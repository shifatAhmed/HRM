import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const rowsPerPage = 10;

export default function Index({ tenants }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTenants = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return tenants;
        }

        return tenants.filter((tenant) =>
            [tenant.name, tenant.flat?.flat_no, tenant.phone, tenant.status, tenant.monthly_rent].join(' ').toLowerCase().includes(query),
        );
    }, [tenants, search]);

    const totalPages = Math.max(1, Math.ceil(filteredTenants.length / rowsPerPage));

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedTenants = filteredTenants.slice(startIndex, startIndex + rowsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tenants
                    </h2>
                    <Link
                        href={route('tenants.create')}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
                    >
                        Add Tenant
                    </Link>
                </div>
            }
        >
            <Head title="Tenants" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Tenant list</h3>
                                <p className="text-sm text-slate-500">Track active tenants and their rental details.</p>
                            </div>
                            <div className="w-full md:max-w-sm">
                                <label htmlFor="tenant-search" className="mb-1 block text-sm font-medium text-slate-700">
                                    Search
                                </label>
                                <input
                                    id="tenant-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by name, phone, flat"
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto p-5 pt-0">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            SL
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Name
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Flat
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Phone
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Rent
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {paginatedTenants.length > 0 ? (
                                        paginatedTenants.map((tenant, index) => (
                                            <tr key={tenant.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-4 text-center text-sm font-medium text-slate-600">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-medium text-slate-900">
                                                    {tenant.name}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {tenant.flat?.flat_no || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {tenant.phone || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                                    ৳{tenant.monthly_rent}
                                                </td>
                                                <td className="px-5 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                            tenant.status === 'active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}
                                                    >
                                                        {tenant.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('tenants.show', tenant.id)}
                                                            className="list-action list-action-view"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('tenants.edit', tenant.id)}
                                                            className="list-action list-action-edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-sm text-slate-500">
                                                No tenants found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-500">
                                Showing {filteredTenants.length === 0 ? 0 : startIndex + 1}–
                                {Math.min(startIndex + rowsPerPage, filteredTenants.length)} of {filteredTenants.length}
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
