import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ collected_total, due_total, payments, invoices }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Reports</h2>}>
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <div className="text-sm text-gray-500">Collected Total</div>
                            <div className="text-2xl font-semibold">৳{collected_total}</div>
                        </div>
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <div className="text-sm text-gray-500">Total Due</div>
                            <div className="text-2xl font-semibold">৳{due_total}</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="font-semibold">Recent Payments</h3>
                        <ul className="mt-3 space-y-2">
                            {payments.map((p) => (
                                <li key={p.id} className="text-sm text-gray-700">{p.payment_date} — ৳{p.amount} — {p.payment_method}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="font-semibold">Recent Invoices</h3>
                        <ul className="mt-3 space-y-2">
                            {invoices.map((i) => (
                                <li key={i.id} className="text-sm text-gray-700">#{i.id} — {i.tenant?.name} — ৳{i.total_amount} — Due: ৳{i.due_amount}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
