import { Buffer } from "node:buffer";
import { execFile } from "node:child_process";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import tls from "node:tls";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const __dirname = dirname(fileURLToPath(import.meta.url));

loadEnvFile(join(__dirname, ".env"));
loadEnvFile(join(__dirname, ".env.local"));

const PORT = Number(process.env.PORT || 3100);
const HOST = process.env.HOST || "127.0.0.1";
const REQUEST_TIMEOUT_MS = envNumber("REQUEST_TIMEOUT_MS", 8000, { min: 1000, max: 20000 });
const CHECKOUT_TIMEOUT_MS = envNumber("STORE_CHECKOUT_TIMEOUT_MS", Math.min(REQUEST_TIMEOUT_MS + 3000, 20000), {
  min: 3000,
  max: 25000,
});
const CACHE_TTL = {
  spotify: envNumber("SPOTIFY_CACHE_TTL_MS", 15000, { min: 1000, max: 300000 }),
  steam: envNumber("STEAM_CACHE_TTL_MS", 60000, { min: 1000, max: 300000 }),
  pubg: envNumber("PUBG_CACHE_TTL_MS", 300000, { min: 1000, max: 900000 }),
};

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://adityaanugrah.me,https://www.adityaanugrah.me,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const cache = new Map();
const adminSessions = new Map();
const STORE_DATA_FILE = join(__dirname, process.env.STORE_DATA_FILE || "store.local.json");
const STORE_SEED_FILE = join(__dirname, "store-seed.json");
const ANALYTICS_DATA_FILE = join(__dirname, process.env.ANALYTICS_DATA_FILE || "analytics.local.json");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (!applyCors(req, res)) {
    return sendJson(res, 403, { error: "Origin not allowed" });
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  try {
    if (url.pathname.startsWith("/store/")) {
      return await handleStoreRequest(req, res, url);
    }

    if (url.pathname === "/analytics/view") {
      return await handleAnalyticsView(req, res);
    }

    if (url.pathname === "/visitor/context") {
      return sendJson(res, 200, visitorContext(req));
    }

    if (req.method === "POST" && url.pathname === "/invoice/send") {
      return await handleInvoiceSend(req, res);
    }

    if (req.method !== "GET") {
      return sendJson(res, 405, { error: "Method not allowed" });
    }

    if (url.pathname === "/health") {
      return sendJson(res, 200, {
        ok: true,
        service: "adityaanugrah-api",
        time: new Date().toISOString(),
      });
    }

    if (url.pathname === "/spotify/now-playing") {
      const data = await cached("spotify:now-playing", CACHE_TTL.spotify, getSpotifyTracks);
      return sendJson(res, 200, data);
    }

    if (url.pathname === "/steam/profile") {
      const data = await cached("steam:profile", CACHE_TTL.steam, getSteamProfile);
      return sendJson(res, 200, data);
    }

    const pubgMatch = url.pathname.match(/^\/pubg\/steam\/player\/([^/]+)$/);
    if (pubgMatch) {
      const ign = decodeURIComponent(pubgMatch[1]);
      const data = await cached(`pubg:steam:${ign.toLowerCase()}`, CACHE_TTL.pubg, () => getPubgPlayer(ign));
      return sendJson(res, 200, data);
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    const status = error.status || 500;
    const message = status >= 500 ? "Upstream API error" : error.message;

    console.error(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`, error);
    return sendJson(res, status, {
      error: message,
      detail: error.publicDetail || undefined,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`adityaanugrah-api listening on http://${HOST}:${PORT}`);
});

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const index = trimmed.indexOf("=");
      if (index === -1) continue;

      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // A .env file is optional because PM2/systemd can inject env vars too.
  }
}

function envNumber(name, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number(process.env[name]);
  const value = Number.isFinite(parsed) ? parsed : fallback;
  return Math.max(min, Math.min(max, value));
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowAll = ALLOWED_ORIGINS.includes("*");

  if (origin && !allowAll && !ALLOWED_ORIGINS.includes(origin)) {
    return false;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", allowAll ? "*" : origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Callback-Signature,X-Callback-Event");
  res.setHeader("Access-Control-Max-Age", "86400");
  return true;
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);

  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function cached(key, ttlMs, load) {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  const data = await load();
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

async function withTimeout(promise, timeoutMs, message, publicDetail) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      const error = new Error(message);
      error.status = 504;
      error.publicDetail = publicDetail;
      reject(error);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeout);
  }
}

async function handleStoreRequest(req, res, url) {
  if (req.method === "GET" && url.pathname === "/store/products") {
    const store = readStore();
    const category = String(url.searchParams.get("category") || "").trim();
    const products = store.products
      .filter((product) => product.active && (!category || product.categoryId === category))
      .map(publicProduct);
    return sendJson(res, 200, { products, categories: store.categories.filter((item) => item.active) });
  }

  if (req.method === "POST" && url.pathname === "/store/checkout") {
    const body = await readJsonBody(req);
    const data = await withTimeout(
      createStoreOrder(body),
      CHECKOUT_TIMEOUT_MS,
      "Checkout request timeout",
      "Tripay belum merespons. Coba lagi sebentar lagi."
    );
    return sendJson(res, 201, data);
  }

  const orderMatch = url.pathname.match(/^\/store\/orders\/([^/]+)$/);
  if (req.method === "GET" && orderMatch) {
    const merchantRef = decodeURIComponent(orderMatch[1]);
    const store = readStore();
    const order = store.orders.find((item) => item.merchantRef === merchantRef);
    if (!order) return sendJson(res, 404, { error: "Order not found" });
    return sendJson(res, 200, { order: publicOrder(order, store) });
  }

  const downloadMatch = url.pathname.match(/^\/store\/download\/([^/]+)$/);
  if (req.method === "GET" && downloadMatch) {
    return sendDelivery(res, decodeURIComponent(downloadMatch[1]));
  }

  if (req.method === "POST" && url.pathname === "/store/tripay/callback") {
    const rawBody = await readRawBody(req);
    return handleTripayCallback(req, res, rawBody);
  }

  if (req.method === "POST" && url.pathname === "/store/admin/login") {
    const body = await readJsonBody(req);
    return adminLogin(res, body);
  }

  if (url.pathname.startsWith("/store/admin/")) {
    const auth = requireAdmin(req);
    if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });

    if (req.method === "GET" && url.pathname === "/store/admin/summary") {
      const store = readStore();
      return sendJson(res, 200, {
        categories: store.categories.map(adminCategory),
        products: store.products.map(adminProduct),
        media: store.media.map(adminMedia),
        orders: store.orders
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 50)
          .map((order) => adminOrder(order, store)),
      });
    }

    if (req.method === "POST" && url.pathname === "/store/admin/products") {
      const body = await readJsonBody(req);
      const product = saveAdminProduct(body);
      return sendJson(res, 200, { product: adminProduct(product) });
    }

    const productDeleteMatch = url.pathname.match(/^\/store\/admin\/products\/([^/]+)\/delete$/);
    if (req.method === "POST" && productDeleteMatch) {
      const productId = decodeURIComponent(productDeleteMatch[1]);
      const result = deleteAdminProduct(productId);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/store/admin/categories") {
      const body = await readJsonBody(req);
      const category = saveAdminCategory(body);
      return sendJson(res, 200, { category: adminCategory(category) });
    }

    const categoryDeleteMatch = url.pathname.match(/^\/store\/admin\/categories\/([^/]+)\/delete$/);
    if (req.method === "POST" && categoryDeleteMatch) {
      const categoryId = decodeURIComponent(categoryDeleteMatch[1]);
      const result = deleteAdminCategory(categoryId);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/store/admin/upload-image") {
      const body = await readJsonBody(req);
      const uploaded = await uploadStoreImage(body);
      return sendJson(res, 200, uploaded);
    }

    const stockMatch = url.pathname.match(/^\/store\/admin\/products\/([^/]+)\/stock$/);
    if (req.method === "POST" && stockMatch) {
      const body = await readJsonBody(req);
      const product = addProductStock(decodeURIComponent(stockMatch[1]), body.items || body.text || "");
      return sendJson(res, 200, { product: adminProduct(product) });
    }

    const stockRemoveMatch = url.pathname.match(/^\/store\/admin\/products\/([^/]+)\/stock\/remove$/);
    if (req.method === "POST" && stockRemoveMatch) {
      const body = await readJsonBody(req);
      const product = removeProductStock(decodeURIComponent(stockRemoveMatch[1]), body.stockIds || body.stockId || []);
      return sendJson(res, 200, { product: adminProduct(product) });
    }

    const deliveryMatch = url.pathname.match(/^\/store\/admin\/orders\/([^/]+)\/delivery$/);
    if (req.method === "POST" && deliveryMatch) {
      const body = await readJsonBody(req);
      const order = saveManualDelivery(decodeURIComponent(deliveryMatch[1]), body);
      return sendJson(res, 200, { order });
    }
  }

  return sendJson(res, 404, { error: "Not found" });
}

