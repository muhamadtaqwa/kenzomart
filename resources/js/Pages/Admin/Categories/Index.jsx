import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Tags } from "lucide-react";

export default function Index({ categories }) {
    const [search, setSearch] = useState("");

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = (id, name) => {
        if (confirm(`Hapus kategori "${name}"?`)) {
            router.delete(`/dashboard/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Kategori Produk">
            <Head title="Kategori - KenzoMart Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                        Manajemen Kategori
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                        Total {categories.length} kategori terdaftar
                    </p>
                </div>
                <Link
                    href="/dashboard/categories/create"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold shadow-sm transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kategori</span>
                </Link>
            </div>

            {/* Search + List */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-zinc-500">
                        <Tags className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm font-medium">
                            {search
                                ? "Kategori tidak ditemukan"
                                : "Belum ada kategori terdaftar"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {filtered.map((cat) => (
                            <div
                                key={cat.id}
                                className="p-4 hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition"
                            >
                                {/* Baris 1: Nama + Nonaktif (kiri), Edit/Hapus (kanan) */}
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                                            {cat.name}
                                        </h3>
                                        {!cat.is_active && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-medium">
                                                Nonaktif
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Link
                                            href={`/dashboard/categories/${cat.id}/edit`}
                                            className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-teal-100 transition"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(cat.id, cat.name)
                                            }
                                            className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-100 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Baris 2: Slug + Produk count */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                    <span className="font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
                                        /{cat.slug}
                                    </span>
                                    <span>{cat.products_count} produk terhubung</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
