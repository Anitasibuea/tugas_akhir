import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { PageProps } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Report {
    id: number;
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
    signed_by?: number | null;
    signature_data?: string | null;
    signature_qr_token?: string | null;
    signed_at?: string | null;
    panjang_tiang?: string;
    jenis_kabel?: string;
}

interface Props extends PageProps {
    report: Report;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;
const BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;
const ROMAN_MONTH = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"] as const;

function angkaKeTeks(num: number): string {
    const satuan = ["","Satu","Dua","Tiga","Empat","Lima","Enam","Tujuh","Delapan","Sembilan","Sepuluh","Sebelas"];
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
    if (year === 2026) return "Dua Ribu Dua Puluh Enam";
    const ribu = Math.floor(year / 1000);
    const sisa = year % 1000;
    return angkaKeTeks(ribu) + " Ribu " + angkaKeTeks(sisa);
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

// ─── Real QR Code Component using 'qrcode' ─────────────────────────────────

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
            color: {
                dark: "#0f172a", // dark slate
                light: "#ffffff",
            },
        }, (error) => {
            if (error) console.error("QR generation failed:", error);
        });
    }, [text, size]);

    return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} />;
};

// ─── Main Component ────────────────────────────────────────────────────────

export default function BeritaAcaraPDF({ report }: Props) {
    const date = parseTanggal(report.tanggal);
    const nomorSurat = buildNomorSurat(report.nama_mitra, report.id, date.year, date.monthIndex);

    const displayStatus = report.signed_by ? "Selesai" : "Dalam Proses";
    const statusClass = {
        Selesai: "bg-green-100 text-green-800 border border-green-300",
        "Dalam Proses": "bg-amber-100 text-amber-800 border border-amber-300",
        Ditunda: "bg-red-100 text-red-800 border border-red-300",
    }[displayStatus];

    const tableRows = [
        { no: 1, label: "ID Registrasi Lapangan", value: <span className="font-mono font-bold tracking-tight">{report.id}</span> },
        { no: 2, label: "Tanggal Pelaporan / Verifikasi", value: `${date.dayNum} ${date.monthName} ${date.year}` },
        { no: 3, label: "Lokasi Penempatan Tiang", value: <strong>{report.lokasi}</strong> },
        {
            no: 4,
            label: "Koordinat Lokasi (GPS)",
            value: <span className="font-mono text-[10px]">Latitude: {report.latitude} | Longitude: {report.longitude}</span>,
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
            label: "Status Akhir Pekerjaan",
            value: (
                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wide font-mono ${statusClass}`}>
                    {displayStatus.toUpperCase()}
                </span>
            ),
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    // QR data strings
    const qrTextPln = `VERIFIED:PTPLN-${report.id}`;
    const qrTextMitra = `VERIFIED:${report.nama_mitra.toUpperCase()}-${report.petugas_lapangan}-${report.id}-${displayStatus}`;

    return (
        <>
            <style>
                {`
                    @media print {
                        .laravel-debugbar, #laravel-debugbar, .debug-bar, [class*="debugbar"], [class*="DebugBar"] {
                            display: none !important;
                        }
                        @page {
                            margin: 0.5cm;
                        }
                        body {
                            margin: 0;
                        }
                        .print-hide {
                            display: none !important;
                        }
                    }
                `}
            </style>
            <div className="font-['Georgia',serif] text-slate-800 text-xs bg-slate-100 py-8 print:bg-white">
                {/* Print Button - only on screen */}
                <div className="print:hidden flex justify-end max-w-[595px] mx-auto mb-4 px-2">
                    <button
                        onClick={handlePrint}
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
                                    <th className="bg-slate-100 px-2 py-1.5 border border-slate-500 font-mono text-[9px] font-bold text-left w-8 text-center">
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
                            {/* Pihak Pertama */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="text-center">
                                    <div className="font-bold text-[11px]">PIHAK PERTAMA</div>
                                    <div className="text-[9px] text-slate-500">PT PLN (Persero) ULP Batam</div>
                                </div>
                                <div className="relative w-20 h-20 border border-slate-200 rounded bg-white p-1 flex items-center justify-center">
                                    <QRCodeReal text={qrTextPln} size={68} />
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-blue-800 text-white text-[7px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap font-mono">
                                        PLN OK
                                    </div>
                                </div>
                                <div className="text-center mt-1">
                                    <div className="font-bold text-[11px] underline">HERLAN FRANSISCO</div>
                                    <div className="text-[9px] text-slate-500">Manager Unit Layanan</div>
                                </div>
                            </div>

                            {/* Pihak Kedua (Mitra) */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="text-center">
                                    <div className="font-bold text-[11px]">PIHAK KEDUA</div>
                                    <div className="text-[9px] text-slate-500 uppercase">{report.nama_mitra.toUpperCase()}</div>
                                </div>
                                <div className="relative w-20 h-20 border border-slate-200 rounded bg-white p-1 flex items-center justify-center">
                                    <QRCodeReal text={qrTextMitra} size={68} />
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[7px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap font-mono">
                                        {report.nama_mitra.substring(0, 8).toUpperCase()}
                                    </div>
                                </div>
                                <div className="text-center mt-1">
                                    <div className="font-bold text-[11px] underline">{report.petugas_lapangan.toUpperCase()}</div>
                                    <div className="text-[9px] text-slate-500">Petugas Lapangan Mitra</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}