async function handleAnalyticsView(req, res) {
  if (req.method === "GET") {
    const analytics = readAnalytics();
    return sendJson(res, 200, { ...publicAnalytics(analytics), ...visitorContext(req) });
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = await readJsonBody(req);
  const visitorId = String(body.visitorId || "").trim();
  const analytics = readAnalytics();
  const now = new Date().toISOString();

  analytics.totalViews = Number(analytics.totalViews || 0) + 1;
  analytics.updatedAt = now;

  if (visitorId) {
    const key = sha256Hex(visitorId).slice(0, 32);
    if (!analytics.visitors[key]) {
      analytics.visitors[key] = {
        firstSeenAt: now,
        lastSeenAt: now,
        views: 1,
      };
    } else {
      analytics.visitors[key].lastSeenAt = now;
      analytics.visitors[key].views = Number(analytics.visitors[key].views || 0) + 1;
    }
  }

  writeAnalytics(analytics);
  return sendJson(res, 200, { ...publicAnalytics(analytics), ...visitorContext(req) });
}

async function createStoreOrder(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const customerName = String(body.name || "Customer").trim() || "Customer";
  const phone = String(body.phone || "").trim().slice(0, 40);
  const buyerNote = String(body.note || body.buyerNote || "").trim().slice(0, 1000);
  const productId = String(body.productId || "").trim();
  const quantity = Math.max(1, Math.min(20, Number.parseInt(body.quantity || "1", 10) || 1));

  if (customerName.length < 2) {
    return invalid("Nama penerima minimal 2 karakter");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return invalid("Email tidak valid");
  }

  const store = readStore();
  const product = store.products.find((item) => item.id === productId && item.active);
  const fulfillmentType = normalizeFulfillmentType(product?.fulfillmentType);
  if (!product) return invalid("Produk tidak ditemukan");
  if (fulfillmentType === "auto_stock" && availableStock(product) < quantity) return invalid("Stok produk tidak cukup");

  const amount = Number(product.price) * quantity;
  const merchantRef = `INV-${randomBytes(4).toString("base64url").toUpperCase()}-${randomBytes(3).toString("base64url").toUpperCase()}`;
  const now = new Date();
  const expiredAt = new Date(now.getTime() + Number(process.env.STORE_PAYMENT_TTL_MINUTES || 30) * 60000);

  const order = {
    id: randomId(),
    merchantRef,
    productId: product.id,
    productName: product.name,
    productSummary: product.summary || "",
    fulfillmentType,
    quantity,
    customerName,
    email,
    phone,
    buyerNote,
    amount,
    warrantyHours: Number(product.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24),
    status: "PENDING",
    tripayReference: null,
    payment: null,
    deliveryToken: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiredAt: expiredAt.toISOString(),
  };

  const tripay = await createTripayTransaction({ order, product });
  order.tripayReference = tripay.reference || tripay.uuid || null;
  order.payment = normalizeTripayPayment(tripay);

  store.orders.push(order);
  writeStore(store);

  return {
    order: publicOrder(order, store),
    payment: order.payment,
  };
}

async function createTripayTransaction({ order, product }) {
  requireStoreEnv("TRIPAY_API_KEY");
  const privateKey = requireStoreEnv("TRIPAY_PRIVATE_KEY");
  const merchantCode = requireStoreEnv("TRIPAY_MERCHANT_CODE");
  const mode = String(process.env.TRIPAY_MODE || "").toLowerCase();
  const sandbox = mode === "sandbox" || process.env.TRIPAY_API_KEY.startsWith("DEV-");
  const endpoint = sandbox
    ? "https://tripay.co.id/api-sandbox/transaction/create"
    : "https://tripay.co.id/api/transaction/create";
  const method = process.env.TRIPAY_PAYMENT_METHOD || "QRIS";
  const signature = createHmac("sha256", privateKey)
    .update(`${merchantCode}${order.merchantRef}${order.amount}`)
    .digest("hex");

  const siteUrl = String(process.env.STORE_SITE_URL || process.env.PUBLIC_SITE_URL || "http://localhost:5173").replace(/\/+$/, "");
  const apiUrlBase = String(process.env.STORE_API_PUBLIC_URL || process.env.PUBLIC_API_URL || "http://127.0.0.1:3100").replace(/\/+$/, "");
  const payload = {
    method,
    merchant_ref: order.merchantRef,
    amount: order.amount,
    customer_name: order.customerName,
    customer_email: order.email,
    customer_phone: order.phone,
    order_items: [
      {
        sku: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: order.quantity,
        product_url: `${siteUrl}/store`,
        image_url: product.image ? mediaPublicUrl(product.image) : undefined,
      },
    ],
    callback_url: `${apiUrlBase}/store/tripay/callback`,
    return_url: `${siteUrl}/store/order/${encodeURIComponent(order.merchantRef)}`,
    expired_time: Math.floor(new Date(order.expiredAt).getTime() / 1000),
    signature,
  };

  let data;
  try {
    ({ data } = await requestJsonWithCurl(endpoint, {
      headers: [
        `Authorization: Bearer ${process.env.TRIPAY_API_KEY}`,
        "Accept: application/json",
        "Content-Type: application/json",
      ],
      body: JSON.stringify(payload),
    }));
  } catch (error) {
    error.publicDetail = error.publicDetail || "Tripay belum merespons. Coba lagi sebentar lagi.";
    throw error;
  }

  if (!data?.success) {
    const error = new Error(data?.message || "Tripay transaction failed");
    error.status = 502;
    throw error;
  }

  return data.data || {};
}

function normalizeTripayPayment(data) {
  return {
    reference: data.reference || data.uuid || null,
    merchantRef: data.merchant_ref || null,
    paymentMethod: data.payment_method || data.payment_name || null,
    payCode: data.pay_code || null,
    qrUrl: data.qr_url || null,
    qrString: data.qr_string || null,
    checkoutUrl: data.checkout_url || data.payment_url || null,
    totalFee: data.total_fee || null,
    amount: data.amount || data.total_amount || null,
    expiredTime: data.expired_time || null,
    instructions: data.instructions || [],
  };
}

function handleTripayCallback(req, res, rawBody) {
  const received = String(req.headers["x-callback-signature"] || "");
  const expected = createHmac("sha256", requireStoreEnv("TRIPAY_PRIVATE_KEY"))
    .update(rawBody)
    .digest("hex");

  if (!safeEqual(received, expected)) {
    return sendJson(res, 403, { success: false, message: "Invalid callback signature" });
  }

  const event = String(req.headers["x-callback-event"] || "");
  if (event && event !== "payment_status") {
    return sendJson(res, 200, { success: true, message: "Ignored event" });
  }

  const payload = JSON.parse(rawBody || "{}");
  const store = readStore();
  const order = store.orders.find((item) => item.merchantRef === payload.merchant_ref);
  if (!order) return sendJson(res, 404, { success: false, message: "Order not found" });

  order.tripayReference = payload.reference || order.tripayReference;
  order.status = payload.status || order.status;
  order.updatedAt = new Date().toISOString();

  if (payload.status === "PAID" && !order.deliveryToken) {
    fulfillOrder(store, order);
  }

  writeStore(store);
  return sendJson(res, 200, { success: true });
}

function fulfillOrder(store, order) {
  const product = store.products.find((item) => item.id === order.productId);
  if (!product) throw new Error("Product not found for fulfillment");

  if (normalizeFulfillmentType(order.fulfillmentType || product.fulfillmentType) === "manual_upload") {
    order.status = "PAID_WAITING_UPLOAD";
    order.updatedAt = new Date().toISOString();
    return;
  }

  const quantity = Number(order.quantity || 1);
  const stockItems = (product.stock || []).filter((item) => !item.usedBy).slice(0, quantity);
  if (stockItems.length < quantity) {
    order.status = "PAID_MANUAL_REVIEW";
    return;
  }

  const now = new Date();
  const warrantyHours = Number(product.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24);
  const warrantyEndsAt = new Date(now.getTime() + warrantyHours * 60 * 60 * 1000);
  const consumedIds = new Set(stockItems.map((stock) => stock.id));
  product.stock = (product.stock || []).filter((stock) => !stock.usedBy && !consumedIds.has(stock.id));
  product.updatedAt = now.toISOString();
  const token = randomBytes(24).toString("hex");
  order.deliveryToken = token;
  order.status = "PAID";
  order.deliveredAt = now.toISOString();
  order.warrantyHours = warrantyHours;
  order.warrantyEndsAt = warrantyEndsAt.toISOString();

  const deliveryText = formatDeliveryText({
    invoice: order.merchantRef,
    productName: product.name,
    quantity,
    items: stockItems.map((item) => item.content),
    warrantyHours,
    warrantyEndsAt,
  });

  store.deliveries.push({
    token,
    orderId: order.id,
    merchantRef: order.merchantRef,
    productName: product.name,
    quantity,
    email: order.email,
    content: deliveryText,
    items: stockItems.map((item) => item.content),
    warrantyHours,
    warrantyEndsAt: warrantyEndsAt.toISOString(),
    createdAt: now.toISOString(),
  });

  sendDeliveryEmail(order, product, deliveryText).catch((error) => {
    console.error("Delivery email failed", error);
  });
}

function sendDelivery(res, token) {
  const store = readStore();
  const delivery = store.deliveries.find((item) => item.token === token);
  if (!delivery) return sendJson(res, 404, { error: "Download token not found" });

  const filename = String(delivery.fileName || `${delivery.productName || "digital-product"}-${delivery.merchantRef}.txt`)
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const body = [
    `Order: ${delivery.merchantRef}`,
    delivery.content,
    "",
  ].join("\n");

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename || "digital-product.txt"}"`,
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function adminLogin(res, body) {
  const password = process.env.STORE_ADMIN_PASSWORD;
  if (!password) return sendJson(res, 503, { error: "Admin password is not configured" });
  if (String(body.password || "") !== password) {
    return sendJson(res, 401, { error: "Password salah" });
  }

  const token = randomBytes(24).toString("hex");
  adminSessions.set(token, Date.now() + 12 * 60 * 60 * 1000);
  return sendJson(res, 200, { token });
}

function requireAdmin(req) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expiresAt = adminSessions.get(token);
  if (!token || !expiresAt) return { ok: false, status: 401, error: "Unauthorized" };
  if (expiresAt < Date.now()) {
    adminSessions.delete(token);
    return { ok: false, status: 401, error: "Session expired" };
  }
  return { ok: true };
}

