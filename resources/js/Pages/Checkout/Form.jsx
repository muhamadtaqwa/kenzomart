import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function Form({ product, variant }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        variant_id: variant.id,
        phone: "",
    });

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/checkout");
    };

    return (
        <StorefrontLayout>
            <Head title="Konfirmasi Checkout - KenzoMart" />

            {/* Back link */}
            <Link
                href={`/produk/${product.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke detail
            </Link>

            <div className="max-w-lg mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                        Konfirmasi Pesanan
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        Lengkapi informasi untuk pengiriman detail akun.
                    </p>
                </div>

                {/* Ringkasan Produk */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 md:p-5 mb-5 shadow-sm">
                    <div className="flex gap-3.5 items-center">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-zinc-700/60">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600 text-[10px]">
                                    No Img
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                                {product.name}
                            </p>
                            <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium mt-1">
                                {variant.name}
                            </span>
                            <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">
                                {formatRupiah(variant.price)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            Data Pembeli
                        </h2>
                    </div>

                    {/* No HP */}
                    <div className="mb-5">
                        <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                            Nomor WhatsApp Aktif
                        </label>
                        <input
                            type="tel"
                            inputMode="tel"
                            placeholder="08xxxxxxxxxx"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                            required
                        />

                        {errors.phone && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Error Box */}
                    {(errors.variant_id ||
                        errors.variant ||
                        errors.duitku ||
                        errors.general) && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 font-medium">
                            {errors.variant_id ||
                                errors.variant ||
                                errors.duitku ||
                                errors.general}
                        </div>
                    )}

                    {/* Total */}
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 mb-5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 dark:text-zinc-400">
                                Total Pembayaran
                            </span>
                            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                                {formatRupiah(variant.price)}
                            </span>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold transition-all shadow-lg shadow-teal-600/20 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Memproses Pesanan...
                            </>
                        ) : (
                            "Lanjutkan ke Pembayaran QRIS"
                        )}
                    </button>
                </form>
            </div>
        </StorefrontLayout>
    );
}
