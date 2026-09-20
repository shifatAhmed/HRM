import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ flats }) {
    const { url } = usePage();
    const initialStatus = new URLSearchParams(url.split('?')[1] || '').get('status') || '';
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [search, setSearch] = useState('');
    const filteredFlats = flats.filter((flat) => {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Flats
                    </h2>
                    <Link
                        href={route('flats.create')}
                        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                        Add Flat
                    </Link>
                </div>
            }
        >
            <Head title="Flats" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col items-stretch justify-between gap-4 border-b border-gray-200 p-6 md:flex-row md:items-end">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="w-full sm:w-52">
                                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                                        Filter by Type
                                    </label>
                                    <select
                                        id="type-filter"
                                        value={typeFilter}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="1">Flat</option>
                                        <option value="2">Single Room</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-52">
                                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                                        Filter by Status
                                    </label>
                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full md:max-w-sm">
                                <label htmlFor="flat-search" className="block text-sm font-medium text-gray-700">
                                    Search Flats
                                </label>
                                <input
                                    id="flat-search"
                                    type="search"
                                    value={search}
                                    placeholder="Flat/room, building, type..."
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto p-6 pt-0">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Flat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Building
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Rent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredFlats.length > 0 ? (
                                        filteredFlats.map((flat) => (
                                            <tr key={flat.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {flat.flat_no}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {Number(flat.type) === 2 ? 'Single Room' : 'Flat'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {flat.building?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ৳{flat.rent}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {flat.status}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('flats.edit', flat.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                {typeFilter || search ? 'No flats match your filters.' : 'No flats added yet.'}
                                            </td>
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
