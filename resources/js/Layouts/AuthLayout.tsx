import AppHeader from "@/Components/AppHeader";
import Sidebar from "@/Components/AppSidebar";
import { PropsWithChildren, useState } from "react";
import { User } from "@/types";

export default function AppLayout({ user, children }: PropsWithChildren<{ user: User }>) {
    const [collapsed, setCollapsed] = useState(false);

    const sidebarWidth = collapsed ? 80 : 250;

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            overflow: "hidden", // ❗ prevent whole page scroll
            background: "#f9f9f9",
        }}>
            {/* Sidebar */}
            <div style={{
                width: sidebarWidth,
                position: "fixed", // ✅ key fix
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 1000,
            }}>
                <Sidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed(!collapsed)}
                />
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: sidebarWidth, // ✅ push content
                flex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}>
                <AppHeader />

                <main style={{
                    flex: 1,
                    padding: "28px 32px",
                    overflowY: "auto", // ✅ only this scrolls
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}