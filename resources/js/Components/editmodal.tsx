// EditReportModal.tsx
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import L from "leaflet";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type User = {
    id: number;
    name: string;
};

type Mitra = {
    id: number;
    nama_perusahaan: string;
};

type Report = {
    id: number;
    tanggal: string;
    deskripsi: string;
    status_laporan: string;
    tipe_tiang: string;
    lokasi: string;
    jenis_kabel: string;
    jumlah_kabel: string;
    panjang_tiang: string;
    petugas_lapangan: string;
    latitude: number;
    longitude: number;
    nama_mitra: string;
};

interface EditReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report | null;
    petugasUsers: User[];
    mitraUsers: Mitra[];
}

type FormState = {
    tanggal: string;
    deskripsi: string;
    status_laporan: string;
    tipe_tiang: string;
    lokasi: string;
    jenis_kabel: string;
    jumlah_kabel: string,
    panjang_tiang: string;
    petugas_lapangan: string;
    latitude: number | "";
    longitude: number | "";
    nama_mitra: string;
};

export default function EditReportModal({
    isOpen,
    onClose,
    report,
    petugasUsers = [],
    mitraUsers = [],
}: EditReportModalProps) {
    const [form, setForm] = useState<FormState>({
        tanggal: "",
        deskripsi: "",
        status_laporan: "",
        tipe_tiang: "",
        lokasi: "",
        jenis_kabel: "",
        jumlah_kabel: "",
        panjang_tiang: "",
        petugas_lapangan: "",
        latitude: "",
        longitude: "",
        nama_mitra: "",
    });

    const [selected, setSelected] = useState<LatLngExpression | null>(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form when report changes
    useEffect(() => {
        if (report) {
            setForm({
                tanggal: report.tanggal,
                deskripsi: report.deskripsi,
                status_laporan: report.status_laporan,
                tipe_tiang: report.tipe_tiang,
                lokasi: report.lokasi,
                jenis_kabel: report.jenis_kabel,
                jumlah_kabel: report.jumlah_kabel,
                panjang_tiang: report.panjang_tiang,
                petugas_lapangan: report.petugas_lapangan,
                latitude: report.latitude,
                longitude: report.longitude,
                nama_mitra: report.nama_mitra,
            });

            if (report.latitude && report.longitude) {
                setSelected([report.latitude, report.longitude]);
            }
        }
    }, [report]);

    async function reverseGeocode(lat: number, lng: number) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const address = data.address?.road ||
                data.address?.suburb ||
                data.address?.village ||
                data.display_name ||
                "";
            setForm((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
                lokasi: address,
            }));
        } catch (error) {
            console.error("Failed reverse geocoding", error);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        // Validate required fields
        if (!form.tanggal || !form.status_laporan || !form.nama_mitra || !form.petugas_lapangan || !form.tipe_tiang || !form.deskripsi) {
            alert("Mohon lengkapi semua field yang diperlukan");
            return;
        }

        setIsSubmitting(true);

        // Use PUT request for update
        router.put(`/dashboard/report/${report?.id}`, form, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
                resetForm();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error("Update failed:", errors);
                alert("Gagal mengupdate laporan. Silakan coba lagi.");
            },
        });
    }

    function resetForm() {
        setForm({
            tanggal: "",
            deskripsi: "",
            status_laporan: "",
            tipe_tiang: "",
            lokasi: "",
            jenis_kabel: "",
            jumlah_kabel: "",
            panjang_tiang: "",
            petugas_lapangan: "",
            latitude: "",
            longitude: "",
            nama_mitra: "",
        });
        setSelected(null);
    }

    function LocationPicker() {
        useMapEvents({
            async click(e: LeafletMouseEvent) {
                const { lat, lng } = e.latlng;
                setSelected([lat, lng]);
                await reverseGeocode(lat, lng);
            },
        });
        return selected ? <Marker position={selected} /> : null;
    }

    function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert("Geolocation tidak didukung perangkat ini");
            return;
        }
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setSelected([lat, lng]);
                await reverseGeocode(lat, lng);
                setGettingLocation(false);
            },
            (error) => {
                alert("Gagal mendapatkan lokasi: " + error.message);
                setGettingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    }

    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Edit Laporan</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* LEFT SIDE - FORM */}
                            <div>
                                <form onSubmit={submit} className="space-y-5">
                                    {/* Tanggal + Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Tanggal</label>
                                            <input
                                                type="date"
                                                value={form.tanggal}
                                                onChange={(e) =>
                                                    setForm({ ...form, tanggal: e.target.value })
                                                }
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={form.status_laporan}
                                                onChange={(e) =>
                                                    setForm({ ...form, status_laporan: e.target.value })
                                                }
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            >
                                                <option value="">Pilih status</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Proses">Proses</option>
                                                <option value="Selesai">Selesai</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Nama Mitra + Petugas */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Nama Mitra</label>
                                            <select
                                                value={form.nama_mitra}
                                                onChange={(e) =>
                                                    setForm({ ...form, nama_mitra: e.target.value })
                                                }
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none text-black"
                                                required
                                            >
                                                <option value="">Pilih Nama Mitra</option>
                                                {mitraUsers.map((mitra) => (
                                                    <option key={mitra.id} value={mitra.nama_perusahaan}>
                                                        {mitra.nama_perusahaan}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Petugas Lapangan</label>
                                            <select
                                                value={form.petugas_lapangan}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        petugas_lapangan: e.target.value
                                                    })
                                                }
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            >
                                                <option value="">Pilih Petugas Lapangan</option>
                                                {petugasUsers.map((user) => (
                                                    <option key={user.id} value={user.name}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Lokasi + Tipe */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Lokasi</label>
                                            <input
                                                value={form.lokasi}
                                                onChange={(e) =>
                                                    setForm({ ...form, lokasi: e.target.value })
                                                }
                                                placeholder="Lokasi"
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Tipe Tiang</label>
                                            <select
                                                value={form.tipe_tiang}
                                                onChange={(e) =>
                                                    setForm({ ...form, tipe_tiang: e.target.value })
                                                }
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            >
                                                <option value="">Pilih Tiang</option>
                                                <option value="Beton">Beton</option>
                                                <option value="Besi">Besi</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Jenis kabel</label>
                                            <select
                                                value={form.jenis_kabel}
                                                onChange={(e) =>
                                                    setForm({ ...form, jenis_kabel: e.target.value })
                                                }
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            >
                                                <option value="">Jenis kabel</option>
                                                <option value="Fiber Optik">Fiber Optik</option>
                                                <option value="Listrik">Listrik</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Panjang Tiang</label>
                                            <input
                                                type="text"
                                                value={form.panjang_tiang}
                                                onChange={(e) => setForm({ ...form, panjang_tiang: e.target.value })}
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Jumlah Kabel</label>
                                            <input
                                                type="text"
                                                value={form.jumlah_kabel}
                                                onChange={(e) => setForm({ ...form, jumlah_kabel: e.target.value })}
                                                className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Deskripsi */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                        <textarea
                                            value={form.deskripsi}
                                            onChange={(e) =>
                                                setForm({ ...form, deskripsi: e.target.value })
                                            }
                                            rows={5}
                                            placeholder="Deskripsi..."
                                            className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                                            disabled={isSubmitting}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Menyimpan..." : "Update Laporan"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* RIGHT SIDE - MAP */}
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-semibold">Lokasi Peta</h3>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={gettingLocation}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-black transition"
                                    >
                                        {gettingLocation ? "Loading..." : "Lokasi Saya"}
                                    </button>
                                </div>

                                {/* Coordinates */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input
                                        value={form.latitude}
                                        readOnly
                                        placeholder="Latitude"
                                        className="rounded-xl border border-gray-300 px-4 py-3 bg-gray-50"
                                    />
                                    <input
                                        value={form.longitude}
                                        readOnly
                                        placeholder="Longitude"
                                        className="rounded-xl border border-gray-300 px-4 py-3 bg-gray-50"
                                    />
                                </div>

                                {/* MAP */}
                                <div className="h-[400px] rounded-2xl overflow-hidden border border-gray-300">
                                    <MapContainer
                                        center={form.latitude && form.longitude ?
                                            [Number(form.latitude), Number(form.longitude)] :
                                            [-6.200000, 106.816666]
                                        }
                                        zoom={13}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationPicker />
                                    </MapContainer>
                                </div>
                                <p className="text-sm text-gray-500 mt-3 text-center">
                                    Klik peta untuk mengubah lokasi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
