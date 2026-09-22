import { Link, usePage, router } from "@inertiajs/react";
import {
    Search,
    Menu,
    X,
    PaperBag,
    Home,
    PackageSearch,
    Phone,
    Mail,
    MessageCircle,
    LayoutDashboard,
    ExternalLink,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/Components/ThemeToggle";

/* ==================== KONFIGURASI ==================== */
const WA_NUMBER = "628985949733"; // 08985949733 → format internasional
const WA_DISPLAY = "0898-5949-733";
const EMAIL = "muhamadtaqwaa@gmail.com";

const navLinks = [
    { label: "Produk", href: "/produk", icon: Home },
    { label: "Cek Pesanan", href: "/cek-pesanan", icon: PackageSearch },
];

/* ==================== KOMPONEN MODAL KONTAK ==================== */
function KontakModal({ open, onClose }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kontak-title"
        >
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                            <MessageCircle className="w-4 h-4" />
                        </div>
                        <h2
                            id="kontak-title"
                            className="text-base font-bold text-slate-900 dark:text-white"
                        >
                            Hubungi Kami
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-1 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                        aria-label="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
                        Ada pertanyaan? Hubungi kami via WhatsApp atau email.
                    </p>

                    {/* WhatsApp */}
                    <a
                        href={`https://wa.me/${WA_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                WhatsApp
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 truncate">
                                {WA_DISPLAY}
                            </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    {/* Email */}
                    <a
                        href={`mailto:${EMAIL}`}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 hover:bg-teal-100 dark:hover:bg-teal-950/60 transition group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-teal-900 dark:text-teal-200">
                                Email
                            </p>
                            <p className="text-xs text-teal-700 dark:text-teal-400 truncate">
                                {EMAIL}
                            </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==================== KOMPONEN UTAMA ==================== */
export default function StorefrontLayout({ children }) {
    const { url } = usePage();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [kontakOpen, setKontakOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [shouldRenderSearch, setShouldRenderSearch] = useState(false);

    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    /* Tutup sidebar tiap ganti halaman */
    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    /* Lock scroll saat sidebar terbuka */
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    /* Handle render + focus search */
    useEffect(() => {
        if (searchOpen) {
            setShouldRenderSearch(true);
            setTimeout(() => searchInputRef.current?.focus(), 150);
        } else {
            const t = setTimeout(() => setShouldRenderSearch(false), 250);
            return () => clearTimeout(t);
        }
    }, [searchOpen]);

    /* Tutup search kalau klik di luar */
    useEffect(() => {
        const handler = (e) => {
            if (
                searchOpen &&
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target)
            ) {
                setSearchOpen(false);
                setSearchValue("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [searchOpen]);

    const isActive = (href) => url.startsWith(href);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            router.get("/produk", { search: searchValue.trim() });
            setSearchOpen(false);
            setSearchValue("");
        }
    };

    /* ==================== SIDEBAR CONTENT ==================== */
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-14 md:h-16 flex items-center px-4 md:px-5 border-b border-slate-200 dark:border-zinc-800 shrink-0">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-tight group"
                >
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
                        <PaperBag className="w-4 h-4" />
                    </div>
                    <span className="text-slate-900 dark:text-white">
                        Kenzo
                        <span className="text-teal-600 dark:text-teal-400">
                            Mart
                        </span>
                    </span>
                </Link>

                {/* Tombol close (mobile) */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden ml-auto p-2 -mr-1 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition shrink-0"
                    aria-label="Tutup menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                                active
                                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold"
                                    : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            }`}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}

                {/* Kontak (buka modal) */}
                <button
                    onClick={() => {
                        setKontakOpen(true);
                        setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                >
                    <Phone className="w-[18px] h-[18px] shrink-0" />
                    <span>Kontak</span>
                </button>

                {/* Divider */}
                <div className="border-t border-slate-100 dark:border-zinc-800 my-2" />

                {/* Panel Admin */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                >
                    <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
                    <span>Panel Admin</span>
                </Link>
            </nav>

            {/* Footer sidebar */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-zinc-800 shrink-0">
                <p className="text-[10px] text-slate-400 dark:text-zinc-600">
                    © {new Date().getFullYear()} KenzoMart
                </p>
            </div>
        </div>
    );

    /* ==================== RENDER ==================== */
    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-200">
            {/* ==================== SIDEBAR DESKTOP ==================== */}
            <aside className="hidden md:flex md:flex-col md:w-60 lg:w-64 shrink-0 bg-white dark:bg-zinc-900 border-r border-slate-200/80 dark:border-zinc-800 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* ==================== SIDEBAR MOBILE (DRAWER) ==================== */}
            <div
                className={`md:hidden fixed inset-0 z-[90] ${
                    sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
            >
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                        sidebarOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                />
                {/* Drawer */}
                <aside
                    className={`absolute top-0 left-0 h-full w-[80vw] max-w-[300px] bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shadow-2xl transition-transform duration-300 ease-out ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <SidebarContent />
                </aside>
            </div>

            {/* ==================== KONTEN UTAMA ==================== */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar atas ramping */}
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
                    <div className="h-14 md:h-16 flex items-center justify-between gap-2 px-4 md:px-6">
                        {/* Kiri: Hamburger (mobile) */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2.5 -ml-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition shrink-0"
                                aria-label="Buka menu"
                                aria-expanded={sidebarOpen}
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Judul mobile */}
                            <span className="md:hidden text-sm font-bold truncate">
                                <span className="text-slate-900 dark:text-white">
                                    Kenzo
                                </span>
                                <span className="text-teal-600 dark:text-teal-400">
                                    Mart
                                </span>
                            </span>
                        </div>

                        {/* Kanan: Theme + Search */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <ThemeToggle />

                            <div
                                ref={searchContainerRef}
                                className="relative flex items-center"
                            >
                                {shouldRenderSearch && (
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow-lg z-10 transition-all ease-out origin-right w-[min(270px,calc(100vw-7rem))] ${
                                            searchOpen
                                                ? "opacity-100 scale-x-100"
                                                : "opacity-0 scale-x-0 pointer-events-none"
                                        }`}
                                        style={{ transitionDuration: "250ms" }}
                                    >
                                        <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 ml-3 shrink-0" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Cari produk..."
                                            value={searchValue}
                                            onChange={(e) =>
                                                setSearchValue(e.target.value)
                                            }
                                            className="flex-1 py-2.5 pr-2 outline-none text-sm bg-transparent text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 min-w-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchOpen(false);
                                                setSearchValue("");
                                            }}
                                            className="p-2 mr-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition shrink-0"
                                            aria-label="Tutup pencarian"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}

                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className={`p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 active:bg-slate-200 dark:active:bg-zinc-700 transition duration-200 ${
                                        searchOpen
                                            ? "opacity-0 scale-90 pointer-events-none"
                                            : "opacity-100 scale-100"
                                    }`}
                                    aria-label="Cari produk"
                                    aria-expanded={searchOpen}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-8">
                    {children}
                </main>

                {/* Footer ramping */}
                <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 mt-8 transition-colors">
                    <div className="px-4 py-4">
                        <p className="text-[11px] text-slate-500 dark:text-zinc-500 text-center">
                            © {new Date().getFullYear()} KenzoMart. All rights
                            reserved.
                        </p>
                    </div>
                </footer>
            </div>

            {/* ==================== MODAL KONTAK ==================== */}
            <KontakModal
                open={kontakOpen}
                onClose={() => setKontakOpen(false)}
            />
        </div>
    );
}
