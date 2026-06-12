import AuthLayout from "@/Layouts/AuthLayout";
import { PageProps, User } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ReactNode, useMemo, useState } from "react";
import EditReportModal from "@/Components/editmodal";
import DetailReportModal from "@/Components/DetailLaporan";
import { ReportDetail } from "@/types/report";
import TandatanganiModal from "@/Components/TandatanganiModal";

import { TrashIcon, QrCodeIcon, EyeIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ChevronsRightIcon, FileIcon, PlusIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { PencilIcon } from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────────────────
TYPES
────────────────────────────────────────────────────────── */
interface AuthenticatedLayoutProps {
    user: User;
    header?: ReactNode;
}

type Status = "Open" | "Pending" | "Closed";

interface Report {
    id: number;
    tanggal: string;
    lokasi: string;
    tipe_tiang: string;
    status_laporan: Status;
    nama_mitra: string;
    petugas_lapangan: string;
    panjang_tiang: string;
    jumlah_kabel: string;
    jenis_kabel: string;
    latitude: number;
    longitude: number;
    deskripsi: string;
    created_at?: string;
    updated_at?: string;
    foto: string;
    signed_by_manajer?: number | null;
    signed_at_manajer?: string | null;
    signed_by_mitra?: number | null;
    signed_at_mitra?: string | null;
    signature_qr_manajer?: string | null;
    signature_qr_mitra?: string | null;
    signature_data?: string | null;
}

interface Props extends PageProps {
    report: Report[];
    petugasUsers?: Array<{ id: number; name: string }>;
    mitraUsers?: Array<{ id: number; name: string }>;
    user: AuthenticatedLayoutProps;
}

/* ──────────────────────────────────────────────────────────
CONSTANTS & HELPERS
────────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<Status, { badge: string; dot: string }> = {
    Open: { badge: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500" },
    Pending: { badge: "bg-yellow-50 text-yellow-600 border border-yellow-200", dot: "bg-yellow-500" },
    Closed: { badge: "bg-emerald-50 text-emerald-600 border border-emerald-200", dot: "bg-emerald-500" },
};

const TIPE_COLORS: Record<string, string> = {
    Beton: "bg-slate-100 text-slate-700",
    Besi: "bg-blue-50 text-blue-700",
    Kayu: "bg-orange-50 text-orange-700",
};

function useRolePermissions(role?: string | number | null) {
    const r = String(role ?? "").toLowerCase();
    return {
        canEdit: ["admin", "petugas"].includes(r),
        canGenerateManajerQr: r === "manajer",
        canGenerateMitraQr: r === "mitra",
        canViewPdf: ["admin", "manajer", "mitra"].includes(r),
    };
}

/* ──────────────────────────────────────────────────────────
MAIN COMPONENT
────────────────────────────────────────────────────────── */
export default function ReportPage({
    auth,
    report,
    petugasUsers = [],
    mitraUsers = [],
}: Props) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showEntries, setShowEntries] = useState(10);

    // Edit / Detail modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    // QR Confirm modal
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [signRole, setSignRole] = useState<"manajer" | "mitra" | null>(null);
    const [pendingQr, setPendingQr] = useState<{ role: "manajer" | "mitra"; reportId: number } | null>(null);
    const [qrLoading, setQrLoading] = useState(false);

    const { canEdit, canGenerateManajerQr, canGenerateMitraQr, canViewPdf } = useRolePermissions(auth.user?.role);

    /* ── Handlers ─────────────────────────────────────────── */
    const handleEdit = (item: Report) => { setSelectedReport(item); setIsEditModalOpen(true); };
    const handleViewDetail = (item: Report) => { setSelectedReport(item); setIsDetailModalOpen(true); };
    const handleViewPdf = (id: number) => window.open(route("reports.surat", id), "_blank");

    const handleOpenQrModal = (role: "manajer" | "mitra", item: Report) => {
        setSelectedReport(item);
        setPendingQr({ role, reportId: item.id });
        setSignRole(role);
        setIsSignModalOpen(true);
    };

    const handleCloseQrModal = () => {
        setIsSignModalOpen(false);
        setSelectedReport(null);
        setSignRole(null);
        setPendingQr(null);
        setQrLoading(false);
    };

    const handleConfirmGenerateQr = () => {
        if (!pendingQr) return;
        const { role, reportId } = pendingQr;
        const routeName = role === "manajer" ? "reports.generateQrManajer" : "reports.generateQrMitra";

        setQrLoading(true);
        router.post(
            route(routeName, reportId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseQrModal();
                },
                onError: (errors) => {
                    console.error(errors);
                    alert("Gagal generate QR. Pastikan laporan berstatus Selesai dan belum ditandatangani.");
                    handleCloseQrModal();
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        if (!confirm("Yakin ingin menghapus laporan ini?")) return;
        router.delete(route("reports.destroy", id), { preserveScroll: true });
    };

    /* ── Filtering & Pagination ───────────────────────────── */
    const filteredData = useMemo(() =>
        report.filter((item) =>
            [item.id, item.lokasi, item.tipe_tiang, item.status_laporan, item.nama_mitra, item.petugas_lapangan]
                .join(" ").toLowerCase().includes(search.toLowerCase())
        ), [report, search]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / showEntries));
    const paginatedData = filteredData.slice((page - 1) * showEntries, page * showEntries);

    /* ── Modal transforms ─────────────────────────────────── */
    const transformForEdit = (r: Report) => ({
        id: r.id, tanggal: r.tanggal, deskripsi: r.deskripsi || "",
        status_laporan: r.status_laporan, tipe_tiang: r.tipe_tiang,
        lokasi: r.lokasi, petugas_lapangan: r.petugas_lapangan,
        latitude: r.latitude || 0, longitude: r.longitude || 0,
        nama_mitra: r.nama_mitra, foto: r.foto,
        panjang_tiang: r.panjang_tiang || "",   // ← add
        jumlah_kabel: r.jumlah_kabel || "",     // ← add
        jenis_kabel: r.jenis_kabel || "",       // ← add
    });

    const transformForDetail = (r: Report): ReportDetail => ({
        id: r.id, tanggal: r.tanggal, lokasi: r.lokasi,
        tipe_tiang: r.tipe_tiang, status_laporan: r.status_laporan,
        nama_mitra: r.nama_mitra, petugas_mitra: r.petugas_lapangan,
        latitude: r.latitude || 0, longitude: r.longitude || 0,
        deskripsi: r.deskripsi || "", foto: r.foto,
        created_at: r.created_at, updated_at: r.updated_at,
        panjang_tiang: r.panjang_tiang || "",   // ← add
        jumlah_kabel: r.jumlah_kabel || "",     // ← add
        jenis_kabel: r.jenis_kabel || "",       // ← add
    });

    return (
        <AuthLayout user={auth.user}>
            <div className="space-y-6">
                {/* PAGE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Laporan Tiang</h1>
                        <p className="text-sm text-slate-500 mt-1">Manajemen data laporan tiang bersama</p>
                    </div>
                    {canEdit && (
                        <Link
                            href={route("reports.add")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                        >
                            <PlusIcon /> Tambah Laporan
                        </Link>
                    )}
                </div>

                {/* CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* TOOLBAR */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan</span>
                            <select
                                value={showEntries}
                                onChange={(e) => { setShowEntries(Number(e.target.value)); setPage(1); }}
                                className="border border-slate-200 rounded-lg px-6 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[5, 10, 25, 50].map(n => <option key={n}>{n}</option>)}
                            </select>
                            <span>entri</span>
                        </div>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari laporan..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["ID", "Tanggal", "Lokasi", "Tipe Tiang", "Status", "Mitra", "Petugas", "Aksi"].map(item => (
                                        <th key={item} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr><td colSpan={10} className="py-16 text-center text-sm text-slate-400">Tidak ada data laporan.</td></tr>
                                ) : (
                                    paginatedData.map(item => {
                                        const normalizedStatus = item.status_laporan.charAt(0).toUpperCase() + item.status_laporan.slice(1).toLowerCase();
                                        const statusColor = STATUS_COLORS[normalizedStatus as Status] ?? STATUS_COLORS.Open;

                                        // Status Selesai check (case-insensitive)
                                        const isSelesai = item.status_laporan.toLowerCase() === "selesai";
                                        const manajerSigned = !!item.signed_by_manajer;
                                        const manajerQrGenerated = !!item.signature_qr_manajer || manajerSigned;
                                        const mitraSigned = !!item.signed_by_mitra;
                                        const mitraQrGenerated = !!item.signature_qr_mitra || mitraSigned;

                                        // Hide manajer button once QR is generated OR already signed
                                        const showManajerQrBtn = canGenerateManajerQr && isSelesai && !manajerQrGenerated;


                                        // Show mitra button once manajer QR exists (generated but not yet scanned is fine)
                                        const showMitraQrBtn = canGenerateMitraQr && isSelesai && manajerQrGenerated && !mitraQrGenerated; // ← was !mitraSigned

                                        return (
                                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">{item.id}</td>
                                                <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{item.tanggal}</td>
                                                <td className="px-5 py-4 text-slate-600 max-w-[250px] truncate">{item.lokasi}</td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${TIPE_COLORS[item.tipe_tiang] ?? "bg-slate-100 text-slate-700"}`}>
                                                        {item.tipe_tiang}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor.badge}`}>
                                                        <span className={`w-2 h-2 rounded-full ${statusColor.dot}`} />
                                                        {normalizedStatus}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{item.nama_mitra}</td>
                                                <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{item.petugas_lapangan}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {/* View Detail */}
                                                        <button
                                                            onClick={() => handleViewDetail(item)}
                                                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50"
                                                            title="Lihat Detail"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>

                                                        {/* Edit & Delete — admin/petugas only */}
                                                        {canEdit && !(manajerSigned && mitraSigned) && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEdit(item)}
                                                                    className="w-8 h-8 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-50"
                                                                    title="Edit"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50"
                                                                    title="Hapus"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {/* Generate QR Manajer */}
                                                        {showManajerQrBtn && (
                                                            <button
                                                                onClick={() => handleOpenQrModal("manajer", item)}
                                                                className="w-8 h-8 rounded-lg border border-indigo-200 text-indigo-600 flex items-center justify-center hover:bg-indigo-50"
                                                                title="Generate QR untuk Manajer"
                                                            >
                                                                <QrCodeIcon className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Generate QR Mitra — hanya setelah manajer TTD */}
                                                        {showMitraQrBtn && (
                                                            <button
                                                                onClick={() => handleOpenQrModal("mitra", item)}
                                                                className="w-8 h-8 rounded-lg border border-violet-200 text-violet-600 flex items-center justify-center hover:bg-violet-50"
                                                                title="Generate QR untuk Mitra"
                                                            >
                                                                <QrCodeIcon className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* PDF — semua pihak berwenang */}
                                                        {canViewPdf && (
                                                            <button
                                                                onClick={() => handleViewPdf(item.id)}
                                                                className="w-8 h-8 rounded-lg border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-50"
                                                                title="Lihat PDF"
                                                            >
                                                                <FileIcon className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER — Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500">
                            Menampilkan{" "}
                            <span className="font-medium text-slate-700">{filteredData.length === 0 ? 0 : (page - 1) * showEntries + 1}</span>
                            {" – "}
                            <span className="font-medium text-slate-700">{Math.min(page * showEntries, filteredData.length)}</span>
                            {" dari "}
                            <span className="font-medium text-slate-700">{filteredData.length}</span> data
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${p === page ? "bg-blue-600 text-white" : "border border-slate-200 hover:bg-slate-50 text-slate-700"}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                            >
                                <ChevronsRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <EditReportModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedReport(null); }}
                report={selectedReport ? transformForEdit(selectedReport) : null}
                petugasUsers={petugasUsers}
                mitraUsers={mitraUsers}
            />

            <DetailReportModal
                isOpen={isDetailModalOpen}
                onClose={() => { setIsDetailModalOpen(false); setSelectedReport(null); }}
                report={selectedReport ? transformForDetail(selectedReport) : null}
            />

            <TandatanganiModal
                isOpen={isSignModalOpen}
                onClose={handleCloseQrModal}
                onConfirm={handleConfirmGenerateQr}
                isLoading={qrLoading}
                report={selectedReport && signRole
                    ? { id: selectedReport.id, role: signRole }
                    : null}
            />
        </AuthLayout>
    );
}
