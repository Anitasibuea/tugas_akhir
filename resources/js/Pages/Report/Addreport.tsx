import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import AuthLayout from "@/Layouts/AuthLayout";

/* ─── Types ─── */
type Report = {
    no_laporan: number;
    tanggal: string;
    deskripsi: string;
    status_laporan: string;
    tipe_tiang: string;
    lokasi: string;
    petugas_mitra: string;
    latitude: number;
    longitude: number;
    nama_mitra: string;
};

type Props = {
    reports: Report[];
};

type FormState = {
    tanggal: string;
    deskripsi: string;
    status_laporan: string;
    tipe_tiang: string;
    lokasi: string;
    petugas_mitra: string;
    latitude: number | "";
    longitude: number | "";
    nama_mitra: string;
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    Pending:  { label: "Pending",  color: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
    Proses:   { label: "Proses",   color: "bg-blue-100 text-blue-700 border-blue-200",      dot: "bg-blue-400" },
    Selesai:  { label: "Selesai",  color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
};

/* ─── Component ─── */
export default function Reports({ reports = [] }: Props) {
    const [form, setForm] = useState<FormState>({
        tanggal: "",
        deskripsi: "",
        status_laporan: "",
        tipe_tiang: "",
        lokasi: "",
        petugas_mitra: "",
        latitude: "",
        longitude: "",
        nama_mitra: "",
    });

    const [selected, setSelected] = useState<LatLngExpression | null>(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    async function reverseGeocode(lat: number, lng: number) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        const address =
            data.address?.road ||
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
        router.post("/reports", form, {
            onSuccess: () => {
                setForm({
                    tanggal: "",
                    deskripsi: "",
                    status_laporan: "",
                    tipe_tiang: "",
                    lokasi: "",
                    petugas_mitra: "",
                    latitude: "",
                    longitude: "",
                    nama_mitra: "",
                });
                setSelected(null);
            },
        });
    }

    function deleteReport(id: number) {
        if (confirm("Hapus laporan ini?")) {
            router.delete(`/laporan/${id}`);
        }
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
        {
            enableHighAccuracy: true,
        }
    );
}

return (
    <AuthLayout>
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT SIDE - FORM */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                        <h2 className="text-xl font-semibold mb-6">
                            Buat Laporan
                        </h2>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Tanggal + Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Tanggal
                                    </label>

                                    <input
                                        type="date"
                                        value={form.tanggal}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                tanggal: e.target.value,
                                            })
                                        }
                                        className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Status
                                    </label>

                                    <select
                                        value={form.status_laporan}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                status_laporan: e.target.value,
                                            })
                                        }
                                        className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
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
                                    <label className="text-sm font-medium text-gray-700">
                                        Nama Mitra
                                    </label>

                                    <input
                                        value={form.nama_mitra}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                nama_mitra: e.target.value,
                                            })
                                        }
                                        placeholder="Nama mitra"
                                        className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Petugas Mitra
                                    </label>

                                    <input
                                        value={form.petugas_mitra}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                petugas_mitra: e.target.value,
                                            })
                                        }
                                        placeholder="Nama petugas"
                                        className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                    />
                                </div>
                            </div>

                            {/* Lokasi + Tipe */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Lokasi
                                    </label>

                                    <input
                                        value={form.lokasi}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                lokasi: e.target.value,
                                            })
                                        }
                                        placeholder="Lokasi"
                                        className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Tipe Tiang
                                    </label>

                                    <input
                                        value={form.tipe_tiang}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                tipe_tiang: e.target.value,
                                            })
                                        }
                                        placeholder="Beton / Besi"
                                        className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                    />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Deskripsi
                                </label>

                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            deskripsi: e.target.value,
                                        })
                                    }
                                    rows={5}
                                    placeholder="Deskripsi kerusakan..."
                                    className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                            >
                                Simpan Laporan
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE - MAP */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-semibold">
                                Lokasi Peta
                            </h2>

                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={gettingLocation}
                                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-black"
                            >
                                {gettingLocation
                                    ? "Loading..."
                                    : "📍 Lokasi Saya"}
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
                        <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-300">

                            <MapContainer
                                center={[1.1287, 104.053]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                <LocationPicker />
                            </MapContainer>
                        </div>

                        <p className="text-sm text-gray-500 mt-3 text-center">
                            Klik peta untuk menentukan lokasi
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AuthLayout>
  );
}