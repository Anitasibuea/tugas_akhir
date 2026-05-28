import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface DetailReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: ReportDetail | null;
}

interface ReportDetail {
    id: number;
    tanggal: string;
    lokasi: string;
    tipe_tiang: string;
    status_laporan: 'Open' | 'Pending' | 'Closed';
    nama_mitra: string;
    petugas_mitra: string;
    latitude: number;
    longitude: number;
    deskripsi: string;
    created_at?: string;
    updated_at?: string;
    foto?: string[] | null;
}

// Icons Components
function ExclamationCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
    );
}

function ClockIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}

function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}

function XMarkIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
}

function MapPinIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    );
}

function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
        </svg>
    );
}

function BuildingOfficeIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
    );
}

function UserIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );
}

function DocumentTextIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    );
}

const STATUS_CONFIG = {
    Open: {
        icon: ExclamationCircleIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'Open',
    },
    Pending: {
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        label: 'Pending',
    },
    Closed: {
        icon: CheckCircleIcon,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        label: 'Closed',
    },
};

const TIPE_TIANG_CONFIG: Record<string, string> = {
    Beton: 'bg-slate-100 text-slate-700',
    Besi: 'bg-blue-50 text-blue-700',
    Kayu: 'bg-orange-50 text-orange-700',
};

export default function DetailReportModal({ isOpen, onClose, report }: DetailReportModalProps) {
    if (!report) return null;

    // Normalize status to handle case insensitivity and ensure it matches our keys
    const normalizedStatus = report.status_laporan?.charAt(0).toUpperCase() + report.status_laporan?.slice(1).toLowerCase() as 'Open' | 'Pending' | 'Closed';
    
    // Get status config with fallback to Open if status is invalid
    const statusConfig = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.Open;
    const StatusIcon = statusConfig.icon;
    const tipeColor = TIPE_TIANG_CONFIG[report.tipe_tiang] || 'bg-slate-100 text-slate-700';

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return dateString;
        }
    };

    const openGoogleMaps = () => {
        if (report.latitude && report.longitude) {
            window.open(`https://www.google.com/maps?q=${report.latitude},${report.longitude}`, '_blank');
        } else if (report.lokasi) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.lokasi)}`, '_blank');
        }
    };

    // Don't render if statusConfig is invalid (should not happen with fallback)
    if (!statusConfig) {
        console.error('Invalid status config for report:', report.status_laporan);
        return null;
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-lg p-2 ${statusConfig.bgColor}`}>
                                            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                                Detail Laporan #{report.id}
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500">
                                                Dibuat pada {formatDateTime(report.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition"
                                        aria-label="Close"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
                                    {/* Status Badge */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}>
                                            <StatusIcon className="h-4 w-4" />
                                            <span>Status: {statusConfig.label}</span>
                                        </div>
                                        {(report.latitude && report.longitude) && (
                                            <button
                                                onClick={openGoogleMaps}
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                            >
                                                <MapPinIcon className="h-4 w-4" />
                                                Lihat di Maps
                                            </button>
                                        )}
                                    </div>

                                    {/* Grid Info */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Tanggal */}
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal Laporan
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {formatDate(report.tanggal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tipe Tiang */}
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tipe Tiang
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tipeColor}`}>
                                                            {report.tipe_tiang}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lokasi */}
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                                            <div className="flex items-start gap-3">
                                                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Lokasi
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {report.lokasi}
                                                    </p>
                                                    {report.latitude && report.longitude && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Koordinat: {report.latitude}, {report.longitude}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nama Mitra */}
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nama Mitra
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {report.nama_mitra}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Petugas Mitra */}
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Petugas Mitra
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {report.petugas_mitra}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deskripsi */}
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                                            <div className="flex items-start gap-3">
                                                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Deskripsi Laporan
                                                    </p>
                                                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                                        {report.deskripsi || 'Tidak ada deskripsi'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Last Updated */}
                                        {report.updated_at && (
                                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                                                <div className="flex items-start gap-3">
                                                    <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Terakhir Diperbarui
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {formatDateTime(report.updated_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Foto Section (Optional) */}
                                    {report.foto && report.foto.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="mb-3 text-sm font-medium text-gray-900">Dokumentasi Foto</h4>
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                {report.foto.map((foto, index) => (
                                                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                        <img
                                                            src={foto}
                                                            alt={`Foto ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Tutup
                                        </button>
                                        {report.status_laporan !== 'Closed' && (
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    // You can trigger edit modal here
                                                }}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                            >
                                                Edit Laporan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}