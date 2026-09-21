import { Link, usePage, router } from "@inertiajs/react";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/Components/ThemeToggle";

const navLinks = [
    { label: "Katalog Produk", href: "/produk" },
    { label: "Cek Pesanan", href: "/cek-pesanan" },
];

export default function StorefrontLayout({ children }) {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [shouldRenderSearch, setShouldRenderSearch] = useState(false);

    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const menuContainerRef = useRef(null);

    // Tutup menu tiap ganti halaman
    useEffect(() => {
        setMenuOpen(false);
    }, [url]);

    // Lock scroll pas menu kebuka
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    // Handle render + focus search
    useEffect(() => {
        if (searchOpen) {
            setShouldRenderSearch(true);
            setTimeout(() => searchInputRef.current?.focus(), 150);
        } else {
            const t = setTimeout(() => setShouldRenderSearch(false), 250);
            return () => clearTimeout(t);
        }
    }, [searchOpen]);

    // Tutup search kalau klik di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchOpen &&
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target)
            ) {
                setSearchOpen(false);
                setSearchValue("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [searchOpen]);

    // Tutup menu mobile kalau klik di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuOpen &&
                menuContainerRef.current &&
                !menuContainerRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const isActive = (href) => url.startsWith(href);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            router.get("/produk", { search: searchValue.trim() });
            setSearchOpen(false);
        }
    };

    const handleCloseSearch = () => {
        setSearchOpen(false);
        setSearchValue("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-200">
            {/* ==================== HEADER ==================== */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
                <div ref={menuContainerRef}>
                    <div className="max-w-6xl mx-auto px-4 md:px-6">
                        <div className="h-16 flex items-center justify-between gap-4 relative">
                            {/* Kiri: Hamburger + Logo desktop */}
                            <div className="flex items-center gap-3 flex-1">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="md:hidden p-2 -ml-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                                    aria-label="Menu"
                                    aria-expanded={menuOpen}
                                >
                                    {menuOpen ? (
                                        <X className="w-5 h-5" />
                                    ) : (
                                        <Menu className="w-5 h-5" />
                                    )}
                                </button>

                                <Link
                                    href="/"
                                    className="hidden md:flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white tracking-tight group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <span>
                                        Kenzo<span className="text-teal-600 dark:text-teal-400">Mart</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Tengah: Logo mobile */}
                            <Link
                                href="/"
                                className={`md:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white transition-all duration-300 ${
                                    searchOpen
                                        ? "opacity-0 scale-95 pointer-events-none"
                                        : "opacity-100 scale-100"
                                }`}
                            >
                                <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                </div>
                                <span>
                                    Kenzo<span className="text-teal-600 dark:text-teal-400">Mart</span>
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav
                                className={`hidden md:flex items-center gap-7 text-sm font-medium transition-all duration-300 ${
                                    searchOpen
                                        ? "opacity-0 scale-95 pointer-events-none"
                                        : "opacity-100 scale-100"
                                }`}
                            >
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`transition-colors py-1 ${
                                            isActive(link.href)
                                                ? "text-teal-600 dark:text-teal-400 font-semibold"
                                                : "text-slate-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-300"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Kanan: Theme Toggle + Search */}
                            <div className="flex items-center gap-1.5 flex-1 justify-end">
                                <ThemeToggle />

                                <div
                                    ref={searchContainerRef}
                                    className="relative flex items-center"
                                >
                                    {shouldRenderSearch && (
                                        <form
                                            onSubmit={handleSearchSubmit}
                                            className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow-lg z-10 transition-all ease-out origin-right ${
                                                searchOpen
                                                    ? "opacity-100 scale-x-100"
                                                    : "opacity-0 scale-x-0 pointer-events-none"
                                            }`}
                                            style={{
                                                width: "270px",
                                                transitionDuration: "250ms",
                                            }}
                                        >
                                            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 ml-3 shrink-0" />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Cari produk digital..."
                                                value={searchValue}
                                                onChange={(e) =>
                                                    setSearchValue(
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 py-2.5 pr-2 outline-none text-sm bg-transparent text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 min-w-0"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCloseSearch}
                                                className="p-2 mr-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition shrink-0"
                                                aria-label="Tutup"
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
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    <div
                        className={`md:hidden overflow-hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-[max-height] duration-300 ease-out ${
                            menuOpen ? "max-h-80" : "max-h-0"
                        }`}
                    >
                        <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition ${
                                        isActive(link.href)
                                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold"
                                            : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="border-t border-slate-100 dark:border-zinc-800 my-2" />

                            <a
                                href="/dashboard"
                                className="py-2.5 px-3 rounded-xl text-sm font-medium text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                            >
                                Panel Admin
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* ==================== MAIN ==================== */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
                {children}
            </main>

            {/* ==================== FOOTER ==================== */}
            <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 mt-16 transition-colors">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                                <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                                Kenzo<span className="text-teal-600 dark:text-teal-400">Mart</span>
                            </span>
                            <span className="text-xs text-slate-400 dark:text-zinc-500 ml-2 hidden sm:inline">
                                Toko Produk Digital Otomatis
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 text-center md:text-right">
                            © {new Date().getFullYear()} KenzoMart. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
