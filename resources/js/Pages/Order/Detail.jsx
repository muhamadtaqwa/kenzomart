import StorefrontLayout from "@/Layouts/StorefrontLayout";
import OrderStatusBadge from "@/Components/OrderStatusBadge";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRight } from "lucide-react";

export default function Detail({ order }) {
    const [copied, setCopied] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

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

    const copyDelivery = (content, idx) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const isPaid = order.status === "paid" || order.status === "delivered";
    const isPending = order.status === "pending";

    return (
        <StorefrontLayout>
            <Head title={`Pesanan ${order.invoice_number} - KenzoMart`} />

            <div className="max-w-lg mx-auto">
                <Link
                    href="/cek-pesanan"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Cek pesanan lain
                </Link>

                {/* Status */}
                <div className="text-center mb-6">
                    <OrderStatusBadge status={order.status} />
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-3">
                        Detail Pesanan
                    </h1>
                </div>

                {/* Info Order */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 mb-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                            Nomor Invoice
                        </span>
                        <button
                            onClick={copyInvoice}
                            className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Tersalin</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Salin</span>
                                </>
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-sm md:text-base font-bold text-slate-900 dark:text-zinc-100 mb-4 tracking-wide">
                        {order.invoice_number}
                    </p>

                    <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
                        <p className="flex justify-between">
                            <span>Waktu Transaksi:</span>
                            <span className="font-medium text-slate-900 dark:text-zinc-200">{order.created_at}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Nomor WhatsApp:</span>
                            <span className="font-medium text-slate-900 dark:text-zinc-200">{order.customer.phone}</span>
                        </p>
                    </div>
                </div>

                {/* ==================== PRODUK (kalau paid) ==================== */}
                {isPaid && (
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 mb-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                            Kredensial Produk Digital
                        </h2>

                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-emerald-100 dark:border-zinc-800 shadow-sm"
                                >
                                    <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-0.5">
                                        {item.product_name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                                        {item.variant_name}
                                    </p>

                                    {item.delivery_content ? (
                                        <div className="bg-slate-50 dark:bg-zinc-800/80 rounded-xl p-3.5 border border-slate-200 dark:border-zinc-700">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                                    Detail Akun / Lisensi
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        copyDelivery(
                                                            item.delivery_content,
                                                            idx,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                                                >
                                                    {copiedIndex === idx
                                                        ? "Tersalin"
                                                        : "Salin"}
                                                </button>
                                            </div>
                                            <pre className="text-xs text-slate-900 dark:text-zinc-100 whitespace-pre-wrap font-mono break-all leading-relaxed">
                                                {item.delivery_content}
                                            </pre>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                                            Detail produk sedang diproses untuk dikirim.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ==================== ITEM (kalau pending) ==================== */}
                {isPending && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 mb-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-3">
                            Item Pesanan
                        </h2>
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-zinc-800 last:border-0"
                            >
                                <div className="min-w-0 mr-2">
                                    <p className="text-slate-900 dark:text-zinc-100 truncate font-medium">
                                        {item.product_name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        {item.variant_name}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-zinc-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="text-slate-900 dark:text-zinc-100 font-bold shrink-0">
                                    {formatRupiah(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Total */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 mb-5 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500 dark:text-zinc-400">Total Pembayaran</span>
                        <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                            {formatRupiah(order.total_amount)}
                        </span>
                    </div>
                </div>

                {/* Info delivered */}
                {order.status === "delivered" && order.delivered_at && (
                    <div className="bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-2xl p-4 mb-5">
                        <p className="text-xs text-teal-800 dark:text-teal-300 font-medium">
                            Pesanan berhasil terkirim pada {order.delivered_at}
                        </p>
                    </div>
                )}

                {/* Tombol Bayar Sekarang — kalau pending */}
                {isPending && (
                    <Link
                        href={`/checkout/${order.invoice_number}/payment`}
                        className="w-full flex items-center justify-center gap-2 text-center bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold px-4 py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition"
                    >
                        <span>Lanjutkan Pembayaran</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </StorefrontLayout>
    );
}
