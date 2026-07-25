import React, { Fragment, useState, useCallback, useMemo } from 'react';
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
    jenis_kabel: string;
    panjang_tiang: string;
    status_laporan: string;
    nama_mitra: string;
    petugas_mitra: string;
    latitude: number;
    longitude: number;
    deskripsi: string;
    awal_kontrak: string;
    akhir_kontrak:string;
    created_at?: string;
    updated_at?: string;
    foto: string | null;
}

// Icons Components - Extracted for reusability
const Icons = {
    ExclamationCircle: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
    ),
    Clock: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    CheckCircle: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    XMark: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    ),
    MapPin: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    ),
    Calendar: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
        </svg>
    ),
    Building: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
    ),
    User: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    Document: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    ),
    Photo: ({ className = "h-5 w-5" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
    ),
    Download: ({ className = "h-4 w-4" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    ),
    Pdf: ({ className = "h-16 w-16" }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    ),
};

// Replace STATUS_CONFIG with:
const STATUS_CONFIG = {
    Pending: {
        icon: Icons.Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        label: 'Pending',
    },
    Proses: {
        icon: Icons.Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'Proses',
    },
    Selesai: {
        icon: Icons.CheckCircle,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        label: 'Selesai',
    },
};

const TIPE_TIANG_CONFIG: Record<string, string> = {
    Beton: 'bg-slate-100 text-slate-700',
    Besi: 'bg-blue-50 text-blue-700',
    Kayu: 'bg-orange-50 text-orange-700',
};

// Helper function to get file info
const getFileInfo = (path: string | null) => {
    if (!path) return { url: null, isPdf: false, isImage: false, fileName: null };

    let cleanPath = path.trim();

    // Parse JSON if needed
    try {
        const parsed = JSON.parse(cleanPath);
        if (Array.isArray(parsed) && parsed.length > 0) {
            cleanPath = parsed[0];
        } else if (typeof parsed === 'string') {
            cleanPath = parsed;
        }
    } catch (e) {
        // Not JSON, continue
    }

    // Build URL
    const url = cleanPath.startsWith('http') ? cleanPath : `/storage/${cleanPath.replace(/^\/?storage\//, '')}`;

    // Get file extension and name
    const fileName = cleanPath.split('/').pop() || 'file';
    const isPdf = cleanPath.toLowerCase().endsWith('.pdf');
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(cleanPath);

    return { url, isPdf, isImage, fileName };
};

// Image Viewer Modal Component
// Image Viewer Modal Component
const ImageViewer = ({ imageUrl, onClose, isOpen }: { imageUrl: string; onClose: () => void; isOpen: boolean }) => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    return (
        <Dialog as="div" className="relative z-[60]" onClose={onClose} open={isOpen} onKeyDown={handleKeyDown}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-90" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-transparent text-left align-middle shadow-xl transition-all">
                            <div className="relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition"
                                    aria-label="Close"
                                >
                                    <Icons.XMark className="h-6 w-6" />
                                </button>

                                <div className="flex items-center justify-center min-h-[80vh]">
                                    <img
                                        src={imageUrl}
                                        alt="Dokumentasi"
                                        className="max-h-[80vh] max-w-full object-contain"
                                        onError={(e) => {
                                            console.error('Failed to load image:', imageUrl);
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Tersedia';
                                        }}
                                    />
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    );
};

// Info Card Component for reusability
const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                </p>
                {children}
            </div>
        </div>
    </div>
);

