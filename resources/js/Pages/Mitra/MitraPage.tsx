import { ReactNode, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthLayout";
import { PageProps, User } from "@/types";
import EditMitraForm from "@/Components/editmitramodal";
import Modal from "@/Components/Modal";

// ─── Icons ──────────────────────────────────────────────────────────────────
interface AuthenticatedLayoutProps {
    user: User;
    header?: ReactNode;
}

const BuildingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

const UserCheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
    </svg>
);

const MapPinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M17 3l4 4-7 7H10v-4l7-7z" />
        <path d="M4 20h16" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

// ─── Role Helper ─────────────────────────────────────────────────────────────
// admin  → full CRUD (Lihat Detail + Edit + Delete + Tambah)
// manajer → view only (Lihat Detail only)

function isAdmin(role?: string | null): boolean {
    return String(role ?? "").toLowerCase() === "admin";
}

// ─── Status Badge ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
    const active = status?.toLowerCase() === "aktif";
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
            active
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-600 ring-1 ring-red-200"
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
            {active ? "Aktif" : "Nonaktif"}
        </span>
    );
};

// ─── Info Row ────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-2.5 text-slate-500 text-[13px]">
        <span className="text-slate-400 flex-shrink-0">{icon}</span>
        <span className="truncate">{text}</span>
    </div>
);

// ─── Company Card ────────────────────────────────────────────────────────────

interface CardProps {
    id: number;
    companyName: string;
    address: string;
    phone: string;
    email: string;
    petugasMapping: string;
    status: string;
    canEdit: boolean; // derived from role, passed down from parent
    onLihatDetail: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const CompanyCard = ({
    companyName, address, phone, email, petugasMapping, status,
    canEdit, onLihatDetail, onEdit, onDelete,
}: CardProps) => {
    const initials = companyName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
            {/* Top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

            <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-slate-800 text-[15px] leading-snug line-clamp-2">
                                {companyName}
                            </h3>
                            <StatusBadge status={status} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                            <MapPinIcon />
                            <span className="truncate">{address}</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Info */}
                <div className="flex flex-col gap-2">
                    <InfoRow icon={<PhoneIcon />} text={phone} />
                    <InfoRow icon={<MailIcon />} text={email} />
                    <InfoRow icon={<UserCheckIcon />} text={petugasMapping} />
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-1">
                    {/* Lihat Detail — visible to ALL roles */}
                    

                    {/* Edit & Delete — admin only */}
                    {canEdit && (
                        <>
                            <button
                                onClick={onEdit}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 text-[13px] font-medium transition-colors duration-150"
                            >
                                <EditIcon />
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-[13px] font-medium transition-colors duration-150"
                            >
                                <TrashIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = ({ canEdit }: { canEdit: boolean }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-dashed border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <BuildingIcon />
        </div>
        <p className="text-slate-700 font-semibold text-base mb-1">Belum ada data mitra</p>
        <p className="text-slate-400 text-sm mb-6 text-center max-w-xs">
            {canEdit
                ? "Mulai tambahkan mitra perusahaan Anda untuk mengelola data dengan lebih mudah."
                : "Belum ada data mitra yang tersedia saat ini."}
        </p>
        {canEdit && (
            <button
                onClick={() => router.get("/mitra/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150"
            >
                <PlusIcon />
                Tambah Mitra Pertama
            </button>
        )}
    </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

interface MitraData {
    id: number;
    nama_perusahaan: string;
    alamat: string;
    telepon: string;
    email: string;
    petugas_mapping: { id: number; name: string }| null;
    status: string;
}

interface MitraPageProps extends PageProps {
    mitras: MitraData[];
}

export default function MitraPage({ auth, mitras }: MitraPageProps) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "nonaktif">("semua");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMitra, setSelectedMitra] = useState<MitraData | null>(null);
    // Derive permissions once from the authenticated user's role
    const canEdit = isAdmin(auth.user?.role);

    const filtered = (mitras ?? []).filter((m) => {
        const matchSearch =
            m.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            filterStatus === "semua" || m.status.toLowerCase() === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus mitra "${name}"?`)) router.delete(`/dashboard/mitra/${id}`);
    };
    const handleEdit = (mitra: MitraData) => {
        setSelectedMitra(mitra);
        setIsEditModalOpen(true);
    };
    const handleEditSuccess = () => {
        // Refresh the page data or update local state
        router.reload({ only: ['mitras'] });
    };

    const counts = {
        semua: (mitras ?? []).length,
        aktif: (mitras ?? []).filter((m) => m.status.toLowerCase() === "aktif").length,
        nonaktif: (mitras ?? []).filter((m) => m.status.toLowerCase() === "nonaktif").length,
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Daftar Mitra" />

            <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto space-y-7">

                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
                                Manajemen
                            </p>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Daftar Mitra
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {counts.semua} perusahaan terdaftar · {counts.aktif} aktif
                            </p>
                        </div>

                        {/* Tambah Mitra — admin only */}
                        {canEdit && (
                            <Link
                                href={route("mitra.add")}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-all duration-150 self-start sm:self-auto"
                            >
                                <PlusIcon />
                                Tambah Mitra
                            </Link>
                        )}
                    </div>

                    {/* ── Toolbar: Search + Filter ── */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau email mitra..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-700 placeholder-slate-400 transition"
                            />
                        </div>

                        {/* Filter pills */}
                        <div className="flex gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start sm:self-auto">
                            {(["semua", "aktif", "nonaktif"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilterStatus(f)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 ${
                                        filterStatus === f
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {f === "semua" ? `Semua (${counts.semua})` : f === "aktif" ? `Aktif (${counts.aktif})` : `Nonaktif (${counts.nonaktif})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Cards Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.length > 0 ? (
                            filtered.map((mitra) => (
                                <CompanyCard
                                    key={mitra.id}
                                    id={mitra.id}
                                    companyName={mitra.nama_perusahaan}
                                    address={mitra.alamat}
                                    phone={mitra.telepon}
                                    email={mitra.email}
                                    petugasMapping={mitra.petugas_mapping?.name ?? '—'}
                                    status={mitra.status}
                                    canEdit={canEdit}
                                    onLihatDetail={() => router.get(`/mitra/${mitra.id}`)}
                                    onEdit={() => handleEdit(mitra)}
                                    onDelete={() => handleDelete(mitra.id, mitra.nama_perusahaan)}
                                />
                            ))
                        ) : (
                            <EmptyState canEdit={canEdit} />
                        )}
                    </div>

                    {/* ── No results from filter/search ── */}
                    {filtered.length === 0 && (mitras ?? []).length > 0 && (
                        <p className="text-center text-slate-400 text-sm py-4">
                            Tidak ada mitra yang cocok dengan pencarian.
                        </p>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMitra(null);
                }}
                title="Edit Data Mitra"
                size="lg"
            >
                <EditMitraForm
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedMitra(null);
                    }}
                    mitra={selectedMitra}
                    onSuccess={handleEditSuccess}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}