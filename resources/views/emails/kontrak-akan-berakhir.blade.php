<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="background-color:#f4f4f4;font-family:Arial,sans-serif;margin:0;padding:20px;">
    <div style="background:#fff;margin:20px auto;border-radius:8px;overflow:hidden;max-width:600px;">

        {{-- Header --}}
        <div style="background-color:#d97706;padding:24px;text-align:center;">
            <h2 style="color:#ffffff;font-size:22px;margin:0;">
                ⚠️ Kontrak Akan Berakhir dalam 7 Hari
            </h2>
        </div>

        {{-- Content --}}
        <div style="padding:24px 32px;">
            <p style="font-size:14px;color:#374151;">Yth. {{ $userName }},</p>
            <p style="font-size:14px;color:#374151;">
                Kontrak untuk laporan berikut akan berakhir dalam <strong>7 hari</strong>.
                Mohon segera persiapkan perpanjangan atau tindakan yang diperlukan.
            </p>

            <hr style="border-color:#e5e7eb;margin:20px 0;">

            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="font-size:13px;color:#6b7280;font-weight:bold;width:140px;padding:6px 0;">
                        ID Laporan
                    </td>
                    <td style="font-size:13px;color:#111827;padding:6px 0;">
                        {{ $laporanId }}
                    </td>
                </tr>
                <tr>
                    <td style="font-size:13px;color:#6b7280;font-weight:bold;width:140px;padding:6px 0;">
                        Mitra
                    </td>
                    <td style="font-size:13px;color:#111827;padding:6px 0;">
                        {{ $namaMitra }}
                    </td>
                </tr>
                <tr>
                    <td style="font-size:13px;color:#6b7280;font-weight:bold;width:140px;padding:6px 0;">
                        Lokasi
                    </td>
                    <td style="font-size:13px;color:#111827;padding:6px 0;">
                        {{ $lokasi }}
                    </td>
                </tr>
                <tr>
                    <td style="font-size:13px;color:#6b7280;font-weight:bold;width:140px;padding:6px 0;">
                        Akhir Kontrak
                    </td>
                    <td style="font-size:13px;color:#d97706;font-weight:bold;padding:6px 0;">
                        {{ $akhirKontrak }}
                    </td>
                </tr>
            </table>

            <hr style="border-color:#e5e7eb;margin:20px 0;">

            <a href="{{ $url }}"
               style="background-color:#d97706;color:#fff;padding:12px 24px;border-radius:6px;
                      text-decoration:none;font-size:14px;display:inline-block;margin-top:8px;">
                Lihat Laporan
            </a>
        </div>

        {{-- Footer --}}
        <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="font-size:11px;color:#9ca3af;text-align:center;margin:0;">
                Email ini dikirim otomatis oleh sistem {{ config('app.name') }}. Jangan balas email ini.
            </p>
        </div>

    </div>
</body>
</html>
