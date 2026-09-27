import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const rowsPerPage = 10;

export default function Index({ flats }) {
    const { url } = usePage();
    const initialStatus = new URLSearchParams(url.split('?')[1] || '').get('status') || '';
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredFlats = useMemo(() => {
        return flats.filter((flat) => {
            const typeName = Number(flat.type) === 2 ? 'single room' : 'flat';
            const searchableText = [
                flat.flat_no,
                flat.building?.name,
                typeName,
                flat.floor,
                flat.size,
                flat.rent,
                flat.status,
                flat.electric_meter,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return (
                (!typeFilter || String(flat.type) === typeFilter) &&
                (!statusFilter || flat.status === statusFilter) &&
                (!search || searchableText.includes(search.toLowerCase()))
            );
        });
    }, [flats, typeFilter, statusFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filteredFlats.length / rowsPerPage));

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [typeFilter, statusFilter, search]);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedFlats = filteredFlats.slice(startIndex, startIndex + rowsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Flats
                    </h2>
                    <Link
                        href={route('flats.create')}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
                    >
                        Add Flat
                    </Link>
                </div>
            }
        >
            <Head title="Flats" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col items-stretch justify-between gap-4 border-b border-slate-200 p-6 md:flex-row md:items-end">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="w-full sm:w-52">
                                    <label htmlFor="type-filter" className="block text-sm font-medium text-slate-700">
                                        Filter by Type
                                    </label>
                                    <select
                                        id="type-filter"
                                        value={typeFilter}
                                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="1">Flat</option>
                                        <option value="2">Single Room</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-52">
                                    <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">
                                        Filter by Status
                                    </label>
                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full md:max-w-sm">
                                <label htmlFor="flat-search" className="block text-sm font-medium text-slate-700">
                                    Search Flats
                                </label>
                                <input
                                    id="flat-search"
                                    type="search"
                                    value={search}
                                    placeholder="Flat, room, building, type..."
                                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onChange={(e) => setSearch(e.target.value)}
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
                                            Flat
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Type
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Building
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
                                    {paginatedFlats.length > 0 ? (
                                        paginatedFlats.map((flat, index) => (
                                            <tr key={flat.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-4 text-center text-sm font-medium text-slate-600">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-medium text-slate-900">
                                                    {flat.flat_no}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {Number(flat.type) === 2 ? 'Single Room' : 'Flat'}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {flat.building?.name || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                                    ৳{flat.rent}
                                                </td>
                                                <td className="px-5 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                            flat.status === 'occupied'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}
                                                    >
                                                        {flat.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('flats.edit', flat.id)}
                                                        className="list-action list-action-edit"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-sm text-slate-500">
                                                {typeFilter || statusFilter || search ? 'No flats match your filters.' : 'No flats added yet.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-500">
                                Showing {filteredFlats.length === 0 ? 0 : startIndex + 1}–
                                {Math.min(startIndex + rowsPerPage, filteredFlats.length)} of {filteredFlats.length}
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
