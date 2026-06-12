import { useState, useRef } from "react";
import { router } from "@inertiajs/react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import AuthLayout from "@/Layouts/AuthLayout";
import { PageProps } from "@/types";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
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
    jenis_kabel: string;
    jumlah_kabel: string;
    lokasi: string;
    panjang_tiang: string;
    petugas_lapangan: string;
    latitude: number;
    longitude: number;
    nama_mitra: string;
    foto: File;
};

interface Props extends PageProps {
    reports: Report[];
    petugasUsers: User[];
    mitraUsers: Mitra[];
}

type FormState = {
    tanggal: string;
    deskripsi: string;
    status_laporan: string;
    tipe_tiang: string;
    jenis_kabel: string;
    jumlah_kabel: string;
    lokasi: string;
    panjang_tiang: string;
    petugas_lapangan: number | "";
    latitude: number | "";
    longitude: number | "";
    nama_mitra: number | "";
    foto: File | null;
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    Pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
    Proses: { label: "Proses", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400" },
    Selesai: { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
};

// Component to handle map center and fly to location
function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();

    useState(() => {
        map.setView(center, zoom);
    });

    return null;
}

// Component to get user's current location on mount
function CurrentLocationOnMount({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
    const map = useMap();

    useState(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    map.setView([lat, lng], 15);
                    onLocationFound(lat, lng);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    //


                    map.setView([-6.200000, 106.816666], 13);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation not supported");
            map.setView([-6.200000, 106.816666], 13);
        }
    });

    return null;
}

