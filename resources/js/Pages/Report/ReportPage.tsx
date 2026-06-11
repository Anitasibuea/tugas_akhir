    import AuthLayout from "@/Layouts/AuthLayout";
    import { PageProps, User } from "@/types";
    import { Link, router } from "@inertiajs/react";
    import { ReactNode, useMemo, useState } from "react";
    import EditReportModal from "@/Components/editmodal";
    import DetailReportModal from "@/Components/DetailLaporan";
    import { ReportDetail } from "@/types/report";
    import TandatanganiModal from "@/Components/TandatanganiModal";

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
        latitude: number;
        longitude: number;
        deskripsi: string;
        created_at?: string;
        updated_at?: string;
        foto: string;
        // Two‑party signature fields
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

    const EDIT_ROLES = ["admin", "petugas"];
    const SIGN_ROLES = ["manajer", "mitra", "admin"]; // allow both manajer & mitra to generate QR
    const PDF_ROLES = ["admin", "manajer", "mitra"];

    function useRolePermissions(role?: string | number | null) {
        const normalizedRole = String(role ?? "").toLowerCase();
        return {
            canEdit: EDIT_ROLES.includes(normalizedRole),
            canGenerateQr: normalizedRole === 'manajer' || normalizedRole === 'admin', // hanya manajer/admin yang generate QR
            canViewPdf: PDF_ROLES.includes(normalizedRole),
        };
    }

    /* ──────────────────────────────────────────────────────────
    MAIN COMPONENT
    ────────────────────────────────────────────────────────── */
    export default function ReportPage({
        user,
        auth,
        report,
        petugasUsers = [],
        mitraUsers = [],
    }: Props) {
        const [search, setSearch] = useState("");
        const [page, setPage] = useState(1);
        const [showEntries, setShowEntries] = useState(10);
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
        const [selectedReport, setSelectedReport] = useState<Report | null>(null);
        const [isSignModalOpen, setIsSignModalOpen] = useState(false);
        const [signRole, setSignRole] = useState<"manajer" | "mitra" | null>(null);
        const [qrToken, setQrToken] = useState<string>("");
        const [pendingQr, setPendingQr] = useState<{ role: "manajer" | "mitra"; reportId: number } | null>(null);
        const { canEdit, canGenerateQr, canViewPdf } = useRolePermissions(auth.user?.role);

        const handleEdit = (reportItem: Report) => {
            setSelectedReport(reportItem);
            setIsEditModalOpen(true);
        };

        const handleViewDetail = (reportItem: Report) => {
            setSelectedReport(reportItem);
            setIsDetailModalOpen(true);
        };

        const handleViewPdf = (reportId: number) => {
            window.open(route("reports.surat", reportId), "_blank");
        };

        // Generate QR for manajer or mitra
       const handleGenerateQr = (role: "manajer" | "mitra", reportId: number) => {
    const currentReport = report.find(r => r.id === reportId);
    setSelectedReport(currentReport || null);
    setPendingQr({ role, reportId });
    setSignRole(role);
    setIsSignModalOpen(true);


};

const handleConfirmGenerateQr = () => {
    if (!pendingQr) return;
    const { role, reportId } = pendingQr;
    const routeName = role === "manajer" ? "reports.generateQrManajer" : "reports.generateQrMitra";
    router.post(
        route(routeName, reportId),
        {},
        {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as any;
                const token = flash.qr_token;
                if (token) {
                    setQrToken(token);
                    // modal is already open — just update the token so QR renders
                }
                setPendingQr(null);
            },
            onError: (errors) => {
                console.error(errors);
                alert("Gagal generate QR. Pastikan status laporan 'Selesai' dan belum ditandatangani.");
                setIsSignModalOpen(false);
                setPendingQr(null);
            },
        }
    );
};

        const filteredData = useMemo(() => {
            return report.filter((item) =>
                [item.id, item.lokasi, item.tipe_tiang, item.status_laporan, item.nama_mitra, item.petugas_lapangan]
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }, [report, search]);

        const totalPages = Math.max(1, Math.ceil(filteredData.length / showEntries));
        const paginatedData = filteredData.slice((page - 1) * showEntries, page * showEntries);

        const handleDelete = (id: number) => {
            if (!confirm("Yakin ingin menghapus laporan ini?")) return;
            router.delete(route("reports.destroy", id), { preserveScroll: true });
        };

        const transformReportForModal = (report: Report) => ({
            id: report.id,
            tanggal: report.tanggal,
            deskripsi: report.deskripsi || "",
            status_laporan: report.status_laporan,
            tipe_tiang: report.tipe_tiang,
            lokasi: report.lokasi,
            petugas_lapangan: report.petugas_lapangan,
            latitude: report.latitude || 0,
            longitude: report.longitude || 0,
            nama_mitra: report.nama_mitra,
            foto: report.foto,
        });

        const transformReportForDetail = (report: Report): ReportDetail => ({
            id: report.id,
            tanggal: report.tanggal,
            lokasi: report.lokasi,
            tipe_tiang: report.tipe_tiang,
            status_laporan: report.status_laporan,
            nama_mitra: report.nama_mitra,
            petugas_mitra: report.petugas_lapangan,
            latitude: report.latitude || 0,
            longitude: report.longitude || 0,
            deskripsi: report.deskripsi || "",
            foto: report.foto,
            created_at: report.created_at,
            updated_at: report.updated_at,
        });

        return (
            <AuthLayout user={auth.user} header="Laporan Tiang">
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
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                        {["ID", "Tanggal", "Lokasi", "Tipe Tiang", "Status", "Mitra", "Petugas", "TTD Manajer", "TTD Mitra", "Aksi"].map(item => (
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
                                            const isSelesai = item.status_laporan.toLowerCase() === "selesai";
                                           const manajerQrGenerated = !!item.signature_qr_manajer; // QR was generated (gate for mitra)
const manajerSigned = !!item.signed_by_manajer;
const mitraSigned = !!item.signed_by_mitra;

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
                                                    <td className="px-5 py-4 text-center">
                                                        {manajerSigned ? "✓" : "✗"}
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        {mitraSigned ? "✓" : "✗"}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {/* View Detail */}
                                                            <button onClick={() => handleViewDetail(item)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50" title="Lihat Detail">
                                                                <ViewIcon />
                                                            </button>

                                                            {/* Edit & Delete (admin/petugas) */}
                                                            {canEdit && (
                                                                <>
                                                                    <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50" title="Edit">
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50" title="Hapus">
                                                                        <DeleteIcon />
                                                                    </button>
                                                                </>
                                                            )}

                                                        {/* Manajer QR */}
    {canGenerateQr && isSelesai && !manajerSigned && (
        <button
            onClick={() => handleGenerateQr("manajer", item.id)}
            className="w-8 h-8 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            title="Generate QR untuk Manajer"
        >
            <QrIcon />
        </button>
    )}

    {/* Mitra QR */}
    {canGenerateQr && isSelesai && manajerSigned && !mitraSigned && (
        <button
            onClick={() => handleGenerateQr("mitra", item.id)}
            className="w-8 h-8 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50"
            title="Generate QR untuk Mitra"
        >
            <QrIcon />
        </button>
    )}
                                                            {/* PDF button (only when both signed) */}
                                                            {canViewPdf  && (
                                                                <button onClick={() => handleViewPdf(item.id)} className="w-8 h-8 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50" title="Lihat PDF">
                                                                    <PdfIcon />
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

                        {/* FOOTER with pagination */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-slate-100">
                            <div className="text-sm text-slate-500">
                                Menampilkan{" "}
                                <span className="font-medium text-slate-700">{filteredData.length === 0 ? 0 : (page - 1) * showEntries + 1}</span>
                                {" - "}
                                <span className="font-medium text-slate-700">{Math.min(page * showEntries, filteredData.length)}</span>
                                {" dari "}
                                <span className="font-medium text-slate-700">{filteredData.length}</span> data
                            </div>
                            <div className="flex items-center gap-2">
                                <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40">
                                    <ChevronLeftIcon />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${p === page ? "bg-blue-600 text-white" : "border border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                                        {p}
                                    </button>
                                ))}
                                <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40">
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <EditReportModal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setSelectedReport(null); }}
                    report={selectedReport ? transformReportForModal(selectedReport) : null}
                    petugasUsers={petugasUsers}
                    mitraUsers={mitraUsers}
                />

                <DetailReportModal
                    isOpen={isDetailModalOpen}
                    onClose={() => { setIsDetailModalOpen(false); setSelectedReport(null); }}
                    report={selectedReport ? transformReportForDetail(selectedReport) : null}
                />

              <TandatanganiModal
    isOpen={isSignModalOpen}
    onClose={() => {
        setIsSignModalOpen(false);
        setSelectedReport(null);
        setQrToken("");
        setSignRole(null);
        setPendingQr(null);
    }}
    onConfirm={handleConfirmGenerateQr}   // ← add this prop
    report={selectedReport && signRole ? {
        id: selectedReport.id,
        signature_qr_token: qrToken,
        role: signRole,
    } : null}
/>
            </AuthLayout>
        );
    }

    /* ──────────────────────────────────────────────────────────
    ICONS
    ────────────────────────────────────────────────────────── */
    function PlusIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>; }
    function SearchIcon({ className = "" }: { className?: string }) { return <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>; }
    function ViewIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>; }
    function EditIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.415.586H9v-2a2 2 0 01.586-1.414z" /></svg>; }
    function DeleteIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6" /></svg>; }
    function ChevronLeftIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>; }
    function ChevronRightIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>; }
    function SignIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m0 0l3.536 3.536M3 21h4l10-10-4-4L3 17v4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.5-1.5" /></svg>; }
    function PdfIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6a1 1 0 001 1h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" /></svg>; }
    function QrIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>; }