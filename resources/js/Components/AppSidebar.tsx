import { useState } from "react";
import { Link } from "@inertiajs/react";

const navItems = [
    {
        section: "Main",
        items: [
            {
                icon: DashboardIcon,
                label: "Dashboard",
                href: route("dashboard"),
                active: route().current("dashboard"),
            },
            {
                icon: UsersIcon,
                label: "Laporan",
                href: route("reports.index"),
                active: route().current("reports.index"),
            },
            {
                icon: InboxIcon,
                label: "Tambah Laporan",
                href: route("reports.add"),
                active: route().current("reports.add"),
            },
            {
                icon: MapIcon,
                label: "Peta Lokasi",
                href: route("reports.map"),
                active: route().current("reports.map"),
            },
        ],
    },
];

export default function Sidebar({ collapsed, onToggle }) {
    return (
        <aside
            style={{
                width: collapsed ? "70px" : "250px",
                minHeight: "100vh",
                background: "#111827",
                color: "white",
                transition: "0.3s",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background: "#e0533a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <DashboardIcon />
                </div>

                {!collapsed && (
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: "15px",
                        }}
                    >
                        LaravelApp
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "16px 10px" }}>
                {navItems.map((group) => (
                    <div key={group.section}>
                        {!collapsed && (
                            <p
                                style={{
                                    fontSize: "11px",
                                    opacity: 0.5,
                                    margin: "0 12px 12px",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                }}
                            >
                                {group.section}
                            </p>
                        )}

                        {group.items.map((item) => (
                            <NavItem
                                key={item.label}
                                item={item}
                                collapsed={collapsed}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            {/* Toggle */}
            <div
                style={{
                    padding: "12px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <button
                    onClick={onToggle}
                    style={{
                        width: "100%",
                        height: "42px",
                        border: "none",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>
        </aside>
    );
}

function NavItem({ item, collapsed }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            href={item.href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: collapsed ? "14px" : "12px 14px",
                marginBottom: "6px",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "0.2s",
                background: item.active
                    ? "#e0533a"
                    : hovered
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                color: "white",
                justifyContent: collapsed ? "center" : "flex-start",
            }}
        >
            <item.icon />

            {!collapsed && (
                <span
                    style={{
                        fontSize: "14px",
                        fontWeight: item.active ? 600 : 400,
                    }}
                >
                    {item.label}
                </span>
            )}
        </Link>
    );
}

/* ICONS */

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

function UsersIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
        </svg>
    );
}

function InboxIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M22 12h-4l-3 3h-6l-3-3H2" />
            <path d="M5 3h14l3 9v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7l3-9z" />
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