export default function Reports({
    auth,
    reports = [],
    petugasUsers = [],
    mitraUsers = [],
}: Props) {
    const [form, setForm] = useState<FormState>({
        tanggal: "",
        deskripsi: "",
        status_laporan: "",
        tipe_tiang: "",
        jenis_kabel: "",
        jumlah_kabel: "",
        lokasi: "",
        panjang_tiang: "",
        petugas_lapangan: "",
        latitude: "",
        longitude: "",
        nama_mitra: "",
        foto: null,
    });

    const [selected, setSelected] = useState<LatLngExpression | null>(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([-6.200000, 106.816666]);
    const [mapZoom, setMapZoom] = useState(13);
    const mapRef = useRef<any>(null);

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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Format file harus JPG, JPEG, PNG, atau WEBP");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file maksimal 5MB");
                return;
            }

            setForm({ ...form, foto: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        console.log("Form data:", {
            tanggal: form.tanggal,
            status_laporan: form.status_laporan,
            nama_mitra: form.nama_mitra,
            petugas_lapangan: form.petugas_lapangan,
            tipe_tiang: form.tipe_tiang,
            deskripsi: form.deskripsi,
            foto: form.foto,
            latitude: form.latitude,
            longitude: form.longitude,
        });

        // Validate required fields
        if (!form.tanggal || !form.status_laporan || !form.nama_mitra || !form.petugas_lapangan || !form.tipe_tiang || !form.deskripsi) {
            alert("Mohon lengkapi semua field yang diperlukan");
            return;
        }

        // Validate file upload
        if (!form.foto) {
            alert("Mohon upload foto laporan");
            return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("tanggal", form.tanggal);
        formData.append("deskripsi", form.deskripsi);
        formData.append("status_laporan", form.status_laporan);
        formData.append("tipe_tiang", form.tipe_tiang);
        formData.append("jenis_kabel", form.jenis_kabel);
        formData.append("jumlah_kabel", form.jumlah_kabel);
        formData.append("panjang_tiang", form.panjang_tiang);
        formData.append("lokasi", form.lokasi);
        formData.append("petugas_lapangan", form.petugas_lapangan.toString());
        formData.append("latitude", form.latitude.toString());
        formData.append("longitude", form.longitude.toString());
        formData.append("nama_mitra", form.nama_mitra.toString());
        if (form.foto) {
            formData.append("foto", form.foto);
        }

        router.post("/dashboard/report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onSuccess: () => {
                setForm({
                    tanggal: "",
                    deskripsi: "",
                    status_laporan: "",
                    tipe_tiang: "",
                    jenis_kabel: "",
                    jumlah_kabel: "",
                    lokasi: "",
                    panjang_tiang: "",
                    petugas_lapangan: "",
                    latitude: "",
                    longitude: "",
                    nama_mitra: "",
                    foto: null,
                });
                setSelected(null);
                setPreviewImage(null);
                // Reset file input
                const fileInput = document.getElementById("foto-upload") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            },
        });
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

                // Update selected marker
                setSelected([lat, lng]);

                // Update map center and zoom
                setMapCenter([lat, lng]);
                setMapZoom(15);

                // If map is available, fly to location
                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 15);
                }

                // Reverse geocode to get address
                await reverseGeocode(lat, lng);
                setGettingLocation(false);
            },
            (error) => {
                let errorMessage = "Gagal mendapatkan lokasi: ";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "Izin lokasi ditolak. Silakan izinkan akses lokasi.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "Informasi lokasi tidak tersedia.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "Waktu permintaan lokasi habis.";
                        break;
                    default:
                        errorMessage += error.message;
                }
                alert(errorMessage);
                setGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    // Auto get location on component mount
    useState(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setSelected([lat, lng]);
                    setMapCenter([lat, lng]);
                    setMapZoom(15);
                    await reverseGeocode(lat, lng);
                },
                (error) => {
                    console.error("Auto location error:", error);
                    // Set default Indonesia location
                    setMapCenter([-6.200000, 106.816666]);
                    setMapZoom(13);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            // Set default Indonesia location
            setMapCenter([-6.200000, 106.816666]);
            setMapZoom(13);
        }
    });

    return (
        <AuthLayout user={auth.user}>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* LEFT SIDE - FORM */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-6">Buat Laporan</h2>

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
                                                setForm({
                                                    ...form,
                                                    nama_mitra: e.target.value ? Number(e.target.value) : ""
                                                })
                                            }
                                            className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none text-gray-900 bg-white"
                                            required
                                        >
                                            <option value="" className="text-gray-900 bg-white">Pilih Nama Mitra</option>
                                            {mitraUsers.map((mitra) => (
                                                <option key={mitra.id} value={mitra.id} className="text-gray-900 bg-white">
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
                                                    petugas_lapangan: e.target.value ? Number(e.target.value) : "",
                                                })
                                            }
                                            className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none text-gray-900 bg-white"
                                            required
                                        >
                                            <option value="" className="text-gray-900 bg-white">Pilih Petugas Lapangan</option>
                                            {petugasUsers.map((user) => (
                                                <option key={user.id} value={user.id} className="text-gray-900 bg-white">
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
                                            value={form.panjang_tiang || ''}   // ← diubah ke string (pastikan state ini string)
                                            onChange={(e) => setForm({ ...form, panjang_tiang: e.target.value })}
                                            className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Jumlah Kabel</label>
                                        <input
                                            type="text"
                                            value={form.jumlah_kabel || ''}   // ← diubah ke string (pastikan state ini string)
                                            onChange={(e) => setForm({ ...form, jumlah_kabel: e.target.value })}
                                            className="w-full mt-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                            required
                                        />
                                    </div>
                                </div>


                                {/* Upload Foto */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Upload Foto Laporan</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition">
                                        <div className="space-y-2 text-center">
                                            {previewImage ? (
                                                <div className="space-y-3">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setForm({ ...form, foto: null });
                                                            setPreviewImage(null);
                                                            const fileInput = document.getElementById("foto-upload") as HTMLInputElement;
                                                            if (fileInput) fileInput.value = "";
                                                        }}
                                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Hapus Foto
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="foto-upload" className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none">
                                                            <span>Upload foto</span>
                                                            <input
                                                                id="foto-upload"
                                                                name="foto-upload"
                                                                type="file"
                                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                                onChange={handleFileChange}
                                                                className="sr-only"
                                                                required={!form.foto}
                                                            />
                                                        </label>
                                                        <p className="pl-1">atau drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, JPEG, WEBP up to 5MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
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
                                <h2 className="text-xl font-semibold">Lokasi Peta</h2>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={gettingLocation}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-300">
                                <MapContainer
                                    key={JSON.stringify(mapCenter)}
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    style={{ height: "100%", width: "100%" }}
                                    ref={mapRef}
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
