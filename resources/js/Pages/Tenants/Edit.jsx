import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect, useState } from 'react';

export default function Edit({ tenant, flats }) {
    const { data, setData, patch, processing, errors } = useForm({
        flat_id: tenant.flat_id,
        name: tenant.name,
        phone: tenant.phone || '',
        nid: tenant.nid || '',
        nid_photo: [],
        profession: tenant.profession || '',
        family_members: tenant.family_members || 0,
        advance_amount: tenant.advance_amount,
        monthly_rent: tenant.monthly_rent,
        move_in_date: tenant.move_in_date || '',
        status: tenant.status,
        move_out_date: tenant.move_out_date || '',
        emergency_contact: tenant.emergency_contact || '',
        note: tenant.note || '',
    });
    const existingPreviewUrls = Array.isArray(tenant.nid_photo)
        ? tenant.nid_photo.map((photoPath) => `/storage/${photoPath}`)
        : [];
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        const selectedFlat = flats.find((flat) => Number(flat.id) === Number(data.flat_id));

        if (selectedFlat) {
            setData('monthly_rent', selectedFlat.rent ?? 0);
        }
    }, [data.flat_id, flats]);

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('flat_id', data.flat_id);
        formData.append('name', data.name);
        formData.append('phone', data.phone || '');
        formData.append('nid', data.nid || '');
        formData.append('profession', data.profession || '');
        formData.append('family_members', data.family_members ?? 0);
        formData.append('advance_amount', data.advance_amount ?? 0);
        formData.append('monthly_rent', data.monthly_rent ?? 0);
        formData.append('move_in_date', data.move_in_date || '');
        formData.append('status', data.status || 'active');
        formData.append('move_out_date', data.move_out_date || '');
        formData.append('emergency_contact', data.emergency_contact || '');
        formData.append('note', data.note || '');

        if (Array.isArray(data.nid_photo)) {
            data.nid_photo.forEach((file) => {
                if (file instanceof File) {
                    formData.append('nid_photo[]', file);
                }
            });
        }

        patch(route('tenants.update', tenant.id), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Tenant
                </h2>
            }
        >
            <Head title="Edit Tenant" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="flat_id" value="Assign Flat" />
                                    <select
                                        id="flat_id"
                                        name="flat_id"
                                        value={data.flat_id}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => {
                                            setData('flat_id', e.target.value);
                                        }}
                                    >
                                        {flats.map((flat) => (
                                            <option key={flat.id} value={flat.id}>
                                                {flat.flat_no} — {flat.building?.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.flat_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Tenant Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone" />
                                        <TextInput
                                            id="phone"
                                            name="phone"
                                            value={data.phone}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="nid" value="NID Number" />
                                        <TextInput
                                            id="nid"
                                            name="nid"
                                            value={data.nid}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('nid', e.target.value)}
                                        />
                                        <InputError message={errors.nid} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="nid_photo" value="NID Photos (Front & Back)" />
                                    <input
                                        id="nid_photo"
                                        name="nid_photo"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => {
                                            const selectedFiles = Array.from(e.target.files || []);
                                            setData('nid_photo', selectedFiles);

                                            const nextPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
                                            setPreviewUrls((currentPreviewUrls) => {
                                                currentPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
                                                return nextPreviewUrls;
                                            });
                                        }}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Upload both sides of the NID (front and back).</p>
                                    {existingPreviewUrls.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {existingPreviewUrls.map((url, index) => (
                                                <img
                                                    key={`stored-${url}-${index}`}
                                                    src={url}
                                                    alt={`Stored NID preview ${index + 1}`}
                                                    className="h-24 w-full rounded-md border border-gray-200 object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {previewUrls.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {previewUrls.map((url, index) => (
                                                <img
                                                    key={`${url}-${index}`}
                                                    src={url}
                                                    alt={`Selected NID preview ${index + 1}`}
                                                    className="h-24 w-full rounded-md border border-gray-200 object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.nid_photo} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="profession" value="Profession" />
                                    <TextInput
                                        id="profession"
                                        name="profession"
                                        value={data.profession}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('profession', e.target.value)}
                                    />
                                    <InputError message={errors.profession} className="mt-2" />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="family_members" value="Family Members" />
                                        <TextInput
                                            id="family_members"
                                            name="family_members"
                                            type="number"
                                            value={data.family_members}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('family_members', e.target.value)}
                                        />
                                        <InputError message={errors.family_members} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="advance_amount" value="Advance Amount" />
                                        <TextInput
                                            id="advance_amount"
                                            name="advance_amount"
                                            type="number"
                                            value={data.advance_amount}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('advance_amount', e.target.value)}
                                        />
                                        <InputError message={errors.advance_amount} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="monthly_rent" value="Monthly Rent" />
                                        <TextInput
                                            id="monthly_rent"
                                            name="monthly_rent"
                                            type="number"
                                            value={data.monthly_rent}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('monthly_rent', e.target.value)}
                                        />
                                        <InputError message={errors.monthly_rent} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="move_in_date" value="Move-in Date" />
                                        <TextInput
                                            id="move_in_date"
                                            name="move_in_date"
                                            type="date"
                                            value={data.move_in_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('move_in_date', e.target.value)}
                                        />
                                        <InputError message={errors.move_in_date} className="mt-2" />
                                    </div>
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
                                        <option value="active">Active</option>
                                        <option value="moved_out">Moved Out</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="move_out_date" value="Move-out Date" />
                                    <TextInput
                                        id="move_out_date"
                                        name="move_out_date"
                                        type="date"
                                        value={data.move_out_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('move_out_date', e.target.value)}
                                    />
                                    <InputError message={errors.move_out_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="emergency_contact" value="Emergency Contact" />
                                    <TextInput
                                        id="emergency_contact"
                                        name="emergency_contact"
                                        value={data.emergency_contact}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('emergency_contact', e.target.value)}
                                    />
                                    <InputError message={errors.emergency_contact} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="note" value="Note" />
                                    <textarea
                                        id="note"
                                        name="note"
                                        value={data.note}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('note', e.target.value)}
                                    />
                                    <InputError message={errors.note} className="mt-2" />
                                </div>

                                <PrimaryButton type="submit" disabled={processing}>
                                    Update Tenant
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
