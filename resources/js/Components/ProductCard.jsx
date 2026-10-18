import { Link } from "@inertiajs/react";
import { Package } from "lucide-react";

export default function ProductCard({ product }) {
    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const totalStock =
        product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

    const isOutOfStock = totalStock === 0;

    return (
        <Link
            href={`/produk/${product.slug}`}
            className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden hover:border-teal-500/50 dark:hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 flex flex-col"
        >
            {/* Image */}
            <div className="aspect-square bg-slate-100 dark:bg-zinc-800/80 overflow-hidden relative">
                {product.image ? (
                    <>
                        <img
                            src={`/storage/${product.image}`}
                            alt={`Gambar produk ${product.name}`}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                                isOutOfStock ? "grayscale opacity-60" : ""
                            }`}
                            loading="lazy"
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                                    HABIS
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-zinc-600">
                        <Package className="w-6 h-6" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">
                            No Image
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1.5 flex-1 justify-between">
                {/* Baris atas: Kategori + Stok + Judul */}
                <div>
                    {/* Baris 1: Kategori + Stok */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex flex-wrap gap-1 min-w-0">
                            {product.categories?.slice(0, 1).map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40 truncate max-w-[100px]"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>

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
                    <h3
                        className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                        title={product.name}
                    >
                        {product.name}
                    </h3>
                </div>

                {/* Baris 3: Harga */}
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        Mulai
                    </span>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400 shrink-0">
                        {product.min_price ? (
                            formatRupiah(product.min_price)
                        ) : (
                            <span className="text-xs font-normal text-slate-400 dark:text-zinc-600">
                                Hubungi
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </Link>
    );
}