function saveAdminProduct(body) {
  const store = readStore();
  const id = slugify(body.id || body.name);
  if (!id) throw Object.assign(new Error("Product name is required"), { status: 400 });

  let product = store.products.find((item) => item.id === id);
  if (!product) {
    product = { id, stock: [], createdAt: new Date().toISOString() };
    store.products.push(product);
  }

  const name = String(body.name || product.name || id).trim();
  const summary = String(body.summary || "").trim();
  const description = String(body.description || "").trim();
  const image = String(body.image || "").trim();
  const categoryId = String(body.categoryId || "").trim();
  const price = Number(body.price);
  const warrantyHours = Number(body.warrantyHours || product.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24);

  if (!name) throw Object.assign(new Error("Nama produk wajib diisi"), { status: 400 });
  if (!summary) throw Object.assign(new Error("Ringkasan produk wajib diisi"), { status: 400 });
  if (!Number.isFinite(price) || price <= 0) {
    throw Object.assign(new Error("Harga produk harus lebih dari 0"), { status: 400 });
  }
  if (!Number.isFinite(warrantyHours) || warrantyHours < 0 || warrantyHours > 24 * 30) {
    throw Object.assign(new Error("Garansi produk tidak valid"), { status: 400 });
  }
  if (categoryId && !store.categories.some((item) => item.id === categoryId)) {
    throw Object.assign(new Error("Kategori produk tidak ditemukan"), { status: 400 });
  }

  product.name = name;
  product.summary = summary;
  product.description = description;
  product.price = price;
  product.image = image;
  product.categoryId = categoryId;
  product.fulfillmentType = normalizeFulfillmentType(body.fulfillmentType || product.fulfillmentType);
  product.warrantyHours = Math.round(warrantyHours);
  product.active = Boolean(body.active);
  product.updatedAt = new Date().toISOString();

  writeStore(store);
  return product;
}

function saveAdminCategory(body) {
  const store = readStore();
  const id = slugify(body.id || body.name);
  if (!id) throw Object.assign(new Error("Category name is required"), { status: 400 });

  let category = store.categories.find((item) => item.id === id);
  if (!category) {
    category = { id, createdAt: new Date().toISOString() };
    store.categories.push(category);
  }

  const name = String(body.name || category.name || id).trim();
  const description = String(body.description || "").trim();
  if (!name) throw Object.assign(new Error("Nama kategori wajib diisi"), { status: 400 });

  category.name = name;
  category.description = description;
  category.active = body.active !== false;
  category.updatedAt = new Date().toISOString();

  writeStore(store);
  return category;
}

function deleteAdminProduct(productId) {
  const store = readStore();
  const index = store.products.findIndex((item) => item.id === productId);
  if (index === -1) throw Object.assign(new Error("Product not found"), { status: 404 });

  const hasOrders = store.orders.some((item) => item.productId === productId);
  if (hasOrders) {
    throw Object.assign(
      new Error("Produk sudah pernah dipakai di order. Nonaktifkan produk ini, jangan dihapus."),
      { status: 400 }
    );
  }

  const [removed] = store.products.splice(index, 1);
  writeStore(store);
  return { ok: true, productId, productName: removed.name || productId };
}

function deleteAdminCategory(categoryId) {
  const store = readStore();
  const index = store.categories.findIndex((item) => item.id === categoryId);
  if (index === -1) throw Object.assign(new Error("Category not found"), { status: 404 });

  const hasProducts = store.products.some((item) => item.categoryId === categoryId);
  if (hasProducts) {
    throw Object.assign(
      new Error("Kategori masih dipakai oleh produk. Pindahkan atau kosongkan dulu kategorinya."),
      { status: 400 }
    );
  }

  const [removed] = store.categories.splice(index, 1);
  writeStore(store);
  return { ok: true, categoryId, categoryName: removed.name || categoryId };
}

