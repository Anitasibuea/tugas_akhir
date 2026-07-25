import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    stats: {
        totalTiang: number;
        totalKabel: number;
        statusWaiting: number;
        statusResolved: number;
    };
    recentActivities: Array<{
        description: string;
        time: string;
    }>;
    cablePerTiang: Array<{
        name: string;
        total: number;
        percentage: number;
    }>;
    statusDistribution: {
        waiting: number;
        resolved: number;
    };
}

export default function Dashboard({
    auth,
    stats = { totalTiang: 0, totalKabel: 0, statusWaiting: 0, statusResolved: 0 },
    recentActivities = [],
    cablePerTiang = [],
    statusDistribution = { waiting: 0, resolved: 0 }
}: Props) {
    // Debug log
    console.log('Dashboard rendering with props:', { auth, stats, recentActivities, cablePerTiang, statusDistribution });

    return (
        <AuthLayout user={auth.user}>
            <Head title="Dashboard Admin" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Tiang Digunakan</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats?.totalTiang || 0}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Kabel Terpasang</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats?.totalKabel || 0}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Status Waiting</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats?.statusWaiting || 0}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Status Resolved</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats?.statusResolved || 0}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Cable per Tiang Chart */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-gray-900">Jumlah Kabel per Tiang</h3>
                                <div className="mt-4 space-y-4">
                                    {cablePerTiang && cablePerTiang.length > 0 ? (
                                        cablePerTiang.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>{item.name}</span>
                                                    <span>{item.total} kabel</span>
                                                </div>
                                                <div className="mt-1 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="rounded-full bg-indigo-600 p-0.5 text-center text-xs font-medium leading-none text-white"
                                                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                                    >
                                                        <span className="sr-only">{item.percentage}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Tidak ada data tiang</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Distribution */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-gray-900">Distribusi Status Kabel</h3>
                                <div className="mt-4">
                                    <div className="relative pt-1">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div>
                                                <span className="inline-block rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
                                                    Proses
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-gray-700">{statusDistribution?.waiting || 0}%</span>
                                            </div>
                                        </div>
                                        <div className="mb-6 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="rounded-full bg-yellow-500"
                                                style={{ width: `${Math.min(statusDistribution?.waiting || 0, 100)}%`, height: '8px' }}
                                            ></div>
                                        </div>

                                        <div className="mb-2 flex items-center justify-between">
                                            <div>
                                                <span className="inline-block rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                                                    Selesai
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-gray-700">{statusDistribution?.resolved || 0}%</span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="rounded-full bg-green-500"
                                                style={{ width: `${Math.min(statusDistribution?.resolved || 0, 100)}%`, height: '8px' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access & Recent Activities */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Quick Access */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-gray-900">Quick Access</h3>
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Link
                                        href="/dashboard/report/add"
                                        className="group rounded-lg border border-gray-300 p-4 transition hover:border-indigo-500 hover:shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                        </svg>
                                        <h4 className="mt-2 font-medium text-gray-900">Tambah Laporan</h4>
                                        <p className="mt-1 text-sm text-gray-500">Input berita acara baru</p>
                                    </Link>

                                    <Link
                                        href="/dashboard/report"
                                        className="group rounded-lg border border-gray-300 p-4 transition hover:border-indigo-500 hover:shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                        </svg>
                                        <h4 className="mt-2 font-medium text-gray-900">Laporan Masuk</h4>
                                        <p className="mt-1 text-sm text-gray-500">Lihat semua laporan</p>
                                    </Link>

                                    <Link
                                        href="/dashboard/report/validate"
                                        className="group rounded-lg border border-gray-300 p-4 transition hover:border-indigo-500 hover:shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <h4 className="mt-2 font-medium text-gray-900">Validasi Status</h4>
                                        <p className="mt-1 text-sm text-gray-500">Validasi laporan masuk</p>
                                    </Link>

                                    <Link
                                        href="/dashboard/mitra"
                                        className="group rounded-lg border border-gray-300 p-4 transition hover:border-indigo-500 hover:shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                        </svg>
                                        <h4 className="mt-2 font-medium text-gray-900">Data Mitra</h4>
                                        <p className="mt-1 text-sm text-gray-500">Kelola data mitra</p>
                                    </Link>

                                    <Link
                                        href="/peta-lokasi"
                                        className="group rounded-lg border border-gray-300 p-4 transition hover:border-indigo-500 hover:shadow-md sm:col-span-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <h4 className="mt-2 font-medium text-gray-900">Peta Lokasi Kabel</h4>
                                        <p className="mt-1 text-sm text-gray-500">Visualisasi lokasi tiang</p>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-gray-900">Aktivitas Terbaru</h3>
                                <div className="mt-4 flow-root">
                                    <ul className="-my-5 divide-y divide-gray-200">
                                        {recentActivities && recentActivities.length > 0 ? (
                                            recentActivities.map((activity, index) => (
                                                <li key={index} className="py-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-400">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm text-gray-900">{activity.description}</p>
                                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="py-4">
                                                <p className="text-sm text-gray-500 text-center">Tidak ada aktivitas terbaru</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}