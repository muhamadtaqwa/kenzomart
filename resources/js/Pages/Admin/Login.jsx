import { Head, useForm } from "@inertiajs/react";
import { Loader2, PaperBag, Lock } from "lucide-react";
import ThemeToggle from "@/Components/ThemeToggle";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/login");
    };

    return (
        <>
            <Head title="Login Admin - KenzoMart" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 font-sans relative transition-colors duration-200">
                {/* ThemeToggle top right */}
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-600/20">
                            <PaperBag className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Kenzo
                            <span className="text-teal-600 dark:text-teal-400">
                                Mart
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            Masuk ke Dashboard Pengelola
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-6 md:p-7 shadow-sm transition-colors"
                    >
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                placeholder="admin@kenzomart.test"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                                autoFocus
                                required
                            />
                            {errors.email && (
                                <p className="text-xs text-rose-500 mt-1.5 font-medium">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                                Kata Sandi
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                                required
                            />
                        </div>

                        <label className="flex items-center gap-2 mb-6 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="rounded border-slate-300 dark:border-zinc-700 text-teal-600 focus:ring-teal-500 dark:bg-zinc-800"
                            />
                            <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                                Ingat sesi login saya
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold transition-all shadow-lg shadow-teal-600/20 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memverifikasi...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Masuk ke Panel</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <a
                            href="/"
                            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition font-medium"
                        >
                            ← Kembali ke Toko Publik
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
