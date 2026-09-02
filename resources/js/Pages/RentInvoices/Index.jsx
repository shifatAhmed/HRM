import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ invoices }) {
    const formatMonthLabel = (month, year) => {
        const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString(
            'en-US',
            { month: 'long' },
        );

        return `${monthName} ${year}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Rent Invoices
                    </h2>
                    <Link
                        href={route('invoices.create')}
                        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                        Generate Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Rent Invoices" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Invoice</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Flats</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tenant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Due</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {invoices.length > 0 ? (
                                        invoices.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    #{inv.id} — {formatMonthLabel(inv.month, inv.year)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.tenant?.flat?.flat_no}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.tenant?.name} </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{inv.total_amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{inv.due_amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{inv.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a
                                                        href={route('invoices.receipt', inv.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </a>
                                                    <Link
                                                        href={route('invoices.show', inv.id)}
                                                        className="ml-4 text-green-600 hover:text-green-900"
                                                    >
                                                        Pay
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No invoices found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
