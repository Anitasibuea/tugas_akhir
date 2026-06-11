import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import QRCode from "qrcode";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    report: {
        id: number | string;
        signature_qr_token?: string | null;
        role?: "manajer" | "mitra" | null;
    } | null;
}

export default function TandatanganiModal({ isOpen, onClose, report }: Props) {
    const canvasQrRef = useRef<HTMLCanvasElement>(null);
    const canvasSignatureRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [signatureBase64, setSignatureBase64] = useState<string | null>(null);

    // Draw QR code when token is available
    useEffect(() => {
        if (!isOpen || !report?.signature_qr_token || !canvasQrRef.current) return;
        const verifyUrl = `${window.location.origin}/dashboard/report/verify/${report.signature_qr_token}`;
        QRCode.toCanvas(canvasQrRef.current, verifyUrl, {
            width: 200,
            margin: 2,
            color: { dark: "#1e293b", light: "#ffffff" },
        });
    }, [isOpen, report?.signature_qr_token]);

    // Setup signature canvas when modal opens
    useEffect(() => {
        if (!isOpen || !canvasSignatureRef.current) return;
        const canvas = canvasSignatureRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = 400;
        canvas.height = 200;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // Clear any previous signature
        setSignatureBase64(null);
    }, [isOpen]);

    // Drawing logic
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasSignatureRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasSignatureRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasSignatureRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.closePath();
        // Save signature as base64
        setSignatureBase64(canvas.toDataURL());
    };

    const clearSignature = () => {
        const canvas = canvasSignatureRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setSignatureBase64(null);
    };

    const handleSubmit = () => {
        if (!report || !signatureBase64) {
            alert("Harap tanda tangani terlebih dahulu.");
            return;
        }
        setSubmitting(true);
        const endpoint = report.role === "manajer" ? route("reports.signManajer") : route("reports.signMitra");
        router.post(
            endpoint,
            {
                token: report.signature_qr_token,
                report_id: report.id,
                signature_data: signatureBase64,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error(errors);
                    alert("Gagal menandatangani. Mungkin token sudah kadaluarsa.");
                    setSubmitting(false);
                },
            }
        );
    };

    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Tanda Tangan {report.role === "manajer" ? "Manajer" : "Mitra"}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                        ✕
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600 mb-2">Scan QR ini untuk verifikasi:</p>
                        <canvas ref={canvasQrRef} className="border border-slate-200 rounded-lg p-2 bg-white" />
                        <p className="text-xs text-slate-400 mt-1">Simpan QR ini atau tunjukkan ke petugas</p>
                    </div>

                    {/* Signature Pad */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tanda Tangan Digital</label>
                        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
                            <canvas
                                ref={canvasSignatureRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                style={{ width: "100%", height: "auto", cursor: "crosshair" }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={clearSignature}
                            className="mt-1 text-xs text-slate-500 hover:text-red-600 underline"
                        >
                            Hapus Tanda Tangan
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !signatureBase64}
                        className="px-5 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        {submitting ? "Memproses..." : "Tandatangani"}
                    </button>
                </div>
            </div>
        </div>
    );
}