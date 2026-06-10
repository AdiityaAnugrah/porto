import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaFolderPlus, FaImage, FaPlus, FaSave, FaSignInAlt, FaSpinner } from "react-icons/fa";
import SEO from "../components/SEO";
import { apiUrl } from "../lib/api";

const emptyProduct = {
  id: "",
  name: "",
  summary: "",
  description: "",
  price: "",
  image: "brand/icon-256.png",
  categoryId: "",
  warrantyHours: 24,
  active: true,
};

const emptyCategory = {
  id: "",
  name: "",
  description: "",
  active: true,
};

export default function StoreAdmin() {
  const [token, setToken] = useState(() => window.localStorage.getItem("store_admin_token") || "");
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState({ categories: [], products: [], orders: [] });
  const [product, setProduct] = useState(emptyProduct);
  const [category, setCategory] = useState(emptyCategory);
  const [stockText, setStockText] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
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
    setSelectedProductId(data.products?.[0]?.id || "");
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
          warrantyHours: Number(product.warrantyHours || 24),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan produk");
      setProduct(emptyProduct);
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
          {message && <p className="text-sm text-red-300">{message}</p>}
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

      {message && <p className="mb-5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-cyan-100">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={saveProduct} className="glass-panel rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><FaBoxOpen /> Produk</h2>
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
            <FaSave /> Simpan produk
          </button>
        </form>

        <div className="space-y-6">
          <form onSubmit={saveCategory} className="glass-panel rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><FaFolderPlus /> Kategori</h2>
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
              <FaSave /> Simpan kategori
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
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">Kategori</h2>
          <div className="space-y-3">
            {summary.categories.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-bold">{item.name}</div>
                <div className="mt-1 text-sm text-white/45">{item.active ? "Aktif" : "Nonaktif"}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">Produk Aktif</h2>
          <div className="space-y-3">
            {summary.products.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-bold">{item.name}</div>
                <div className="mt-1 text-sm text-white/45">Stok {item.stock} / total {item.totalStock}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">Order Terbaru</h2>
          <div className="space-y-3">
            {summary.orders.map((item) => (
              <div key={item.merchantRef} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between gap-3">
                  <span className="font-bold">{item.merchantRef}</span>
                  <span className="text-cyan-200">{item.status}</span>
                </div>
                <div className="mt-1 text-sm text-white/45">{item.productName} - {item.email}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
