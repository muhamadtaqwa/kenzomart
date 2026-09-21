import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head, useForm } from "@inertiajs/react";
import { Loader2, Search, Receipt } from "lucide-react";

export default function Check() {
    const { data, setData, post, processing, errors } = useForm({
        invoice_number: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/cek-pesanan");
    };

    return (
        <StorefrontLayout>
            <Head title="Cek Status Pesanan - KenzoMart" />

            <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center mx-auto mb-3">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                        Cek Status Pesanan
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        Masukkan nomor invoice pesanan digital Anda
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-5 md:p-6 shadow-sm"
                >
                    <div className="mb-5">
                        <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                            Nomor Invoice
                        </label>
                        <input
                            type="text"
                            placeholder="INV-XXXXXXXX-XXXXXX"
                            value={data.invoice_number}
                            onChange={(e) =>
                                setData(
                                    "invoice_number",
                                    e.target.value.toUpperCase(),
                                )
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm font-mono transition-all uppercase"
                            required
                            autoFocus
                        />
                        {errors.invoice_number && (
                            <p className="text-xs text-rose-500 mt-1.5 font-medium">
                                {errors.invoice_number}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold transition-all shadow-lg shadow-teal-600/20 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Mencari Data Pesanan...
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                <span>Cek Status Sekarang</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </StorefrontLayout>
    );
}
