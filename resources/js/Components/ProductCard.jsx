import { Link } from "@inertiajs/react";

export default function ProductCard({ product }) {
    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    // Total stok semua varian
    const totalStock =
        product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

    return (
        <Link
            href={`/produk/${product.slug}`}
            className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden hover:border-teal-500/50 dark:hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 flex flex-col"
        >
            {/* Image */}
            <div className="aspect-square bg-slate-100 dark:bg-zinc-800/80 overflow-hidden relative">
                {product.image ? (
                    <img
                        src={`/storage/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600 text-xs font-medium">
                        No Image
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
                <div>
                    {/* Baris 1: Kategori (kiri) + Stok (kanan) */}
                    <div className="flex items-center justify-between gap-2 min-h-[1.25rem] mb-1">
                        {/* Kiri: Kategori */}
                        <div className="flex flex-wrap gap-1 min-w-0">
                            {product.categories?.slice(0, 1).map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40 font-medium truncate"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>

                        {/* Kanan: Stok */}
                        <span
                            className={`text-[10px] font-medium shrink-0 ${
                                totalStock > 0
                                    ? "text-slate-500 dark:text-zinc-400"
                                    : "text-rose-500 dark:text-rose-400"
                            }`}
                        >
                            {totalStock > 0 ? `Stok: ${totalStock}` : "Habis"}
                        </span>
                    </div>

                    {/* Baris 2: Judul */}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {product.name}
                    </h3>
                </div>

                {/* Baris 3: Label kiri, Harga kanan */}
                <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
                        Mulai
                    </span>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400 shrink-0">
                        {product.min_price
                            ? formatRupiah(product.min_price)
                            : "-"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
