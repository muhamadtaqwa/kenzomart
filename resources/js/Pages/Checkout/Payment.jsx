import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Copy, Check, Clock, QrCode, ArrowRight } from "lucide-react";

export default function Payment({ order: initialOrder }) {
    const { flash } = usePage().props;
    const [order, setOrder] = useState(initialOrder);
    const [copied, setCopied] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

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

    // Polling status tiap 5 detik
    useEffect(() => {
        if (order.status !== "pending") return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(
                    `/checkout/${order.invoice_number}/status`,
                    {
                        headers: { Accept: "application/json" },
                    },
                );
                const data = await res.json();

                if (data.status && data.status !== order.status) {
                    setOrder((prev) => ({ ...prev, ...data }));
                } else if (data.items && data.items.length > 0) {
                    setOrder((prev) => ({ ...prev, items: data.items }));
                }
            } catch (e) {
                // silent fail
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [order.status, order.invoice_number]);

    // Countdown expired
    useEffect(() => {
        if (!order.expired_at || order.status !== "pending") return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const expiry = new Date(order.expired_at).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft({ minutes: 0, seconds: 0, expired: true });
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeLeft({ minutes, seconds, expired: false });
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [order.expired_at, order.status]);

    const isPending = order.status === "pending";
    const isPaid = order.status === "paid" || order.status === "delivered";
    const isExpired = order.status === "expired" || order.status === "failed";

    return (
        <StorefrontLayout>
            <Head title="Instruksi Pembayaran - KenzoMart" />

            <div className="max-w-lg mx-auto">
                {/* Status Badge */}
                <div className="flex justify-center mb-4">
                    {isPending && !timeLeft?.expired && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800/60">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            Menunggu Pembayaran
                        </div>
                    )}
                    {isPaid && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/60">
                            <Check className="w-3.5 h-3.5" />
                            Pembayaran Berhasil Dikonfirmasi
                        </div>
                    )}
                    {isExpired && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-800/60">
                            Pesanan {order.status === "expired" ? "Kadaluarsa" : "Gagal"}
                        </div>
                    )}
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-100 text-center mb-6">
                    {isPaid ? "Terima Kasih! Pesanan Sukses" : "Selesaikan Pembayaran"}
                </h1>

                {/* Invoice Info */}
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
                                    <span>Salin Invoice</span>
                                </>
                            )}
                        </button>
                    </div>
                    <p className="font-mono text-sm md:text-base font-bold text-slate-900 dark:text-zinc-100 mb-4 tracking-wide">
                        {order.invoice_number}
                    </p>

                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 dark:text-zinc-400">
                                Total Pembayaran
                            </span>
                            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                                {formatRupiah(order.total_amount)}
                            </span>
                        </div>
                    </div>

                    {/* Countdown */}
                    {isPending && timeLeft && !timeLeft.expired && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 dark:text-zinc-400">
                                    Sisa waktu pembayaran
                                </span>
                                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
                                    {String(timeLeft.minutes).padStart(2, "0")}:
                                    {String(timeLeft.seconds).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ==================== PAID: Tampil Produk ==================== */}
                {isPaid && (
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 mb-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                            Detail Akun / Produk Digital
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
                                                    Kredensial / Lisensi
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
                                                    {copiedIndex === idx ? "Tersalin" : "Salin Kredensial"}
                                                </button>
                                            </div>
                                            <pre className="text-xs text-slate-900 dark:text-zinc-100 whitespace-pre-wrap font-mono break-all leading-relaxed">
                                                {item.delivery_content}
                                            </pre>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                                            Detail produk sedang diproses dan akan segera tampil.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Detail Item — sembunyi kalau udah paid */}
                {isPending && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 mb-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-3">
                            Rincian Item
                        </h2>
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between text-sm py-1.5 border-b border-slate-100 dark:border-zinc-800 last:border-b-0"
                            >
                                <div className="min-w-0 mr-2">
                                    <p className="text-slate-900 dark:text-zinc-100 font-medium truncate">
                                        {item.product_name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        {item.variant_name}
                                    </p>
                                </div>
                                <p className="text-slate-900 dark:text-zinc-100 font-semibold shrink-0">
                                    {formatRupiah(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* QRIS Container */}
                {isPending && order.qr_string && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 mb-5 shadow-sm text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3 border border-teal-100 dark:border-teal-900/40">
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan QRIS Resmi</span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 mb-3">
                            Scan QRIS untuk Menyelesaikan Pembayaran
                        </h2>
                        {/* Always white bg for QR image so scanner contrasts properly in dark mode */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm max-w-xs mx-auto">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(order.qr_string)}`}
                                alt="QRIS KenzoMart"
                                className="w-full h-auto mx-auto block"
                            />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-4 leading-relaxed">
                            Mendukung GoPay, DANA, OVO, ShopeePay, LinkAja, serta seluruh aplikasi Mobile Banking.
                        </p>
                    </div>
                )}

                {/* Expired */}
                {isExpired && (
                    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 mb-5">
                        <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-1">
                            Pesanan Telah Kadaluarsa
                        </h2>
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                            Batas waktu pembayaran telah habis. Silakan lakukan pemesanan baru.
                        </p>
                    </div>
                )}

                {/* Flash */}
                {flash?.success && (
                    <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-2xl p-4 mb-5">
                        <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                            {flash.success}
                        </p>
                    </div>
                )}

                {/* Tombol Cek Pesanan */}
                <Link
                    href="/cek-pesanan"
                    className="w-full flex items-center justify-center gap-2 text-center bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold px-4 py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition"
                >
                    <span>Cek Riwayat & Status Pesanan</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </StorefrontLayout>
    );
}
