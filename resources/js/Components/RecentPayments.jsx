import { BadgeCheck, CircleAlert, Clock3 } from 'lucide-react';

const statusStyles = {
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    overdue: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const statusIcons = {
    paid: BadgeCheck,
    pending: Clock3,
    overdue: CircleAlert,
};

export default function RecentPayments({ payments = [] }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent Payments</h3>
                    <p className="text-sm text-slate-500">Latest collection activity</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.9fr_0.9fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span>Tenant</span>
                    <span>Flat</span>
                    <span>Amount</span>
                    <span>Date</span>
                    <span>Status</span>
                </div>

                <div className="divide-y divide-slate-200 bg-white">
                    {payments.length > 0 ? (
                        payments.map((payment) => {
                            const status = String(payment.status || 'pending').toLowerCase();
                            const StatusIcon = statusIcons[status] || Clock3;
                            const style = statusStyles[status] || statusStyles.pending;

                            return (
                                <div
                                    key={payment.id}
                                    className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.9fr_0.9fr] items-center px-4 py-3 text-sm text-slate-700"
                                >
                                    <span className="font-medium text-slate-900">
                                        {payment.tenant?.name || payment.tenant_name || '-'}
                                    </span>
                                    <span>{payment.flat?.name || payment.flat_name || '-'}</span>
                                    <span className="font-semibold text-slate-900">
                                        ৳{payment.amount}
                                    </span>
                                    <span>{payment.payment_date || payment.date || '-'}</span>
                                    <span>
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${style}`}
                                        >
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {status}
                                        </span>
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">
                            No recent payments found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
