import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ buildings }) {
    const { data, setData, post, processing, errors } = useForm({
        building_id: buildings[0]?.id || '',
        flat_no: '',
        floor: '',
        size: '',
        rent: 0,
        gas_bill: 0,
        water_bill: 0,
        service_charge: 0,
        electric_meter: '',
        status: 'vacant',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('flats.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Flat
                </h2>
            }
        >
            <Head title="Add Flat" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="building_id" value="Building" />
                                    <select
                                        id="building_id"
                                        name="building_id"
                                        value={data.building_id}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('building_id', e.target.value)}
                                    >
                                        {buildings.map((building) => (
                                            <option key={building.id} value={building.id}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.building_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="flat_no" value="Flat / Room No" />
                                    <TextInput
                                        id="flat_no"
                                        name="flat_no"
                                        value={data.flat_no}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('flat_no', e.target.value)}
                                    />
                                    <InputError message={errors.flat_no} className="mt-2" />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="floor" value="Floor" />
                                        <TextInput
                                            id="floor"
                                            name="floor"
                                            value={data.floor}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('floor', e.target.value)}
                                        />
                                        <InputError message={errors.floor} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="size" value="Size" />
                                        <TextInput
                                            id="size"
                                            name="size"
                                            value={data.size}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('size', e.target.value)}
                                        />
                                        <InputError message={errors.size} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="rent" value="Rent Amount" />
                                        <TextInput
                                            id="rent"
                                            name="rent"
                                            type="number"
                                            value={data.rent}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('rent', e.target.value)}
                                        />
                                        <InputError message={errors.rent} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="service_charge" value="Service Charge" />
                                        <TextInput
                                            id="service_charge"
                                            name="service_charge"
                                            type="number"
                                            value={data.service_charge}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('service_charge', e.target.value)}
                                        />
                                        <InputError message={errors.service_charge} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="gas_bill" value="Gas Bill" />
                                        <TextInput
                                            id="gas_bill"
                                            name="gas_bill"
                                            type="number"
                                            value={data.gas_bill}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('gas_bill', e.target.value)}
                                        />
                                        <InputError message={errors.gas_bill} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="water_bill" value="Water Bill" />
                                        <TextInput
                                            id="water_bill"
                                            name="water_bill"
                                            type="number"
                                            value={data.water_bill}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('water_bill', e.target.value)}
                                        />
                                        <InputError message={errors.water_bill} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="electric_meter" value="Electric Meter No" />
                                    <TextInput
                                        id="electric_meter"
                                        name="electric_meter"
                                        value={data.electric_meter}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('electric_meter', e.target.value)}
                                    />
                                    <InputError message={errors.electric_meter} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="notes" value="Notes" />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <PrimaryButton type="submit" disabled={processing}>
                                    Save Flat
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
