import { Link, usePage, router } from "@inertiajs/react";
import {
    LayoutDashboard,
    Package,
    Tags,
    Users,
    ShoppingCart,
    LogOut,
    Menu,
    X,
    ExternalLink,
    PaperBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/Components/ThemeToggle";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
    { label: "Customer", href: "/dashboard/customers", icon: Users },
    { label: "Kategori", href: "/dashboard/categories", icon: Tags },
    { label: "Produk", href: "/dashboard/products", icon: Package },
];

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = props.auth?.user;

    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    const isActive = (href) => {
        if (href === "/dashboard") return url === "/dashboard";
        return url.startsWith(href);
    };

    const handleLogout = () => {
        router.post("/dashboard/logout");
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-200">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-slate-200/80 dark:border-zinc-800 z-50 transform transition-transform duration-200 ease-out flex flex-col ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-zinc-800">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white tracking-tight"
                    >
                        <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm">
                            <PaperBag className="w-4 h-4" />
                        </div>
                        <span>
                            Kenzo
                            <span className="text-teal-600 dark:text-teal-400">
                                Mart
                            </span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 ml-0.5">
                            Admin
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3.5 flex flex-col gap-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold"
                                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-zinc-200"
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3.5 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-1">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200 transition"
                    >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        Buka Toko
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-rose-400 transition w-full text-left"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 px-4 md:px-6 py-3.5 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
