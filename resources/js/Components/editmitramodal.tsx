import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

interface MitraData {
    id: number;
    nama_perusahaan: string;
    alamat: string;
    telepon: string;
    email: string;
    petugas_mapping: string;
    status: string;
}

interface EditMitraFormProps {
    isOpen: boolean;
    onClose: () => void;
    mitra: MitraData | null;
    onSuccess?: () => void;
}

const EditMitraForm = ({ isOpen, onClose, mitra, onSuccess }: EditMitraFormProps) => {
    const [formData, setFormData] = useState({
        nama_perusahaan: "",
        alamat: "",
        telepon: "",
        email: "",
        petugas_mapping: "",
        status: "aktif",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mitra) {
            setFormData({
                nama_perusahaan: mitra.nama_perusahaan,
                alamat: mitra.alamat,
                telepon: mitra.telepon,
                email: mitra.email,
                petugas_mapping: mitra.petugas_mapping,
                status: mitra.status.toLowerCase(),
            });
        }
    }, [mitra]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.nama_perusahaan.trim()) {
            newErrors.nama_perusahaan = "Nama perusahaan wajib diisi";
        }
        if (!formData.alamat.trim()) {
            newErrors.alamat = "Alamat wajib diisi";
        }
        if (!formData.telepon.trim()) {
            newErrors.telepon = "Nomor telepon wajib diisi";
        } else if (!/^[0-9+\-\s()]+$/.test(formData.telepon)) {
            newErrors.telepon = "Format nomor telepon tidak valid";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }
        if (!formData.petugas_mapping.trim()) {
            newErrors.petugas_mapping = "Nama petugas mapping wajib diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setIsSubmitting(true);
        
        router.put(`/dashboard/mitra/${mitra?.id}`, formData, {
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
                if (onSuccess) onSuccess();
                // Optional: show success notification
                alert("Data mitra berhasil diperbarui!");
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrors(errors);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Perusahaan */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="nama_perusahaan"
                    value={formData.nama_perusahaan}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${errors.nama_perusahaan ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition`}
                    placeholder="Masukkan nama perusahaan"
                />
                {errors.nama_perusahaan && (
                    <p className="text-red-500 text-xs mt-1">{errors.nama_perusahaan}</p>
                )}
            </div>

            {/* Alamat */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2.5 border ${errors.alamat ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none`}
                    placeholder="Masukkan alamat lengkap"
                />
                {errors.alamat && (
                    <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>
                )}
            </div>

            {/* Telepon & Email - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="telepon"
                        value={formData.telepon}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.telepon ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition`}
                        placeholder="Contoh: 08123456789"
                    />
                    {errors.telepon && (
                        <p className="text-red-500 text-xs mt-1">{errors.telepon}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition`}
                        placeholder="contoh@perusahaan.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>
            </div>

            {/* Petugas Mapping & Status - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Petugas Mapping <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="petugas_mapping"
                        value={formData.petugas_mapping}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.petugas_mapping ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition`}
                        placeholder="Nama petugas mapping"
                    />
                    {errors.petugas_mapping && (
                        <p className="text-red-500 text-xs mt-1">{errors.petugas_mapping}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition bg-white"
                    >
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        "Simpan Perubahan"
                    )}
                </button>
            </div>
        </form>
    );
};

export default EditMitraForm;