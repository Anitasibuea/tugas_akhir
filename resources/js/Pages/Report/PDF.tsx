import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { PageProps } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Report {
    id: number | string;
    tanggal: string;
    lokasi: string;
    latitude: number;
    longitude: number;
    tipe_tiang: string;
    status_laporan: string;
    nama_mitra: string;
    petugas_lapangan: string;
    deskripsi?: string;
    foto?: string;
    panjang_tiang?: string;
    jenis_kabel?: string;
    jumlah_kabel?: string;
    // Manajer signature fields
    signed_by_manajer?: number | null;
    signed_at_manajer?: string | null;
    signature_qr_manajer?: string | null;
    // Mitra signature fields
    signed_by_mitra?: number | null;
    signed_at_mitra?: string | null;
    signature_qr_mitra?: string | null;
}

interface Props extends PageProps {
    report: Report;
    manajerName: string; // ← add
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;
const BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;
const ROMAN_MONTH = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"] as const;

function angkaKeTeks(num: number): string {
    const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    if (num <= 11) return satuan[num];
    if (num < 20) return angkaKeTeks(num - 10) + " Belas";
    if (num < 100) {
        const puluh = Math.floor(num / 10);
        const sisa = num % 10;
        return satuan[puluh] + " Puluh" + (sisa ? " " + satuan[sisa] : "");
    }
    return num.toString();
}

function tahunKeTeks(year: number): string {
    const ribu = Math.floor(year / 1000);
    const ratus = Math.floor((year % 1000) / 100);
    const puluhan = year % 100;
    let result = angkaKeTeks(ribu) + " Ribu";
    if (ratus > 0) result += " " + angkaKeTeks(ratus) + " Ratus";
    if (puluhan > 0) result += " " + angkaKeTeks(puluhan);
    return result.trim();
}

function parseTanggal(dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return {
        hari: HARI[date.getDay()],
        tgl: angkaKeTeks(day),
        bln: BULAN[month],
        thn: tahunKeTeks(year),
        formatted: `${String(day).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`,
        dayNum: day,
        monthName: BULAN[month],
        year,
        monthIndex: month,
    };
}

function buildNomorSurat(mitra: string, id: string | number, year: number, monthIndex: number): string {
    const mitraSlug = mitra.toUpperCase().replace(/\s+/g, "-");
    const seq = String(id).slice(-3);
    return `BA-PLN/${mitraSlug}/${ROMAN_MONTH[monthIndex]}/${year}/${seq}`;
}

function formatTanggalId(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

// ─── QR Code Component ──────────────────────────────────────────────────────

interface QRCodeRealProps {
    text: string;
    size?: number;
}

const QRCodeReal: React.FC<QRCodeRealProps> = ({ text, size = 68 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            margin: 1,
            color: { dark: "#0f172a", light: "#ffffff" },
        }, (error) => {
            if (error) console.error("QR generation failed:", error);
        });
    }, [text, size]);

    return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} />;
};

// ─── Signature Block Component ──────────────────────────────────────────────

interface SignatureBlockProps {
    title: string;
    subtitle: string;
    name: string;
    role: string;
    qrText: string;
    signedAt?: string | null;
    badgeColor: "blue" | "violet";
}

