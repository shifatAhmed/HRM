import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ tenant }) {
    if (!tenant) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tenant Details
                    </h2>
                }
            >
                <Head title="Tenant Details" />

                <div className="py-12">
                    <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white p-6 text-center text-gray-500">
                            No tenant data available
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Family Members
    |--------------------------------------------------------------------------
    |
    | Laravel may send the relationship as:
    |
    | tenant.family_members
    |
    | while some frontend code may expect:
    |
    | tenant.familyMembers
    |
    | This handles both.
    |
    */

    const rawFamilyMembers =
        tenant.familyMembers ?? tenant.family_members ?? [];

    const familyMembers = Array.isArray(rawFamilyMembers)
        ? rawFamilyMembers
        : rawFamilyMembers
            ? [rawFamilyMembers]
            : [];

    /*
    |--------------------------------------------------------------------------
    | Normalize NID Photos
    |--------------------------------------------------------------------------
    */

    const normalizePhotos = (photos) => {
        if (!photos) {
            return [];
        }

        // Already an array
        if (Array.isArray(photos)) {
            return photos.filter(Boolean);
        }

        // JSON string
        if (typeof photos === 'string') {
            try {
                const parsed = JSON.parse(photos);

                if (Array.isArray(parsed)) {
                    return parsed.filter(Boolean);
                }

                return parsed ? [parsed] : [];
            } catch {
                // If it's just a normal filename
                return photos ? [photos] : [];
            }
        }

        return [];
    };

    const nidPhotos = normalizePhotos(tenant.nid_photo);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {tenant.name} - Tenant Details
                        </h2>

                        <p className="text-sm text-gray-600">
                            Full tenant information with family members and
                            documents
                        </p>
                    </div>

                    <div className="flex gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            🖨️ Print
                        </button>

                        <Link
                            href={route('tenants.index')}
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${tenant.name} - Tenant Details`} />

            <div className="py-8 print:py-0">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8 print:max-w-full print:px-2">

                    {/* =====================================================
                        MAIN TENANT INFORMATION
                    ====================================================== */}

                    <div className="mb-6 grid gap-6 print:gap-4 md:grid-cols-2">

                        {/* Personal Information */}
                        <div className="overflow-hidden rounded-lg bg-white shadow print:border print:border-gray-300 print:shadow-none">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 print:bg-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Personal Information
                                </h3>
                            </div>

                            <div className="space-y-3 p-6 print:p-4">

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Name:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.name || '—'}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Phone:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.phone || '—'}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        NID Number:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.nid || '—'}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Profession:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.profession || '—'}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">
                                        Emergency Contact:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.emergency_contact || '—'}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Accommodation & Financial Information */}
                        <div className="overflow-hidden rounded-lg bg-white shadow print:border print:border-gray-300 print:shadow-none">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 print:bg-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Accommodation & Financial
                                </h3>
                            </div>

                            <div className="space-y-3 p-6 print:p-4">

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Flat:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.flat?.flat_no || '—'}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Building:
                                    </span>

                                    <span className="text-gray-900">
                                        {tenant.flat?.building?.name || '—'}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Monthly Rent:
                                    </span>

                                    <span className="font-semibold text-green-700">
                                        ৳{tenant.monthly_rent || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium text-gray-700">
                                        Advance Amount:
                                    </span>

                                    <span className="text-gray-900">
                                        ৳{tenant.advance_amount || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">
                                        Status:
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                            tenant.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {tenant.status || '—'}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* =====================================================
                        TENURE INFORMATION
                    ====================================================== */}

                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow print:border print:border-gray-300 print:shadow-none">

                        <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 print:bg-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Tenure Information
                            </h3>
                        </div>

                        <div className="grid gap-4 p-6 print:p-4 md:grid-cols-2">

                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    Move-in Date
                                </span>

                                <span className="text-lg text-gray-900">
                                    {tenant.move_in_date || '—'}
                                </span>
                            </div>

                            {tenant.move_out_date && (
                                <div>
                                    <span className="block text-sm font-medium text-gray-700">
                                        Move-out Date
                                    </span>

                                    <span className="text-lg text-gray-900">
                                        {tenant.move_out_date}
                                    </span>
                                </div>
                            )}

                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    Family Members
                                </span>

                                <span className="text-lg font-semibold text-blue-600">
                                    {familyMembers.length}
                                </span>
                            </div>

                        </div>
                    </div>


                    {/* =====================================================
                        NID PHOTOS
                    ====================================================== */}

                    {nidPhotos.length > 0 && (
                        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow print:border print:border-gray-300 print:shadow-none">

                            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 print:bg-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    NID Photos
                                </h3>
                            </div>

                            <div className="grid gap-4 p-6 print:grid-cols-4 print:p-4 sm:grid-cols-2 lg:grid-cols-4">

                                {nidPhotos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-lg border border-gray-200"
                                    >
                                        <img
                                            src={`/storage/${photo}`}
                                            alt={`Tenant NID ${index + 1}`}
                                            className="h-48 w-full object-cover"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}


                    {/* =====================================================
                        FAMILY MEMBERS
                    ====================================================== */}

                    {familyMembers.length > 0 ? (
                        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow print:border print:border-gray-300 print:shadow-none">

                            {/* Header */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 print:bg-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Family Members ({familyMembers.length})
                                </h3>
                            </div>


                            {/* Members */}
                            <div className="space-y-4 p-6 print:p-4">

                                {familyMembers.map((member, index) => {

                                    const memberPhotos = normalizePhotos(
                                        member.member_photos
                                    );

                                    return (
                                        <div
                                            key={member.id || index}
                                            className="border-l-4 border-indigo-500 bg-indigo-50 p-4 print:border-l-2 print:bg-white"
                                        >

                                            {/* Member Name */}
                                            <div className="mb-3">
                                                <h4 className="text-base font-semibold text-gray-800">
                                                    {index + 1}.{' '}
                                                    {member.member_name ||
                                                        'Unnamed Member'}
                                                </h4>
                                            </div>


                                            {/* Member Photos */}
                                            {memberPhotos.length > 0 ? (
                                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">

                                                    {memberPhotos.map(
                                                        (
                                                            photo,
                                                            photoIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    photoIndex
                                                                }
                                                                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                                                            >
                                                                <img
                                                                    src={`/storage/${photo}`}
                                                                    alt={`${member.member_name || 'Family member'} photo ${photoIndex + 1}`}
                                                                    className="h-40 w-full object-cover"
                                                                />
                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">
                                                    No photos uploaded
                                                </div>
                                            )}

                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                            <p className="text-gray-500">
                                No family members added
                            </p>
                        </div>
                    )}


                    {/* =====================================================
                        ADDITIONAL NOTES
                    ====================================================== */}

                    {tenant.note && (
                        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow print:border print:border-gray-300 print:shadow-none">

                            <div className="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 print:bg-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Additional Notes
                                </h3>
                            </div>

                            <div className="whitespace-pre-wrap p-6 text-gray-700 print:p-4">
                                {tenant.note}
                            </div>

                        </div>
                    )}


                    {/* =====================================================
                        PRINT FOOTER
                    ====================================================== */}

                    <div className="hidden border-t pt-4 text-center text-xs text-gray-600 print:block">
                        <p>
                            Generated on{' '}
                            {new Date().toLocaleString()}
                        </p>

                        <p>
                            House Rent Management System
                        </p>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}