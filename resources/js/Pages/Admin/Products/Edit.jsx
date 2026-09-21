import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";

const emptyVariant = {
    id: null,
    name: "",
    duration: "",
    account_type: "",
    price: "",
    stock: 0,
    delivery_type: "account",
    delivery_content: "",
    is_active: true,
};

export default function Edit({ product, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        image: null,
        is_active: product.is_active,
        categories: product.categories || [],
        variants:
            product.variants.length > 0
                ? product.variants
                : [{ ...emptyVariant }],
        _method: "PUT",
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

    const addVariant = () =>
        setData("variants", [...data.variants, { ...emptyVariant }]);
    const removeVariant = (idx) =>
        setData(
            "variants",
            data.variants.filter((_, i) => i !== idx),
        );

    const updateVariant = (idx, key, value) => {
        const updated = [...data.variants];
        updated[idx][key] = value;
        setData("variants", updated);
    };

    const toggleCategory = (id) => {
        const cats = data.categories.includes(id)
            ? data.categories.filter((c) => c !== id)
            : [...data.categories, id];
        setData("categories", cats);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/dashboard/products/${product.id}`);
    };

    return (
        <AdminLayout title="Edit Produk">
            <Head title={`Edit ${product.name} - KenzoMart Admin`} />

            <div className="max-w-4xl mx-auto">
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 mb-4 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar produk
                </Link>

                <form onSubmit={handleSubmit} className="space-y-5 mb-8">
                    {/* Info Produk */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-xs">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-4">
                            Informasi Produk
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        handleNameChange(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
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
                                Deskripsi Produk
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={3}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                            />
                        </div>

                        {product.image && (
                            <div className="mt-4">
                                <p className="text-xs font-medium text-slate-700 dark:text-zinc-300 mb-2">
                                    Foto Produk Saat Ini
                                </p>
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-24 h-24 rounded-xl object-cover border border-slate-200 dark:border-zinc-700"
                                />
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                Perbarui Foto (opsional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData("image", e.target.files[0])
                                }
                                className="w-full text-xs text-slate-600 dark:text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-950/60 dark:file:text-teal-300 hover:file:bg-teal-100 cursor-pointer"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-2">
                                Kategori
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                                            data.categories.includes(cat.id)
                                                ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                                                : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700 hover:border-teal-400"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="flex items-center gap-2 mt-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="rounded border-slate-300 dark:border-zinc-700 text-teal-600 focus:ring-teal-500 dark:bg-zinc-800"
                            />
                            <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                                Produk aktif & tampil di etalase toko
                            </span>
                        </label>
                    </div>

                    {/* Varian */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                                Varian & Stok
                            </h2>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Varian</span>
                            </button>
                        </div>

                        {errors.variants && (
                            <p className="text-xs text-rose-500 mb-3 font-medium">
                                {errors.variants}
                            </p>
                        )}

                        <div className="space-y-3.5">
                            {data.variants.map((v, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-zinc-700/80"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                            Varian #{idx + 1}
                                        </span>
                                        {data.variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(idx)}
                                                className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-[10px] font-semibold px-2 py-1 rounded-lg hover:bg-rose-100 transition"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span>Hapus</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Nama varian *"
                                            value={v.name}
                                            onChange={(e) =>
                                                updateVariant(
                                                    idx,
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Durasi (cth: 1 Bulan)"
                                            value={v.duration || ""}
                                            onChange={(e) =>
                                                updateVariant(
                                                    idx,
                                                    "duration",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tipe akun (Private/Sharing)"
                                            value={v.account_type || ""}
                                            onChange={(e) =>
                                                updateVariant(
                                                    idx,
                                                    "account_type",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Harga (Rp) *"
                                            value={v.price}
                                            onChange={(e) =>
                                                updateVariant(
                                                    idx,
                                                    "price",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Jumlah Stok *"
                                            value={v.stock}
                                            onChange={(e) =>
                                                updateVariant(
                                                    idx,
                                                    "stock",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs"
                                            required
                                        />
                                        <select
                                            value={v.delivery_type || "account"}
                                            onChange={(e) =>
                                                updateVariant(
                                                    idx,
                                                    "delivery_type",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs"
                                        >
                                            <option value="account">Akun (Email & Password)</option>
                                            <option value="link">Link / Lisensi</option>
                                        </select>
                                    </div>

                                    <textarea
                                        placeholder="Isi kredensial pengiriman otomatis"
                                        value={v.delivery_content || ""}
                                        onChange={(e) =>
                                            updateVariant(
                                                idx,
                                                "delivery_content",
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                        className="w-full mt-3 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:border-teal-500 outline-none text-xs font-mono"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition disabled:bg-slate-300 dark:disabled:bg-zinc-800"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memperbarui Produk...</span>
                                </>
                            ) : (
                                "Perbarui Produk"
                            )}
                        </button>
                        <Link
                            href="/dashboard/products"
                            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition text-center"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
