"use client";

import { useEffect, useState } from "react";
import {
    Briefcase,
    Users,
    CheckCircle,
    Clock,
    TrendingUp,
    AlertTriangle,
    FileText
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";

interface Stats {
    totalCases: number;
    pendingCases: number;
    resolvedCases: number;
    totalUsers: number;
}

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-xs font-bold">
                    <TrendingUp size={12} />
                    {trend}
                </div>
            )}
        </div>
        <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-[var(--foreground)] mt-1">{value}</p>
    </div>
);

export default function Overview() {
    const [stats, setStats] = useState<Stats>({
        totalCases: 0,
        pendingCases: 0,
        resolvedCases: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [casesRes, usersRes] = await Promise.all([
                    apiRequest("/admin/cases"),
                    apiRequest("/admin/users")
                ]);

                const allCases = casesRes.data || [];
                setStats({
                    totalCases: allCases.length,
                    pendingCases: allCases.filter((c: any) => c.status !== 'RESOLVED' && c.status !== 'DISMISSED').length,
                    resolvedCases: allCases.filter((c: any) => c.status === 'RESOLVED').length,
                    totalUsers: (usersRes.data || []).length
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-[var(--muted)] rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">System Overview</h2>
                <p className="text-[var(--muted-foreground)]">Real-time performance metrics and case tracking.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Cases"
                    value={stats.totalCases}
                    icon={FileText}
                    color="bg-blue-600"
                    trend="+12%"
                />
                <StatCard
                    label="Pending Review"
                    value={stats.pendingCases}
                    icon={Clock}
                    color="bg-amber-500"
                />
                <StatCard
                    label="Resolved Cases"
                    value={stats.resolvedCases}
                    icon={CheckCircle}
                    color="bg-green-600"
                />
                <StatCard
                    label="Managed Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-[var(--shadow-elevated)]">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-[var(--accent)] w-5 h-5" />
                        Urgent Action Required
                    </h3>
                    <div className="space-y-4">
                        <p className="text-[var(--muted-foreground)] text-sm italic">No urgent alerts found. All systems operational.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-[var(--shadow-elevated)]">
                    <h3 className="font-bold text-lg mb-6">Internal Console Notifications</h3>
                    <div className="p-4 bg-[var(--color-teal-50)] text-[var(--color-teal-900)] rounded-2xl border border-[var(--color-teal-200)] flex items-start gap-4">
                        <div className="w-10 h-10 bg-[var(--color-teal-400)] rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">System Update Successful</p>
                            <p className="text-xs mt-1 opacity-80">All core modules have been upgraded to provide better analytics and faster response times.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
