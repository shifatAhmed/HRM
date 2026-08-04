import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create() {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing } = useForm({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const monthOptions = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const submit = (e) => {
        e.preventDefault();
        post(route('invoices.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Generate Invoice</h2>}
        >
            <Head title="Generate Invoice" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            {flash.success && (
                                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                                    {flash.success}
                                </div>
                            )}

                            {flash.warning && (
                                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                                    {flash.warning}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <p className="text-sm text-gray-600">
                                    Invoices will be generated for every occupied flat that currently has an active tenant.
                                </p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel value="Month" />
                                        <select
                                            value={data.month}
                                            onChange={(e) => setData('month', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {monthOptions.map((monthName, index) => (
                                                <option key={monthName} value={index + 1}>
                                                    {monthName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel value="Year" />
                                        <TextInput type="number" value={data.year} onChange={(e) => setData('year', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                </div>

                                <PrimaryButton type="submit" disabled={processing}>Generate Invoices</PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
