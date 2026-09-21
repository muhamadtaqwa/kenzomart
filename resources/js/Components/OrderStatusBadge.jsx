const statusConfig = {
    pending: {
        label: "Menunggu Pembayaran",
        className: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    },
    paid: {
        label: "Sudah Dibayar",
        className: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    expired: {
        label: "Kadaluarsa",
        className: "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
    },
    failed: {
        label: "Gagal",
        className: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
    },
    delivered: {
        label: "Selesai",
        className: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
    },
};

export default function OrderStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
        >
            {config.label}
        </span>
    );
}
