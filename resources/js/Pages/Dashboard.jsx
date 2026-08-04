import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import IncomeExpenseChart from '@/Components/IncomeExpenseChart';
import InvoiceStatusChart from '@/Components/InvoiceStatusChart';
import MonthlyCollectionChart from '@/Components/MonthlyCollectionChart';
import OccupancyChart from '@/Components/OccupancyChart';
import QuickActions from '@/Components/QuickActions';
import RecentPayments from '@/Components/RecentPayments';
import StatCard from '@/Components/StatCard';
import { Head } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CircleDollarSign,
    DollarSign,
    FileText,
    Home,
    Receipt,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';

const today = new Date().toLocaleDateString('en-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const widgetItems = [
    {
        title: "Today's Collection",
        value: '৳42,500',
        trend: '+8.2%',
        icon: CircleDollarSign,
        tone: 'text-emerald-600',
    },
    {
        title: 'Pending Collection',
        value: '৳18,900',
        trend: '-2.1%',
        icon: Wallet,
        tone: 'text-amber-600',
    },
    {
        title: 'Occupancy Rate',
        value: '78%',
        trend: '+4.5%',
        icon: TrendingUp,
        tone: 'text-indigo-600',
    },
];

export default function Dashboard({ stats }) {
    const statCards = [
        {
            title: 'Buildings',
            value: stats.buildings,
            subtitle: 'Total property records',
            icon: Building2,
            accent: '#3B82F6',
            iconBg: 'rgba(59, 130, 246, 0.14)',
            iconColor: '#2563EB',
        },
        {
            title: 'Flats',
            value: stats.flats,
            subtitle: 'All units in portfolio',
            icon: Home,
            accent: '#8B5CF6',
            iconBg: 'rgba(139, 92, 246, 0.14)',
            iconColor: '#7C3AED',
        },
        {
            title: 'Occupied Flats',
            value: stats.occupied_flats,
            subtitle: 'Currently rented units',
            icon: Users,
            accent: '#10B981',
            iconBg: 'rgba(16, 185, 129, 0.14)',
            iconColor: '#059669',
        },
        {
            title: 'Vacant Flats',
            value: stats.vacant_flats,
            subtitle: 'Available for occupancy',
            icon: Wallet,
            accent: '#F59E0B',
            iconBg: 'rgba(245, 158, 11, 0.14)',
            iconColor: '#D97706',
        },
        {
            title: 'Tenants',
            value: stats.tenants,
            subtitle: 'Active tenant profiles',
            icon: Users,
            accent: '#06B6D4',
            iconBg: 'rgba(6, 182, 212, 0.14)',
            iconColor: '#0891B2',
        },
        {
            title: 'Pending Invoices',
            value: stats.pending_invoices,
            subtitle: 'Awaiting payment follow-up',
            icon: FileText,
            accent: '#EF4444',
            iconBg: 'rgba(239, 68, 68, 0.14)',
            iconColor: '#DC2626',
        },
        {
            title: 'Total Due',
            value: `৳${stats.due_total}`,
            subtitle: 'Current unpaid balance',
            icon: Receipt,
            accent: '#F43F5E',
            iconBg: 'rgba(244, 63, 94, 0.14)',
            iconColor: '#E11D48',
        },
        {
            title: 'Collected Amount',
            value: `৳${stats.collected_total}`,
            subtitle: 'Total payment received',
            icon: CircleDollarSign,
            accent: '#10B981',
            iconBg: 'rgba(16, 185, 129, 0.14)',
            iconColor: '#059669',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Welcome back, Admin
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Dashboard
                            </h1>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        {today}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="bg-slate-100 py-6">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((card) => (
                            <StatCard key={card.title} {...card} />
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[7fr_5fr]">
                        <IncomeExpenseChart />
                        <OccupancyChart stats={stats} />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[7fr_5fr]">
                        <MonthlyCollectionChart />
                        <InvoiceStatusChart />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[8fr_4fr]">
                        <RecentPayments />

                        <div className="space-y-6">
                            <QuickActions />

                            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                                {widgetItems.map((widget) => {
                                    const Icon = widget.icon;

                                    return (
                                        <div
                                            key={widget.title}
                                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-slate-500">
                                                        {widget.title}
                                                    </p>
                                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                                        {widget.value}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 p-2">
                                                    <Icon className={`h-5 w-5 ${widget.tone}`} />
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                                                <TrendingUp className="h-4 w-4" />
                                                {widget.trend}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
