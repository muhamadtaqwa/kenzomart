import StorefrontLayout from "@/Layouts/StorefrontLayout";
import ProductCard from "@/Components/ProductCard";
import { Head, Link } from "@inertiajs/react";
import { Sparkles, PackageSearch, X } from "lucide-react";

export default function Index({ products, filters = {} }) {
    return (
        <StorefrontLayout>
            <Head title="Katalog Produk Digital" />

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 text-white px-4 py-4 md:px-8 md:py-6 mb-5 md:mb-8 shadow-xl shadow-teal-950/10 border border-teal-700/30">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 md:w-48 md:h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 md:max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-teal-500/20 text-teal-200 text-[10px] md:text-xs font-medium backdrop-blur-md mb-2 border border-teal-400/20">
                        <Sparkles className="w-3 h-3" />
                        <span>KenzoMart Digital Solutions</span>
                    </div>
                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white mb-1.5 md:mb-2 leading-tight">
                        Solusi Produk Digital{" "}
                        <span className="text-teal-300">Cepat & Otomatis</span>
                    </h1>
                    <p className="text-teal-100/80 text-xs md:text-sm leading-relaxed">
                        Pembayaran aman & praktis via QRIS.
                    </p>
                </div>
            </div>

            {/* Search Filter Notice */}
            {filters?.search && (
                <div className="flex items-center justify-between gap-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 rounded-2xl px-3 py-2.5 md:px-4 md:py-3 mb-5 md:mb-6">
                    <p className="text-xs md:text-sm text-teal-800 dark:text-teal-200 font-medium min-w-0 truncate">
                        Menampilkan hasil pencarian untuk:{" "}
                        <span className="font-bold">"{filters.search}"</span>
                    </p>
                    <Link
                        href="/produk"
                        className="inline-flex items-center gap-1 shrink-0 text-xs text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white font-semibold bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-zinc-700 shadow-xs transition"
                    >
                        <X className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </Link>
                </div>
            )}

            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 md:mb-5">
                <div>
                    <h2 className="text-base md:text-xl font-bold text-slate-900 dark:text-zinc-100">
                        Daftar Produk
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                        Menampilkan {products.length} produk pilihan
                    </p>
                </div>
            </div>

            {/* Grid Produk */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 text-slate-400 dark:text-zinc-500">
                    <PackageSearch className="w-10 h-10 md:w-12 md:h-12 mb-3 text-teal-600/50 dark:text-teal-400/50" />
                    <p className="text-sm font-medium text-center">
                        Belum ada produk yang tersedia saat ini.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1 text-center">
                        Silakan cek kembali nanti atau hubungi admin.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </StorefrontLayout>
    );
}