async function uploadStoreImage(body) {
  const fileName = String(body.fileName || "product-image").trim();
  const contentType = String(body.contentType || "application/octet-stream").trim();
  const base64 = String(body.data || "").replace(/^data:[^;]+;base64,/, "");
  if (!base64) throw Object.assign(new Error("Image data is required"), { status: 400 });
  if (!contentType.startsWith("image/")) throw Object.assign(new Error("Only image uploads are allowed"), { status: 400 });

  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > Number(process.env.STORE_IMAGE_MAX_BYTES || 2_500_000)) {
    throw Object.assign(new Error("Image terlalu besar"), { status: 413 });
  }

  const ext = extensionFromContentType(contentType, fileName);
  const key = `store/products/${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  await uploadR2Object({ key, body: bytes, contentType });
  const store = readStore();
  const media = {
    id: randomId(),
    key,
    url: mediaPublicUrl(key),
    fileName,
    contentType,
    size: bytes.length,
    createdAt: new Date().toISOString(),
  };
  store.media.push(media);
  writeStore(store);
  return media;
}

function saveManualDelivery(merchantRef, body) {
  const store = readStore();
  const order = store.orders.find((item) => item.merchantRef === merchantRef);
  if (!order) throw Object.assign(new Error("Order not found"), { status: 404 });

  const fileName = String(body.fileName || `${merchantRef}.txt`).trim();
  const contentType = String(body.contentType || "text/plain").trim();
  const source = String(body.text || body.content || body.data || "");
  const base64Match = source.match(/^data:[^;]+;base64,(.+)$/);
  const content = base64Match
    ? Buffer.from(base64Match[1], "base64").toString("utf8")
    : source;

  if (!fileName.toLowerCase().endsWith(".txt")) {
    throw Object.assign(new Error("File delivery harus .txt"), { status: 400 });
  }
  if (contentType && contentType !== "text/plain" && contentType !== "application/octet-stream") {
    throw Object.assign(new Error("File delivery harus text/plain"), { status: 400 });
  }
  if (!content.trim()) throw Object.assign(new Error("Isi file delivery kosong"), { status: 400 });
  if (Buffer.byteLength(content, "utf8") > Number(process.env.STORE_DELIVERY_MAX_BYTES || 1_000_000)) {
    throw Object.assign(new Error("File delivery terlalu besar"), { status: 413 });
  }

  const existing = store.deliveries.find((item) => item.orderId === order.id);
  const token = existing?.token || randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  const warrantyHours = Number(order.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24);
  const warrantyEndsAt = order.warrantyEndsAt || new Date(Date.now() + warrantyHours * 60 * 60 * 1000).toISOString();
  const delivery = {
    token,
    orderId: order.id,
    merchantRef: order.merchantRef,
    productName: order.productName,
    quantity: order.quantity || 1,
    email: order.email,
    content,
    items: [content],
    warrantyHours,
    warrantyEndsAt,
    fileName,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existing) Object.assign(existing, delivery);
  else store.deliveries.push(delivery);

  order.deliveryToken = token;
  order.status = "READY";
  order.deliveredAt = now;
  order.warrantyHours = warrantyHours;
  order.warrantyEndsAt = warrantyEndsAt;
  order.updatedAt = now;
  writeStore(store);
  return adminOrder(order, store);
}

function addProductStock(productId, input) {
  const store = readStore();
  const product = store.products.find((item) => item.id === productId);
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });

  const items = Array.isArray(input)
    ? input
    : String(input || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

  if (!items.length) {
    throw Object.assign(new Error("Isi stok tidak boleh kosong"), { status: 400 });
  }

  product.stock ||= [];
  for (const content of items) {
    product.stock.push({
      id: randomId(),
      content,
      usedBy: null,
      createdAt: new Date().toISOString(),
    });
  }
  product.updatedAt = new Date().toISOString();
  writeStore(store);
  return product;
}

function removeProductStock(productId, input) {
  const store = readStore();
  const product = store.products.find((item) => item.id === productId);
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });

  const stockIds = Array.isArray(input) ? input : [input];
  const normalizedIds = stockIds.map((item) => String(item || "").trim()).filter(Boolean);
  if (!normalizedIds.length) {
    throw Object.assign(new Error("Pilih stok yang ingin dihapus"), { status: 400 });
  }

  const removableIds = new Set(
    (product.stock || [])
      .filter((item) => !item.usedBy && normalizedIds.includes(String(item.id || "")))
      .map((item) => item.id)
  );

  if (!removableIds.size) {
    throw Object.assign(new Error("Stok tidak ditemukan atau sudah terpakai"), { status: 400 });
  }

  product.stock = (product.stock || []).filter((item) => !removableIds.has(item.id));
  product.updatedAt = new Date().toISOString();
  writeStore(store);
  return product;
}

function publicProduct(product) {
  const fulfillmentType = normalizeFulfillmentType(product.fulfillmentType);

  return {
    id: product.id,
    name: product.name,
    summary: product.summary,
    description: product.description,
    price: product.price,
    image: product.image,
    categoryId: product.categoryId || "",
    fulfillmentType,
    warrantyHours: product.warrantyHours || Number(process.env.STORE_WARRANTY_HOURS || 24),
    active: product.active,
    stock: availableStock(product),
  };
}

function adminCategory(category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description || "",
    active: category.active !== false,
  };
}

function adminProduct(product) {
  const stockPreview = (product.stock || [])
    .filter((item) => !item.usedBy)
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      content: item.content,
      createdAt: item.createdAt || null,
    }));

  return {
    ...publicProduct(product),
    totalStock: product.stock?.length || 0,
    soldStock: (product.stock || []).filter((item) => item.usedBy).length,
    stockPreview,
  };
}

function adminMedia(media) {
  return {
    id: media.id,
    key: media.key,
    url: media.url || mediaPublicUrl(media.key),
    fileName: media.fileName || "",
    contentType: media.contentType || "",
    size: media.size || 0,
    createdAt: media.createdAt || null,
  };
}

function publicOrder(order, store = null) {
  const product = store?.products?.find((item) => item.id === order.productId);
  const fulfillmentType = normalizeFulfillmentType(order.fulfillmentType || product?.fulfillmentType);

  return {
    merchantRef: order.merchantRef,
    productId: order.productId,
    productName: order.productName,
    productSummary: order.productSummary || product?.summary || "",
    fulfillmentType,
    email: order.email,
    buyerNote: order.buyerNote || "",
    amount: order.amount,
    quantity: order.quantity || 1,
    warrantyHours: order.warrantyHours || product?.warrantyHours || Number(process.env.STORE_WARRANTY_HOURS || 24),
    status: order.status,
    payment: order.payment,
    expiredAt: order.expiredAt,
    createdAt: order.createdAt,
    downloadUrl: order.deliveryToken ? `/store/download/${order.deliveryToken}` : null,
  };
}

function adminOrder(order, store = null) {
  const product = store?.products?.find((item) => item.id === order.productId);
  const fulfillmentType = normalizeFulfillmentType(order.fulfillmentType || product?.fulfillmentType);

  return {
    merchantRef: order.merchantRef,
    productId: order.productId,
    productName: order.productName,
    fulfillmentType,
    email: order.email,
    buyerNote: order.buyerNote || "",
    amount: order.amount,
    quantity: order.quantity || 1,
    status: order.status,
    tripayReference: order.tripayReference,
    needsUpload: fulfillmentType === "manual_upload" && order.status === "PAID_WAITING_UPLOAD",
    downloadUrl: order.deliveryToken ? `/store/download/${order.deliveryToken}` : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function normalizeFulfillmentType(value) {
  return value === "manual_upload" ? "manual_upload" : "auto_stock";
}

function availableStock(product) {
  return (product.stock || []).filter((item) => !item.usedBy).length;
}

function readStore() {
  const file = existsSync(STORE_DATA_FILE) ? STORE_DATA_FILE : STORE_SEED_FILE;
  const fallback = { categories: [], products: [], orders: [], deliveries: [] };
  try {
    return ensureSeedCatalog(normalizeStore(JSON.parse(readFileSync(file, "utf8"))));
  } catch {
    return ensureSeedCatalog(fallback);
  }
}

function writeStore(store) {
  mkdirSync(dirname(STORE_DATA_FILE), { recursive: true });
  writeFileSync(STORE_DATA_FILE, `${JSON.stringify(normalizeStore(store), null, 2)}\n`);
}

function normalizeStore(store) {
  return {
    categories: Array.isArray(store.categories) ? store.categories : [],
    products: Array.isArray(store.products) ? store.products : [],
    orders: Array.isArray(store.orders) ? store.orders : [],
    deliveries: Array.isArray(store.deliveries) ? store.deliveries : [],
    media: Array.isArray(store.media) ? store.media : [],
  };
}

function readAnalytics() {
  const fallback = { totalViews: 0, visitors: {}, createdAt: new Date().toISOString(), updatedAt: null };
  try {
    return normalizeAnalytics(JSON.parse(readFileSync(ANALYTICS_DATA_FILE, "utf8")));
  } catch {
    return fallback;
  }
}

function writeAnalytics(analytics) {
  mkdirSync(dirname(ANALYTICS_DATA_FILE), { recursive: true });
  writeFileSync(ANALYTICS_DATA_FILE, `${JSON.stringify(normalizeAnalytics(analytics), null, 2)}\n`);
}

function normalizeAnalytics(analytics) {
  return {
    totalViews: Number(analytics.totalViews || 0),
    visitors: analytics.visitors && typeof analytics.visitors === "object" ? analytics.visitors : {},
    createdAt: analytics.createdAt || new Date().toISOString(),
    updatedAt: analytics.updatedAt || null,
  };
}

function publicAnalytics(analytics) {
  return {
    totalViews: Number(analytics.totalViews || 0),
    uniqueVisitors: Object.keys(analytics.visitors || {}).length,
  };
}

function visitorContext(req) {
  const countryCode = [
    req.headers["cf-ipcountry"],
    req.headers["x-vercel-ip-country"],
    req.headers["cloudfront-viewer-country"],
    req.headers["x-country-code"],
    req.headers["x-appengine-country"],
  ]
    .map((value) => String(value || "").trim().toUpperCase())
    .find((value) => /^[A-Z]{2}$/.test(value)) || null;

  return { countryCode };
}

function ensureSeedCatalog(store) {
  if (!existsSync(STORE_SEED_FILE)) return store;

  try {
    const seed = normalizeStore(JSON.parse(readFileSync(STORE_SEED_FILE, "utf8")));
    const categories = store.categories.map((category) => {
      const seeded = seed.categories.find((item) => item.id === category.id);
      return seeded
        ? {
            ...seeded,
            ...category,
            name: category.name || seeded.name,
            description: category.description || seeded.description || "",
            active: category.active ?? seeded.active ?? true,
          }
        : category;
    });
    const products = store.products.map((product) => {
      const seeded = seed.products.find((item) => item.id === product.id);
      return seeded
        ? {
            ...seeded,
            ...product,
            name: product.name || seeded.name,
            summary: product.summary || seeded.summary || "",
            description: product.description || seeded.description || "",
            image: product.image || seeded.image || "",
            categoryId: product.categoryId || seeded.categoryId || "",
            fulfillmentType: normalizeFulfillmentType(product.fulfillmentType || seeded.fulfillmentType),
            warrantyHours: Number(product.warrantyHours || seeded.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24),
            active: product.active ?? seeded.active ?? true,
            stock: Array.isArray(product.stock) ? product.stock : Array.isArray(seeded.stock) ? seeded.stock : [],
          }
        : product;
    });
    const categoryIds = new Set(categories.map((item) => item.id));
    const productIds = new Set(products.map((item) => item.id));
    const missingCategories = seed.categories.filter((item) => !categoryIds.has(item.id));
    const missingProducts = seed.products.filter((item) => !productIds.has(item.id));

    if (!missingCategories.length && !missingProducts.length && categories.length === store.categories.length && products.length === store.products.length) {
      return {
        ...store,
        categories,
        products,
      };
    }

    return {
      ...store,
      categories: [...categories, ...missingCategories],
      products: [...products, ...missingProducts],
    };
  } catch {
    return store;
  }
}

async function readJsonBody(req) {
  const raw = await readRawBody(req);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("Invalid JSON body"), { status: 400 });
  }
}

async function readRawBody(req) {
  const maxBytes = Number(process.env.STORE_MAX_BODY_BYTES || 6 * 1024 * 1024);
  const timeoutMs = Number(process.env.STORE_BODY_TIMEOUT_MS || 5000);

  return new Promise((resolve, reject) => {
    let size = 0;
    let body = "";
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeout);
      req.off("data", onData);
      req.off("end", onEnd);
      req.off("error", onError);
      req.off("aborted", onAborted);
    };

    const done = (value) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };

    const fail = (error, destroy = false) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (destroy) req.destroy();
      reject(error);
    };

    const onData = (chunk) => {
      const text = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
      size += Buffer.byteLength(text);
      if (size > maxBytes) {
        fail(Object.assign(new Error("Request body too large"), { status: 413 }), true);
        return;
      }
      body += text;
    };

    const onEnd = () => done(body);
    const onError = (error) => fail(Object.assign(error, { status: 400 }));
    const onAborted = () => fail(Object.assign(new Error("Request aborted"), { status: 400 }));
    const timeout = setTimeout(() => {
      fail(Object.assign(new Error("Request body timeout"), { status: 408 }), true);
    }, timeoutMs);

    req.setEncoding("utf8");
    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.on("aborted", onAborted);
  });
}

async function sendDeliveryEmail(order, product, content) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const subject = `Pesanan ${order.merchantRef} - ${product.name}`;
  const message = [
    `Halo ${order.customerName},`,
    "",
    content,
    "",
    `Order: ${order.merchantRef}`,
    "",
    "Terima kasih.",
  ].join("\n");

  await sendSmtpMail({
    from: process.env.EMAIL_USER,
    to: order.email,
    subject,
    text: message,
  });
}

async function handleInvoiceSend(req, res) {
  if (process.env.INVOICE_ACCESS_TOKEN) {
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!safeEqual(token, process.env.INVOICE_ACCESS_TOKEN)) {
      return sendJson(res, 401, { error: "Token invoice tidak valid" });
    }
  }

  const body = await readJsonBody(req);
  const invoice = normalizeInvoice(body);
  const pdf = buildInvoicePdf(invoice);
  const html = buildInvoiceEmailHtml(invoice);
  const text = buildInvoiceEmailText(invoice);

  await sendSmtpMail({
    from: process.env.INVOICE_FROM_EMAIL || process.env.EMAIL_USER,
    to: invoice.recipient.email,
    subject: `${invoice.invoiceNumber} - Invoice ${invoice.sender.name}`,
    text,
    html,
    attachments: [
      {
        filename: `${invoice.invoiceNumber.replace(/[^a-z0-9_-]+/gi, "-")}.pdf`,
        contentType: "application/pdf",
        content: pdf,
      },
    ],
    replyTo: invoice.sender.email || undefined,
  });

  return sendJson(res, 200, {
    ok: true,
    invoiceNumber: invoice.invoiceNumber,
    sentTo: invoice.recipient.email,
    total: invoice.total,
  });
}

function normalizeInvoice(body) {
  requireStoreEnv("EMAIL_USER");
  requireStoreEnv("EMAIL_PASS");

  const sender = {
    name: clean(body.senderName || process.env.INVOICE_SENDER_NAME || "Aditya Anugrah", 90),
    email: clean(body.senderEmail || process.env.INVOICE_SENDER_EMAIL || process.env.EMAIL_USER || "", 120),
    phone: clean(body.senderPhone || process.env.INVOICE_SENDER_PHONE || "", 60),
    address: clean(body.senderAddress || process.env.INVOICE_SENDER_ADDRESS || "", 220),
  };
  const recipient = {
    name: clean(body.clientName || body.recipientName, 90),
    email: clean(body.clientEmail || body.recipientEmail, 120).toLowerCase(),
    company: clean(body.clientCompany || "", 100),
    address: clean(body.clientAddress || "", 220),
  };
  const invoiceNumber = clean(body.invoiceNumber || `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomBytes(2).toString("hex").toUpperCase()}`, 40);
  const issueDate = clean(body.issueDate || new Date().toISOString().slice(0, 10), 30);
  const dueDate = clean(body.dueDate || "", 30);
  const currency = clean(body.currency || "IDR", 8).toUpperCase();
  const notes = clean(body.notes || "Terima kasih atas kepercayaannya. Silakan lakukan pembayaran sesuai detail yang tertera.", 900);
  const paymentInfo = clean(body.paymentInfo || process.env.INVOICE_PAYMENT_INFO || "", 900);
  const paymentStatus = String(body.paymentStatus || body.status || "").toLowerCase() === "paid" ? "paid" : "unpaid";
  const items = Array.isArray(body.items) ? body.items : [];
  const normalizedItems = items
    .map((item) => {
      const description = clean(item.description || item.name || "", 160);
      const quantity = Math.max(0, Number(item.quantity || 0));
      const unitPrice = Math.max(0, Number(item.unitPrice || item.price || 0));
      return { description, quantity, unitPrice, amount: quantity * unitPrice };
    })
    .filter((item) => item.description && item.quantity > 0);

  if (!recipient.name || recipient.name.length < 2) invalid("Nama klien minimal 2 karakter");
  if (!recipient.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.email)) invalid("Email klien tidak valid");
  if (!normalizedItems.length) invalid("Minimal 1 item invoice harus diisi");

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.amount, 0);
  const discount = Math.max(0, Number(body.discount || 0));
  const taxRate = Math.max(0, Number(body.taxRate || 0));
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * (taxRate / 100);
  const total = taxable + tax;

  return {
    sender,
    recipient,
    invoiceNumber,
    issueDate,
    dueDate,
    currency,
    items: normalizedItems,
    subtotal,
    discount,
    taxRate,
    tax,
    total,
    paymentStatus,
    notes,
    paymentInfo,
  };
}

function clean(value, max = 300) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function money(value, currency = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(Number(value || 0));
}

function buildInvoiceEmailText(invoice) {
  return [
    `Halo ${invoice.recipient.name},`,
    "",
    `Terlampir invoice ${invoice.invoiceNumber} dengan total ${money(invoice.total, invoice.currency)}.`,
    invoice.paymentStatus === "paid" ? "Status: LUNAS" : "Status: BELUM LUNAS",
    invoice.dueDate ? `Jatuh tempo: ${invoice.dueDate}` : "",
    "",
    invoice.notes,
    "",
    "Ringkasan:",
    ...invoice.items.map((item) => `- ${item.description}: ${item.quantity} x ${money(item.unitPrice, invoice.currency)} = ${money(item.amount, invoice.currency)}`),
    "",
    invoice.paymentInfo ? `Pembayaran: ${invoice.paymentInfo}` : "",
    "",
    `Terima kasih,\n${invoice.sender.name}`,
  ].filter(Boolean).join("\n");
}

function buildInvoiceEmailHtml(invoice) {
  const isPaid = invoice.paymentStatus === "paid";
  const statusLabel = isPaid ? "LUNAS" : "BELUM LUNAS";
  const statusColor = isPaid ? "#166534" : "#92400e";
  const rows = invoice.items
    .map((item, index) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;vertical-align:top;width:34px">${index + 1}</td>
        <td style="padding:14px 12px 14px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;line-height:1.45;vertical-align:top">${escapeHtml(item.description)}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;text-align:center;vertical-align:top;width:56px">${item.quantity}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;text-align:right;white-space:nowrap;vertical-align:top;width:118px">${money(item.unitPrice, invoice.currency)}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;text-align:right;font-weight:700;white-space:nowrap;vertical-align:top;width:128px">${money(item.amount, invoice.currency)}</td>
      </tr>`)
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#111827">
    <div style="max-width:720px;margin:0 auto;padding:34px 24px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-bottom:2px solid #111827;padding-bottom:18px">
        <tr>
          <td style="vertical-align:top;padding-bottom:18px">
            <p style="margin:0;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.14em">INVOICE</p>
            <h1 style="margin:8px 0 0;color:#111827;font-size:28px;line-height:1.15;letter-spacing:-.02em">${escapeHtml(invoice.invoiceNumber)}</h1>
          </td>
          <td align="right" style="vertical-align:top;padding-bottom:18px">
            <div style="display:inline-block;border:2px solid ${statusColor};color:${statusColor};padding:7px 14px;font-size:12px;font-weight:800;letter-spacing:.12em">${statusLabel}</div>
            <p style="margin:14px 0 0;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.08em">TOTAL</p>
            <p style="margin:4px 0 0;color:#111827;font-size:24px;font-weight:800">${money(invoice.total, invoice.currency)}</p>
          </td>
        </tr>
      </table>

      <p style="margin:24px 0;color:#374151;font-size:15px;line-height:1.65">Halo <strong>${escapeHtml(invoice.recipient.name)}</strong>, terlampir invoice PDF untuk kebutuhan pembayaran dan administrasi. Ringkasan invoice tersedia di bawah ini.</p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 26px">
        <tr>
          <td style="width:50%;vertical-align:top;padding-right:18px">
            <p style="margin:0 0 8px;color:#6b7280;font-size:11px;font-weight:800;letter-spacing:.12em">DARI</p>
            <p style="margin:0;color:#111827;font-size:16px;font-weight:800">${escapeHtml(invoice.sender.name)}</p>
            ${invoice.sender.email ? `<p style="margin:5px 0 0;color:#374151;font-size:13px">${escapeHtml(invoice.sender.email)}</p>` : ""}
            ${invoice.sender.phone ? `<p style="margin:4px 0 0;color:#374151;font-size:13px">${escapeHtml(invoice.sender.phone)}</p>` : ""}
            ${invoice.sender.address ? `<p style="margin:4px 0 0;color:#6b7280;font-size:13px;line-height:1.45">${escapeHtml(invoice.sender.address)}</p>` : ""}
          </td>
          <td style="width:50%;vertical-align:top;padding-left:18px;border-left:1px solid #e5e7eb">
            <p style="margin:0 0 8px;color:#6b7280;font-size:11px;font-weight:800;letter-spacing:.12em">UNTUK</p>
            <p style="margin:0;color:#111827;font-size:16px;font-weight:800">${escapeHtml(invoice.recipient.name)}</p>
            ${invoice.recipient.company ? `<p style="margin:5px 0 0;color:#374151;font-size:13px">${escapeHtml(invoice.recipient.company)}</p>` : ""}
            <p style="margin:4px 0 0;color:#374151;font-size:13px">${escapeHtml(invoice.recipient.email)}</p>
            ${invoice.recipient.address ? `<p style="margin:4px 0 0;color:#6b7280;font-size:13px;line-height:1.45">${escapeHtml(invoice.recipient.address)}</p>` : ""}
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 26px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb">
        <tr>
          <td style="padding:12px 0;color:#6b7280;font-size:12px">Tanggal Invoice<br><strong style="display:block;margin-top:4px;color:#111827;font-size:14px">${escapeHtml(invoice.issueDate)}</strong></td>
          <td style="padding:12px 0;color:#6b7280;font-size:12px">Jatuh Tempo<br><strong style="display:block;margin-top:4px;color:#111827;font-size:14px">${escapeHtml(invoice.dueDate || "-")}</strong></td>
          <td style="padding:12px 0;color:#6b7280;font-size:12px;text-align:right">Status<br><strong style="display:block;margin-top:4px;color:${statusColor};font-size:14px">${statusLabel}</strong></td>
        </tr>
      </table>

      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 24px">
        <thead>
          <tr>
            <th align="left" style="padding:0 0 10px;border-bottom:2px solid #111827;color:#111827;font-size:11px;letter-spacing:.1em">NO</th>
            <th align="left" style="padding:0 12px 10px 0;border-bottom:2px solid #111827;color:#111827;font-size:11px;letter-spacing:.1em">DESKRIPSI</th>
            <th align="center" style="padding:0 0 10px;border-bottom:2px solid #111827;color:#111827;font-size:11px;letter-spacing:.1em">QTY</th>
            <th align="right" style="padding:0 0 10px;border-bottom:2px solid #111827;color:#111827;font-size:11px;letter-spacing:.1em">HARGA</th>
            <th align="right" style="padding:0 0 10px;border-bottom:2px solid #111827;color:#111827;font-size:11px;letter-spacing:.1em">JUMLAH</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:20px">
        <tr>
          <td style="vertical-align:top;padding-right:30px">
            ${invoice.paymentInfo ? `<p style="margin:0 0 8px;color:#6b7280;font-size:11px;font-weight:800;letter-spacing:.12em">DETAIL PEMBAYARAN</p><p style="margin:0 0 18px;color:#374151;font-size:13px;line-height:1.55">${escapeHtml(invoice.paymentInfo)}</p>` : ""}
            <p style="margin:0 0 8px;color:#6b7280;font-size:11px;font-weight:800;letter-spacing:.12em">CATATAN</p>
            <p style="margin:0;color:#374151;font-size:13px;line-height:1.55">${escapeHtml(invoice.notes)}</p>
          </td>
          <td style="width:260px;vertical-align:top">
            <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:2px solid #111827;border-bottom:2px solid #111827">
              <tr><td style="padding:12px 0;color:#6b7280;font-size:13px">Subtotal</td><td align="right" style="padding:12px 0;color:#111827;font-size:13px">${money(invoice.subtotal, invoice.currency)}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Diskon</td><td align="right" style="padding:6px 0;color:#111827;font-size:13px">${money(invoice.discount, invoice.currency)}</td></tr>
              <tr><td style="padding:6px 0 12px;color:#6b7280;font-size:13px">Pajak (${invoice.taxRate || 0}%)</td><td align="right" style="padding:6px 0 12px;color:#111827;font-size:13px">${money(invoice.tax, invoice.currency)}</td></tr>
              <tr><td style="padding:14px 0;border-top:1px solid #d1d5db;color:#111827;font-size:16px;font-weight:800">TOTAL</td><td align="right" style="padding:14px 0;border-top:1px solid #d1d5db;color:#111827;font-size:16px;font-weight:800">${money(invoice.total, invoice.currency)}</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:30px 0 0;padding-top:14px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:12px">Email ini dikirim otomatis oleh sistem invoice ${escapeHtml(invoice.sender.name)}.</p>
    </div>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

