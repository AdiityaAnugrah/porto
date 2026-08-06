import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  FaBoxOpen,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaExternalLinkAlt,
  FaQrcode,
  FaReceipt,
  FaShieldAlt,
} from "react-icons/fa";
import SEO from "../components/SEO";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/8bit-alert";
import TetrisLoading from "../components/ui/tetris-loader";
import { API_BASE_URL, apiUrl } from "../lib/api";
import { useLocalizedPath } from "../lib/i18n";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
};

const statusClass = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "PAID" || value === "READY") return "border-emerald-300/25 bg-emerald-400/12 text-emerald-200";
  if (value === "EXPIRED" || value === "FAILED") return "border-red-300/25 bg-red-400/12 text-red-200";
  return "border-cyan-300/25 bg-cyan-300/12 text-cyan-100";
};

const instructionSteps = (instructions) =>
  (Array.isArray(instructions) ? instructions : []).flatMap((instruction) => {
    if (Array.isArray(instruction?.steps)) return instruction.steps;
    if (instruction?.title) return [instruction.title];
    return [];
  });

export default function StoreOrder() {
  const { ref } = useParams();
  const location = useLocation();
  const toLocalized = useLocalizedPath();
  const [order, setOrder] = useState(location.state?.order || null);
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const isTerminalStatus = ["PAID", "READY", "EXPIRED", "FAILED"].includes(
    String(order?.status || "").toUpperCase()
  );

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
    if (isTerminalStatus) return undefined;
    const interval = window.setInterval(load, 10000);
    return () => window.clearInterval(interval);
  }, [isTerminalStatus, ref]);

  const downloadUrl = order?.downloadUrl
    ? `${String(API_BASE_URL).replace(/\/+$/, "")}${order.downloadUrl}`
    : "";
  const paymentMethod = payment?.paymentMethod || "QRIS";
  const paymentAmount = payment?.amount || order?.amount || 0;
  const paymentExpiry = payment?.expiredTime || order?.expiredAt;
  const steps = instructionSteps(payment?.instructions);
  const canDownload = Boolean(downloadUrl) && ["PAID", "READY"].includes(String(order?.status || "").toUpperCase());

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-32 pt-24 sm:px-6">
      <SEO
        title="Status Order | Store"
        description="Status pembayaran dan download produk digital."
        robots="noindex,nofollow"
      />

      {loading ? (
        <div className="glass-panel flex min-h-[320px] items-center justify-center rounded-3xl p-8 text-white/60">
          <TetrisLoading size="sm" speed="fast" loadingText="Memuat order..." />
        </div>
      ) : order ? (
        <>
          <header className="mb-6 border-b border-white/10 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                Order {ref}
              </p>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-5xl">
              {order.productName}
            </h1>
            {order.productSummary && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
                {order.productSummary}
              </p>
            )}
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="glass-panel rounded-3xl p-5 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <FaBoxOpen className="text-cyan-300" aria-hidden="true" />
                <h2 className="text-xl font-bold text-white">Detail pembelian</h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                {[
                  [FaReceipt, "Invoice", order.merchantRef],
                  [FaBoxOpen, "Produk", order.productName],
                  [FaBoxOpen, "Quantity", `${order.quantity || 1} item`],
                  [FaEnvelope, "Email pengiriman", order.email],
                  [FaReceipt, "Catatan pembeli", order.buyerNote],
                  [FaShieldAlt, "Garansi", `${order.warrantyHours || 24} jam`],
                  [FaQrcode, "Metode bayar", paymentMethod],
                  [FaClock, "Batas pembayaran", formatDateTime(paymentExpiry)],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="grid gap-2 border-b border-white/10 bg-white/[0.035] p-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="flex items-center gap-2 text-sm text-white/42">
                      {React.createElement(Icon, { className: "text-cyan-200/70", size: 15, "aria-hidden": true })}
                      {label}
                    </div>
                    <p className="break-words text-sm font-bold text-white sm:text-right">{value || "-"}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.08] p-5">
                <div>
                  <p className="text-sm text-cyan-100/65">Total pembayaran</p>
                  <p className="mt-1 text-2xl font-bold text-cyan-100">{formatRupiah(paymentAmount)}</p>
                </div>
                <FaQrcode className="hidden text-cyan-100/55 sm:block" size={28} aria-hidden="true" />
              </div>

              {canDownload && (
                <a
                  href={downloadUrl}
                  className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-100 px-5 font-bold text-black transition-colors hover:bg-white"
                >
                  <FaDownload aria-hidden="true" /> Download TXT
                </a>
              )}
            </section>

            <aside className="glass-panel rounded-3xl p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <FaQrcode className="text-cyan-300" aria-hidden="true" />
                <h2 className="text-lg font-bold text-white">Pembayaran QRIS</h2>
              </div>

              {canDownload ? (
                <Alert variant="success">
                  <AlertTitle>Pembayaran diterima</AlertTitle>
                  <AlertDescription>File digital tersedia dari tombol download.</AlertDescription>
                </Alert>
              ) : order.status === "PAID_WAITING_UPLOAD" ? (
                <Alert variant="info">
                  <AlertTitle>Pembayaran diterima</AlertTitle>
                  <AlertDescription>
                    Admin sedang menyiapkan file TXT sesuai catatan pembelian kamu.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {payment?.qrUrl ? (
                    <img src={payment.qrUrl} alt="QRIS payment" className="mx-auto w-64 max-w-full rounded-xl bg-white p-3" />
                  ) : (
                    <div className="flex min-h-64 items-center justify-center">
                      <Alert variant="warning" className="w-full">
                        <AlertTitle>QRIS belum tersedia</AlertTitle>
                        <AlertDescription>Refresh status order atau buka halaman pembayaran Tripay.</AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {payment?.checkoutUrl && (
                    <a
                      href={payment.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      Buka halaman pembayaran <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
                    </a>
                  )}

                  <p className="mt-4 text-sm leading-6 text-white/45">
                    Halaman ini otomatis mengecek status setiap 10 detik. Setelah PAID, tombol download akan muncul.
                  </p>

                  {steps.length > 0 && (
                    <ol className="mt-5 space-y-2 text-sm leading-6 text-white/55">
                      {steps.slice(0, 5).map((step, index) => (
                        <li key={`${step}-${index}`} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-cyan-100">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </>
              )}
            </aside>
          </div>
        </>
      ) : (
        <div className="glass-panel rounded-3xl p-6 md:p-10">
          <Alert variant="destructive">
            <AlertTitle>Order tidak ditemukan</AlertTitle>
            <AlertDescription>Pastikan invoice benar atau kembali ke store untuk membuat order baru.</AlertDescription>
          </Alert>
          <Link to={toLocalized("/store")} className="mt-5 inline-block text-cyan-300">
            Kembali ke store
          </Link>
        </div>
      )}
    </div>
  );
}
