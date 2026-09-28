import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const rowsPerPage = 10;

export default function Index({ invoices }) {
    const [search, setSearch] = useState('');
    const [selectedFlat, setSelectedFlat] = useState('');
    const [selectedTenant, setSelectedTenant] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const formatMonthLabel = (month, year) => {
        const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString(
            'en-US',
            { month: 'long' },
        );

        return `${monthName} ${year}`;
    };

    const flatOptions = useMemo(() => {
        const flats = new Map();

        invoices.forEach((invoice) => {
            const flat = invoice.tenant?.flat;
            const flatId = invoice.flat_id ?? flat?.id;

            if (flatId && flat) {
                flats.set(String(flatId), flat.flat_no);
            }
        });

        return Array.from(flats, ([id, label]) => ({ id, label })).sort((a, b) =>
            String(a.label).localeCompare(String(b.label)),
        );
    }, [invoices]);

    const tenantOptions = useMemo(() => {
        const tenants = new Map();

        invoices.forEach((invoice) => {
            const tenant = invoice.tenant;

            if (tenant?.id) {
                tenants.set(String(tenant.id), tenant.name);
            }
        });

        return Array.from(tenants, ([id, label]) => ({ id, label })).sort((a, b) =>
            String(a.label).localeCompare(String(b.label)),
        );
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        const query = search.trim().toLowerCase();

        return invoices.filter((inv) => {
            const matchesFlat = !selectedFlat
                || String(inv.flat_id ?? inv.tenant?.flat?.id ?? '') === selectedFlat;
            const matchesTenant = !selectedTenant
                || String(inv.tenant_id ?? inv.tenant?.id ?? '') === selectedTenant;
            const matchesSearch = !query || [
                inv.id,
                inv.tenant?.name,
                inv.tenant?.flat?.flat_no,
                inv.status,
                inv.total_amount,
                inv.due_amount,
                formatMonthLabel(inv.month, inv.year),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(query);

            return matchesFlat && matchesTenant && matchesSearch;
        });
    }, [invoices, search, selectedFlat, selectedTenant]);

    const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / rowsPerPage));

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedFlat, selectedTenant]);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + rowsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Rent Invoices
                    </h2>
                    <Link
                        href={route('invoices.create')}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
                    >
                        Generate Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Rent Invoices" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Invoice ledger</h3>
                                <p className="text-sm text-slate-500">Review totals, balances, and outstanding invoices.</p>
                            </div>
                            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
                                <div>
                                    <label htmlFor="invoice-flat-filter" className="mb-1 block text-sm font-medium text-slate-700">
                                        Flat
                                    </label>
                                    <select
                                        id="invoice-flat-filter"
                                        value={selectedFlat}
                                        onChange={(event) => setSelectedFlat(event.target.value)}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All flats</option>
                                        {flatOptions.map((flat) => (
                                            <option key={flat.id} value={flat.id}>{flat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="invoice-tenant-filter" className="mb-1 block text-sm font-medium text-slate-700">
                                        Tenant
                                    </label>
                                    <select
                                        id="invoice-tenant-filter"
                                        value={selectedTenant}
                                        onChange={(event) => setSelectedTenant(event.target.value)}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All tenants</option>
                                        {tenantOptions.map((tenant) => (
                                            <option key={tenant.id} value={tenant.id}>{tenant.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="invoice-search" className="mb-1 block text-sm font-medium text-slate-700">
                                        Search
                                    </label>
                                    <input
                                        id="invoice-search"
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search invoice, status"
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto p-5 pt-0">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">SL</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Invoice</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Flat</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tenant</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Total</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Due</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {paginatedInvoices.length > 0 ? (
                                        paginatedInvoices.map((inv, index) => (
                                            <tr key={inv.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-4 text-center text-sm font-medium text-slate-600">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-medium text-slate-900">
                                                    #{inv.id} — {formatMonthLabel(inv.month, inv.year)}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">{inv.tenant?.flat?.flat_no}</td>
                                                <td className="px-5 py-4 text-sm text-slate-600">{inv.tenant?.name}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">৳{inv.total_amount}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">৳{inv.due_amount}</td>
                                                <td className="px-5 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                            inv.status === 'paid'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : inv.status === 'partial'
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-rose-100 text-rose-700'
                                                        }`}
                                                    >
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a
                                                            href={route('invoices.receipt', inv.id)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="list-action list-action-view"
                                                        >
                                                            View
                                                        </a>
                                                        <Link
                                                            href={route('invoices.show', inv.id)}
                                                            className="list-action list-action-pay"
                                                        >
                                                            Pay
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-10 text-center text-sm text-slate-500">No invoices found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-500">
                                Showing {filteredInvoices.length === 0 ? 0 : startIndex + 1}–
                                {Math.min(startIndex + rowsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <span className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                                    {currentPage}/{totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
