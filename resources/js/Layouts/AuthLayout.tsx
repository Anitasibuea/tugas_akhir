import {
    PropsWithChildren,
    ReactNode,
    useState,
} from "react";

import { Link } from "@inertiajs/react";

import Dropdown from "@/Components/Dropdown";
import ApplicationLogo from "@/Components/ApplicationLogo";

import { User } from "@/types";

interface AuthenticatedLayoutProps {
    user: User;
    header?: ReactNode;
}

export default function AuthenticatedLayout({
    user,
    header,
    children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        {
            label: "Dashboard",
            href: route("dashboard"),
            active: route().current("dashboard"),
            icon: DashboardIcon,
        },
        {
            label: "Laporan",
            href: route("reports.index"),
            active: route().current("reports.*"),
            icon: ReportIcon,
        },
    ...(user.role == "admin" || user.role == "manajer"
    ? [
        {
            label: "Mitra",
            href: route("mitra.index"),
            active: route().current("mitra.*"),
            icon: AddIcon,
        },
      ]
    : []),
        {
            label: "Peta Lokasi Tiang",
            href: route("peta.lokasi"),
            active: route().current("peta.lokasi"),
            icon: MapIcon,
        },
           ...(user.role.includes("admin")
        ? [
              {
                  label: "Tambah Pengguna",
                  href: route("users.index"),
                  active: route().current("users.*"),
                  icon: MapIcon,
              },
          ]
        : []),
    ];

    return (
        <div className="min-h-screen bg-gray-100  overflow-hidden">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                    flex flex-col
                `}
            >

                {/* LOGO */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                    >
                        <ApplicationLogo className="block h-9 w-auto fill-current text-orange-500" />

                        <span className="font-semibold text-lg text-gray-800">
                            LaravelApp
                        </span>
                    </Link>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl
                                text-sm font-medium transition-all duration-200
                                ${
                                    item.active
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            <item.icon />

                            <span>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* SIDEBAR FOOTER */}
                <div className="p-4 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">

                        {/* AVATAR */}
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>

                        {/* USER INFO */}
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                                {user.name}
                            </div>

                            <div className="text-xs text-gray-500 truncate">
                                {user.email}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="lg:ml-64 flex flex-col min-h-screen">

                {/* HEADER */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">

                    <div className="h-full px-4 sm:px-6 flex items-center justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-4">

                            {/* MOBILE MENU BUTTON */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <MenuIcon />
                            </button>

                            {/* PAGE TITLE */}
                            {header && (
                                <div className="text-lg font-semibold text-gray-800">
                                    {header}
                                </div>
                            )}
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center">

                            <Dropdown>

                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                                    >

                                        {/* AVATAR */}
                                        <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </div>

                                        {/* USER INFO */}
                                        <div className="hidden sm:block text-left">
                                            <div className="text-sm font-medium text-gray-800">
                                                {user.name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {user.role ?? "User"}
                                            </div>
                                        </div>

                                        {/* CHEVRON */}
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>

                                    <Dropdown.Link
                                        href={route("profile.edit")}
                                    >
                                        Profile
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>

                                </Dropdown.Content>

                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
   ICONS
────────────────────────────────────────────────────────── */

function DashboardIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
        </svg>
    );
}

function ReportIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M9 12h6" />
            <path d="M9 16h6" />
            <path d="M13 8h2" />
            <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
    );
}

function AddIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* LEFT USER */}
            <path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M2 20a5 5 0 0 1 10 0" />

            {/* RIGHT USER */}
            <path d="M17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M12 20a5 5 0 0 1 10 0" />
        </svg>
    );
}

function MapIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}