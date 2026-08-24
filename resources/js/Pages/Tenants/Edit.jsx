import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlatSearchSelect from '@/Components/FlatSearchSelect';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect, useState } from 'react';

/*
|--------------------------------------------------------------------------
| Family Member Helper
|--------------------------------------------------------------------------
*/
const createFamilyMember = (member = null) => {
    let existingPhotos = [];

    // Handle array
    if (Array.isArray(member?.member_photos)) {
        existingPhotos = member.member_photos;
    }
    // Handle JSON string
    else if (typeof member?.member_photos === 'string') {
        try {
            const parsed = JSON.parse(member.member_photos);
            existingPhotos = Array.isArray(parsed) ? parsed : [];
        } catch {
            existingPhotos = [];
        }
    }

    return {
        id: member?.id ?? null,
        member_name: member?.member_name ?? '',
        member_photos: [],
        existing_photos: existingPhotos.map((photo) => {
            // If already a full URL, don't add /storage/
            if (
                typeof photo === 'string' &&
                (photo.startsWith('http://') ||
                    photo.startsWith('https://') ||
                    photo.startsWith('/storage/'))
            ) {
                return photo;
            }

            return `/storage/${photo}`;
        }),
    };
};

export default function Edit({ tenant, flats }) {
    /*
    |--------------------------------------------------------------------------
    | Normalize Family Members
    |--------------------------------------------------------------------------
    |
    | Laravel may send the relationship as:
    | tenant.familyMembers
    | OR
    | tenant.family_members
    |
    | Support both.
    |
    */

    const rawFamilyMembers =
        tenant?.familyMembers ??
        tenant?.family_members ??
        [];

    console.log('Tenant:', tenant);
    console.log('Raw family members:', rawFamilyMembers);

    let normalizedFamilyMembers = [];

    if (Array.isArray(rawFamilyMembers)) {
        normalizedFamilyMembers = rawFamilyMembers.filter(
            (member) => member && typeof member === 'object'
        );
    } else if (
        rawFamilyMembers &&
        typeof rawFamilyMembers === 'object'
    ) {
        normalizedFamilyMembers = Object.values(rawFamilyMembers).filter(
            (member) => member && typeof member === 'object'
        );
    }

    console.log(
        'Normalized family members:',
        normalizedFamilyMembers
    );

    /*
    |--------------------------------------------------------------------------
    | Initial Family Members
    |--------------------------------------------------------------------------
    */

    const initialFamilyMembers =
        normalizedFamilyMembers.length > 0
            ? normalizedFamilyMembers.map((member) =>
                  createFamilyMember(member)
              )
            : [createFamilyMember()];

    console.log(
        'Initial family members for form:',
        initialFamilyMembers
    );

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | useForm() must come BEFORE any useEffect that accesses `data`.
    |
    */

    const {
        data,
        setData,
        patch,
        processing,
        errors,
    } = useForm({
        flat_id: tenant?.flat_id ?? '',
        name: tenant?.name ?? '',
        phone: tenant?.phone ?? '',
        nid: tenant?.nid ?? '',
        nid_photo: [],
        profession: tenant?.profession ?? '',

        family_members: initialFamilyMembers.length,
        family_members_details: initialFamilyMembers,

        advance_amount: tenant?.advance_amount ?? 0,
        monthly_rent: tenant?.monthly_rent ?? 0,
        move_in_date: tenant?.move_in_date ?? '',
        status: tenant?.status ?? 'active',
        move_out_date: tenant?.move_out_date ?? '',
        emergency_contact: tenant?.emergency_contact ?? '',
        note: tenant?.note ?? '',
    });

    /*
    |--------------------------------------------------------------------------
    | Existing NID Photos
    |--------------------------------------------------------------------------
    */

    const existingPreviewUrls = Array.isArray(tenant?.nid_photo)
        ? tenant.nid_photo.map((photoPath) => {
              if (
                  typeof photoPath === 'string' &&
                  (photoPath.startsWith('http://') ||
                      photoPath.startsWith('https://') ||
                      photoPath.startsWith('/storage/'))
              ) {
                  return photoPath;
              }

              return `/storage/${photoPath}`;
          })
        : [];

    const [previewUrls, setPreviewUrls] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Debug Form Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        console.log(
            'Form family members:',
            data.family_members_details
        );
    }, [data.family_members_details]);

    /*
    |--------------------------------------------------------------------------
    | Sync Family Members
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setData(
            'family_members_details',
            initialFamilyMembers
        );

        setData(
            'family_members',
            initialFamilyMembers.length
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tenant?.id]);

    /*
    |--------------------------------------------------------------------------
    | Update Monthly Rent When Flat Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const selectedFlat = flats?.find(
            (flat) =>
                Number(flat.id) === Number(data.flat_id)
        );

        if (selectedFlat) {
            setData(
                'monthly_rent',
                selectedFlat.rent ?? 0
            );
        }
    }, [data.flat_id, flats]);

    /*
    |--------------------------------------------------------------------------
    | Cleanup Preview URLs
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) =>
                URL.revokeObjectURL(url)
            );
        };
    }, [previewUrls]);

    /*
    |--------------------------------------------------------------------------
    | Family Member Functions
    |--------------------------------------------------------------------------
    */

    const updateFamilyMembers = (nextMembers) => {
        setData(
            'family_members_details',
            nextMembers
        );

        setData(
            'family_members',
            nextMembers.length
        );
    };

    const addFamilyMember = () => {
        const currentMembers =
            data.family_members_details || [];

        updateFamilyMembers([
            ...currentMembers,
            createFamilyMember(),
        ]);
    };

    const removeFamilyMember = (index) => {
        const currentMembers =
            data.family_members_details || [];

        const nextMembers = currentMembers.filter(
            (_, memberIndex) =>
                memberIndex !== index
        );

        updateFamilyMembers(
            nextMembers.length > 0
                ? nextMembers
                : [createFamilyMember()]
        );
    };

    const updateFamilyMember = (
        index,
        field,
        value
    ) => {
        const currentMembers =
            data.family_members_details || [];

        const nextMembers = currentMembers.map(
            (member, memberIndex) =>
                memberIndex === index
                    ? {
                          ...member,
                          [field]: value,
                      }
                    : member
        );

        updateFamilyMembers(nextMembers);
    };

    const handleMemberPhotoChange = (
        index,
        files
    ) => {
        updateFamilyMember(
            index,
            'member_photos',
            Array.from(files || [])
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append(
            'flat_id',
            data.flat_id
        );

        formData.append(
            'name',
            data.name
        );

        formData.append(
            'phone',
            data.phone || ''
        );

        formData.append(
            'nid',
            data.nid || ''
        );

        formData.append(
            'profession',
            data.profession || ''
        );

        formData.append(
            'family_members',
            String(
                data.family_members_details?.length ?? 0
            )
        );

        formData.append(
            'advance_amount',
            data.advance_amount ?? 0
        );

        formData.append(
            'monthly_rent',
            data.monthly_rent ?? 0
        );

        formData.append(
            'move_in_date',
            data.move_in_date || ''
        );

        formData.append(
            'status',
            data.status || 'active'
        );

        formData.append(
            'move_out_date',
            data.move_out_date || ''
        );

        formData.append(
            'emergency_contact',
            data.emergency_contact || ''
        );

        formData.append(
            'note',
            data.note || ''
        );

        /*
        |--------------------------------------------------------------------------
        | Tenant NID Photos
        |--------------------------------------------------------------------------
        */

        if (Array.isArray(data.nid_photo)) {
            data.nid_photo.forEach((file) => {
                if (file instanceof File) {
                    formData.append(
                        'nid_photo[]',
                        file
                    );
                }
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Family Members
        |--------------------------------------------------------------------------
        */

        (
            data.family_members_details || []
        ).forEach((member, index) => {
            if (member.id) {
                formData.append(
                    `family_members_details[${index}][id]`,
                    String(member.id)
                );
            }

            formData.append(
                `family_members_details[${index}][member_name]`,
                member.member_name || ''
            );

            (
                member.member_photos || []
            ).forEach((file) => {
                if (file instanceof File) {
                    formData.append(
                        `family_members_details[${index}][member_photos][]`,
                        file
                    );
                }
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Update Tenant
        |--------------------------------------------------------------------------
        */

        patch(
            route(
                'tenants.update',
                tenant.id
            ),
            formData,
            {
                forceFormData: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

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
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form
                                onSubmit={submit}
                                className="space-y-6"
                            >
                                {/* Flat */}
                                <div>
                                    <InputLabel
                                        htmlFor="flat_id"
                                        value="Assign Flat"
                                    />

                                    <FlatSearchSelect
                                        flats={flats || []}
                                        value={data.flat_id}
                                        onChange={(value) => setData('flat_id', value)}
                                    />

                                    <InputError
                                        message={
                                            errors.flat_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Tenant Name */}
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Tenant Name"
                                    />

                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.name
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Phone + NID */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Phone"
                                        />

                                        <TextInput
                                            id="phone"
                                            name="phone"
                                            value={
                                                data.phone
                                            }
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'phone',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                errors.phone
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="nid"
                                            value="NID Number"
                                        />

                                        <TextInput
                                            id="nid"
                                            name="nid"
                                            value={
                                                data.nid
                                            }
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'nid',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                errors.nid
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* NID Photos */}
                                <div>
                                    <InputLabel
                                        htmlFor="nid_photo"
                                        value="NID Photos (Front & Back)"
                                    />

                                    <input
                                        id="nid_photo"
                                        name="nid_photo"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                                        onChange={(e) => {
                                            const selectedFiles =
                                                Array.from(
                                                    e.target
                                                        .files ||
                                                        []
                                                );

                                            setData(
                                                'nid_photo',
                                                selectedFiles
                                            );

                                            const nextPreviewUrls =
                                                selectedFiles.map(
                                                    (
                                                        file
                                                    ) =>
                                                        URL.createObjectURL(
                                                            file
                                                        )
                                                );

                                            setPreviewUrls(
                                                (
                                                    current
                                                ) => {
                                                    current.forEach(
                                                        (
                                                            url
                                                        ) =>
                                                            URL.revokeObjectURL(
                                                                url
                                                            )
                                                    );

                                                    return nextPreviewUrls;
                                                }
                                            );
                                        }}
                                    />

                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload both sides
                                        of the NID
                                        (front and back).
                                    </p>

                                    {/* Existing NID */}
                                    {existingPreviewUrls.length >
                                        0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {existingPreviewUrls.map(
                                                (
                                                    url,
                                                    index
                                                ) => (
                                                    <img
                                                        key={`stored-${url}-${index}`}
                                                        src={
                                                            url
                                                        }
                                                        alt={`Stored NID preview ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="h-24 w-full rounded-md border border-gray-200 object-cover"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}

                                    {/* New NID */}
                                    {previewUrls.length >
                                        0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {previewUrls.map(
                                                (
                                                    url,
                                                    index
                                                ) => (
                                                    <img
                                                        key={`${url}-${index}`}
                                                        src={
                                                            url
                                                        }
                                                        alt={`Selected NID preview ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="h-24 w-full rounded-md border border-gray-200 object-cover"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}

                                    <InputError
                                        message={
                                            errors.nid_photo
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Profession */}
                                <div>
                                    <InputLabel
                                        htmlFor="profession"
                                        value="Profession"
                                    />

                                    <TextInput
                                        id="profession"
                                        name="profession"
                                        value={
                                            data.profession
                                        }
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                'profession',
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.profession
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Family Members */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <h3 className="text-lg font-medium text-gray-800">
                                            Family Members
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={
                                                addFamilyMember
                                            }
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                                        >
                                            + Add Family Member
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-separate border-spacing-y-2">
                                            <thead>
                                                <tr>
                                                    <th className="px-2 pb-2 text-left text-sm font-medium text-gray-600">
                                                        Member
                                                        Name
                                                    </th>

                                                    <th className="px-2 pb-2 text-left text-sm font-medium text-gray-600">
                                                        NID
                                                        Photos
                                                    </th>

                                                    <th className="px-2 pb-2 text-left text-sm font-medium text-gray-600">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {(
                                                    data.family_members_details ||
                                                    []
                                                ).map(
                                                    (
                                                        member,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={`family-member-${
                                                                member.id ??
                                                                index
                                                            }-${index}`}
                                                            className="align-top"
                                                        >
                                                            {/* Name */}
                                                            <td className="rounded-l-md border border-gray-200 bg-white px-2 py-2">
                                                                <TextInput
                                                                    value={
                                                                        member.member_name ||
                                                                        ''
                                                                    }
                                                                    className="block w-full"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateFamilyMember(
                                                                            index,
                                                                            'member_name',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Enter member name"
                                                                />
                                                            </td>

                                                            {/* Photos */}
                                                            <td className="border border-gray-200 bg-white px-2 py-2">
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept="image/*"
                                                                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberPhotoChange(
                                                                            index,
                                                                            e
                                                                                .target
                                                                                .files
                                                                        )
                                                                    }
                                                                />

                                                                {/* Existing photos */}
                                                                {(
                                                                    member.existing_photos ||
                                                                    []
                                                                ).length >
                                                                    0 && (
                                                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                                                        {(
                                                                            member.existing_photos ||
                                                                            []
                                                                        ).map(
                                                                            (
                                                                                url,
                                                                                photoIndex
                                                                            ) => (
                                                                                <img
                                                                                    key={`${member.id || index}-existing-${photoIndex}`}
                                                                                    src={
                                                                                        url
                                                                                    }
                                                                                    alt={`Existing family member photo ${
                                                                                        photoIndex +
                                                                                        1
                                                                                    }`}
                                                                                    className="h-16 w-full rounded-md border border-gray-200 object-cover"
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Newly selected photos */}
                                                                {(
                                                                    member.member_photos ||
                                                                    []
                                                                ).length >
                                                                    0 && (
                                                                    <div className="mt-2 text-xs text-gray-600">
                                                                        {member.member_photos.map(
                                                                            (
                                                                                file,
                                                                                fileIndex
                                                                            ) => (
                                                                                <div
                                                                                    key={`${file.name}-${fileIndex}`}
                                                                                >
                                                                                    {
                                                                                        file.name
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>

                                                            {/* Remove */}
                                                            <td className="rounded-r-md border border-gray-200 bg-white px-2 py-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeFamilyMember(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <InputError
                                        message={
                                            errors.family_members_details
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Advance + Rent */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel
                                            htmlFor="advance_amount"
                                            value="Advance Amount"
                                        />

                                        <TextInput
                                            id="advance_amount"
                                            name="advance_amount"
                                            type="number"
                                            value={
                                                data.advance_amount
                                            }
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'advance_amount',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                errors.advance_amount
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="monthly_rent"
                                            value="Monthly Rent"
                                        />

                                        <TextInput
                                            id="monthly_rent"
                                            name="monthly_rent"
                                            type="number"
                                            value={
                                                data.monthly_rent
                                            }
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'monthly_rent',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                errors.monthly_rent
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Move In + Status */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel
                                            htmlFor="move_in_date"
                                            value="Move-in Date"
                                        />

                                        <TextInput
                                            id="move_in_date"
                                            name="move_in_date"
                                            type="date"
                                            value={
                                                data.move_in_date
                                            }
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'move_in_date',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                errors.move_in_date
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="status"
                                            value="Status"
                                        />

                                        <select
                                            id="status"
                                            name="status"
                                            value={
                                                data.status
                                            }
                                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="moved_out">
                                                Moved Out
                                            </option>
                                        </select>

                                        <InputError
                                            message={
                                                errors.status
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Move Out */}
                                <div>
                                    <InputLabel
                                        htmlFor="move_out_date"
                                        value="Move-out Date"
                                    />

                                    <TextInput
                                        id="move_out_date"
                                        name="move_out_date"
                                        type="date"
                                        value={
                                            data.move_out_date
                                        }
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                'move_out_date',
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.move_out_date
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Emergency Contact */}
                                <div>
                                    <InputLabel
                                        htmlFor="emergency_contact"
                                        value="Emergency Contact"
                                    />

                                    <TextInput
                                        id="emergency_contact"
                                        name="emergency_contact"
                                        value={
                                            data.emergency_contact
                                        }
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                'emergency_contact',
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.emergency_contact
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Note */}
                                <div>
                                    <InputLabel
                                        htmlFor="note"
                                        value="Note"
                                    />

                                    <textarea
                                        id="note"
                                        name="note"
                                        value={
                                            data.note
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) =>
                                            setData(
                                                'note',
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.note
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit */}
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Tenant'}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}