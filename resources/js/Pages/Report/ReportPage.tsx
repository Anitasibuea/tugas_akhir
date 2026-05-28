import AuthLayout from "@/Layouts/AuthLayout";
import { PageProps } from "@/types";
import { Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import EditReportModal from "@/Components/editmodal";
import DetailReportModal from "@/Components/DetailLaporan";
import { ReportDetail } from "@/types/report";

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */

type Status = "Open" | "Pending" | "Closed";

interface Report {
    id: number;
    tanggal: string;
    lokasi: string;
    tipe_tiang: string;
    status_laporan: Status;
    nama_mitra: string;
    petugas_mitra: string;
    latitude: number;
    longitude: number;
    deskripsi: string;
    created_at?: string;
    updated_at?: string;
}

interface Props extends PageProps {
    report: Report[];
    petugasUsers?: Array<{ id: number; name: string }>;
    mitraUsers?: Array<{ id: number; name: string }>;
}

/* ──────────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────────── */

const STATUS_COLORS: Record<
    Status,
    {
        badge: string;
        dot: string;
    }
> = {
    Open: {
        badge: "bg-red-50 text-red-600 border border-red-200",
        dot: "bg-red-500",
    },
    Pending: {
        badge: "bg-yellow-50 text-yellow-600 border border-yellow-200",
        dot: "bg-yellow-500",
    },
    Closed: {
        badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        dot: "bg-emerald-500",
    },
};

const TIPE_COLORS: Record<string, string> = {
    Beton: "bg-slate-100 text-slate-700",
    Besi: "bg-blue-50 text-blue-700",
    Kayu: "bg-orange-50 text-orange-700",
};

/* ──────────────────────────────────────────────────────────
   PAGE
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    
    const handleEdit = (reportItem: Report) => {
        setSelectedReport(reportItem);
        setIsEditModalOpen(true);
    };
    
    const handleViewDetail = (reportItem: Report) => {
        setSelectedReport(reportItem);
        setIsDetailModalOpen(true);
    };
    
    const filteredData = useMemo(() => {
        return report.filter((item) =>
            [
                item.id,
                item.lokasi,
                item.tipe_tiang,
                item.status_laporan,
                item.nama_mitra,
                item.petugas_mitra,
            ]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [report, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / showEntries)
    );

    const paginatedData = filteredData.slice(
        (page - 1) * showEntries,
        page * showEntries
    );

    const handleDelete = (id: number) => {
        if (!confirm("Yakin ingin menghapus laporan ini?")) {
            return;
        }

        router.delete(route("reports.destroy", id), {
            preserveScroll: true,
        });
    };

    // Transform report data to match the format expected by EditReportModal
    const transformReportForModal = (report: Report) => {
        return {
            id: report.id,
            tanggal: report.tanggal,
            deskripsi: report.deskripsi || "",
            status_laporan: report.status_laporan,
            tipe_tiang: report.tipe_tiang,
            lokasi: report.lokasi,
            petugas_lapangan: report.petugas_mitra,
            latitude: report.latitude || 0,
            longitude: report.longitude || 0,
            nama_mitra: report.nama_mitra,
        };
    };

    // Transform report data for detail modal
    const transformReportForDetail = (report: Report): ReportDetail => {
        return {
            id: report.id,
            tanggal: report.tanggal,
            lokasi: report.lokasi,
            tipe_tiang: report.tipe_tiang,
            status_laporan: report.status_laporan,
            nama_mitra: report.nama_mitra,
            petugas_mitra: report.petugas_mitra,
            latitude: report.latitude || 0,
            longitude: report.longitude || 0,
            deskripsi: report.deskripsi || "",
            created_at: report.created_at,
            updated_at: report.updated_at,
        };
    };

    return (
        <AuthLayout
            user={auth.user}
            header="Laporan Tiang"
        >
            <div className="space-y-6">

                {/* PAGE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Laporan Tiang
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Manajemen data laporan tiang bersama
                        </p>
                    </div>

                    <Link
                        href={route("reports.add")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                    >
                        <PlusIcon />
                        Tambah Laporan
                    </Link>
                </div>

                {/* CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* TOOLBAR */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 border-b border-slate-100">

                        {/* LEFT */}
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan</span>

                            <select
                                value={showEntries}
                                onChange={(e) => {
                                    setShowEntries(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[5, 10, 25, 50].map((n) => (
                                    <option key={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>

                            <span>entri</span>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-3">

                            {/* SEARCH */}
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    placeholder="Cari laporan..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {[
                                        "ID",
                                        "Tanggal",
                                        "Lokasi",
                                        "Tipe Tiang",
                                        "Status",
                                        "Mitra",
                                        "Petugas",
                                        "Aksi",
                                    ].map((item) => (
                                        <th
                                            key={item}
                                            className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                                        >
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-16 text-center text-sm text-slate-400"
                                        >
                                            Tidak ada data laporan.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item) => {
                                        const normalizedStatus =
                                            item.status_laporan.charAt(0).toUpperCase() +
                                            item.status_laporan.slice(1).toLowerCase();

                                        const statusColor =
                                            STATUS_COLORS[normalizedStatus as Status] ??
                                            STATUS_COLORS.Open;
                                        
                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition"
                                            >
                                                {/* ID */}
                                                <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                                    {item.id}
                                                </td>

                                                {/* TANGGAL */}
                                                <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                    {item.tanggal}
                                                </td>

                                                {/* LOKASI */}
                                                <td className="px-5 py-4 text-slate-600 max-w-[250px] truncate">
                                                    {item.lokasi}
                                                </td>

                                                {/* TIPE */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                            TIPE_COLORS[
                                                                item.tipe_tiang
                                                            ] ??
                                                            "bg-slate-100 text-slate-700"
                                                        }`}
                                                    >
                                                        {item.tipe_tiang}
                                                    </span>
                                                </td>

                                                {/* STATUS */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor.badge}`}
                                                    >
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${statusColor.dot}`}
                                                        />
                                                        {normalizedStatus}
                                                    </span>
                                                </td>

                                                {/* MITRA */}
                                                <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                    {item.nama_mitra}
                                                </td>

                                                {/* PETUGAS */}
                                                <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                    {item.petugas_mitra}
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {/* VIEW BUTTON */}
                                                        <button
                                                            onClick={() => handleViewDetail(item)}
                                                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition"
                                                            title="Lihat Detail">
                                                            <ViewIcon />
                                                        </button>

                                                        {/* EDIT BUTTON */}
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="w-8 h-8 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition"
                                                            title="Edit Laporan"
                                                        >
                                                            <EditIcon />
                                                        </button>

                                                        {/* DELETE BUTTON */}
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(item.id)
                                                            }
                                                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition"
                                                            title="Hapus Laporan"
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-slate-100">

                        {/* INFO */}
                        <div className="text-sm text-slate-500">
                            Menampilkan{" "}
                            <span className="font-medium text-slate-700">
                                {filteredData.length === 0
                                    ? 0
                                    : (page - 1) * showEntries + 1}
                            </span>
                            {" - "}
                            <span className="font-medium text-slate-700">
                                {Math.min(
                                    page * showEntries,
                                    filteredData.length
                                )}
                            </span>
                            {" dari "}
                            <span className="font-medium text-slate-700">
                                {filteredData.length}
                            </span>{" "}
                            data
                        </div>

                        {/* PAGINATION */}
                        <div className="flex items-center gap-2">

                            {/* PREV */}
                            <button
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((prev) => Math.max(1, prev - 1))
                                }
                                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeftIcon />
                            </button>

                            {/* PAGE NUMBERS */}
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                                        p === page
                                            ? "bg-blue-600 text-white"
                                            : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}

                            {/* NEXT */}
                            <button
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(totalPages, prev + 1)
                                    )
                                }
                                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <EditReportModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedReport(null);
                }}
                report={selectedReport ? transformReportForModal(selectedReport) : null}
                petugasUsers={petugasUsers}
                mitraUsers={mitraUsers}
            />

            {/* DETAIL MODAL */}
           <DetailReportModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedReport(null);
                }}
                report={selectedReport ? transformReportForDetail(selectedReport) : null}
            />
        </AuthLayout>
    );
}

/* ──────────────────────────────────────────────────────────
   ICONS
────────────────────────────────────────────────────────── */

function PlusIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
            />
        </svg>
    );
}

function SearchIcon({
    className = "",
}: {
    className?: string;
}) {
    return (
        <svg
            className={`w-4 h-4 ${className}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
        </svg>
    );
}

function ViewIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.415.586H9v-2a2 2 0 01.586-1.414z"
            />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6"
            />
        </svg>
    );
}

function ChevronLeftIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
            />
        </svg>
    );
}