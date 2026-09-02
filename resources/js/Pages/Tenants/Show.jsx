import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ tenant }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
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
                            Tenant Profile
                        </h2>

                        <p className="text-sm text-gray-600">
                            Tenant information and details
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

            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .tenant-container {
                    max-width: 900px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 20px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }

                .tenant-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                    border-bottom: 3px solid #1e40af;
                    padding-bottom: 10px;
                }

                .company-info {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    flex: 1;
                }

                .company-logo {
                    width: 45px;
                    height: 45px;
                    background-color: #1e40af;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                .company-details h1 {
                    color: #1e40af;
                    font-size: 18px;
                    margin-bottom: 2px;
                }

                .company-details p {
                    color: #666;
                    font-size: 10px;
                    margin: 1px 0;
                }

                .tenant-badge {
                    background-color: #1e40af;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    text-align: center;
                    font-weight: bold;
                    font-size: 11px;
                    min-width: 70px;
                }

                .tenant-meta {
                    text-align: right;
                }

                .tenant-meta-item {
                    margin-bottom: 3px;
                    font-size: 10px;
                }

                .tenant-meta-item strong {
                    color: #1e40af;
                    display: inline-block;
                    width: 85px;
                }

                .info-sections {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .info-section h3 {
                    color: #1e40af;
                    font-size: 11px;
                    font-weight: bold;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    border-bottom: 2px solid #1e40af;
                    padding-bottom: 4px;
                }

                .info-section p {
                    font-size: 10px;
                    margin-bottom: 2px;
                    color: #333;
                    line-height: 1.3;
                }

                .info-section strong {
                    display: inline-block;
                    width: 85px;
                    color: #1e40af;
                }

                .family-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                }

                .family-table thead {
                    background-color: #1e40af;
                    color: white;
                }

                .family-table th {
                    padding: 6px;
                    text-align: left;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .family-table td {
                    padding: 5px 6px;
                    border-bottom: 1px solid #e0e0e0;
                    font-size: 10px;
                }

                .family-table tbody tr:hover {
                    background-color: #f9f9f9;
                }

                .nid-photos {
                    margin-bottom: 10px;
                }

                .nid-photos h3 {
                    color: #1e40af;
                    font-size: 11px;
                    font-weight: bold;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    border-bottom: 2px solid #1e40af;
                    padding-bottom: 4px;
                }

                .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }

                .photo-item {
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #f5f5f5;
                }

                .photo-item img {
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                }

                .signature-section {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: center;
                }

                .signature-box {
                    text-align: center;
                }

                .signature-line {
                    width: 150px;
                    border-top: 1px solid #333;
                    margin: 30px 0 2px 0;
                }

                .signature-box p {
                    font-size: 10px;
                    color: #666;
                    font-weight: bold;
                    margin: 2px 0;
                }

                .print-actions {
                    margin-top: 10px;
                    text-align: center;
                }

                .print-button {
                    background-color: #1e40af;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 11px;
                }

                .print-button:hover {
                    background-color: #1e3a8a;
                }

                .passport-photo {
                    width: 50px;
                    height: 65px;
                    object-fit: cover;
                    border: 1px solid #ddd;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .passport-photo:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background-color: white;
                    border-radius: 8px;
                    padding: 20px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: auto;
                    position: relative;
                }

                .modal-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #666;
                }

                .modal-close:hover {
                    color: #000;
                }

                .modal-image {
                    width: 100%;
                    border-radius: 4px;
                }

                @media print {
                    body {
                        background-color: white;
                        margin: 0;
                        padding: 0;
                    }

                    header,
                    nav,
                    .navbar,
                    .print\\:hidden {
                        display: none !important;
                    }

                    .tenant-container {
                        box-shadow: none;
                        margin: 0;
                        padding: 10px;
                        max-width: 100%;
                    }

                    .print-actions {
                        display: none;
                    }

                    .modal-overlay {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="py-8 print:py-0">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8 print:max-w-full print:px-2">
                    <div className="tenant-container">
                        {/* Header */}
                        <div className="tenant-header">
                            <div className="company-info">
                                <div className="company-logo">👤</div>
                                <div className="company-details">
                                    <h1>GREEN VIEW RESIDENCE</h1>
                                    <p>House Rent Management System</p>
                                    <p>📍 Road-12, Block-A, Bashundhara R/A, Dhaka-1229</p>
                                    <p>📞 01712-345678, 01898-765432</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="tenant-badge">TENANT PROFILE</div>
                                <div className="tenant-meta">
                                    <div className="tenant-meta-item"><strong>Name:</strong> {tenant.name}</div>
                                    <div className="tenant-meta-item"><strong>Phone:</strong> {tenant.phone}</div>
                                    <div className="tenant-meta-item"><strong>NID No.:</strong> {tenant.nid || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Personal & Accommodation Info */}
                        <div className="info-sections">
                            <div className="info-section">
                                <h3>Personal Information</h3>
                                <p><strong>Full Name:</strong> {tenant.name}</p>
                                <p><strong>Phone:</strong> {tenant.phone}</p>
                                <p><strong>NID:</strong> {tenant.nid || 'N/A'}</p>
                                <p><strong>Profession:</strong> {tenant.profession || 'N/A'}</p>
                                <p><strong>Emergency Contact:</strong> {tenant.emergency_contact || 'N/A'}</p>
                            </div>
                            <div className="info-section">
                                <h3>Accommodation Information</h3>
                                <p><strong>Flat No.:</strong> {tenant.flat?.flat_no || 'N/A'}</p>
                                <p><strong>Building:</strong> {tenant.flat?.building?.name || 'N/A'}</p>
                                <p><strong>Floor:</strong> {tenant.flat?.floor || 'N/A'}</p>
                                <p><strong>Bedrooms:</strong> {tenant.flat?.bedrooms || 'N/A'}</p>
                                <p><strong>Bathrooms:</strong> {tenant.flat?.bathrooms || 'N/A'}</p>
                            </div>
                        </div>

                        {/* NID Photos */}
                        {nidPhotos.length > 0 && (
                            <div className="nid-photos">
                                <h3>NID Photos</h3>
                                <div className="photo-grid">
                                    {nidPhotos.map((photo, index) => (
                                        <div key={index} className="photo-item">
                                            <img
                                                src={`/storage/${photo}`}
                                                alt={`Tenant NID ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Family Members Table */}
                        {familyMembers.length > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <h3 style={{ color: '#1e40af', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase', borderBottom: '2px solid #1e40af', paddingBottom: '4px' }}>
                                    Family Members ({familyMembers.length})
                                </h3>
                                <table className="family-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '35%' }}>Name</th>
                                            <th style={{ width: '35%' }}>Relation</th>
                                            <th style={{ width: '30%', textAlign: 'center' }}>Photo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {familyMembers.map((member, index) => {
                                            const memberPhotos = normalizePhotos(member.member_photos);
                                            const firstPhoto = memberPhotos.length > 0 ? memberPhotos[0] : null;

                                            return (
                                                <tr key={member.id || index}>
                                                    <td>{member.member_name || 'N/A'}</td>
                                                    <td>{member.relation || 'N/A'}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {firstPhoto ? (
                                                            <img
                                                                src={`/storage/${firstPhoto}`}
                                                                alt={member.member_name || 'Family member'}
                                                                className="passport-photo"
                                                                onClick={() => setSelectedPhoto(`/storage/${firstPhoto}`)}
                                                            />
                                                        ) : (
                                                            <span style={{ fontSize: '9px', color: '#999' }}>No photo</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Additional Notes */}
                        {tenant.note && (
                            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f5f5f5', borderLeft: '3px solid #1e40af' }}>
                                <h3 style={{ color: '#1e40af', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Additional Notes
                                </h3>
                                <p style={{ fontSize: '10px', color: '#333', margin: 0, whiteSpace: 'pre-wrap' }}>
                                    {tenant.note}
                                </p>
                            </div>
                        )}

                        {/* Signature Section */}
                        <div className="signature-section">
                            <div className="signature-box">
                                <div className="signature-line"></div>
                                <p>Authorized Signature</p>
                                <p style={{ marginTop: '5px' }}>Green View Residence</p>
                            </div>
                        </div>

                        {/* Print Actions */}
                        <div className="print-actions">
                            <button type="button" className="print-button" onClick={() => window.print()}>
                                🖨️ Print Profile
                            </button>
                        </div>
                    </div>

                    <div className="hidden border-t pt-4 text-center text-xs text-gray-600 print:block">
                        <p>
                            Generated on{' '}
                            {new Date().toLocaleString()}
                        </p>

                        <p>
                            House Rent Management System
                        </p>
                    </div>

                    {/* Photo Preview Modal */}
                    {selectedPhoto && (
                        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="modal-close"
                                    onClick={() => setSelectedPhoto(null)}
                                >
                                    ✕
                                </button>
                                <img
                                    src={selectedPhoto}
                                    alt="Preview"
                                    className="modal-image"
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}