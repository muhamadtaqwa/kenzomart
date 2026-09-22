import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Search, ChevronDown, ShoppingBag } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const statusColors = {
    pending:
        "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    paid: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    delivered:
        "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
    expired:
        "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
    failed: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
};

const statusLabels = {
    pending: "Pending",
    paid: "Paid",
    delivered: "Delivered",
    expired: "Expired",
    failed: "Failed",
};

export default function Index({ orders, stats, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value || 0);

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applyFilter = (status) => {
        setDropdownOpen(false);
        router.get(
            "/dashboard/orders",
            { status, search },
            { preserveState: true },
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/dashboard/orders",
            { status: filters.status, search },
            { preserveState: true },
        );
    };

    const activeStatusLabel =
        filters.status === "all"
            ? "Semua Status"
            : statusLabels[filters.status] || "Semua Status";

    const statusOptions = [
        { value: "all", label: `Semua (${stats.all})` },
        { value: "pending", label: `Pending (${stats.pending})` },
        { value: "paid", label: `Paid (${stats.paid})` },
        { value: "delivered", label: `Delivered (${stats.delivered})` },
        { value: "expired", label: `Expired (${stats.expired})` },
        { value: "failed", label: `Failed (${stats.failed})` },
    ];

    return (
        <AdminLayout title="Daftar Pesanan">
            <Head title="Kelola Pesanan - KenzoMart Admin" />

            {/* Search + Filter Dropdown */}
            <div className="flex gap-2.5 mb-5">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Cari nomor invoice / HP WhatsApp..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                        />
                    </div>
                </form>

                {/* Dropdown Filter */}
                <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="h-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:border-teal-500 transition-colors inline-flex items-center gap-2 shadow-xs"
                    >
                        <span>{activeStatusLabel}</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                                dropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-30 overflow-hidden py-1">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => applyFilter(opt.value)}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-medium transition ${
                                        filters.status === opt.value
                                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold"
                                            : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden shadow-xs">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-zinc-500">
                        <ShoppingBag className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm font-medium">
                            Belum ada pesanan ditemukan
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="p-4 hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Link
                                                href={`/dashboard/orders/${order.id}`}
                                                className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-100 hover:text-teal-600 dark:hover:text-teal-400 transition"
                                            >
                                                {order.invoice_number}
                                            </Link>
                                            <span
                                                className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusColors[order.status]}`}
                                            >
                                                {statusLabels[order.status]}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                            {order.customer.phone} •{" "}
                                            {order.created_at}
                                        </p>
                                        <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">
                                            {formatRupiah(order.total_amount)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition shrink-0"
                                    >
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
