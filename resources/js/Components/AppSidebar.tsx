import { useState } from "react";

const navItems = [
    {
        section: "Main",
        items: [
            { icon: DashboardIcon, label: "Dashboard", href: "/dashboard", active: true },
            { icon: UsersIcon, label: "Laporan", href: "/users" },
            { icon: InboxIcon, label: "Data Mitra", href: "/inbox", badge: 4 },
            { icon: InboxIcon, label: "Validasi Status", href: "/inbox", badge: 4 },
            { icon: InboxIcon, label: "Peta Lokasi", href: "/inbox", badge: 4 },
        ],
    },
];

function DashboardIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}
function UsersIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function InboxIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    );
}
function DocumentIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}
function TagIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    );
}
function MediaIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}
function SettingsIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
function LogIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
function ChevronIcon({ collapsed }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

export default function Sidebar({ collapsed, onToggle }) {
    return (
        <aside style={{
            width: collapsed ? "64px" : "240px",
            minHeight: "100vh",
            background: "#0f1117",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.07)",
        }}>
            {/* Brand */}
            <div style={{
                height: "60px",
                display: "flex",
                alignItems: "center",
                padding: collapsed ? "0 20px" : "0 20px",
                gap: "10px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden",
                flexShrink: 0,
            }}>
                <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "7px",
                    background: "linear-gradient(135deg, #e0533a 0%, #b83323 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {!collapsed && (
                    <span style={{ color: "#f4f4f5", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                        LaravelApp
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 0" }}>
                {navItems.map((group) => (
                    <div key={group.section} style={{ marginBottom: "4px" }}>
                        {!collapsed && (
                            <p style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                padding: "8px 20px 4px",
                                margin: 0,
                            }}>
                                {group.section}
                            </p>
                        )}
                        {group.items.map((item) => (
                            <NavItem key={item.label} item={item} collapsed={collapsed} />
                        ))}
                    </div>
                ))}
            </nav>

            {/* Collapse toggle */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "12px 8px" }}>
                <button
                    onClick={onToggle}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-end",
                        gap: "8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.35)",
                        padding: "8px 10px",
                        borderRadius: "7px",
                        transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                >
                    <ChevronIcon collapsed={!collapsed} />
                </button>
            </div>
        </aside>
    );
}

function NavItem({ item, collapsed }) {
    const { icon: Icon, label, href, active, badge } = item;
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={href}
            onClick={e => e.preventDefault()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={collapsed ? label : undefined}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: collapsed ? "9px 0" : "8px 12px 8px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                margin: "1px 8px",
                borderRadius: "8px",
                textDecoration: "none",
                background: active
                    ? "rgba(224,83,58,0.15)"
                    : hovered
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                color: active ? "#e0533a" : hovered ? "#d4d4d8" : "rgba(255,255,255,0.5)",
                transition: "background 0.15s, color 0.15s",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {active && (
                <span style={{
                    position: "absolute",
                    left: 0,
                    top: "25%",
                    bottom: "25%",
                    width: "3px",
                    background: "#e0533a",
                    borderRadius: "0 2px 2px 0",
                }} />
            )}
            <span style={{ flexShrink: 0, display: "flex" }}>
                <Icon />
            </span>
            {!collapsed && (
                <span style={{ fontSize: "13.5px", fontWeight: active ? 500 : 400, whiteSpace: "nowrap", flex: 1 }}>
                    {label}
                </span>
            )}
            {!collapsed && badge && (
                <span style={{
                    background: "#e0533a",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "10px",
                    lineHeight: "16px",
                }}>
                    {badge}
                </span>
            )}
        </a>
    );
}