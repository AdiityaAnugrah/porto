import React, { useMemo, useState } from "react";
import { FileText, Mail, Plus, Send, Trash2 } from "lucide-react";
import SEO from "../components/SEO";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/8bit-alert";
import { apiUrl } from "../lib/api";

const defaultItem = () => ({ description: "", quantity: 1, unitPrice: 0 });

const formatMoney = (value, currency = "IDR") =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(Number(value || 0));

const today = new Date().toISOString().slice(0, 10);

const Invoice = () => {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    accessToken: "",
    senderName: "Aditya Anugrah",
    senderEmail: "admin@adityaanugrah.me",
    senderPhone: "+62 813 7943 0432",
    senderAddress: "Indonesia",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    clientAddress: "",
    invoiceNumber: `INV-${today.replaceAll("-", "")}`,
    issueDate: today,
    dueDate: "",
    currency: "IDR",
    taxRate: 0,
    discount: 0,
    paymentStatus: "unpaid",
    paymentInfo: "",
    notes: "Terima kasih atas kepercayaannya. Invoice PDF terlampir pada email ini.",
    items: [defaultItem()],
  });

  const totals = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum, item) => sum + Math.max(0, Number(item.quantity || 0)) * Math.max(0, Number(item.unitPrice || 0)),
      0
    );
    const discount = Math.max(0, Number(form.discount || 0));
    const taxable = Math.max(0, subtotal - discount);
    const tax = taxable * (Math.max(0, Number(form.taxRate || 0)) / 100);
    return { subtotal, discount, tax, total: taxable + tax };
  }, [form.items, form.discount, form.taxRate]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateItem = (index, key, value) =>
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));

  const submitInvoice = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(apiUrl("/invoice/send"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(form.accessToken ? { Authorization: `Bearer ${form.accessToken}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Invoice gagal dikirim");

      setStatus("success");
      setMessage(`Invoice ${data.invoiceNumber} terkirim ke ${data.sentTo}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Invoice gagal dikirim. Cek konfigurasi email server.");
    }
  };

  return (
    <div className="min-h-screen px-4 pb-28 pt-24 sm:px-6 md:pb-32 md:pt-28">
      <SEO
        title="Invoice Sender | Aditya Anugrah"
        description="Buat invoice profesional, kirim email, dan lampirkan PDF otomatis."
        path="/invoice"
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.055] px-4 py-2 text-sm text-cyan-100">
              <FileText size={16} aria-hidden="true" />
              Invoice PDF + Email
            </div>
            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
              Buat invoice profesional dan kirim langsung ke email klien.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
              Isi data invoice, item pekerjaan, pajak, diskon, catatan pembayaran, lalu sistem akan mengirim email rapi
              dengan lampiran PDF.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-sm font-semibold text-white/55">Total invoice</p>
            <p className="mt-2 text-4xl font-black text-cyan-100">{formatMoney(totals.total, form.currency)}</p>
            <div className="mt-5 space-y-2 text-sm text-white/62">
              <div className="flex justify-between"><span>Subtotal</span><b>{formatMoney(totals.subtotal, form.currency)}</b></div>
              <div className="flex justify-between"><span>Diskon</span><b>{formatMoney(totals.discount, form.currency)}</b></div>
              <div className="flex justify-between"><span>Pajak</span><b>{formatMoney(totals.tax, form.currency)}</b></div>
            </div>
          </div>
        </div>

        {status === "success" && (
          <Alert variant="success" className="mb-6">
            <AlertTitle>Invoice terkirim</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {status === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Pengiriman gagal</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={submitInvoice} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-[#0d0b08]/92 p-5 shadow-2xl shadow-black/25 md:p-7">
            <h2 className="text-2xl font-bold text-white">Detail invoice</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Nomor invoice" value={form.invoiceNumber} onChange={(v) => update("invoiceNumber", v)} required />
              <Field label="Mata uang" value={form.currency} onChange={(v) => update("currency", v.toUpperCase())} required />
              <Field label="Tanggal invoice" type="date" value={form.issueDate} onChange={(v) => update("issueDate", v)} required />
              <Field label="Jatuh tempo" type="date" value={form.dueDate} onChange={(v) => update("dueDate", v)} />
              <Field label="Pajak (%)" type="number" value={form.taxRate} onChange={(v) => update("taxRate", v)} />
              <Field label="Diskon" type="number" value={form.discount} onChange={(v) => update("discount", v)} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/78">Status pembayaran</span>
                <select
                  className={inputClass}
                  value={form.paymentStatus}
                  onChange={(event) => update("paymentStatus", event.target.value)}
                >
                  <option className="bg-[#0d0b08]" value="unpaid">Belum lunas</option>
                  <option className="bg-[#0d0b08]" value="paid">Lunas</option>
                </select>
              </label>
            </div>

            <h3 className="mt-8 text-lg font-bold text-white">Item pekerjaan / produk</h3>
            <div className="mt-4 space-y-3">
              {form.items.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_90px_150px_44px]">
                  <Field label="Deskripsi" value={item.description} onChange={(v) => updateItem(index, "description", v)} required />
                  <Field label="Qty" type="number" value={item.quantity} onChange={(v) => updateItem(index, "quantity", v)} required />
                  <Field label="Harga" type="number" value={item.unitPrice} onChange={(v) => updateItem(index, "unitPrice", v)} required />
                  <button
                    type="button"
                    aria-label="Hapus item"
                    onClick={() => setForm((current) => {
                      const nextItems = current.items.filter((_, i) => i !== index);
                      return { ...current, items: nextItems.length ? nextItems : [defaultItem()] };
                    })}
                    className="mt-7 flex min-h-12 items-center justify-center rounded-xl border border-red-300/20 text-red-200 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, items: [...current.items, defaultItem()] }))}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 font-bold text-white transition-colors hover:bg-white/[0.075]"
            >
              <Plus size={18} /> Tambah item
            </button>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0d0b08]/92 p-5 md:p-7">
              <h2 className="text-2xl font-bold text-white">Pengirim & klien</h2>
              <div className="mt-6 grid gap-4">
                <Field label="Token invoice (opsional)" value={form.accessToken} onChange={(v) => update("accessToken", v)} placeholder="Isi jika server memakai INVOICE_ACCESS_TOKEN" />
                <Field label="Nama pengirim" value={form.senderName} onChange={(v) => update("senderName", v)} required />
                <Field label="Email pengirim / reply-to" type="email" value={form.senderEmail} onChange={(v) => update("senderEmail", v)} />
                <Field label="Telepon pengirim" value={form.senderPhone} onChange={(v) => update("senderPhone", v)} />
                <TextArea label="Alamat pengirim" value={form.senderAddress} onChange={(v) => update("senderAddress", v)} rows={2} />
                <Field label="Nama klien" value={form.clientName} onChange={(v) => update("clientName", v)} required />
                <Field label="Email klien" type="email" value={form.clientEmail} onChange={(v) => update("clientEmail", v)} required />
                <Field label="Perusahaan klien" value={form.clientCompany} onChange={(v) => update("clientCompany", v)} />
                <TextArea label="Alamat klien" value={form.clientAddress} onChange={(v) => update("clientAddress", v)} rows={2} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d0b08]/92 p-5 md:p-7">
              <h2 className="text-2xl font-bold text-white">Catatan email</h2>
              <div className="mt-6 grid gap-4">
                <TextArea label="Detail pembayaran" value={form.paymentInfo} onChange={(v) => update("paymentInfo", v)} rows={4} placeholder="Contoh: BCA 123456789 a.n. Aditya Anugrah" />
                <TextArea label="Catatan invoice" value={form.notes} onChange={(v) => update("notes", v)} rows={4} />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-5 text-base font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "sending" ? "Mengirim invoice..." : "Kirim invoice + PDF"}
                {status === "sending" ? <Mail size={18} /> : <Send size={18} />}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

const inputClass =
  "min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55";

function Field({ label, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/78">{label}{required ? " *" : ""}</span>
      <input
        type={type}
        required={required}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/78">{label}</span>
      <textarea
        rows={rows}
        className={`${inputClass} resize-none py-3`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default Invoice;
