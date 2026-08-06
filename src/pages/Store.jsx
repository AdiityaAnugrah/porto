import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  CreditCard,
  Download,
  FileText,
  Loader2,
  LockKeyhole,
  Mail,
  Minus,
  PackageOpen,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
} from "lucide-react";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/8bit-alert";
import TetrisLoading from "../components/ui/tetris-loader";
import { apiUrl } from "../lib/api";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const splitDescription = (value) =>
  String(value || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const normalizeText = (value) => String(value || "").toLowerCase();

const storeCopy = {
  id: {
    seoTitle: "Store | Aditya Anugrah",
    seoDescription: "Produk digital pilihan untuk template, panduan, dan workflow siap pakai.",
    badge: "Produk digital siap kirim",
    title: "Digital store untuk template, panduan, dan workflow siap pakai.",
    body: "Pilih produk, cek detail isi paket, bayar dengan QRIS, lalu terima file digital melalui email dan halaman order.",
    stats: {
      active: "Produk aktif",
      stock: "Stok tersedia",
      payment: "Metode bayar",
    },
    loading: "Memuat katalog",
    all: "Semua",
    search: "Cari produk",
    emptyTitle: "Produk tidak ditemukan",
    emptyBody: "Ubah kata kunci atau pilih kategori lain untuk melihat katalog yang tersedia.",
    delivery: "Email dan halaman order",
    warranty: "Garansi",
    price: "Harga",
    stockLabel: "Stok",
    digital: "Digital",
    productCategory: "Produk Digital",
    deliveryAuto: "Otomatis",
    detail: "Detail produk",
    name: "Nama",
    recipient: "Nama penerima",
    email: "Email pengiriman",
    phone: "WhatsApp",
    optional: "Opsional",
    note: "Catatan pembelian",
    notePlaceholder: "Tulis permintaan khusus, username, atau detail kebutuhan pembelian.",
    quantity: "Quantity",
    quantityHelp: "Maksimal sesuai stok",
    decrease: "Kurangi quantity",
    increase: "Tambah quantity",
    total: "Total pembayaran",
    creating: "Membuat invoice",
    pay: "Bayar QRIS",
    noProduct: "Belum ada produk aktif.",
    item: "item",
    hour: "jam",
    manual: "Manual",
  },
  en: {
    seoTitle: "Store | Aditya Anugrah",
    seoDescription: "Selected digital products for ready-to-use templates, guides, and workflows.",
    badge: "Ready-to-send digital products",
    title: "Digital store for templates, guides, and ready-to-use workflows.",
    body: "Choose a product, review the package details, pay with QRIS, then receive the digital file by email and order page.",
    stats: {
      active: "Active products",
      stock: "Available stock",
      payment: "Payment method",
    },
    loading: "Loading catalog",
    all: "All",
    search: "Search products",
    emptyTitle: "No products found",
    emptyBody: "Change the keyword or choose another category to see available products.",
    delivery: "Email and order page",
    warranty: "Warranty",
    price: "Price",
    stockLabel: "Stock",
    digital: "Digital",
    productCategory: "Digital Product",
    deliveryAuto: "Automatic",
    detail: "Product details",
    name: "Name",
    recipient: "Recipient name",
    email: "Delivery email",
    phone: "WhatsApp",
    optional: "Optional",
    note: "Purchase note",
    notePlaceholder: "Write a special request, username, or purchase details.",
    quantity: "Quantity",
    quantityHelp: "Limited by available stock",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    total: "Payment total",
    creating: "Creating invoice",
    pay: "Pay with QRIS",
    noProduct: "No active products yet.",
    item: "item",
    hour: "hour",
    manual: "Manual",
  },
};

export default function Store() {
  const { language } = usePreferredLanguage();
  const t = storeCopy[language] || storeCopy.en;
  const navigate = useNavigate();
  const toLocalized = useLocalizedPath();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "", quantity: 1 });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/store/products"))
      .then((res) => {
        if (!res.ok) throw new Error("Produk belum tersedia");
        return res.json();
      })
      .then((data) => {
        const nextProducts = data.products || [];
        setProducts(nextProducts);
        setCategories(data.categories || []);
        setSelectedId(nextProducts[0]?.id || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const selected = useMemo(
    () => products.find((product) => product.id === selectedId),
    [products, selectedId]
  );

  const selectedCategory = selected ? categoryById.get(selected.categoryId) : null;
  const selectedDescription = useMemo(
    () => splitDescription(selected?.description),
    [selected?.description]
  );
  const isManualFulfillment = selected?.fulfillmentType === "manual_upload";

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.categoryId === activeCategory;
      const haystack = normalizeText(`${product.name} ${product.summary} ${product.description}`);
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [activeCategory, products, searchQuery]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelectedId("");
      return;
    }
    if (!filteredProducts.some((product) => product.id === selectedId)) {
      setSelectedId(filteredProducts[0].id);
    }
  }, [filteredProducts, selectedId]);

  const selectedTotal = selected ? Number(selected.price || 0) * Number(form.quantity || 1) : 0;
  const productCount = products.length;
  const availableCount = products.filter((product) => product.fulfillmentType === "manual_upload" || Number(product.stock || 0) > 0).length;

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const nextProducts = categoryId === "all"
      ? products
      : products.filter((product) => product.categoryId === categoryId);
    const nextSelected = nextProducts.find((product) => {
      const query = normalizeText(searchQuery);
      return !query || normalizeText(`${product.name} ${product.summary} ${product.description}`).includes(query);
    });
    if (nextSelected) setSelectedId(nextSelected.id);
  };

  const selectProduct = (product) => {
    const maxQuantity = product.fulfillmentType === "manual_upload" ? 20 : Math.max(1, Number(product.stock || 1));
    setSelectedId(product.id);
    setForm((current) => ({
      ...current,
      quantity: Math.min(Math.max(1, Number(current.quantity || 1)), maxQuantity),
    }));
  };

  const updateQuantity = (value) => {
    const maxStock = selected?.fulfillmentType === "manual_upload" ? 20 : Math.max(1, Number(selected?.stock || 1));
    const nextValue = Math.min(maxStock, Math.max(1, Number(value || 1)));
    setForm((current) => ({ ...current, quantity: nextValue }));
  };

  const checkout = async (event) => {
    event.preventDefault();
    if (!selected) return;

    setCheckingOut(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/store/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selected.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          note: form.note,
          quantity: form.quantity,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || data.error || "Checkout gagal");
      navigate(toLocalized(`/store/order/${data.order.merchantRef}`), { state: data });
    } catch (err) {
      const message = err.message === "Failed to fetch"
        ? "Checkout gagal terhubung ke API. Coba refresh halaman atau ulangi sebentar lagi."
        : err.message;
      setError(message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-32 pt-24 sm:px-6">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        path="/store"
      />

      <div className="mx-auto max-w-7xl">
        <header className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <BadgeCheck size={16} aria-hidden="true" />
              {t.badge}
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
              {t.body}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              [QrCode, "QRIS"],
              [Mail, "Email"],
              [LockKeyhole, "Token"],
            ].map(([Icon, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center">
                {React.createElement(Icon, { className: "mx-auto text-cyan-200", size: 22, "aria-hidden": true })}
                <p className="mt-3 text-sm font-semibold text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-4 py-6 md:grid-cols-3">
          {[
            [t.stats.active, productCount],
            [t.stats.stock, availableCount],
            [t.stats.payment, "QRIS"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-sm text-white/45">{label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </section>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white/65">
            <TetrisLoading size="sm" speed="fast" loadingText={t.loading} />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <main>
              <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-2">
                  <button
                    type="button"
                    onClick={() => selectCategory("all")}
                    className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition-colors ${
                      activeCategory === "all"
                        ? "bg-cyan-100 text-black"
                        : "text-white/62 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {t.all}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => selectCategory(category.id)}
                      className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition-colors ${
                        activeCategory === category.id
                          ? "bg-cyan-100 text-black"
                          : "text-white/62 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <label className="relative block">
                    <span className="sr-only">{t.search}</span>
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/38"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t.search}
                    className="min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-cyan-200/55"
                  />
                </label>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
                  <PackageOpen className="text-white/30" size={38} aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-bold text-white">{t.emptyTitle}</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">
                    {t.emptyBody}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const active = product.id === selectedId;
                    const category = categoryById.get(product.categoryId);
                    const stock = Number(product.stock || 0);

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => selectProduct(product)}
                        className={`group min-h-[420px] overflow-hidden rounded-2xl border bg-white/[0.045] text-left transition-colors ${
                          active
                            ? "border-cyan-200/70 bg-cyan-200/[0.08]"
                            : "border-white/10 hover:border-white/24 hover:bg-white/[0.065]"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-[#13100b]">
                          {product.image ? (
                            <LazyImage src={product.image} alt={product.name} className="h-full w-full" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/25">
                              <PackageOpen size={42} aria-hidden="true" />
                            </div>
                          )}
                          <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                            {category?.name || t.digital}
                          </div>
                          {active && (
                            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-black">
                              <Check size={18} aria-hidden="true" />
                            </div>
                          )}
                        </div>

                        <div className="flex min-h-[230px] flex-col p-5">
                          <h2 className="text-xl font-bold leading-snug text-white">{product.name}</h2>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/58">{product.summary}</p>

                          <div className="mt-5 grid gap-2 text-sm text-white/52">
                            <span className="inline-flex items-center gap-2">
                              <Download size={16} className="text-cyan-200" aria-hidden="true" />
                              {t.delivery}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <ShieldCheck size={16} className="text-cyan-200" aria-hidden="true" />
                              {t.warranty} {product.warrantyHours || 24} {t.hour}
                            </span>
                          </div>

                          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                            <div>
                              <p className="text-xs text-white/38">{t.price}</p>
                              <p className="text-xl font-bold text-cyan-100">{formatRupiah(product.price)}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              product.fulfillmentType === "manual_upload" || stock > 0 ? "bg-emerald-400/12 text-emerald-200" : "bg-red-400/12 text-red-200"
                            }`}>
                              {product.fulfillmentType === "manual_upload" ? t.manual : `${t.stockLabel} ${stock}`}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </main>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0b08]/92 shadow-2xl shadow-black/30 backdrop-blur-xl">
                {selected ? (
                  <>
                    <div className="border-b border-white/10 p-6">
                      <p className="text-sm font-semibold text-cyan-200">{selectedCategory?.name || t.productCategory}</p>
                      <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{selected.name}</h2>
                      <p className="mt-3 text-sm leading-6 text-white/58">{selected.summary}</p>

                      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                        {[
                          [t.price, formatRupiah(selected.price)],
                          [t.stockLabel, isManualFulfillment ? t.manual : `${selected.stock} ${t.item}`],
                          [t.delivery, t.deliveryAuto],
                          [t.warranty, `${selected.warrantyHours || 24} ${t.hour}`],
                        ].map(([label, value]) => (
                          <div key={label} className="bg-[#0d0b08] p-4">
                            <p className="text-xs text-white/40">{label}</p>
                            <p className="mt-1 text-sm font-bold text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDescription.length > 0 && (
                      <div className="border-b border-white/10 p-6">
                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                          <FileText size={18} className="text-cyan-200" aria-hidden="true" />
                          {t.detail}
                        </div>
                        <div className="space-y-3 text-sm leading-6 text-white/58">
                          {selectedDescription.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={checkout} className="p-6">
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-white/78">{t.name}</span>
                          <input
                            required
                            autoComplete="name"
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            placeholder={t.recipient}
                            className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-white/78">{t.email}</span>
                          <input
                            required
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            placeholder="email@example.com"
                            className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-white/78">{t.phone}</span>
                          <input
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={(event) => setForm({ ...form, phone: event.target.value })}
                            placeholder={t.optional}
                            className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-white/78">{t.note}</span>
                          <textarea
                            value={form.note || ""}
                            onChange={(event) => setForm({ ...form, note: event.target.value })}
                            placeholder={t.notePlaceholder}
                            rows="3"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                          />
                        </label>

                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div>
                            <p className="text-sm font-semibold text-white">{t.quantity}</p>
                            <p className="mt-1 text-xs text-white/42">{t.quantityHelp}</p>
                          </div>
                          <div className="flex items-center rounded-xl border border-white/10 bg-black/25">
                            <button
                              type="button"
                              onClick={() => updateQuantity(Number(form.quantity || 1) - 1)}
                              className="flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:text-white"
                              aria-label={t.decrease}
                            >
                              <Minus size={16} aria-hidden="true" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={isManualFulfillment ? 20 : selected.stock}
                              value={form.quantity}
                              onChange={(event) => updateQuantity(event.target.value)}
                              className="h-11 w-14 border-x border-white/10 bg-transparent text-center text-base font-bold text-white outline-none"
                              aria-label="Quantity"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(Number(form.quantity || 1) + 1)}
                              className="flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:text-white"
                              aria-label={t.increase}
                            >
                              <Plus size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive" className="mt-5">
                          <div className="flex gap-3">
                            <CircleAlert className="mt-0.5 shrink-0 text-red-100" size={18} aria-hidden="true" />
                            <div>
                              <AlertTitle>Checkout gagal</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </div>
                          </div>
                        </Alert>
                      )}

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm text-white/50">{t.total}</span>
                          <span className="text-2xl font-bold text-cyan-100">{formatRupiah(selectedTotal)}</span>
                        </div>
                        <button
                          type="submit"
                          disabled={checkingOut || (!isManualFulfillment && Number(selected.stock || 0) <= 0)}
                          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-5 text-base font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {checkingOut ? (
                            <>
                              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                              {t.creating}
                            </>
                          ) : (
                            <>
                              {t.pay}
                              <ArrowRight size={18} aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="p-6 text-white/55">{t.noProduct}</div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  [CreditCard, "QRIS"],
                  [Mail, "Email"],
                  [Download, "TXT"],
                ].map(([Icon, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
                    {React.createElement(Icon, { className: "mx-auto text-white/55", size: 18, "aria-hidden": true })}
                    <p className="mt-2 text-xs font-semibold text-white/48">{label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
