import React, { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BeritaAcaraData {
  id: string;
  tanggal: string;
  lokasi: string;
  lat: number;
  lng: number;
  tipeTiang: "Beton" | "Besi" | "Kayu";
  panjangTiang: string;
  jenisKabel: string;
  mitra: string;
  petugas: string;
  status: "Selesai" | "Dalam Proses" | "Ditunda";
}

interface DateDetails {
  hari: string;
  tgl: string;
  bln: string;
  thn: string;
  formatted: string;
  dayNum: number;
  monthName: string;
  year: number;
  monthIndex: number;
}

// ─── Static Data (replaces form/props) ────────────────────────────────────────

const staticData: BeritaAcaraData = {
  id: "BA-PLN-2026-082",
  tanggal: "2026-06-08",
  lokasi: "Kawasan Industri Mukakuning, Batam Center",
  lat: 1.0892,
  lng: 104.0521,
  tipeTiang: "Beton",
  panjangTiang: "14 meter (SNI 04-1234-2025)",
  jenisKabel: "Fiber Optic 48 Core (SM / G.652.D)",
  mitra: "PT Mora Telematika Indonesia",
  petugas: "Rizki Akbar",
  status: "Selesai",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function parseTanggal(dateStr: string): DateDetails {
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

function buildNomorSurat(data: BeritaAcaraData, date: DateDetails): string {
  const mitraSlug = data.mitra.toUpperCase().replace(/\s+/g, "-");
  const seq = data.id.split("-").pop() ?? "000";
  return `BA-PLN/${mitraSlug}/${ROMAN_MONTH[date.monthIndex]}/${date.year}/${seq}`;
}

// ─── QR Canvas (decorative QR-style pattern) ────────────────────────────────

interface QRCanvasProps {
  text: string;
  size?: number;
}

const QRCanvas: React.FC<QRCanvasProps> = ({ text, size = 68 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mod = 25;
    const cell = Math.floor(size / mod);
    const data: boolean[][] = Array.from({ length: mod }, (_, i) =>
      Array.from({ length: mod }, (_, j) => {
        const h = (i * 7 + j * 13 + text.charCodeAt((i + j) % text.length)) % 3;
        return h !== 0;
      })
    );

    // Finder patterns (corners)
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        data[r][c] = true;
        data[r][mod - 1 - c] = true;
        data[mod - 1 - r][c] = true;
      }
    }
    for (let r = 2; r < 5; r++) {
      for (let c = 2; c < 5; c++) {
        data[r][c] = true;
        data[r][mod - 1 - c] = true;
        data[mod - 1 - r][c] = true;
      }
    }
    for (let r = 1; r < 6; r++) {
      for (let c = 1; c < 6; c++) {
        if (r === 1 || r === 5 || c === 1 || c === 5) {
          data[r][c] = false;
          data[r][mod - 1 - c] = false;
          data[mod - 1 - r][c] = false;
        }
      }
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#0f172a";
    for (let r = 0; r < mod; r++) {
      for (let c = 0; c < mod; c++) {
        if (data[r][c]) ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
      }
    }
  }, [text, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

// ─── Main Component (Static Data, Tailwind Only) ─────────────────────────────

const BeritaAcara: React.FC = () => {
  const data = staticData;
  const date = parseTanggal(data.tanggal);
  const nomorSurat = buildNomorSurat(data, date);

  // Status badge style mapping (Tailwind)
  const statusClass = {
    Selesai: "bg-green-100 text-green-800 border border-green-300",
    "Dalam Proses": "bg-amber-100 text-amber-800 border border-amber-300",
    Ditunda: "bg-red-100 text-red-800 border border-red-300",
  }[data.status];

  // Table rows (static data mapped)
  const tableRows: Array<{ no: number; label: string; value: React.ReactNode }> = [
    { no: 1, label: "ID Registrasi Lapangan", value: <span className="font-mono font-bold tracking-tight">{data.id}</span> },
    { no: 2, label: "Tanggal Pelaporan / Verifikasi", value: `${date.dayNum} ${date.monthName} ${date.year}` },
    { no: 3, label: "Lokasi Penempatan Tiang", value: <strong>{data.lokasi}</strong> },
    {
      no: 4,
      label: "Koordinat Lokasi (GPS)",
      value: <span className="font-mono text-[10px]">Latitude: {data.lat} | Longitude: {data.lng}</span>,
    },
    {
      no: 5,
      label: "Tipe / Material Konstruksi Tiang",
      value: (
        <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[9.5px] font-bold tracking-wide">
          {data.tipeTiang}
        </span>
      ),
    },
    { no: 6, label: "Spesifikasi Panjang Tiang", value: <em className="font-semibold not-italic">{data.panjangTiang}</em> },
    { no: 7, label: "Jenis / Kapasitas Kabel Terpasang", value: <em>{data.jenisKabel}</em> },
    {
      no: 8,
      label: "Status Akhir Pekerjaan",
      value: (
        <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wide font-mono ${statusClass}`}>
          {data.status.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="font-['Georgia',serif] text-slate-800 text-xs bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="w-[595px] min-h-[842px] mx-auto bg-white border border-slate-200 rounded-lg shadow-md px-10 py-8 print:shadow-none print:border-0 flex flex-col">
        {/* Kop Surat */}
        <div className="flex justify-between items-start border-b-[3px] double-border-slate-800 pb-3 mb-5">
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
            <div className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 mt-1">{data.id}</div>
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
                <strong className="uppercase">{data.mitra.toUpperCase()}</strong>, berkedudukan di
                wilayah Batam, dalam hal ini diwakili oleh petugas lapangan atas nama{" "}
                <strong>{data.petugas}</strong>, selanjutnya disebut sebagai{" "}
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

        {/* Catatan & Ketentuan */}
        <div className="text-[10px] leading-relaxed text-slate-700 mb-4">
          <p className="font-bold text-slate-800 mb-1">Catatan &amp; Ketentuan Teknis Lapangan:</p>
          <ul className="pl-4 space-y-1 list-disc">
            <li className="mb-1">Pemasangan kabel pada tiang beton wajib mematuhi standar keselamatan kerja kelistrikan (K3) serta ruang bebas (clearance area) minimal yang diizinkan oleh PLN.</li>
            <li className="mb-1">Kabel dilarang keras melilit ataupun mengganggu jalur penghantar tegangan listrik utama pada tiang listrik PLN.</li>
            <li>Segala jenis pemeliharaan rutin maupun penanganan darurat atas kabel yang menempel pada tiang tumpu menjadi tanggung jawab penuh dari PIHAK KEDUA (Mitra).</li>
          </ul>
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
                <QRCanvas text={`VERIFIED:PTPLN-${data.id}`} />
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
                <div className="text-[9px] text-slate-500 uppercase">{data.mitra.toUpperCase()}</div>
              </div>
              <div className="relative w-20 h-20 border border-slate-200 rounded bg-white p-1 flex items-center justify-center">
                <QRCanvas text={`VERIFIED:${data.mitra.toUpperCase()}-${data.petugas}-${data.id}-${data.status}`} />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[7px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap font-mono">
                  {data.mitra.substring(0, 8).toUpperCase()}
                </div>
              </div>
              <div className="text-center mt-1">
                <div className="font-bold text-[11px] underline">{data.petugas.toUpperCase()}</div>
                <div className="text-[9px] text-slate-500">Petugas Lapangan Mitra</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaAcara;