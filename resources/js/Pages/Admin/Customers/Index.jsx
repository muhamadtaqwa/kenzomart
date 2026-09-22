import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Search, Users } from "lucide-react";

export default function Index({ customers }) {
    const [search, setSearch] = useState("");

    const filtered = customers.filter(
        (c) =>
            (c.phone && c.phone.toLowerCase().includes(search.toLowerCase())) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
            (c.name && c.name.toLowerCase().includes(search.toLowerCase())),
    );

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value || 0);

    return (
        <AdminLayout title="Daftar Pelanggan">
            <Head title="Pelanggan - KenzoMart Admin" />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                    Data Pelanggan
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                    Total {customers.length} pelanggan terdaftar
                </p>
            </div>

            {/* Search + List */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Cari pelanggan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-zinc-500">
                        <Users className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm font-medium">
                            {search
                                ? "Pelanggan tidak ditemukan"
                                : "Belum ada data pelanggan"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {filtered.map((customer) => (
                            <div
                                key={customer.id}
                                className="p-4 hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    {/* Kiri: Nama + HP/Email */}
                                    <div className="flex-1 min-w-0">
                                        {customer.name && (
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate mb-0.5">
                                                {customer.name}
                                            </h3>
                                        )}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                            <span className="font-medium text-slate-700 dark:text-zinc-300">
                                                {customer.phone}
                                            </span>
                                            {customer.email && (
                                                <span className="truncate">
                                                    {customer.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Kanan: Order count + Total */}
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                            {customer.orders_count} pesanan
                                        </p>
                                        {customer.total_spent > 0 && (
                                            <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                                                {formatRupiah(
                                                    customer.total_spent,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
