import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaDownload, FaExternalLinkAlt, FaQrcode, FaSpinner } from "react-icons/fa";
import SEO from "../components/SEO";
import { API_BASE_URL, apiUrl } from "../lib/api";
import { useLocalizedPath } from "../lib/i18n";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function StoreOrder() {
  const { ref } = useParams();
  const location = useLocation();
  const toLocalized = useLocalizedPath();
  const [order, setOrder] = useState(location.state?.order || null);
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const load = () => {
      fetch(apiUrl(`/store/orders/${ref}`))
        .then((res) => res.json())
        .then((data) => {
          setOrder(data.order);
          setPayment(data.order?.payment);
        })
        .finally(() => setLoading(false));
    };

    load();
    const interval = window.setInterval(load, 10000);
    return () => window.clearInterval(interval);
  }, [ref]);

  const downloadUrl = order?.downloadUrl
    ? `${String(API_BASE_URL).replace(/\/+$/, "")}${order.downloadUrl}`
    : "";

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen">
      <SEO
        title="Status Order | Store"
        description="Status pembayaran dan download produk digital."
        robots="noindex,nofollow"
      />

      <div className="glass-panel rounded-3xl p-6 md:p-10">
        <p className="mb-4 text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/80">
          Order {ref}
        </p>
        {loading ? (
          <div className="flex items-center gap-3 text-white/60">
            <FaSpinner className="animate-spin" /> Memuat order...
          </div>
        ) : order ? (
          <>
            <h1 className="text-3xl md:text-5xl font-bold font-display">{order.productName}</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/35">Status</p>
                <p className="mt-1 font-bold text-cyan-200">{order.status}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/35">Total</p>
                <p className="mt-1 font-bold">{formatRupiah(order.amount)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/35">Qty</p>
                <p className="mt-1 font-bold">{order.quantity || 1}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/35">Email</p>
                <p className="mt-1 font-bold truncate">{order.email}</p>
              </div>
            </div>

            {order.status === "PAID" && downloadUrl ? (
              <a
                href={downloadUrl}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-100 px-5 py-4 font-bold text-black hover:bg-white"
              >
                <FaDownload /> Download TXT
              </a>
            ) : (
              <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <FaQrcode className="text-cyan-300" />
                  <h2 className="font-bold text-lg">Pembayaran QRIS</h2>
                </div>
                {payment?.qrUrl && (
                  <img src={payment.qrUrl} alt="QRIS payment" className="w-64 max-w-full rounded-xl bg-white p-3" />
                )}
                {payment?.checkoutUrl && (
                  <a
                    href={payment.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
                  >
                    Buka halaman pembayaran <FaExternalLinkAlt className="text-xs" />
                  </a>
                )}
                <p className="mt-4 text-sm text-white/45">
                  Halaman ini otomatis mengecek status setiap 10 detik. Setelah PAID, tombol download akan muncul.
                </p>
              </section>
            )}
          </>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">Order tidak ditemukan</h1>
            <Link to={toLocalized("/store")} className="mt-5 inline-block text-cyan-300">
              Kembali ke store
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
