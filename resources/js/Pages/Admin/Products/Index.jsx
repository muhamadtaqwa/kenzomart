import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Package } from "lucide-react";

export default function Index({ products }) {
    const [search, setSearch] = useState("");

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
    );

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value || 0);

    const handleDelete = (id, name) => {
        if (confirm(`Hapus produk "${name}"?`)) {
            router.delete(`/dashboard/products/${id}`);
        }
    };

    return (
        <AdminLayout title="Katalog Produk">
            <Head title="Kelola Produk - KenzoMart Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                        Manajemen Produk
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                        Total {products.length} produk terdaftar dalam katalog
                    </p>
                </div>
                <Link
                    href="/dashboard/products/create"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold shadow-sm transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk</span>
                </Link>
            </div>

            {/* Search & Container */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Cari produk berdasarkan nama..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                    />
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-zinc-500">
                        <Package className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm font-medium">
                            {search
                                ? "Produk tidak ditemukan"
                                : "Belum ada produk terdaftar"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {filtered.map((product) => (
                            <div
                                key={product.id}
                                className="p-4 hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition"
                            >
                                {/* Baris 1: Kategori (kiri) + Edit/Hapus (kanan) */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    {/* Kiri: Kategori */}
                                    <div className="flex flex-wrap gap-1.5 min-w-0">
                                        {product.categories.length > 0 ? (
                                            product.categories.map((c) => (
                                                <span
                                                    key={c.id}
                                                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40 font-medium"
                                                >
                                                    {c.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                                                Tanpa kategori
                                            </span>
                                        )}
                                        {!product.is_active && (
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-medium">
                                                Nonaktif
                                            </span>
                                        )}
                                    </div>

                                    {/* Kanan: Edit + Hapus */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Link
                                            href={`/dashboard/products/${product.id}/edit`}
                                            className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/80 transition"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    product.id,
                                                    product.name,
                                                )
                                            }
                                            className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/80 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Baris 2: Nama Produk */}
                                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-2.5">
                                    {product.name}
                                </h3>

                                {/* Baris 3+: Varian */}
                                <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-zinc-700">
                                    {product.variants.map((v) => (
                                        <div
                                            key={v.id}
                                            className="flex items-center justify-between gap-2 text-xs"
                                        >
                                            <span className="text-slate-700 dark:text-zinc-300 truncate min-w-0">
                                                {v.name}
                                            </span>
                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <span className="font-semibold text-teal-600 dark:text-teal-400">
                                                    {formatRupiah(v.price)}
                                                </span>
                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                        v.stock > 0
                                                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                                                            : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                                                    }`}
                                                >
                                                    Stok: {v.stock}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
