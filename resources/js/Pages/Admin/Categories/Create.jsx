import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        is_active: true,
    });

    const handleNameChange = (value) => {
        setData("name", value);
        setData(
            "slug",
            value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/categories");
    };

    return (
        <AdminLayout title="Tambah Kategori">
            <Head title="Tambah Kategori - KenzoMart Admin" />

            <div className="max-w-2xl mx-auto">
                <Link
                    href="/dashboard/categories"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 mb-4 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar kategori
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-xs mb-6"
                >
                    <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-4">
                        Informasi Kategori Baru
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                Nama Kategori *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                Slug URL *
                            </label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData("slug", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm font-mono transition-all"
                                required
                            />
                            {errors.slug && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.slug}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                            Deskripsi (opsional)
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                        />
                    </div>

                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData("is_active", e.target.checked)}
                            className="rounded border-slate-300 dark:border-zinc-700 text-teal-600 focus:ring-teal-500 dark:bg-zinc-800"
                        />
                        <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                            Aktifkan kategori ini
                        </span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition disabled:bg-slate-300 dark:disabled:bg-zinc-800"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                "Simpan Kategori"
                            )}
                        </button>
                        <Link
                            href="/dashboard/categories"
                            className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition text-center"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
