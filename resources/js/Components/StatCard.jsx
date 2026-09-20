import { Link } from '@inertiajs/react';

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    accent,
    iconBg,
    iconColor,
    href,
}) {
    return (
        <Link
            href={href}
            className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: accent }}
            />

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
                    <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                </div>

                <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: iconBg, color: iconColor }}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Link>
    );
}
