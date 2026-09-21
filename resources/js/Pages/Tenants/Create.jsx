import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlatSearchSelect from '@/Components/FlatSearchSelect';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import { useEffect, useState } from 'react';

const createFamilyMember = () => ({
    id: null,
    member_name: '',
    member_photos: [],
});

const getErrorMessage = (messages) => {
    if (Array.isArray(messages)) {
        return messages
            .flatMap((message) => (Array.isArray(message) ? message : [message]))
            .filter(Boolean)
            .join(' ');
    }

    if (typeof messages === 'string') {
        return messages;
    }

    return '';
};

const collectErrorMessages = (errorBag = {}) => {
    const messages = [];

    const walk = (value) => {
        if (Array.isArray(value)) {
            value.forEach((item) => walk(item));
            return;
        }

        if (typeof value === 'object' && value !== null) {
            Object.values(value).forEach((item) => walk(item));
            return;
        }

        if (typeof value === 'string' && value.trim() !== '') {
            messages.push(value);
        }
    };

    walk(errorBag);

    return messages;
};

export default function Create({ flats }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        flat_id: flats[0]?.id || '',
        name: '',
        phone: '',
        nid: '',
        date_of_birth: '',
        nid_photo: [],
        profession: '',
        family_members: 1,
        family_members_details: [createFamilyMember()],
        advance_amount: 0,
        monthly_rent: flats[0]?.rent ?? 0,
        move_in_date: '',
        emergency_contact: '',
        note: '',
    });
    const [previewUrls, setPreviewUrls] = useState([]);
    const [scanningNid, setScanningNid] = useState(false);
    const [nidScanError, setNidScanError] = useState('');

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

    const updateFamilyMembers = (nextMembers) => {
        setData('family_members_details', nextMembers);
        setData('family_members', nextMembers.length);
    };

    const addFamilyMember = () => {
        updateFamilyMembers([...(data.family_members_details || []), createFamilyMember()]);
    };

    const removeFamilyMember = (index) => {
        const nextMembers = (data.family_members_details || []).filter((_, memberIndex) => memberIndex !== index);
        updateFamilyMembers(nextMembers.length > 0 ? nextMembers : [createFamilyMember()]);
    };

    const updateFamilyMember = (index, field, value) => {
        const nextMembers = (data.family_members_details || []).map((member, memberIndex) => (
            memberIndex === index ? { ...member, [field]: value } : member
        ));
        updateFamilyMembers(nextMembers);
    };

    const handleMemberPhotoChange = (index, files) => {
        updateFamilyMember(index, 'member_photos', Array.from(files || []));
    };

    const scanNid = async () => {
        const image = data.nid_photo?.[0];

        if (!(image instanceof File)) {
            setNidScanError('Select a NID image first.');
            return;
        }

        setScanningNid(true);
        setNidScanError('');

        const formData = new FormData();
        formData.append('nid_image', image);

        try {
            const response = await axios.post(route('tenants.scan-nid'), formData);
            const extracted = response.data.data || {};

            setData((currentData) => ({
                ...currentData,
                name: extracted.name || currentData.name,
                date_of_birth: extracted.date_of_birth || currentData.date_of_birth,
                nid: extracted.nid || currentData.nid,
            }));
        } catch (error) {
            setNidScanError(
                error.response?.data?.message ||
                    'The NID could not be read. Please try a clearer image.',
            );
        } finally {
            setScanningNid(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('flat_id', data.flat_id);
        formData.append('name', data.name);
        formData.append('phone', data.phone || '');
        formData.append('nid', data.nid || '');
        formData.append('date_of_birth', data.date_of_birth || '');
        formData.append('profession', data.profession || '');
        formData.append('family_members', String(data.family_members_details?.length ?? 0));
        formData.append('advance_amount', data.advance_amount ?? 0);
        formData.append('monthly_rent', data.monthly_rent ?? 0);
        formData.append('move_in_date', data.move_in_date || '');
        formData.append('emergency_contact', data.emergency_contact || '');
        formData.append('note', data.note || '');

        if (Array.isArray(data.nid_photo)) {
            data.nid_photo.forEach((file) => {
                if (file instanceof File) {
                    formData.append('nid_photo[]', file);
                }
            });
        }

        (data.family_members_details || []).forEach((member, index) => {
            if (member.id) {
                formData.append(`family_members_details[${index}][id]`, String(member.id));
            }

            formData.append(`family_members_details[${index}][member_name]`, member.member_name || '');

            (member.member_photos || []).forEach((file) => {
                if (file instanceof File) {
                    formData.append(`family_members_details[${index}][member_photos][]`, file);
                }
            });
        });

        post(route('tenants.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onError: (validationErrors) => {
                const summary = collectErrorMessages(validationErrors);
                if (summary.length > 0) {
                    return summary;
                }
                return null;
            },
        });
    };

    const errorSummary = collectErrorMessages(errors);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Tenant
                </h2>
            }
        >
            <Head title="Add Tenant" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {flash.success && (
                                <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                                    {flash.success}
                                </div>
                            )}

                            {errorSummary.length > 0 && (
                                <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    <ul className="list-disc space-y-1 pl-5">
                                        {errorSummary.map((message, index) => (
                                            <li key={`${message}-${index}`}>{message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="flat_id" value="Assign Flat/Room" />
                                    <FlatSearchSelect
                                        flats={flats}
                                        value={data.flat_id}
                                        onChange={(value) => setData('flat_id', value)}
                                    />
                                    <InputError message={errors.flat_id} className="mt-2" />
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
                                            setNidScanError('');

                                            const nextPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
                                            setPreviewUrls((currentPreviewUrls) => {
                                                currentPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
                                                return nextPreviewUrls;
                                            });
                                        }}
                                    />
                                    <div className="mt-2 flex flex-wrap items-center gap-3">
                                        <p className="text-sm text-gray-500">Upload both sides of the NID (front and back).</p>
                                        <button
                                            type="button"
                                            onClick={scanNid}
                                            disabled={scanningNid || !(data.nid_photo?.[0] instanceof File)}
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {scanningNid ? 'Reading NID...' : 'Read NID with AI'}
                                        </button>
                                    </div>
                                    {nidScanError && (
                                        <p className="mt-2 text-sm text-red-600">{nidScanError}</p>
                                    )}
                                    {previewUrls.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {previewUrls.map((url, index) => (
                                                <img
                                                    key={`${url}-${index}`}
                                                    src={url}
                                                    alt={`NID preview ${index + 1}`}
                                                    className="h-24 w-full rounded-md border border-gray-200 object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={getErrorMessage(errors.nid_photo)} className="mt-2" />
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
                                    <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                                    <TextInput
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                    />
                                    <InputError message={errors.date_of_birth} className="mt-2" />
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

                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <h3 className="text-lg font-medium text-gray-800">Family Members</h3>
                                        <button
                                            type="button"
                                            onClick={addFamilyMember}
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                                        >
                                            + Add Family Member
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-separate border-spacing-y-2">
                                            <thead>
                                                <tr>
                                                    <th className="px-2 pb-2 text-left text-sm font-medium text-gray-600">Member Name</th>
                                                    <th className="px-2 pb-2 text-left text-sm font-medium text-gray-600">NID Photos</th>
                                                    <th className="px-2 pb-2 text-left text-sm font-medium text-gray-600">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.family_members_details || []).map((member, index) => (
                                                    <tr key={`family-member-${index}`} className="align-top">
                                                        <td className="rounded-l-md border border-gray-200 bg-white px-2 py-2">
                                                            <TextInput
                                                                value={member.member_name}
                                                                className="block w-full"
                                                                onChange={(e) => updateFamilyMember(index, 'member_name', e.target.value)}
                                                                placeholder="Enter member name"
                                                            />
                                                        </td>
                                                        <td className="border border-gray-200 bg-white px-2 py-2">
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                onChange={(e) => handleMemberPhotoChange(index, e.target.files)}
                                                            />
                                                            {member.member_photos?.length > 0 && (
                                                                <div className="mt-2 text-xs text-gray-600">
                                                                    {member.member_photos.map((file, fileIndex) => (
                                                                        <div key={`${file.name}-${fileIndex}`}>{file.name}</div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="rounded-r-md border border-gray-200 bg-white px-2 py-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFamilyMember(index)}
                                                                className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <InputError message={getErrorMessage(errors.family_members_details)} className="mt-2" />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
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
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
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
                                    Save Tenant
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
