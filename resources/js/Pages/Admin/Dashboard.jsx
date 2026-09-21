import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    TrendingUp,
    ShoppingCart,
    Clock,
    Users,
    Banknote,
    Package,
    ArrowUpRight,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const statusColors = {
    pending: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    paid: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    delivered: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
    expired: "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
    failed: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
};

const statusLabels = {
    pending: "Pending",
    paid: "Paid",
    delivered: "Delivered",
    expired: "Expired",
    failed: "Failed",
};

export default function Dashboard({
    stats,
    chartData,
    latestOrders,
    topProducts,
}) {
    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value || 0);

    const formatRupiahShort = (value) => {
        if (value >= 1000000) return `Rp${(value / 1000000).toFixed(1)}jt`;
        if (value >= 1000) return `Rp${(value / 1000).toFixed(0)}rb`;
        return `Rp${value}`;
    };

    // 6 stat cards
    const statCards = [
        {
            label: "Revenue Hari Ini",
            value: formatRupiah(stats.revenue_today),
            icon: Banknote,
            color: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40",
        },
        {
            label: "Revenue Bulan Ini",
            value: formatRupiah(stats.revenue_month),
            icon: TrendingUp,
            color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40",
        },
        {
            label: "Order Hari Ini",
            value: stats.orders_today,
            icon: ShoppingCart,
            color: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40",
        },
        {
            label: "Order Menunggu",
            value: stats.pending_orders,
            icon: Clock,
            color:
                stats.pending_orders > 0
                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400",
        },
        {
            label: "Total Produk",
            value: stats.total_products,
            icon: Package,
            color: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40",
        },
        {
            label: "Total Pelanggan",
            value: stats.total_customers,
            icon: Users,
            color: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40",
        },
    ];

    return (
        <AdminLayout title="Dashboard Pengelola">
            <Head title="Dashboard - KenzoMart Admin" />

            {/* Stat Cards — 6 */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 mb-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 md:p-5 shadow-xs transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                    {card.label}
                                </span>
                                <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-zinc-100 truncate">
                                {card.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Chart Penjualan */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 md:p-6 mb-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-zinc-100">
                        Trend Revenue (7 Hari Terakhir)
                    </h2>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                        Live Analytics
                    </span>
                </div>
                <div className="w-full h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#94a3b8"
                                strokeOpacity={0.15}
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                axisLine={{ stroke: "#64748b", strokeOpacity: 0.2 }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={formatRupiahShort}
                                width={55}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(24, 24, 27, 0.95)",
                                    color: "#f4f4f5",
                                    border: "1px solid rgba(63, 63, 70, 0.8)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    backdropFilter: "blur(4px)",
                                }}
                                formatter={(value) => [
                                    formatRupiah(value),
                                    "Revenue",
                                ]}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0d9488"
                                strokeWidth={3}
                                dot={{ fill: "#0d9488", r: 4 }}
                                activeDot={{ r: 6, fill: "#14b8a6" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Order Chart */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 md:p-6 mb-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-zinc-100">
                        Volume Transaksi (7 Hari Terakhir)
                    </h2>
                </div>
                <div className="w-full h-48 md:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#94a3b8"
                                strokeOpacity={0.15}
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                axisLine={{ stroke: "#64748b", strokeOpacity: 0.2 }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                axisLine={false}
                                tickLine={false}
                                width={25}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(24, 24, 27, 0.95)",
                                    color: "#f4f4f5",
                                    border: "1px solid rgba(63, 63, 70, 0.8)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => [value, "Pesanan"]}
                            />
                            <Bar
                                dataKey="orders"
                                fill="#0d9488"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Grid: Order Terbaru + Top Produk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Order Terbaru */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 md:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                            Pesanan Terbaru
                        </h2>
                        <Link
                            href="/dashboard/orders"
                            className="bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-teal-700 transition flex items-center gap-1"
                        >
                            <span>Semua Pesanan</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {latestOrders.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-8">
                            Belum ada transaksi pesanan
                        </p>
                    ) : (
                        <div className="space-y-1.5">
                            {latestOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/dashboard/orders/${order.id}`}
                                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition"
                                >
                                    <div className="min-w-0">
                                        <p className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                                            {order.invoice_number}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                            {order.customer_phone}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                                            {formatRupiah(order.total_amount)}
                                        </p>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium border inline-block mt-0.5 ${statusColors[order.status]}`}
                                        >
                                            {statusLabels[order.status]}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Produk */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 md:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                            Produk Terlaris
                        </h2>
                        <Link
                            href="/dashboard/products"
                            className="bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-teal-700 transition flex items-center gap-1"
                        >
                            <span>Kelola Produk</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {topProducts.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-8">
                            Belum ada data penjualan produk
                        </p>
                    ) : (
                        <div className="space-y-1.5">
                            {topProducts.map((product, idx) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 transition"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                                            {product.name}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 shrink-0">
                                        {product.sold_count} terjual
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
