import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import AuthLayout from "@/Layouts/AuthLayout";

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
}

interface Props extends PageProps {
    users: User[];
}

export default function UserPage({ auth, users }: Props) {

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "petugas",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("users.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AuthLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                        User Management
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Kelola user dan role pengguna
                    </p>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="space-y-6">

                {/* CREATE USER */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                    <h3 className="text-lg font-semibold text-slate-800 mb-5">
                        Tambah User
                    </h3>

                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >

                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Nama
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan nama"
                            />

                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan email"
                            />

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Password
                            </label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan password"
                            />

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* ROLE */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Role
                            </label>

                            <select
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="admin">Admin</option>
                                <option value="petugas">Petugas</option>
                                <option value="manajer">Manajer</option>
                                <option value="mitra">Mitra</option>
                            </select>

                            {errors.role && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : "Tambah User"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* USER TABLE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Daftar User
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-500">
                                        Nama
                                    </th>

                                    <th className="px-6 py-4 text-left font-semibold text-slate-500">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left font-semibold text-slate-500">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left font-semibold text-slate-500">
                                        Dibuat
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                                    >

                                        {/* NAME */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <div className="font-medium text-slate-800">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* EMAIL */}
                                        <td className="px-6 py-4 text-slate-600">
                                            {user.email}
                                        </td>

                                        {/* ROLE */}
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {user.roles.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className={`
                                                            px-3 py-1 rounded-full text-xs font-medium
                                                            ${
                                                                role.name === "admin"
                                                                    ? "bg-red-100 text-red-600"
                                                                    : role.name === "manajer"
                                                                    ? "bg-amber-100 text-amber-700"
                                                                    : role.name === "petugas"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-slate-100 text-slate-600"
                                                            }
                                                        `}
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* CREATED */}
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}