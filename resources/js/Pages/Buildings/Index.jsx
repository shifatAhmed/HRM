import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const rowsPerPage = 10;

export default function Index({ buildings }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBuildings = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return buildings;
        }

        return buildings.filter((building) =>
            [building.name, building.address, building.created_at].join(' ').toLowerCase().includes(query),
        );
    }, [buildings, search]);

    const totalPages = Math.max(1, Math.ceil(filteredBuildings.length / rowsPerPage));

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedBuildings = filteredBuildings.slice(startIndex, startIndex + rowsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Buildings
                    </h2>
                    <Link
                        href={route('buildings.create')}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
                    >
                        Add Building
                    </Link>
                </div>
            }
        >
            <Head title="Buildings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Building directory</h3>
                                <p className="text-sm text-slate-500">View and manage all buildings.</p>
                            </div>
                            <div className="w-full md:max-w-sm">
                                <label htmlFor="building-search" className="mb-1 block text-sm font-medium text-slate-700">
                                    Search
                                </label>
                                <input
                                    id="building-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by name or address"
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
                                            Address
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Created
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {paginatedBuildings.length > 0 ? (
                                        paginatedBuildings.map((building, index) => (
                                            <tr key={building.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-4 text-center text-sm font-medium text-slate-600">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-medium text-slate-900">
                                                    {building.name}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {building.address || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {new Date(building.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('buildings.edit', building.id)}
                                                        className="list-action list-action-edit"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                                                No buildings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-500">
                                Showing {filteredBuildings.length === 0 ? 0 : startIndex + 1}–
                                {Math.min(startIndex + rowsPerPage, filteredBuildings.length)} of {filteredBuildings.length}
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
