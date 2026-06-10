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
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 8000);
const CACHE_TTL = {
  spotify: Number(process.env.SPOTIFY_CACHE_TTL_MS || 15000),
  steam: Number(process.env.STEAM_CACHE_TTL_MS || 60000),
  pubg: Number(process.env.PUBG_CACHE_TTL_MS || 300000),
};

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://adityaanugrah.me,http://localhost:5173,http://127.0.0.1:5173")
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
      return handleStoreRequest(req, res, url);
    }

    if (url.pathname === "/analytics/view") {
      return handleAnalyticsView(req, res);
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
    const data = await createStoreOrder(body);
    return sendJson(res, 201, data);
  }

  const orderMatch = url.pathname.match(/^\/store\/orders\/([^/]+)$/);
  if (req.method === "GET" && orderMatch) {
    const merchantRef = decodeURIComponent(orderMatch[1]);
    const store = readStore();
    const order = store.orders.find((item) => item.merchantRef === merchantRef);
    if (!order) return sendJson(res, 404, { error: "Order not found" });
    return sendJson(res, 200, { order: publicOrder(order) });
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
        orders: store.orders
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 50)
          .map(adminOrder),
      });
    }

    if (req.method === "POST" && url.pathname === "/store/admin/products") {
      const body = await readJsonBody(req);
      const product = saveAdminProduct(body);
      return sendJson(res, 200, { product: adminProduct(product) });
    }

    if (req.method === "POST" && url.pathname === "/store/admin/categories") {
      const body = await readJsonBody(req);
      const category = saveAdminCategory(body);
      return sendJson(res, 200, { category: adminCategory(category) });
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
  }

  return sendJson(res, 404, { error: "Not found" });
}

