import { FormEventHandler, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthLayout";
import { PageProps } from '@/types'
import { Building2, MapPin, Phone, Mail, Users, BadgeCheck, Save, ArrowLeft } from "lucide-react";

// Type definition for Petugas User from database
interface PetugasUser {
    id: number;
    name: string;
}

// Extended PageProps to include petugasUsers
interface AddMitraProps extends PageProps {
    petugasUsers: PetugasUser[];
}

export default function AddMitra({ auth, petugasUsers }: AddMitraProps) {
    const [values, setValues] = useState({
        nama_perusahaan: "",
        alamat: "",
        telepon: "",
        email: "",
        petugas_mapping: "", // This will store the ID
        status: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post("/mitra", values, {
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                // Reset form or redirect
                router.get("/mitra");
            }
        });
    };

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title="Tambah Mitra" />

                <div className="min-h-screen p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header with back button */}
                    

                        {/* Main Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            {/* Header Section - Clean */}
                            <div className="border-b border-gray-100 px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                    <h1 className="text-xl font-semibold text-gray-800">
                                        Tambah Mitra Baru
                                    </h1>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Lengkapi informasi mitra perusahaan di bawah ini
                                </p>
                            </div>

                            {/* Form Section */}
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-5">
                                    {/* Nama Perusahaan */}
                                    <div>
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Nama Perusahaan
                                        </label>
                                        <input
                                            type="text"
                                            name="nama_perusahaan"
                                            value={values.nama_perusahaan}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none"
                                            placeholder="Masukkan nama perusahaan"
                                            required
                                        />
                                    </div>

                                    {/* Alamat */}
                                    <div>
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Alamat
                                        </label>
                                        <textarea
                                            name="alamat"
                                            value={values.alamat}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none resize-none"
                                            placeholder="Masukkan alamat lengkap"
                                            required
                                        />
                                    </div>

                                    {/* Telepon dan Email - 2 columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                                Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                name="telepon"
                                                value={values.telepon}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none"
                                                placeholder="Masukkan nomor telepon"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none"
                                                placeholder="Masukkan email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Petugas Mapping dan Status - 2 columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                                <Users className="inline w-4 h-4 mr-1" />
                                                Petugas Mapping
                                            </label>
                                            <select
                                                name="petugas_mapping"
                                                value={values.petugas_mapping}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none bg-white"
                                                required
                                            >
                                                <option value="">Pilih Petugas Mapping</option>
                                                {petugasUsers && petugasUsers.map((petugas) => (
                                                    <option key={petugas.id} value={petugas.id}>
                                                        {petugas.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {(!petugasUsers || petugasUsers.length === 0) && (
                                                <p className="text-xs text-amber-600 mt-1">
                                                    Belum ada data petugas. Silakan tambah user dengan role petugas terlebih dahulu.
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                                <BadgeCheck className="inline w-4 h-4 mr-1" />
                                                Status
                                            </label>
                                            <select
                                                name="status"
                                                value={values.status}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none bg-white"
                                                required
                                            >
                                                <option value="">Pilih Status</option>
                                                <option value="aktif">Aktif</option>
                                                <option value="nonaktif">Nonaktif</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 pt-5 border-t border-gray-100 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Simpan Mitra
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Info Card - Clean */}
                        <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-start gap-2">
                                <div className="text-blue-500 mt-0.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-xs text-blue-700">
                                    Pastikan semua data yang diisi sudah benar dan lengkap sebelum menyimpan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}