const SignatureBlock: React.FC<SignatureBlockProps> = ({
    title, subtitle, name, role, qrText, signedAt, badgeColor,
}) => {

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="text-center">
                <div className="font-bold text-[11px]">{title}</div>
                <div className="text-[9px] text-slate-500 uppercase">{subtitle}</div>
            </div>
            <div className="relative w-28 h-28 border border-slate-200 rounded bg-white p-1 flex items-center justify-center">
                {qrText ? (
                    <QRCodeReal text={qrText} size={100} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-300">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="4" height="4" rx="0.5" />
                            <rect x="19" y="19" width="2" height="2" rx="0.5" />
                        </svg>
                        <span className="text-[8px] font-mono text-slate-400 text-center leading-tight">Belum<br />Ditandatangani</span>
                    </div>
                )}
            </div>
            <div className="text-center mt-1">
                <div className="font-bold text-[11px] underline">{name.toUpperCase()}</div>
                <div className="text-[9px] text-slate-500">{role}</div>
                {signedAt && (
                    <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                        {formatTanggalId(signedAt)}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BeritaAcaraPDF({ report, manajerName }: Props) {
    const date = parseTanggal(report.tanggal);
    const nomorSurat = buildNomorSurat(report.nama_mitra, report.id, date.year, date.monthIndex);

    // Signature state
    const manajerSigned = !!report.signed_by_manajer;
    const mitraSigned = !!report.signed_by_mitra;
    const bothSigned = manajerSigned && mitraSigned;

    const displayStatus = bothSigned
        ? "Selesai"
        : manajerSigned
            ? "Menunggu TTD Mitra"
            : "Dalam Proses";

    const statusClass: Record<string, string> = {
        "Selesai": "bg-green-100 text-green-800 border border-green-300",
        "Menunggu TTD Mitra": "bg-blue-100 text-blue-800 border border-blue-300",
        "Dalam Proses": "bg-amber-100 text-amber-800 border border-amber-300",
    };

    // Build QR text — use real verify URL if token exists, fall back to signed/pending label
    const verifyBase = typeof window !== "undefined" ? window.location.origin : "";

    const qrTextManajer = report.signature_qr_manajer
        ? `${verifyBase}/dashboard/report/verify/${report.signature_qr_manajer}`
        : null;
    // : manajerSigned
    //     ? `SIGNED:PLN-MANAJER-${report.id}`
    //     : `PENDING:PLN-MANAJER-${report.id}`;

    const qrTextMitra = report.signature_qr_mitra
        ? `${verifyBase}/dashboard/report/verify/${report.signature_qr_mitra}`
        // : mitraSigned
        //     ? `SIGNED:${report.nama_mitra.toUpperCase()}-${report.id}`
        //     : `PENDING:${report.nama_mitra.toUpperCase()}-${report.id}`;
        : null;

    // Table rows
    const tableRows = [
        {
            no: 1,
            label: "ID Registrasi Lapangan",
            value: <span className="font-mono font-bold tracking-tight">{report.id}</span>,
        },
        {
            no: 2,
            label: "Tanggal Pelaporan / Verifikasi",
            value: `${date.dayNum} ${date.monthName} ${date.year}`,
        },
        {
            no: 3,
            label: "Lokasi Penempatan Tiang",
            value: <strong>{report.lokasi}</strong>,
        },
        {
            no: 4,
            label: "Koordinat Lokasi (GPS)",
            value: (
                <span className="font-mono text-[10px]">
                    Latitude: {report.latitude} | Longitude: {report.longitude}
                </span>
            ),
        },
        {
            no: 5,
            label: "Tipe / Material Konstruksi Tiang",
            value: (
                <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[9.5px] font-bold tracking-wide">
                    {report.tipe_tiang}
                </span>
            ),
        },
        {
            no: 6,
            label: "Spesifikasi Panjang Tiang",
            value: <em className="font-semibold not-italic">{report.panjang_tiang || "Data tidak tersedia"}</em>,
        },
        {
            no: 7,
            label: "Jenis / Kapasitas Kabel Terpasang",
            value: <em>{report.jenis_kabel || "Data tidak tersedia"}</em>,
        },
        {
            no: 8,
            label: "Jumlah Kabel",
            value: <em>{report.jumlah_kabel || "Data tidak tersedia"}</em>,
        },
        {
            no: 9,
            label: "Status Akhir Pekerjaan",
            value: (
                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wide font-mono ${statusClass[displayStatus] ?? "bg-slate-100 text-slate-700"}`}>
                    {displayStatus.toUpperCase()}
                </span>
            ),
        },
    ];

    return (
        <>
            <style>{`
                @media print {
                    .laravel-debugbar, #laravel-debugbar, .debug-bar,
                    [class*="debugbar"], [class*="DebugBar"] {
                        display: none !important;
                    }
                    @page { margin: 0.5cm; }
                    body { margin: 0; }
                    .print-hide { display: none !important; }
                }
            `}</style>

            <div className="font-['Georgia',serif] text-slate-800 text-xs bg-slate-100 py-8 print:bg-white">

                {/* Print Button */}
                <div className="print:hidden flex justify-end max-w-[595px] mx-auto mb-4 px-2">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-6 rounded-md shadow-sm"
                    >
                        🖨️ Cetak / Simpan PDF
                    </button>
                </div>

                {/* A4 Document */}
                <div className="w-[595px] min-h-[842px] mx-auto bg-white border border-slate-200 rounded-lg shadow-md px-10 py-8 print:shadow-none print:border-0 flex flex-col">

                    {/* Kop Surat */}
                    <div className="flex justify-between items-start border-b-[3px] border-slate-800 pb-3 mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-amber-400 text-slate-800 w-9 h-9 flex items-center justify-center rounded font-black text-xl">
                                ⚡
                            </div>
                            <div>
                                <p className="font-bold text-base tracking-wide m-0 leading-tight">PT PLN (PERSERO)</p>
                                <p className="text-[9px] text-slate-600 font-mono tracking-wider m-0">UNIT LAYANAN PELANGGAN BATAM</p>
                                <p className="text-[8px] text-slate-400 mt-0.5">Jl. Engku Putri No. 3, Batam Center, Kepulauan Riau</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] text-slate-500 tracking-[0.12em] uppercase font-mono">Form Laporan Bersama</div>
                            <div className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 mt-1">{report.id}</div>
                        </div>
                    </div>

                    {/* Judul & Nomor Surat */}
                    <div className="text-center mb-5">
                        <h2 className="text-[13px] font-bold tracking-wide border-b border-slate-800 inline-block pb-0.5 uppercase">
                            BERITA ACARA PEMANFAATAN TIANG BERSAMA
                        </h2>
                        <div className="font-mono text-[10px] text-slate-500 mt-1.5">Nomor: {nomorSurat}</div>
                    </div>

                    {/* Pembuka */}
                    <div className="text-[11.5px] leading-relaxed text-justify mb-3.5">
                        <p>
                            Pada hari ini <strong>{date.hari}</strong> tanggal <strong>{date.tgl}</strong> bulan{" "}
                            <strong>{date.bln}</strong> tahun <strong>{date.thn}</strong> ({date.formatted}), yang
                            bertanda tangan di bawah ini masing-masing pihak sepakat untuk menandatangani Berita
                            Acara Pemanfaatan Tiang Bersama ini:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded p-2.5 my-2.5">
                            <div className="grid grid-cols-[20px_1fr] gap-x-1.5 text-[11px] leading-relaxed mb-1">
                                <span className="font-bold">I.</span>
                                <span>
                                    <strong>PT PLN (Persero) ULP Batam</strong>, bertindak sebagai pengelola dan
                                    penyedia infrastruktur tiang tumpu listrik umum, selanjutnya disebut sebagai{" "}
                                    <strong>PIHAK PERTAMA</strong>.
                                </span>
                            </div>
                            <div className="grid grid-cols-[20px_1fr] gap-x-1.5 text-[11px] leading-relaxed">
                                <span className="font-bold">II.</span>
                                <span>
                                    <strong className="uppercase">{report.nama_mitra.toUpperCase()}</strong>, berkedudukan di
                                    wilayah Batam, dalam hal ini diwakili oleh petugas lapangan atas nama{" "}
                                    <strong>{report.petugas_lapangan}</strong>, selanjutnya disebut sebagai{" "}
                                    <strong>PIHAK KEDUA (MITRA)</strong>.
                                </span>
                            </div>
                        </div>
                        <p className="mt-2.5">
                            Menyatakan bahwa kedua belah pihak telah melakukan pemeriksaan fisik dan inventarisasi
                            teknis secara saksama di lapangan demi kepentingan pemanfaatan ruang udara (kabel
                            telekomunikasi/FO) di fasilitas tiang milik PIHAK PERTAMA dengan detail laporan
                            rincian teknis sebagai berikut:
                        </p>
                    </div>

                    {/* Tabel Data Teknis */}
                    <div className="my-3.5">
                        <table className="w-full border-collapse text-[10.5px]">
                            <thead>
                                <tr>
                                    <th className="bg-slate-100 px-2 py-1.5 border border-slate-500 font-mono text-[9px] font-bold text-center w-8">
                                        No
                                    </th>
                                    <th className="bg-slate-100 px-2 py-1.5 border border-slate-500 font-mono text-[9px] font-bold text-left">
                                        Parameter Lapangan
                                    </th>
                                    <th className="bg-slate-100 px-2 py-1.5 border border-slate-500 font-mono text-[9px] font-bold text-left">
                                        Hasil Pengukuran &amp; Keterangan
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row) => (
                                    <tr key={row.no}>
                                        <td className="border border-slate-500 px-2 py-1.5 text-center font-mono">{row.no}</td>
                                        <td className="border border-slate-500 px-2 py-1.5 bg-slate-50/40 font-semibold">{row.label}</td>
                                        <td className="border border-slate-500 px-2 py-1.5">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tanda Tangan & QR Verification */}
                    <div className="border-t border-slate-200 pt-4 mt-auto">
                        <p className="text-[10px] text-center text-slate-500 italic mb-4">
                            "Berita Acara ini sah dan berkekuatan hukum sejak ditandatangani serta diverifikasi secara elektronik."
                        </p>
                        <div className="grid grid-cols-2 gap-4">

                            {/* Pihak Pertama — Manajer */}
                            <SignatureBlock
                                title="PIHAK PERTAMA"
                                subtitle="PT PLN (Persero) ULP Batam"
                                name={manajerName}
                                role="Manager Unit Layanan"
                                qrText={qrTextManajer}
                                signedAt={report.signed_at_manajer}
                                badgeColor="blue"
                            />

                            {/* Pihak Kedua — Mitra */}
                            <SignatureBlock
                                title="PIHAK KEDUA"
                                subtitle={report.nama_mitra}
                                name={report.petugas_lapangan}
                                role="Petugas Lapangan Mitra"
                                qrText={qrTextMitra}
                                signedAt={report.signed_at_mitra}
                                badgeColor="violet"
                            />

                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
