"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface SidebarItemProps {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
    collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
            active
                ? "bg-[var(--primary)] text-white shadow-lg"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        )}
    >
        <Icon className={clsx("w-5 h-5 flex-shrink-0", active ? "scale-110" : "group-hover:scale-110 transition-transform")} />
        {!collapsed && (
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden origin-left">
                {label}
            </span>
        )}
        {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--card)] border border-[var(--border)] rounded shadow-xl text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {label}
            </div>
        )}
    </button>
);

export default function Sidebar({
    activeTab,
    setActiveTab
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const { logout, user } = useAuth();
    const router = useRouter();

    const menuItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "cases", label: "Compliance Cases", icon: Briefcase },
        { id: "users", label: "Client Directory", icon: Users },
        { id: "chat", label: "Live Communications", icon: MessageSquare },
        { id: "settings", label: "Console Settings", icon: Settings },
    ];

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-[var(--card)] border-r border-[var(--border)] flex flex-col relative transition-all duration-300 shadow-xl z-30"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-10 bg-[var(--card)] border border-[var(--border)] rounded-full p-1 shadow-md hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Section */}
            <div className="p-6 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 flex-shrink-0">
                    <ShieldCheck className="text-white w-6 h-6" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-[var(--foreground)] text-lg leading-tight uppercase tracking-tighter">
                            Compliance<br /><span className="text-[var(--accent)]">Advisory</span>
                        </h1>
                    </div>
                )}
            </div>

            {/* User Profile Summary */}
            {!collapsed && (
                <div className="px-6 mb-8 mt-2">
                    <div className="bg-[var(--muted)]/50 p-4 rounded-2xl border border-[var(--border)]/50">
                        <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Active Admin</p>
                        <p className="font-bold text-[var(--foreground)] truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[var(--muted-foreground)] truncate">{user?.email}</p>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <div className="flex-grow px-4 space-y-2 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.id}
                        {...item}
                        active={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                        collapsed={collapsed}
                    />
                ))}
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-[var(--border)]">
                <SidebarItem
                    icon={LogOut}
                    label="Sign Out"
                    active={false}
                    onClick={() => {
                        logout();
                        router.push("/admin/login");
                    }}
                    collapsed={collapsed}
                />
            </div>
        </motion.div>
    );
}
