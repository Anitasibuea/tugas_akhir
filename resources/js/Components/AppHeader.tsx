import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

function SearchIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export default function AppHeader() {
    const { props } = usePage<PageProps>();
    const user = props.auth.user;

    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const breadcrumbs = ["Dashboard", "Overview"];

    // Generate initials safely
    const initials =
        user?.name
            ?.split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <header
            style={{
                height: "60px",
                background: "#ffffff",
                borderBottom: "1px solid #e4e4e7",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                gap: "16px",
                position: "sticky",
                top: 0,
                zIndex: 30,
            }}
        >
            {/* Breadcrumbs */}
            <nav style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                {breadcrumbs.map((crumb, i) => (
                    <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {i > 0 && <span style={{ color: "#d4d4d8" }}>/</span>}
                        <span
                            style={{
                                fontSize: "13.5px",
                                color: i === breadcrumbs.length - 1 ? "#18181b" : "#71717a",
                                fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                            }}
                        >
                            {crumb}
                        </span>
                    </span>
                ))}
            </nav>

            {/* Search */}
            <div style={{ position: "relative" }}>
                <span
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#a1a1aa",
                    }}
                >
                    <SearchIcon />
                </span>

                <input
                    type="text"
                    placeholder="Search..."
                    style={{
                        height: "34px",
                        width: "220px",
                        paddingLeft: "32px",
                        background: "#f4f4f5",
                        border: "1px solid #e4e4e7",
                        borderRadius: "8px",
                        fontSize: "13px",
                    }}
                />
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
                <button
                    onClick={() => {
                        setNotifOpen(!notifOpen);
                        setUserOpen(false);
                    }}
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid #e4e4e7",
                        background: "#fff",
                        cursor: "pointer",
                    }}
                >
                    <BellIcon />
                </button>

                {notifOpen && (
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "40px",
                            width: "280px",
                            background: "#fff",
                            border: "1px solid #e4e4e7",
                            borderRadius: "10px",
                        }}
                    >
                        <div style={{ padding: "12px" }}>No notifications</div>
                    </div>
                )}
            </div>

            {/* User */}
            <div style={{ position: "relative" }}>
                <button
                    onClick={() => {
                        setUserOpen(!userOpen);
                        setNotifOpen(false);
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid #e4e4e7",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        background: "#fff",
                        cursor: "pointer",
                    }}
                >
                    <div
                        style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "6px",
                            background: "#e0533a",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 600,
                        }}
                    >
                        {initials}
                    </div>

                    <div>
                        <div style={{ fontSize: "12px", fontWeight: 500 }}>{user.name}</div>
                        <div style={{ fontSize: "10px", color: "#888" }}>
                            {user.role ?? "User"}
                        </div>
                    </div>

                    <ChevronDown />
                </button>

                {userOpen && (
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "40px",
                            width: "180px",
                            background: "#fff",
                            border: "1px solid #e4e4e7",
                            borderRadius: "10px",
                        }}
                    >
                        <button style={{ padding: "10px", width: "100%", textAlign: "left" }}>
                            Profile
                        </button>
                        <button style={{ padding: "10px", width: "100%", textAlign: "left" }}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}