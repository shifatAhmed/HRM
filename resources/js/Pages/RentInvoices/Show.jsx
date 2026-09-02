import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Show({ invoice }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: invoice.id,
        amount: 0,
        payment_method: 'cash',
        payment_date: new Date().toISOString().slice(0, 10),
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Invoice #{invoice.id}</h2>}>
            <Head title={`Invoice #${invoice.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        {flash.success && (
                            <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                                {flash.success}
                            </div>
                        )}

                        <div className="mb-6">
                            <div className="text-sm text-gray-600">Tenant: {invoice.tenant?.name} — {invoice.tenant?.flat?.flat_no}</div>
                            <div className="text-lg font-semibold">Total: ৳{invoice.total_amount}</div>
                            <div className="text-sm">Paid: ৳{invoice.paid_amount} — Due: ৳{invoice.due_amount}</div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold">Payments</h3>
                            <ul className="mt-2 space-y-2">
                                {invoice.payments?.length > 0 ? (
                                    invoice.payments.map((p) => (
                                        <li key={p.id} className="text-sm text-gray-700">{p.payment_date}: ৳{p.amount} — {p.payment_method}</li>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">No payments yet.</div>
                                )}
                            </ul>
                        </div>

                        <div className="mb-4 flex gap-2">
                            <a
                                href={route('invoices.receipt', invoice.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
                            >
                                Print / Download PDF
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Record Payment</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <input type="hidden" name="invoice_id" value={data.invoice_id} />
                                <div>
                                    <InputLabel value="Amount" />
                                    <TextInput type="number" min="0.01" max={invoice.due_amount} step="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.amount} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Payment Method" />
                                    <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                                        <option value="cash">Cash</option>
                                        <option value="bkash">bKash</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Date" />
                                    <TextInput type="date" value={data.payment_date} onChange={(e) => setData('payment_date', e.target.value)} className="mt-1 block w-full" />
                                </div>
                                <PrimaryButton type="submit" disabled={processing}>Save Payment</PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
