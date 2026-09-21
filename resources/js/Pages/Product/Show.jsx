import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";

export default function Show({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants.length > 0 ? product.variants[0] : null,
    );

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const handleBuy = () => {
        if (!selectedVariant) return;
        router.get(`/checkout/${product.slug}`, {
            variant: selectedVariant.id,
        });
    };

    return (
        <StorefrontLayout>
            <Head title={product.name} />

            <div className="max-w-2xl mx-auto">
                {/* Back link */}
                <Link
                    href="/produk"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke katalog
                </Link>

                {/* Card Konten Utama */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-sm mb-6">
                    {/* Header: Gambar (kiri) + Info (kanan) */}
                    <div className="flex gap-4 md:gap-5 mb-6">
                        {/* Gambar */}
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-100 dark:bg-zinc-800 rounded-2xl overflow-hidden shrink-0 border border-slate-200/60 dark:border-zinc-700/60">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600 text-xs">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            {/* Kategori */}
                            {product.categories?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {product.categories.map((cat) => (
                                        <span
                                            key={cat.id}
                                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40 font-medium"
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Nama */}
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                                {product.name}
                            </h1>

                            {/* Deskripsi */}
                            {product.description && (
                                <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pilih Varian */}
                    <div className="mb-6 pt-5 border-t border-slate-100 dark:border-zinc-800">
                        <label className="block text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-3">
                            Pilih Paket / Varian
                        </label>

                        {product.variants.length === 0 ? (
                            <p className="text-sm text-rose-500 dark:text-rose-400 font-medium">Stok saat ini kosong</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2.5">
                                {product.variants.map((variant) => {
                                    const isSelected =
                                        selectedVariant?.id === variant.id;
                                    const isOutOfStock = variant.stock <= 0;
                                    return (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            onClick={() =>
                                                !isOutOfStock &&
                                                setSelectedVariant(variant)
                                            }
                                            disabled={isOutOfStock}
                                            className={`relative flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left ${
                                                isSelected
                                                    ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 dark:border-teal-400 shadow-sm"
                                                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700"
                                            } ${
                                                isOutOfStock
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-teal-600 bg-teal-600 dark:border-teal-400 dark:bg-teal-400" : "border-slate-300 dark:border-zinc-600"}`}>
                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                                        {variant.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                                        Sisa stok: <span className="font-medium text-slate-700 dark:text-zinc-300">{variant.stock}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-teal-600 dark:text-teal-400 shrink-0 ml-2">
                                                {formatRupiah(variant.price)}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Total + Beli */}
                    {selectedVariant && (
                        <div className="pt-5 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-slate-500 dark:text-zinc-400">Total Pembayaran</span>
                                <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                    {formatRupiah(selectedVariant.price)}
                                </span>
                            </div>

                            <button
                                onClick={handleBuy}
                                disabled={selectedVariant.stock <= 0}
                                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold transition-all shadow-lg shadow-teal-600/20 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span>Beli Sekarang</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
