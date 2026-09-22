import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Copy,
    Check,
    ArrowLeft,
    Truck,
    Trash2,
    CheckCircle2,
    Clock,
} from "lucide-react";

const statusColors = {
    pending:
        "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    paid: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    delivered:
        "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
    expired:
        "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
    failed: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
};

const statusLabels = {
    pending: "Pending",
    paid: "Paid",
    delivered: "Delivered",
    expired: "Expired",
    failed: "Failed",
};

export default function Show({ order }) {
    const [copied, setCopied] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [statusValue, setStatusValue] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value || 0);

    const copyInvoice = () => {
        navigator.clipboard.writeText(order.invoice_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyPhone = () => {
        navigator.clipboard.writeText(order.customer.phone);
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(order.customer.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        router.patch(
            `/dashboard/orders/${order.id}/status`,
            { status: statusValue },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            },
        );
    };

    const handleDeliver = () => {
        if (confirm("Tandai pesanan ini sebagai sudah terkirim / selesai?")) {
            router.post(
                `/dashboard/orders/${order.id}/deliver`,
                {},
                { preserveScroll: true },
            );
        }
    };

    const handleDelete = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus pesanan "${order.invoice_number}"?`,
            )
        ) {
            router.delete(`/dashboard/orders/${order.id}`);
        }
    };

    return (
        <AdminLayout title={`Detail Pesanan`}>
            <Head title={`Pesanan ${order.invoice_number} - KenzoMart Admin`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {/* Kolom Kiri */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Info Order */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-xs">
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">
                                    Nomor Invoice
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono text-base font-bold text-slate-900 dark:text-zinc-100">
                                        {order.invoice_number}
                                    </p>
                                    <button
                                        onClick={copyInvoice}
                                        className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <span
                                className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[order.status]}`}
                            >
                                {statusLabels[order.status]}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs">
                            <div>
                                <p className="text-slate-500 dark:text-zinc-400">
                                    Waktu Pembuatan
                                </p>
                                <p className="font-semibold text-slate-900 dark:text-zinc-200 mt-0.5">
                                    {order.created_at}
                                </p>
                            </div>
                            {order.paid_at && (
                                <div>
                                    <p className="text-slate-500 dark:text-zinc-400">
                                        Waktu Pembayaran
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-zinc-200 mt-0.5">
                                        {order.paid_at}
                                    </p>
                                </div>
                            )}
                            {order.delivered_at && (
                                <div>
                                    <p className="text-slate-500 dark:text-zinc-400">
                                        Waktu Pengiriman
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-zinc-200 mt-0.5">
                                        {order.delivered_at}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Item + Delivery Content */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-xs">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-4">
                            Daftar Produk Dipesan
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="pb-4 border-b border-slate-100 dark:border-zinc-800 last:border-0 last:pb-0"
                                >
                                    <div className="flex justify-between gap-3 text-sm mb-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                {item.variant_name}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                                                {formatRupiah(item.price)} ×{" "}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-900 dark:text-zinc-100 shrink-0">
                                            {formatRupiah(item.subtotal)}
                                        </p>
                                    </div>

                                    {item.delivery_content && (
                                        <div className="bg-slate-50 dark:bg-zinc-800/80 rounded-xl p-3 border border-slate-200 dark:border-zinc-700 mt-2">
                                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium mb-1 uppercase tracking-wider">
                                                Data Akun / Lisensi Digital
                                            </p>
                                            <pre className="text-xs text-slate-900 dark:text-zinc-100 whitespace-pre-wrap font-mono break-all">
                                                {item.delivery_content}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-zinc-700 flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                Total Transaksi
                            </span>
                            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                                {formatRupiah(order.total_amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-5">
                    {/* Kelola Status & Aksi */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-3">
                            Kelola Status Pesanan
                        </h2>

                        {/* Quick Deliver button jika paid */}
                        {order.status === "paid" && (
                            <button
                                type="button"
                                onClick={handleDeliver}
                                className="w-full mb-4 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition"
                            >
                                <Truck className="w-4 h-4" />
                                <span>Tandai Terkirim / Selesai</span>
                            </button>
                        )}

                        <form
                            onSubmit={handleUpdateStatus}
                            className="space-y-3"
                        >
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Pilih Status Baru
                                </label>
                                <select
                                    value={statusValue}
                                    onChange={(e) =>
                                        setStatusValue(e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs outline-none focus:border-teal-500"
                                >
                                    <option value="pending">
                                        Pending (Menunggu)
                                    </option>
                                    <option value="paid">Paid (Dibayar)</option>
                                    <option value="delivered">
                                        Delivered (Terkirim)
                                    </option>
                                    <option value="expired">
                                        Expired (Kadaluarsa)
                                    </option>
                                    <option value="failed">
                                        Failed (Gagal)
                                    </option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isUpdating || statusValue === order.status
                                }
                                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating
                                    ? "Memperbarui..."
                                    : "Simpan Status"}
                            </button>
                        </form>

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 transition font-medium"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus Pesanan Ini</span>
                            </button>
                        </div>
                    </div>

                    {/* Customer — Kiri kanan + copy */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 shadow-xs">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-3">
                            Informasi Pembeli
                        </h2>
                        <div className="space-y-2.5">
                            {/* WhatsApp */}
                            <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-zinc-800">
                                <span className="text-xs text-slate-500 dark:text-zinc-400 shrink-0">
                                    WhatsApp
                                </span>
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate text-right">
                                        {order.customer.phone}
                                    </span>
                                    <button
                                        onClick={copyPhone}
                                        className="inline-flex items-center justify-center w-6 h-6 rounded-md text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition shrink-0"
                                        aria-label="Salin WhatsApp"
                                    >
                                        {copiedPhone ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Email */}
                            {order.customer.email && (
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <span className="text-xs text-slate-500 dark:text-zinc-400 shrink-0">
                                        Email
                                    </span>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-xs font-medium text-slate-900 dark:text-zinc-100 truncate text-right">
                                            {order.customer.email}
                                        </span>
                                        <button
                                            onClick={copyEmail}
                                            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition shrink-0"
                                            aria-label="Salin Email"
                                        >
                                            {copiedEmail ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                <Copy className="w-3 h-3" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Catatan / Log Sistem */}
                    {order.notes && (
                        <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 p-4 shadow-xs">
                            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                Catatan Sistem
                            </p>
                            <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono leading-relaxed">
                                {order.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
