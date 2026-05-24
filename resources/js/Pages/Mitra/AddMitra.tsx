import { FormEventHandler, useState } from "react";
import { Head, router } from "@inertiajs/react";

export default function AddMitra() {
    const [values, setValues] = useState({
        nama_perusahaan: "",
        alamat: "",
        telepon: "",
        email: "",
        petugas_mapping: "",
        status: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post("/mitra", values);
    };

    return (
        <>
            <Head title="Tambah Mitra" />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        Tambah Mitra
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium">
                                Nama Perusahaan
                            </label>

                            <input
                                type="text"
                                name="nama_perusahaan"
                                value={values.nama_perusahaan}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                                placeholder="Masukkan nama perusahaan"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Alamat
                            </label>

                            <textarea
                                name="alamat"
                                value={values.alamat}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                                placeholder="Masukkan alamat"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Telepon
                            </label>

                            <input
                                type="text"
                                name="telepon"
                                value={values.telepon}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                                placeholder="Masukkan nomor telepon"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                                placeholder="Masukkan email"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Petugas Mapping
                            </label>

                            <input
                                type="text"
                                name="petugas_mapping"
                                value={values.petugas_mapping}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                                placeholder="Masukkan petugas mapping"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Status
                            </label>

                            <select
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            >
                                <option value="">Pilih Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Simpan Mitra
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}