function buildInvoicePdf(invoice) {
  const isPaid = invoice.paymentStatus === "paid";
  const statusLabel = isPaid ? "LUNAS" : "BELUM LUNAS";
  const ops = [];

  const color = {
    ink: [17, 24, 39],
    slate: [55, 65, 81],
    muted: [107, 114, 128],
    line: [209, 213, 219],
    softLine: [229, 231, 235],
    green: [21, 128, 61],
    amber: [180, 83, 9],
  };
  const statusColor = isPaid ? color.green : color.amber;

  // Minimal professional letterhead, no colored background blocks.
  pdfTextAt(ops, 44, 795, "INVOICE", 26, "F2", color.ink);
  pdfTextAt(ops, 44, 773, invoice.invoiceNumber, 10, "F1", color.muted);
  pdfTextAt(ops, 552, 797, "TOTAL", 8, "F2", color.muted, "right");
  pdfTextAt(ops, 552, 775, money(invoice.total, invoice.currency), 18, "F2", color.ink, "right");
  pdfLine(ops, 44, 752, 552, 752, color.ink, 1.4);

  // Status stamp as outline only.
  pdfStrokeRect(ops, 438, 708, 114, 30, statusColor, 1.5);
  pdfTextAt(ops, 495, 718, statusLabel, 10, "F2", statusColor, "center");

  // Parties.
  pdfTextAt(ops, 44, 718, "DARI", 8, "F2", color.muted);
  pdfTextAt(ops, 44, 699, invoice.sender.name, 14, "F2", color.ink);
  let sy = 682;
  for (const line of [invoice.sender.email, invoice.sender.phone, invoice.sender.address].filter(Boolean)) {
    for (const part of wrapPdfText(line, 42).slice(0, 2)) {
      pdfTextAt(ops, 44, sy, part, 9, "F1", color.slate);
      sy -= 12;
    }
  }

  pdfTextAt(ops, 306, 718, "UNTUK", 8, "F2", color.muted);
  pdfTextAt(ops, 306, 699, invoice.recipient.name, 14, "F2", color.ink);
  let by = 682;
  for (const line of [invoice.recipient.company, invoice.recipient.email, invoice.recipient.address].filter(Boolean)) {
    for (const part of wrapPdfText(line, 39).slice(0, 2)) {
      pdfTextAt(ops, 306, by, part, 9, "F1", color.slate);
      by -= 12;
    }
  }

  pdfLine(ops, 44, 636, 552, 636, color.softLine, 1);
  const meta = [
    [44, "Tanggal Invoice", invoice.issueDate],
    [210, "Jatuh Tempo", invoice.dueDate || "-"],
    [376, "Status", statusLabel],
  ];
  for (const [x, label, value] of meta) {
    pdfTextAt(ops, x, 613, label, 8, "F2", color.muted);
    pdfTextAt(ops, x, 594, value, 11, "F2", label === "Status" ? statusColor : color.ink);
  }
  pdfLine(ops, 44, 578, 552, 578, color.softLine, 1);

  // Items table: typography + rules only.
  const tableTop = 548;
  pdfTextAt(ops, 44, tableTop, "DESKRIPSI", 8, "F2", color.ink);
  pdfTextAt(ops, 338, tableTop, "QTY", 8, "F2", color.ink, "center");
  pdfTextAt(ops, 430, tableTop, "HARGA", 8, "F2", color.ink, "right");
  pdfTextAt(ops, 552, tableTop, "JUMLAH", 8, "F2", color.ink, "right");
  pdfLine(ops, 44, tableTop - 11, 552, tableTop - 11, color.ink, 1.2);

  let y = tableTop - 34;
  invoice.items.slice(0, 8).forEach((item) => {
    const descLines = wrapPdfText(item.description, 45).slice(0, 2);
    const rowHeight = descLines.length > 1 ? 47 : 37;
    pdfTextAt(ops, 44, y, descLines[0] || "-", 9.5, "F2", color.ink);
    if (descLines[1]) pdfTextAt(ops, 44, y - 13, descLines[1], 8.5, "F1", color.muted);
    pdfTextAt(ops, 338, y, String(item.quantity), 9.5, "F1", color.slate, "center");
    pdfTextAt(ops, 430, y, money(item.unitPrice, invoice.currency), 9.5, "F1", color.slate, "right");
    pdfTextAt(ops, 552, y, money(item.amount, invoice.currency), 9.5, "F2", color.ink, "right");
    pdfLine(ops, 44, y - rowHeight + 14, 552, y - rowHeight + 14, color.softLine, 0.6);
    y -= rowHeight;
  });

  const belowTop = Math.min(y - 24, 350);
  const summaryTop = belowTop;
  pdfTextAt(ops, 44, belowTop, "CATATAN", 8, "F2", color.muted);
  let noteY = belowTop - 18;
  for (const part of wrapPdfText(invoice.notes, 47).slice(0, 4)) {
    pdfTextAt(ops, 44, noteY, part, 8.5, "F1", color.slate);
    noteY -= 12;
  }
  if (invoice.paymentInfo) {
    noteY -= 8;
    pdfTextAt(ops, 44, noteY, "DETAIL PEMBAYARAN", 8, "F2", color.muted);
    noteY -= 18;
    for (const part of wrapPdfText(invoice.paymentInfo, 47).slice(0, 4)) {
      pdfTextAt(ops, 44, noteY, part, 8.5, "F1", color.slate);
      noteY -= 12;
    }
  }

  // Summary table uses lines only, no filled background.
  const sx = 334;
  pdfLine(ops, sx, summaryTop + 8, 552, summaryTop + 8, color.ink, 1.2);
  pdfTextAt(ops, sx, summaryTop - 15, "Subtotal", 10, "F1", color.slate);
  pdfTextAt(ops, 552, summaryTop - 15, money(invoice.subtotal, invoice.currency), 10, "F1", color.ink, "right");
  pdfTextAt(ops, sx, summaryTop - 39, "Diskon", 10, "F1", color.slate);
  pdfTextAt(ops, 552, summaryTop - 39, money(invoice.discount, invoice.currency), 10, "F1", color.ink, "right");
  pdfTextAt(ops, sx, summaryTop - 63, `Pajak (${invoice.taxRate || 0}%)`, 10, "F1", color.slate);
  pdfTextAt(ops, 552, summaryTop - 63, money(invoice.tax, invoice.currency), 10, "F1", color.ink, "right");
  pdfLine(ops, sx, summaryTop - 82, 552, summaryTop - 82, color.line, 1);
  pdfTextAt(ops, sx, summaryTop - 108, "TOTAL", 13, "F2", color.ink);
  pdfTextAt(ops, 552, summaryTop - 108, money(invoice.total, invoice.currency), 13, "F2", color.ink, "right");
  pdfLine(ops, sx, summaryTop - 123, 552, summaryTop - 123, color.ink, 1.2);

  pdfLine(ops, 44, 54, 552, 54, color.softLine, 1);
  pdfTextAt(ops, 44, 34, `Invoice dibuat otomatis oleh ${invoice.sender.name}`, 8, "F1", color.muted);
  pdfTextAt(ops, 552, 34, "Terima kasih atas kepercayaannya", 8, "F1", color.muted, "right");

  const stream = ops.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "binary");
}

