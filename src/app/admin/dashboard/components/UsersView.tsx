"use client";

import { useState, useEffect } from "react";
import {
    Search,
    User as UserIcon,
    Mail,
    Calendar,
    MessageSquare,
    ChevronRight,
    Loader2,
    Shield
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Input, Button } from "@/components/ui";
import { format } from "date-fns";

export default function UsersView() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (search) query.append("search", search);
            const res = await apiRequest(`/admin/users?${query.toString()}`);
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Client Directory</h2>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">Full registry of clients seeking compliance assistance.</p>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 text-sm h-11 shadow-sm border-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading && users.length === 0 ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-[var(--card)] rounded-3xl border border-[var(--border)] animate-pulse shadow-sm" />
                    ))
                ) : users.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-[var(--card)] rounded-3xl border border-dashed border-[var(--border)]">
                        <UserIcon className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-20" />
                        <p className="text-[var(--muted-foreground)] italic font-semibold">No registered clients found matching your search.</p>
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[var(--muted)] rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors shadow-inner">
                                        <UserIcon size={24} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-[var(--foreground)] text-lg truncate tracking-tight">
                                            {user.firstName ? `${user.firstName} ${user.lastName}` : "Unnamed Client"}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] font-medium">
                                            <Mail size={12} strokeWidth={2.5} />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                                {user.isAdmin && (
                                    <div className="p-1 px-2.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg" title="Administrator">
                                        <Shield size={14} />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Total Cases</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-bold">{user._count.cases}</p>
                                        <span className="text-[10px] text-[var(--muted-foreground)]">managed</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Status</p>
                                    <p className={`text-xs font-bold uppercase tracking-tighter ${user.accountStatus === 'ACTIVE' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user.accountStatus}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] font-medium">
                                    <Calendar size={12} />
                                    Joined {format(new Date(user.createdAt), "MMM yyyy")}
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-xl font-bold text-xs h-9 bg-white border shadow-sm hover:bg-[var(--primary)] hover:text-white group/btn"
                                >
                                    <MessageSquare size={14} className="group-hover/btn:scale-110 transition-transform" />
                                    Message
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
