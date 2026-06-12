import { QrCodeIcon } from "@heroicons/react/24/solid";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    report: {
        id: number | string;
        role?: "manajer" | "mitra" | null;
    } | null;
    isLoading?: boolean;
}

export default function TandatanganiModal({ isOpen, onClose, onConfirm, report, isLoading = false }: Props) {
    if (!isOpen || !report) return null;

    const roleName = report.role === "manajer" ? "Manajer" : "Mitra";
    const roleColor = report.role === "manajer" ? "indigo" : "violet";

    const colorMap = {
        indigo: {
            iconBg: "bg-indigo-50",
            iconText: "text-indigo-600",
            border: "border-indigo-100",
            btn: "bg-indigo-600 hover:bg-indigo-700",
        },
        violet: {
            iconBg: "bg-violet-50",
            iconText: "text-violet-600",
            border: "border-violet-100",
            btn: "bg-violet-600 hover:bg-violet-700",
        },
    };

    const c = colorMap[roleColor];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">
                        Generate QR — {roleName}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition disabled:opacity-40"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 flex flex-col items-center gap-4 text-center">
                    <div className={`w-16 h-16 rounded-full ${c.iconBg} flex items-center justify-center`}>
                        <QrCodeIcon className={`w-8 h-8 ${c.iconText}`} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-800 mb-1">
                            Buat QR Code untuk Laporan #{report.id}?
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            QR Code akan dikirim ke <span className="font-medium text-slate-700">{roleName}</span> untuk
                            ditandatangani secara digital. Pastikan data laporan sudah lengkap sebelum melanjutkan.
                        </p>
                    </div>

                    <div className={`w-full rounded-xl border ${c.border} bg-slate-50 px-4 py-3 text-left`}>
                        <p className="text-xs text-slate-500 mb-0.5">Langkah selanjutnya</p>
                        <p className="text-xs text-slate-700">
                            {report.role === "manajer"
                                ? "Setelah QR di-generate, Manajer dapat memindai dan menandatangani laporan."
                                : "Setelah QR di-generate, Mitra dapat memindai dan menandatangani laporan."}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-40"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2 text-sm font-medium ${c.btn} text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <QrCodeIcon className="w-4 h-4" />
                                Generate QR
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