function pdfRgb(rgb) {
  return rgb.map((value) => (Math.max(0, Math.min(255, value)) / 255).toFixed(3)).join(" ");
}

function pdfRect(ops, x, y, width, height, rgb) {
  ops.push(`q ${pdfRgb(rgb)} rg ${x} ${y} ${width} ${height} re f Q`);
}

function pdfStrokeRect(ops, x, y, width, height, rgb, lineWidth = 1) {
  ops.push(`q ${pdfRgb(rgb)} RG ${lineWidth} w ${x} ${y} ${width} ${height} re S Q`);
}

function pdfLine(ops, x1, y1, x2, y2, rgb, width = 1) {
  ops.push(`q ${pdfRgb(rgb)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S Q`);
}

function pdfTextAt(ops, x, y, value, size = 10, font = "F1", rgb = [0, 0, 0], align = "left") {
  const text = pdfText(value);
  const estimatedWidth = text.length * size * 0.50;
  const tx = align === "right" ? x - estimatedWidth : align === "center" ? x - estimatedWidth / 2 : x;
  ops.push(`BT ${pdfRgb(rgb)} rg /${font} ${size} Tf ${tx.toFixed(2)} ${y.toFixed(2)} Td (${text}) Tj ET`);
}

function wrapPdfText(value, max) {
  const words = String(value || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function pdfText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function formatDeliveryText({ invoice, productName, quantity, items, warrantyHours, warrantyEndsAt }) {
  const detail = items.map((item, index) => `${index + 1}. ${item}`).join("\n");
  return [
    "📦 Produk Berhasil Dikirim!",
    `Invoice : ${invoice}`,
    `Produk  : ${productName}`,
    `Qty     : ${quantity}`,
    "",
    "Detail produk:",
    detail,
    "",
    `🛡 Masa Garansi Aktif (${warrantyHours} jam)`,
    `Selesai otomatis: ${formatIndonesiaDateTime(warrantyEndsAt)}`,
    "Kalau ada masalah, hubungi admin",
    "",
    "Terima kasih sudah belanja 🙏",
  ].join("\n");
}

function formatIndonesiaDateTime(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

async function uploadR2Object({ key, body, contentType }) {
  requireStoreEnv("R2_BUCKET");
  requireStoreEnv("R2_ACCESS_KEY_ID");
  requireStoreEnv("R2_SECRET_ACCESS_KEY");

  const endpoint = String(process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`).replace(/\/+$/, "");
  const url = `${endpoint}/${encodeURIComponent(process.env.R2_BUCKET)}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const payloadHash = sha256Hex(body);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const { host, pathname } = new URL(url);
  const signedHeaders = "cache-control;content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    "cache-control:public, max-age=31536000, immutable",
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    "",
  ].join("\n");
  const canonicalRequest = ["PUT", pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = hmacHex(signingKey(process.env.R2_SECRET_ACCESS_KEY, dateStamp), stringToSign);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
      Host: host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization:
        `AWS4-HMAC-SHA256 Credential=${process.env.R2_ACCESS_KEY_ID}/${credentialScope}, ` +
        `SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  });

  if (!response.ok) {
    throw Object.assign(new Error(`R2 upload failed: HTTP ${response.status}`), { status: 502 });
  }
}

function mediaPublicUrl(value) {
  const source = String(value || "").trim();
  if (!source || /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(source) || source.startsWith("/")) return source;
  const base = String(process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || "").replace(/\/+$/, "");
  return base ? `${base}/${source.replace(/^\/+/, "")}` : source;
}

function extensionFromContentType(contentType, fileName) {
  const ext = String(fileName || "").match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) return ext;
  switch (contentType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    default:
      return ".bin";
  }
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key, value) {
  return createHmac("sha256", key).update(value).digest();
}

function hmacHex(key, value) {
  return createHmac("sha256", key).update(value).digest("hex");
}

function signingKey(secretAccessKey, dateStamp) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, "auto");
  const serviceKey = hmac(regionKey, "s3");
  return hmac(serviceKey, "aws4_request");
}

function sendSmtpMail({ from, to, subject, text, html = "", attachments = [], replyTo = "" }) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const username = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASS;

  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { servername: host });
    let buffer = "";
    let step = 0;

    const commands = [
      () => writeLine(socket, `EHLO ${process.env.SMTP_HELO || "adityaanugrah.me"}`),
      () => writeLine(socket, "AUTH LOGIN"),
      () => writeLine(socket, Buffer.from(username).toString("base64")),
      () => writeLine(socket, Buffer.from(password).toString("base64")),
      () => writeLine(socket, `MAIL FROM:<${from}>`),
      () => writeLine(socket, `RCPT TO:<${to}>`),
      () => writeLine(socket, "DATA"),
      () => {
        const boundary = `mail_${randomBytes(12).toString("hex")}`;
        const safeText = String(text || "").replace(/\r?\n/g, "\r\n");
        const parts = [];

        if (html || attachments.length) {
          parts.push(`--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${safeText}\r\n`);
          if (html) {
            parts.push(`--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${String(html).replace(/\r?\n/g, "\r\n")}\r\n`);
          }
          for (const attachment of attachments) {
            const filename = String(attachment.filename || "attachment.bin").replace(/["\r\n]/g, "");
            const content = Buffer.isBuffer(attachment.content) ? attachment.content : Buffer.from(String(attachment.content || ""), "utf8");
            parts.push(
              `--${boundary}\r\n` +
                `Content-Type: ${attachment.contentType || "application/octet-stream"}; name="${filename}"\r\n` +
                "Content-Transfer-Encoding: base64\r\n" +
                `Content-Disposition: attachment; filename="${filename}"\r\n\r\n` +
                `${content.toString("base64").replace(/(.{76})/g, "$1\r\n")}\r\n`
            );
          }
          parts.push(`--${boundary}--`);
        }

        const payload = [
          `From: ${from}`,
          `To: ${to}`,
          replyTo ? `Reply-To: ${replyTo}` : "",
          `Subject: ${encodeHeader(subject)}`,
          "MIME-Version: 1.0",
          html || attachments.length ? `Content-Type: multipart/mixed; boundary="${boundary}"` : "Content-Type: text/plain; charset=UTF-8",
          html || attachments.length ? "" : "Content-Transfer-Encoding: 8bit",
          "",
          html || attachments.length ? parts.join("\r\n") : safeText,
          ".",
        ].filter((line) => line !== "").join("\r\n");
        writeLine(socket, payload);
      },
      () => writeLine(socket, "QUIT"),
    ];

    socket.setTimeout(REQUEST_TIMEOUT_MS);
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      if (!buffer.endsWith("\n")) return;

      const response = buffer.trim();
      buffer = "";
      const code = Number(response.slice(0, 3));
      if (code >= 400) {
        socket.destroy();
        reject(new Error(`SMTP error ${response}`));
        return;
      }

      const command = commands[step++];
      if (command) command();
      else resolve();
    });
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("SMTP timeout"));
    });
    socket.on("error", reject);
    socket.on("close", () => resolve());
  });
}

function writeLine(socket, line) {
  socket.write(`${line}\r\n`);
}

function encodeHeader(value) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function requireStoreEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`${name} is not configured`);
    error.status = 503;
    throw error;
  }
  return value;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "utf8");
  const rightBuffer = Buffer.from(String(right || ""), "utf8");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function invalid(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomId() {
  return randomBytes(8).toString("hex");
}

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  let timeout;

  try {
    const timeoutPromise = new Promise((_, reject) => {
      timeout = setTimeout(() => {
        controller.abort();
        const timeoutError = new Error("Request timeout");
        timeoutError.status = 504;
        reject(timeoutError);
      }, REQUEST_TIMEOUT_MS);
    });
    const response = await Promise.race([
      fetch(url, { ...options, signal: controller.signal }),
      timeoutPromise,
    ]);
    const text = await Promise.race([
      response.text(),
      timeoutPromise,
    ]);
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status >= 400 && response.status < 500 ? response.status : 502;
      error.publicDetail = data?.message || data?.error?.message || data?.errors?.[0]?.title || data?.error || undefined;
      throw error;
    }

    return { response, data };
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Request timeout");
      timeoutError.status = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function requestJsonWithCurl(url, { headers = [], body = "" } = {}) {
  const args = [
    "-sS",
    "--connect-timeout",
    String(Math.min(5, Math.ceil(REQUEST_TIMEOUT_MS / 1000))),
    "--max-time",
    String(Math.ceil(REQUEST_TIMEOUT_MS / 1000)),
    "-X",
    "POST",
  ];

  for (const header of headers) {
    args.push("-H", header);
  }

  args.push("--data", body, "-w", "\n%{http_code}", url);

  return new Promise((resolve, reject) => {
    execFile("curl", args, { timeout: REQUEST_TIMEOUT_MS + 2000, windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        const err = new Error(stderr || error.message || "curl request failed");
        err.status = error.killed ? 504 : 502;
        err.publicDetail = "Tripay belum merespons. Coba lagi sebentar lagi.";
        reject(err);
        return;
      }

      const lines = String(stdout || "").split(/\r?\n/);
      const status = Number(lines.pop());
      const text = lines.join("\n").trim();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        const err = new Error("Invalid upstream JSON");
        err.status = 502;
        err.publicDetail = text.slice(0, 240);
        reject(err);
        return;
      }

      if (status < 200 || status >= 300) {
        const err = new Error(`HTTP ${status}`);
        err.status = status >= 400 && status < 500 ? status : 502;
        err.publicDetail = data?.message || data?.error?.message || data?.error || text.slice(0, 240);
        reject(err);
        return;
      }

      resolve({ data, status });
    });
  });
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`${name} is not configured`);
    error.status = 503;
    throw error;
  }
  return value;
}

async function getSpotifyAccessToken() {
  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
  const refreshToken = requireEnv("SPOTIFY_REFRESH_TOKEN");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const { data } = await requestJson("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return data.access_token;
}

async function getSpotifyTracks() {
  try {
    const accessToken = await getSpotifyAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const tracks = [];

    const current = await requestJson("https://api.spotify.com/v1/me/player/currently-playing", {
      headers,
    }).catch((error) => {
      if (error.status === 404) return { data: null };
      throw error;
    });

    const currentTrack = mapSpotifyCurrentTrack(current.data);
    if (currentTrack) tracks.push(currentTrack);

    const { data: recentData } = await requestJson("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
      headers,
    });

    const recentTracks = (recentData?.items || [])
      .map(mapSpotifyRecentTrack)
      .filter(Boolean)
      .filter((track) => !tracks.some((existing) => existing.songUrl === track.songUrl));

    return tracks.concat(recentTracks).slice(0, 5);
  } catch (error) {
    console.warn(`[spotify] ${error.message}`);
    return [];
  }
}

function mapSpotifyCurrentTrack(data) {
  if (!data?.item) return null;
  return mapSpotifyTrack(data.item, {
    isPlaying: Boolean(data.is_playing),
    playedAt: null,
  });
}

function mapSpotifyRecentTrack(item) {
  if (!item?.track) return null;
  return mapSpotifyTrack(item.track, {
    isPlaying: false,
    playedAt: item.played_at || null,
  });
}

function mapSpotifyTrack(track, meta) {
  return {
    title: track.name,
    artist: (track.artists || []).map((artist) => artist.name).join(", ") || "Unknown Artist",
    album: track.album?.name || "",
    albumImageUrl: track.album?.images?.[0]?.url || "",
    songUrl: track.external_urls?.spotify || "https://open.spotify.com",
    isPlaying: meta.isPlaying,
    playedAt: meta.playedAt,
  };
}

async function getSteamProfile() {
  const apiKey = requireEnv("STEAM_API_KEY");
  const steamId = requireEnv("STEAM_ID");
  const displayNameOverride = process.env.STEAM_DISPLAY_NAME?.trim();
  const realNameOverride = process.env.STEAM_REAL_NAME?.trim();
  const profileUrlOverride = process.env.STEAM_PROFILE_URL?.trim();
  const avatarUrlOverride = process.env.STEAM_AVATAR_URL?.trim();
  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamids", steamId);

  const { data } = await requestJson(url);
  const player = data?.response?.players?.[0];

  if (!player) {
    const error = new Error("Steam profile not found");
    error.status = 404;
    throw error;
  }

  const state = player.gameextrainfo ? "In-Game" : mapSteamState(player.personastate);
  const gameMedia = player.gameid ? await getSteamGameMedia(player.gameid).catch(() => null) : null;

  return {
    username: displayNameOverride || player.personaname || "Steam User",
    realName: realNameOverride || player.realname || "",
    state,
    avatarUrl: avatarUrlOverride || player.avatarfull || player.avatarmedium || "",
    gameName: player.gameextrainfo || null,
    gameId: player.gameid || null,
    gameArtUrl: gameMedia?.gameArtUrl || "",
    gameLogoUrl: gameMedia?.gameLogoUrl || "",
    gameStoreUrl: gameMedia?.gameStoreUrl || "",
    profileUrl: profileUrlOverride || player.profileurl || `https://steamcommunity.com/profiles/${steamId}`,
    countryCode: player.loccountrycode || "",
  };
}

async function getSteamGameMedia(gameId) {
  const url = new URL("https://store.steampowered.com/api/appdetails");
  url.searchParams.set("appids", String(gameId));
  url.searchParams.set("l", "en");

  const { data } = await requestJson(url);
  const app = data?.[String(gameId)];
  if (!app?.success) return null;

  const game = app.data || {};
  return {
    gameArtUrl: game.header_image || game.capsule_imagev5 || game.capsule_image || "",
    gameLogoUrl: game.capsule_imagev5 || game.capsule_image || game.header_image || "",
    gameStoreUrl: `https://store.steampowered.com/app/${gameId}`,
  };
}

function mapSteamState(state) {
  switch (Number(state)) {
    case 1:
      return "Online";
    case 2:
      return "Busy";
    case 3:
      return "Away";
    case 4:
      return "Snooze";
    case 5:
      return "Looking to Trade";
    case 6:
      return "Looking to Play";
    case 0:
    default:
      return "Offline";
  }
}

async function getPubgPlayer(ign) {
  const apiKey = requireEnv("PUBG_API_KEY");
  const url = new URL("https://api.pubg.com/shards/steam/players");
  url.searchParams.set("filter[playerNames]", ign);

  const { data } = await requestJson(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/vnd.api+json",
    },
  });

  const player = data?.data?.[0];
  if (!player) {
    const error = new Error("PUBG player not found");
    error.status = 404;
    throw error;
  }

  return {
    ign: player.attributes?.name || ign,
    platform: "Steam",
    playerId: player.id,
    recentMatchIds: (player.relationships?.matches?.data || []).map((match) => match.id),
    shard: "steam",
  };
}