export default function DetailReportModal({ isOpen, onClose, report }: DetailReportModalProps) {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    // Memoized values for performance
    const fileInfo = useMemo(() => getFileInfo(report?.foto || null), [report?.foto]);

    const formattedDates = useMemo(() => {
        if (!report) return { tanggal: '', createdAt: '', updatedAt: '' };

        const formatDate = (dateString: string) => {
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            } catch {
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
            } catch {
                return dateString;
            }
        };

        return {
            tanggal: formatDate(report.tanggal),
            createdAt: formatDateTime(report.created_at),
            updatedAt: formatDateTime(report.updated_at),
        };
    }, [report]);

    const handleOpenGoogleMaps = useCallback(() => {
        if (!report) return;

        if (report.latitude && report.longitude) {
            window.open(`https://www.google.com/maps?q=${report.latitude},${report.longitude}`, '_blank');
        } else if (report.lokasi) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.lokasi)}`, '_blank');
        }
    }, [report]);

    const handleEdit = useCallback(() => {
        onClose();
        // Trigger edit modal here
    }, [onClose]);

    if (!report) return null;

    const normalizedStatus = report.status_laporan as keyof typeof STATUS_CONFIG;
    const statusConfig = STATUS_CONFIG[normalizedStatus] ?? STATUS_CONFIG.Pending;
    const StatusIcon = statusConfig.icon;
    const tipeColor = TIPE_TIANG_CONFIG[report.tipe_tiang] || 'bg-slate-100 text-slate-700';

    return (
        <>
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
                                                    Dibuat pada {formattedDates.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition"
                                            aria-label="Close"
                                        >
                                            <Icons.XMark className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
                                        {/* Status Badge & Map Button */}
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}>
                                                <StatusIcon className="h-4 w-4" />
                                                <span>Status: {statusConfig.label}</span>
                                            </div>
                                            {(report.latitude && report.longitude) && (
                                                <button
                                                    onClick={handleOpenGoogleMaps}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                                >
                                                    <Icons.MapPin className="h-4 w-4" />
                                                    Lihat di Maps
                                                </button>
                                            )}
                                        </div>

                                        {/* Grid Info */}
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                            <InfoCard icon={Icons.Calendar} title="Tanggal Laporan">
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {formattedDates.tanggal}
                                                </p>
                                            </InfoCard>

                                            <InfoCard icon={Icons.Building} title="Tipe Tiang">
                                                <div className="mt-1">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tipeColor}`}>
                                                        {report.tipe_tiang}
                                                    </span>
                                                </div>
                                            </InfoCard>
                                            <InfoCard icon={Icons.Calendar} title="Jenis Kabel">
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {report.jenis_kabel}
                                                </p>
                                            </InfoCard>
                                            <InfoCard icon={Icons.Building} title="Panjang Tiang">
                                                <div className="mt-1">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tipeColor}`}>
                                                        {report.panjang_tiang}
                                                    </span>
                                                </div>
                                            </InfoCard>
                                            <div className="md:col-span-2">
                                                <InfoCard icon={Icons.MapPin} title="Lokasi">
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {report.lokasi}
                                                    </p>
                                                    {report.latitude && report.longitude && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Koordinat: {report.latitude}, {report.longitude}
                                                        </p>
                                                    )}
                                                </InfoCard>
                                            </div>

                                            <InfoCard icon={Icons.Building} title="Nama Mitra">
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {report.nama_mitra}
                                                </p>
                                            </InfoCard>

                                            <InfoCard icon={Icons.User} title="Petugas Mitra">
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {report.petugas_mitra}
                                                </p>
                                            </InfoCard>

                                            <InfoCard icon={Icons.User} title="Awal Kontrak">
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {report.awal_kontrak}
                                                </p>
                                            </InfoCard>

                                            <InfoCard icon={Icons.User} title="Akhir Kontrak Kontrak">
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {report.akhir_kontrak}
                                                </p>
                                            </InfoCard>

                                            <div className="md:col-span-2">
                                                <InfoCard icon={Icons.Document} title="Deskripsi Laporan">
                                                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                                        {report.deskripsi || 'Tidak ada deskripsi'}
                                                    </p>
                                                </InfoCard>
                                            </div>

                                            {report.updated_at && (
                                                <div className="md:col-span-2">
                                                    <InfoCard icon={Icons.Clock} title="Terakhir Diperbarui">
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {formattedDates.updatedAt}
                                                        </p>
                                                    </InfoCard>
                                                </div>
                                            )}
                                        </div>

                                        {/* File Section */}
                                        {!fileInfo.url ? (
                                            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
                                                <div className="text-center">
                                                    <Icons.Photo className="mx-auto h-10 w-10 text-gray-400" />
                                                    <p className="mt-2 text-sm text-gray-500">Tidak ada dokumentasi</p>
                                                </div>
                                            </div>
                                        ) : fileInfo.isPdf ? (
                                            <div className="mt-6">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        <Icons.Document className="h-5 w-5 text-gray-500" />
                                                        Dokumen PDF
                                                    </h4>
                                                </div>
                                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                                                    <div className="text-center">
                                                        <Icons.Pdf className="mx-auto text-red-500" />
                                                        <p className="mt-2 text-sm text-gray-600">{fileInfo.fileName}</p>
                                                        <a
                                                            href={fileInfo.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                                                        >
                                                            <Icons.Download className="h-4 w-4" />
                                                            Buka PDF
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : fileInfo.isImage ? (
                                            <div className="mt-6">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        <Icons.Photo className="h-5 w-5 text-gray-500" />
                                                        Dokumentasi Foto
                                                    </h4>
                                                </div>
                                                <div
                                                    className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 cursor-pointer group"
                                                    onClick={() => setIsImageViewerOpen(true)}
                                                >
                                                    <img
                                                        src={fileInfo.url}
                                                        alt="Dokumentasi"
                                                        className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            console.error('Failed to load image:', fileInfo.url);
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Tersedia';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <div className="rounded-full bg-white/90 p-3">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-xs text-gray-500 text-center">
                                                    Klik pada foto untuk melihat lebih besar
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
                                                <div className="text-center">
                                                    <Icons.Document className="mx-auto h-12 w-12 text-gray-400" />
                                                    <p className="mt-2 text-sm text-gray-500">{fileInfo.fileName}</p>
                                                    <a
                                                        href={fileInfo.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                                                    >
                                                        <Icons.Download className="h-4 w-4" />
                                                        Download File
                                                    </a>
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
                                                    onClick={handleEdit}
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

            {/* Image Viewer Modal */}
            {isImageViewerOpen && fileInfo.isImage && fileInfo.url && (
                <ImageViewer
                    imageUrl={fileInfo.url}
                    isOpen={isImageViewerOpen}
                    onClose={() => setIsImageViewerOpen(false)}
                />
            )}
        </>
    );
}
