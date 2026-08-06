import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaFolderPlus, FaImage, FaPen, FaPlus, FaSave, FaSignInAlt, FaSpinner, FaTrash, FaUpload } from "react-icons/fa";
import SEO from "../components/SEO";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/8bit-alert";
import { apiUrl } from "../lib/api";

const emptyProduct = {
  id: "",
  name: "",
  summary: "",
  description: "",
  price: "",
  image: "brand/icon-256.png",
  categoryId: "",
  fulfillmentType: "auto_stock",
  warrantyHours: 24,
  active: true,
};

const emptyCategory = {
  id: "",
  name: "",
  description: "",
  active: true,
};

const messageVariant = (message) =>
  /gagal|error|failed|unauthorized|forbidden|invalid/i.test(String(message || ""))
    ? "destructive"
    : "success";

const orderStatuses = ["ALL", "PENDING", "PAID_WAITING_UPLOAD", "READY", "PAID", "EXPIRED", "FAILED"];

export default function StoreAdmin() {
  const [token, setToken] = useState(() => window.localStorage.getItem("store_admin_token") || "");
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState({ categories: [], products: [], orders: [] });
  const [product, setProduct] = useState(emptyProduct);
  const [category, setCategory] = useState(emptyCategory);
  const [editingProductId, setEditingProductId] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [stockText, setStockText] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [deliveryUploads, setDeliveryUploads] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadSummary = async () => {
    if (!token) return;
    const response = await fetch(apiUrl("/store/admin/summary"), { headers: authHeaders });
    if (response.status === 401) {
      window.localStorage.removeItem("store_admin_token");
      setToken("");
      return;
    }
    const data = await response.json();
    setSummary(data);
    setSelectedProductId((current) =>
      data.products?.some((item) => item.id === current) ? current : data.products?.[0]?.id || ""
    );
  };

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl("/store/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login gagal");
      window.localStorage.setItem("store_admin_token", data.token);
      setToken(data.token);
      setPassword("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl("/store/admin/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          fulfillmentType: product.fulfillmentType,
          warrantyHours: Number(product.warrantyHours || 24),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan produk");
      setProduct(emptyProduct);
      setEditingProductId("");
      setMessage(`Produk ${data.product.name} tersimpan`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl("/store/admin/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(category),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan kategori");
      setCategory(emptyCategory);
      setEditingCategoryId("");
      setMessage(`Kategori ${data.category.name} tersimpan`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch(apiUrl("/store/admin/upload-image"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          data: dataUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload gambar gagal");
      setProduct((current) => ({ ...current, image: data.key }));
      await loadSummary();
      setMessage("Gambar berhasil diupload ke R2");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const addStock = async (event) => {
    event.preventDefault();
    if (!selectedProductId) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/store/admin/products/${selectedProductId}/stock`), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ text: stockText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal tambah stok");
      setStockText("");
      setMessage(`Stok ${data.product.name} diperbarui`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeStockItem = async (stockId) => {
    if (!selectedProductId || !stockId) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/store/admin/products/${selectedProductId}/stock/remove`), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ stockId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal hapus stok");
      setMessage(`Stok ${data.product.name} diperbarui`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadDelivery = async (merchantRef, file) => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch(apiUrl(`/store/admin/orders/${merchantRef}/delivery`), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "text/plain",
          data: dataUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload delivery gagal");
      setDeliveryUploads((current) => ({ ...current, [merchantRef]: "" }));
      setMessage(`File delivery ${data.order.merchantRef} tersimpan`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!productId) return;
    const item = summary.products.find((productItem) => productItem.id === productId);
    const confirmed = window.confirm(
      `Hapus produk "${item?.name || productId}"? Produk yang pernah dipakai order tidak bisa dihapus.`
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/store/admin/products/${productId}/delete`), {
        method: "POST",
        headers: { ...authHeaders },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghapus produk");
      if (editingProductId === productId) resetProductForm();
      setMessage(`Produk ${data.productName || productId} dihapus`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!categoryId) return;
    const item = summary.categories.find((categoryItem) => categoryItem.id === categoryId);
    const confirmed = window.confirm(
      `Hapus kategori "${item?.name || categoryId}"? Kategori yang masih dipakai produk tidak bisa dihapus.`
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/store/admin/categories/${categoryId}/delete`), {
        method: "POST",
        headers: { ...authHeaders },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghapus kategori");
      if (editingCategoryId === categoryId) resetCategoryForm();
      setMessage(`Kategori ${data.categoryName || categoryId} dihapus`);
      await loadSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const beginEditProduct = (item) => {
    setEditingProductId(item.id);
    setSelectedProductId(item.id);
    setProduct({
      id: item.id,
      name: item.name || "",
      summary: item.summary || "",
      description: item.description || "",
      price: item.price || "",
      image: item.image || "",
      categoryId: item.categoryId || "",
      fulfillmentType: item.fulfillmentType || "auto_stock",
      warrantyHours: item.warrantyHours || 24,
      active: item.active !== false,
    });
  };

  const beginEditCategory = (item) => {
    setEditingCategoryId(item.id);
    setCategory({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      active: item.active !== false,
    });
  };

  const resetProductForm = () => {
    setEditingProductId("");
    setProduct(emptyProduct);
  };

  const resetCategoryForm = () => {
    setEditingCategoryId("");
    setCategory(emptyCategory);
  };

  const selectedStockProduct = summary.products.find((item) => item.id === selectedProductId) || null;
  const filteredOrders = summary.orders.filter((item) =>
    orderStatusFilter === "ALL" ? true : item.status === orderStatusFilter
  );

  if (!token) {
    return (
      <div className="pt-24 pb-32 px-6 max-w-md mx-auto min-h-screen">
        <SEO title="Store Admin" description="Admin store digital." robots={false} />
        <form onSubmit={login} className="glass-panel rounded-3xl p-6 space-y-4">
          <h1 className="text-2xl font-bold font-display">Store Admin</h1>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password admin"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
          />
          {message && (
            <Alert variant="destructive">
              <AlertTitle>Login gagal</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <button className="w-full rounded-xl bg-cyan-100 px-5 py-3 font-bold text-black flex items-center justify-center gap-2">
            {loading ? <FaSpinner className="animate-spin" /> : <><FaSignInAlt /> Login</>}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <SEO title="Store Admin" description="Admin store digital." robots={false} />
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/80">Admin</p>
          <h1 className="text-4xl font-bold font-display">Store Control</h1>
        </div>
        <button
          onClick={() => {
            window.localStorage.removeItem("store_admin_token");
            setToken("");
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
        >
          Logout
        </button>
      </header>

      {message && (
        <Alert variant={messageVariant(message)} className="mb-6">
          <AlertTitle>{messageVariant(message) === "destructive" ? "Aksi gagal" : "Aksi berhasil"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={saveProduct} className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold flex items-center gap-2"><FaBoxOpen /> Produk</h2>
            <div className="flex gap-2">
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
                >
                  Produk baru
                </button>
              )}
              <select
                value={editingProductId}
                onChange={(event) => {
                  const nextId = event.target.value;
                  if (!nextId) return resetProductForm();
                  const item = summary.products.find((productItem) => productItem.id === nextId);
                  if (item) beginEditProduct(item);
                }}
                className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm outline-none focus:border-cyan-300/50"
              >
                <option value="">Pilih produk untuk edit</option>
                {summary.products.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
          {[
            ["name", "Nama produk"],
            ["summary", "Ringkasan"],
            ["price", "Harga"],
          ].map(([key, placeholder]) => (
            <input
              key={key}
              value={product[key]}
              onChange={(event) => setProduct({ ...product, [key]: event.target.value })}
              placeholder={placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
            />
          ))}
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={product.image}
              onChange={(event) => setProduct({ ...product, image: event.target.value })}
              placeholder="Image key R2"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
            />
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 font-bold text-cyan-100 hover:bg-cyan-300/15">
              {uploadingImage ? <FaSpinner className="animate-spin" /> : <FaImage />}
              Upload
              <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
            </label>
          </div>
          {summary.media?.length > 0 && (
            <select
              value={product.image}
              onChange={(event) => setProduct({ ...product, image: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-300/50"
            >
              <option value={product.image}>Pakai gambar saat ini</option>
              {summary.media.map((item) => (
                <option key={item.id || item.key} value={item.key}>
                  {item.fileName || item.key}
                </option>
              ))}
            </select>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={product.categoryId}
              onChange={(event) => setProduct({ ...product, categoryId: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-300/50"
            >
              <option value="">Tanpa kategori</option>
              {summary.categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={product.warrantyHours}
              onChange={(event) => setProduct({ ...product, warrantyHours: event.target.value })}
              placeholder="Garansi jam"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
            />
          </div>
          <select
            value={product.fulfillmentType}
            onChange={(event) => setProduct({ ...product, fulfillmentType: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-300/50"
          >
            <option value="auto_stock">Auto stock - stok TXT langsung dikirim setelah PAID</option>
            <option value="manual_upload">Manual upload - admin upload TXT setelah PAID</option>
          </select>
          <textarea
            value={product.description}
            onChange={(event) => setProduct({ ...product, description: event.target.value })}
            placeholder="Deskripsi"
            rows="4"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
          />
          <label className="flex items-center gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              checked={product.active}
              onChange={(event) => setProduct({ ...product, active: event.target.checked })}
            />
            Aktif
          </label>
          <button className="rounded-xl bg-cyan-100 px-5 py-3 font-bold text-black flex items-center gap-2">
            {editingProductId ? <FaPen /> : <FaSave />} {editingProductId ? "Update produk" : "Simpan produk"}
          </button>
        </form>

        <div className="space-y-6">
          <form onSubmit={saveCategory} className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold flex items-center gap-2"><FaFolderPlus /> Kategori</h2>
              <div className="flex gap-2">
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
                  >
                    Kategori baru
                  </button>
                )}
                <select
                  value={editingCategoryId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    if (!nextId) return resetCategoryForm();
                    const item = summary.categories.find((categoryItem) => categoryItem.id === nextId);
                    if (item) beginEditCategory(item);
                  }}
                  className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm outline-none focus:border-cyan-300/50"
                >
                  <option value="">Pilih kategori untuk edit</option>
                  {summary.categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <input
              value={category.name}
              onChange={(event) => setCategory({ ...category, name: event.target.value })}
              placeholder="Nama kategori"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
            />
            <input
              value={category.description}
              onChange={(event) => setCategory({ ...category, description: event.target.value })}
              placeholder="Deskripsi singkat"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
            />
            <label className="flex items-center gap-3 text-sm text-white/60">
              <input
                type="checkbox"
                checked={category.active}
                onChange={(event) => setCategory({ ...category, active: event.target.checked })}
              />
              Aktif
            </label>
            <button className="rounded-xl bg-white/10 px-5 py-3 font-bold text-white flex items-center gap-2">
              {editingCategoryId ? <FaPen /> : <FaSave />} {editingCategoryId ? "Update kategori" : "Simpan kategori"}
            </button>
          </form>

          <form onSubmit={addStock} className="glass-panel rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><FaPlus /> Tambah Stok TXT</h2>
            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-300/50"
            >
              {summary.products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - stok {item.stock}
                </option>
              ))}
            </select>
            <textarea
              value={stockText}
              onChange={(event) => setStockText(event.target.value)}
              placeholder="Satu stok per baris. Contoh: email@gmail.com|password"
              rows="7"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300/50"
            />
            <p className="text-xs leading-relaxed text-white/40">
              Jika pembeli beli Qty 2, sistem otomatis mengambil 2 baris stok dan menulisnya bernomor di file TXT.
            </p>
            <button className="rounded-xl bg-cyan-100 px-5 py-3 font-bold text-black flex items-center gap-2">
              <FaPlus /> Tambah stok
            </button>
          </form>

          {selectedStockProduct && (
            <div className="glass-panel rounded-3xl p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Preview stok</h2>
                  <p className="mt-1 text-sm text-white/45">
                    {selectedStockProduct.name} · tersedia {selectedStockProduct.stock} · total {selectedStockProduct.totalStock}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">
                  {selectedStockProduct.fulfillmentType}
                </span>
              </div>

              {selectedStockProduct.stockPreview?.length ? (
                <div className="space-y-3">
                  {selectedStockProduct.stockPreview.map((item) => (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-3 text-sm leading-6 text-white/68">{item.content}</p>
                        <button
                          type="button"
                          onClick={() => removeStockItem(item.id)}
                          className="shrink-0 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedStockProduct.stock > selectedStockProduct.stockPreview.length && (
                    <p className="text-xs text-white/38">
                      Menampilkan {selectedStockProduct.stockPreview.length} stok pertama dari {selectedStockProduct.stock} stok tersedia.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-white/45">Belum ada stok tersedia untuk produk ini.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">Kategori</h2>
          <div className="space-y-3">
            {summary.categories.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="mt-1 text-sm text-white/45">{item.active ? "Aktif" : "Nonaktif"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => beginEditCategory(item)}
                    className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/70"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(item.id)}
                    className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-100"
                  >
                    <FaTrash className="inline" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">Produk Aktif</h2>
          <div className="space-y-3">
            {summary.products.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="mt-1 text-sm text-white/45">
                      {item.fulfillmentType === "manual_upload" ? "Manual upload" : `Stok ${item.stock} / total ${item.totalStock}`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => beginEditProduct(item)}
                    className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/70"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(item.id)}
                    className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-100"
                  >
                    <FaTrash className="inline" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Order Terbaru</h2>
            <select
              value={orderStatusFilter}
              onChange={(event) => setOrderStatusFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm outline-none focus:border-cyan-300/50"
            >
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "Semua status" : status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {filteredOrders.map((item) => (
              <div key={item.merchantRef} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between gap-3">
                  <span className="font-bold">{item.merchantRef}</span>
                  <span className="text-cyan-200">{item.status}</span>
                </div>
                <div className="mt-1 text-sm text-white/45">{item.productName} - {item.email}</div>
                {item.buyerNote && (
                  <div className="mt-2 rounded-lg bg-black/20 p-3 text-xs leading-5 text-white/55">
                    {item.buyerNote}
                  </div>
                )}
                {item.needsUpload && (
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/15">
                    <FaUpload /> Upload TXT
                    <input
                      type="file"
                      accept=".txt,text/plain"
                      value={deliveryUploads[item.merchantRef] || ""}
                      onChange={(event) => uploadDelivery(item.merchantRef, event.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                )}
                {item.downloadUrl && (
                  <div className="mt-2 text-xs text-emerald-200">File delivery sudah tersedia</div>
                )}
              </div>
            ))}
            {!filteredOrders.length && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
                Tidak ada order untuk status ini.
              </div>
            )}
          </div>
        </div>
      </section>

      {summary.media?.length > 0 && (
        <section className="mt-8 glass-panel rounded-3xl p-6">
          <h2 className="mb-4 text-xl font-bold">Media Library</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.media.map((item) => (
              <button
                key={item.id || item.key}
                type="button"
                onClick={() => setProduct((current) => ({ ...current, image: item.key }))}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition-colors hover:border-cyan-300/35"
              >
                <img src={item.url} alt={item.fileName || item.key} className="aspect-[4/3] w-full object-cover" />
                <div className="p-3 text-xs text-white/55">{item.fileName || item.key}</div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
