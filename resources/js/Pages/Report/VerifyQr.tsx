import { Head } from "@inertiajs/react";

interface Laporan {
    id: string;
    tanggal: string;
}

interface Signer {
    role: string;
    name: string;
    signed_at: string | null;
}

interface Props {
    laporan: Laporan;
    signer: Signer;
    verified: boolean;
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const DataRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-slate-100 last:border-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:w-44 shrink-0">
            {label}
        </span>
        <span className="text-sm text-slate-800 font-medium">{value}</span>
    </div>
);

export default function VerifyQr({ laporan, signer, verified }: Props) {
    return (
        <>
            <Head title="Verifikasi Dokumen" />

            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-10 px-4">

                {/* Header */}
                <div className="w-full max-w-lg mb-6 flex items-center gap-3">
                    <img src="/images/Logo_PLN.svg" className="h-10 w-auto" alt="PLN Logo" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">PT PLN (Persero)</p>
                        <p className="text-sm font-bold text-slate-800 leading-tight">ULP Batam — Verifikasi Dokumen</p>
                    </div>
                </div>

                {/* Verification Status Banner */}
                <div className={`w-full max-w-lg rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 ${verified ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                    {verified ? (
                        <>
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-emerald-800 text-sm">Dokumen Terverifikasi</p>
                                <p className="text-xs text-emerald-600 mt-0.5">
                                    Tanda tangan digital valid dan sah secara hukum
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-red-800 text-sm">Verifikasi Gagal</p>
                                <p className="text-xs text-red-600 mt-0.5">Token tidak valid atau dokumen tidak ditemukan</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Signer Card */}
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm mb-5 overflow-hidden">
                    <div className="px-5 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <span className="text-lg font-bold text-amber-600">
                                {signer.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{signer.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{signer.role}</p>
                            {signer.signed_at && (
                                <p className="text-xs text-slate-400 font-mono mt-1">
                                    Ditandatangani: {formatDate(signer.signed_at)}
                                </p>
                            )}
                        </div>
                        <div className="ml-auto">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Sah
                            </span>
                        </div>
                    </div>
                </div>

                {/* Report Detail Card */}
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-800 px-5 py-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                            Detail Berita Acara
                        </span>
                        <span className="ml-auto font-mono text-xs text-amber-400">{laporan.id}</span>
                    </div>
                    <div className="px-5 py-2">
                        <DataRow label="ID Laporan" value={<span className="font-mono font-bold">{laporan.id}</span>} />
                        <DataRow label="Tanggal" value={new Date(laporan.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
                        <DataRow label="Jam Tanda Tangan" value={formatDate(signer.signed_at)} />
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-xs text-slate-400 text-center">
                    Dokumen ini diterbitkan secara elektronik oleh sistem PT PLN (Persero) ULP Batam.<br />
                    Verifikasi dilakukan otomatis melalui token QR yang tersemat pada dokumen.
                </p>
            </div>
        </>
    );
}