async function handleAnalyticsView(req, res) {
  if (req.method === "GET") {
    const analytics = readAnalytics();
    return sendJson(res, 200, publicAnalytics(analytics));
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
  return sendJson(res, 200, publicAnalytics(analytics));
}

async function createStoreOrder(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const customerName = String(body.name || "Customer").trim() || "Customer";
  const phone = String(body.phone || "").trim();
  const productId = String(body.productId || "").trim();
  const quantity = Math.max(1, Math.min(20, Number.parseInt(body.quantity || "1", 10) || 1));

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return invalid("Email tidak valid");
  }

  const store = readStore();
  const product = store.products.find((item) => item.id === productId && item.active);
  if (!product) return invalid("Produk tidak ditemukan");
  if (availableStock(product) < quantity) return invalid("Stok produk tidak cukup");

  const amount = Number(product.price) * quantity;
  const merchantRef = `INV-${randomBytes(4).toString("base64url").toUpperCase()}-${randomBytes(3).toString("base64url").toUpperCase()}`;
  const now = new Date();
  const expiredAt = new Date(now.getTime() + Number(process.env.STORE_PAYMENT_TTL_MINUTES || 30) * 60000);

  const order = {
    id: randomId(),
    merchantRef,
    productId: product.id,
    productName: product.name,
    quantity,
    customerName,
    email,
    phone,
    amount,
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
    order: publicOrder(order),
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

  const { data } = await requestJsonWithCurl(endpoint, {
    headers: [
      `Authorization: Bearer ${process.env.TRIPAY_API_KEY}`,
      "Content-Type: application/json",
    ],
    body: JSON.stringify(payload),
  });

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

  const quantity = Number(order.quantity || 1);
  const stockItems = (product.stock || []).filter((item) => !item.usedBy).slice(0, quantity);
  if (stockItems.length < quantity) {
    order.status = "PAID_MANUAL_REVIEW";
    return;
  }

  const now = new Date();
  const warrantyHours = Number(product.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24);
  const warrantyEndsAt = new Date(now.getTime() + warrantyHours * 60 * 60 * 1000);
  for (const stock of stockItems) {
    stock.usedBy = order.merchantRef;
    stock.usedAt = now.toISOString();
  }
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

  const filename = `${delivery.productName || "digital-product"}-${delivery.merchantRef}.txt`
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

  product.name = String(body.name || product.name || id).trim();
  product.summary = String(body.summary || "").trim();
  product.description = String(body.description || "").trim();
  product.price = Number(body.price || product.price || 0);
  product.image = String(body.image || "").trim();
  product.categoryId = String(body.categoryId || "").trim();
  product.warrantyHours = Number(body.warrantyHours || product.warrantyHours || process.env.STORE_WARRANTY_HOURS || 24);
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

  category.name = String(body.name || category.name || id).trim();
  category.description = String(body.description || "").trim();
  category.active = body.active !== false;
  category.updatedAt = new Date().toISOString();

  writeStore(store);
  return category;
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
  return { key, url: mediaPublicUrl(key) };
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

function publicProduct(product) {
  return {
    id: product.id,
    name: product.name,
    summary: product.summary,
    description: product.description,
    price: product.price,
    image: product.image,
    categoryId: product.categoryId || "",
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
  return {
    ...publicProduct(product),
    totalStock: product.stock?.length || 0,
    soldStock: (product.stock || []).filter((item) => item.usedBy).length,
  };
}

function publicOrder(order) {
  return {
    merchantRef: order.merchantRef,
    productName: order.productName,
    email: order.email,
    amount: order.amount,
    quantity: order.quantity || 1,
    status: order.status,
    payment: order.payment,
    expiredAt: order.expiredAt,
    createdAt: order.createdAt,
    downloadUrl: order.deliveryToken ? `/store/download/${order.deliveryToken}` : null,
  };
}

function adminOrder(order) {
  return {
    merchantRef: order.merchantRef,
    productName: order.productName,
    email: order.email,
    amount: order.amount,
    quantity: order.quantity || 1,
    status: order.status,
    tripayReference: order.tripayReference,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
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

function ensureSeedCatalog(store) {
  if (!existsSync(STORE_SEED_FILE)) return store;

  try {
    const seed = normalizeStore(JSON.parse(readFileSync(STORE_SEED_FILE, "utf8")));
    const categoryIds = new Set(store.categories.map((item) => item.id));
    const productIds = new Set(store.products.map((item) => item.id));
    const missingCategories = seed.categories.filter((item) => !categoryIds.has(item.id));
    const missingProducts = seed.products.filter((item) => !productIds.has(item.id));

    if (!missingCategories.length && !missingProducts.length) return store;

    return {
      ...store,
      categories: [...store.categories, ...missingCategories],
      products: [...store.products, ...missingProducts],
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
  console.log(`[store] read body start ${req.method} ${req.url} len=${req.headers["content-length"] || "none"}`);
  const maxBytes = Number(process.env.STORE_MAX_BODY_BYTES || 6 * 1024 * 1024);
  let size = 0;
  let body = "";

  const readPromise = (async () => {
    for await (const chunk of req) {
      const text = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
      size += Buffer.byteLength(text);
      if (size > maxBytes) {
        throw Object.assign(new Error("Request body too large"), { status: 413 });
      }
      body += text;
    }
    console.log(`[store] read body end ${req.method} ${req.url} bytes=${size}`);
    return body;
  })();

  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      console.log(`[store] read body timeout ${req.method} ${req.url}`);
      req.destroy();
      reject(Object.assign(new Error("Request body timeout"), { status: 408 }));
    }, Number(process.env.STORE_BODY_TIMEOUT_MS || 5000));
  });

  try {
    return await Promise.race([readPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeout);
  }
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

function sendSmtpMail({ from, to, subject, text }) {
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
        const payload = [
          `From: ${from}`,
          `To: ${to}`,
          `Subject: ${encodeHeader(subject)}`,
          "MIME-Version: 1.0",
          "Content-Type: text/plain; charset=UTF-8",
          "Content-Transfer-Encoding: 8bit",
          "",
          text.replace(/\r?\n/g, "\r\n"),
          ".",
        ].join("\r\n");
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

  return {
    username: player.personaname || "Aditya",
    realName: player.realname || "",
    state,
    avatarUrl: player.avatarfull || player.avatarmedium || "",
    gameName: player.gameextrainfo || null,
    gameId: player.gameid || null,
    profileUrl: player.profileurl || "https://steamcommunity.com/id/claraikaa/",
    countryCode: player.loccountrycode || "",
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
