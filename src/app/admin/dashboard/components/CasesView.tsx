"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle,
    Trash2,
    Briefcase,
    Clock,
    FileText,
    MessageSquare,
    ExternalLink,
    X,
    Plus,
    Loader2,
    TrendingUp,
    AlertTriangle,
    Lock
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { Badge, Button, Input } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function CasesView() {
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [newNote, setNewNote] = useState("");
    const [noteLoading, setNoteLoading] = useState(false);
    const [showClassifyModal, setShowClassifyModal] = useState(false);
    const [classificationForm, setClassificationForm] = useState({
        likelihood: "MEDIUM",
        fundLikelihood: "MEDIUM",
        recommendation: ""
    });

    const fetchCases = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (search) query.append("search", search);
            if (selectedStatus) query.append("status", selectedStatus);

            const res = await apiRequest(`/admin/cases?${query.toString()}`);
            setCases(res.data);
        } catch (err) {
            console.error("Failed to fetch cases", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCases();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, selectedStatus]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await apiRequest(`/admin/cases/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status })
            });
            fetchCases();
            if (selectedCase?.id === id) {
                setSelectedCase({ ...selectedCase, status });
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleDeleteCase = async (id: string) => {
        if (!confirm("Are you sure you want to permanentely remove this case? This action cannot be undone.")) return;
        try {
            await apiRequest(`/admin/cases/${id}`, { method: "DELETE" });
            fetchCases();
            setSelectedCase(null);
        } catch (err) {
            console.error("Failed to delete case", err);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setNoteLoading(true);
        try {
            const res = await apiRequest(`/admin/cases/${selectedCase.id}/notes`, {
                method: "POST",
                body: JSON.stringify({ content: newNote })
            });
            setSelectedCase({
                ...selectedCase,
                notes: [res.data, ...selectedCase.notes]
            });
            setNewNote("");
        } catch (err) {
            console.error("Failed to add note", err);
        } finally {
            setNoteLoading(false);
        }
    };

    const handleClassificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest(`/admin/cases/${selectedCase.id}/classify`, {
                method: "PUT",
                body: JSON.stringify(classificationForm)
            });
            setShowClassifyModal(false);
            fetchCases();
            setSelectedCase({
                ...selectedCase,
                ...classificationForm
            });
        } catch (err) {
            console.error("Failed to update classification", err);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "RESOLVED": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
            case "UNDER_REVIEW": return "bg-blue-100 text-blue-700 border-blue-200";
            case "DISMISSED": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Compliance Case Management</h2>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">Review, monitor, and resolve client submission files.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <Input
                            placeholder="Find by name/email..."
                            className="pl-10 text-sm h-10 border-none shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 px-4 rounded-xl border-none bg-[var(--card)] text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[var(--primary)]"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Status: All</option>
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="DISMISSED">Dismissed</option>
                    </select>
                </div>
            </div>

            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--muted)]/30 border-b border-[var(--border)]">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Submission</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Client Identity</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status Level</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Timeline</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {loading && cases.length === 0 ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-4 h-16 bg-[var(--muted)]/10" />
                                </tr>
                            ))
                        ) : cases.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted-foreground)] italic">
                                    No compliance cases match your current filters.
                                </td>
                            </tr>
                        ) : (
                            cases.map((c) => (
                                <tr key={c.id} className="hover:bg-[var(--muted)]/20 transition-colors group cursor-pointer" onClick={() => setSelectedCase(c)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                                <Briefcase size={16} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[var(--foreground)]">{c.title || "Untitled Case"}</p>
                                                <p className="text-xs text-[var(--muted-foreground)]">{c.restrictionType || "Gen. Limitation"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{c.user.firstName} {c.user.lastName}</span>
                                            <span className="text-xs text-[var(--muted-foreground)]">{c.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(c.status)}`}>
                                            {c.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-[var(--muted-foreground)]">
                                        {format(new Date(c.createdAt), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/dashboard/cases/${c.id}/classify`}
                                                className="p-2 hover:bg-[var(--card)] rounded-lg text-amber-600 shadow-sm"
                                                title="Give Classification"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <TrendingUp size={16} />
                                            </Link>
                                            <button className="p-2 hover:bg-[var(--card)] rounded-lg text-blue-600 shadow-sm" title="Quick View">
                                                <Eye size={16} />
                                            </button>
                                            {c.status !== 'RESOLVED' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c.id, 'RESOLVED'); }}
                                                    className="p-2 hover:bg-[var(--card)] rounded-lg text-green-600 shadow-sm"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteCase(c.id); }}
                                                className="p-2 hover:bg-[var(--card)] rounded-lg text-red-600 shadow-sm"
                                                title="Delete Case"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Case Details Modal */}
            <AnimatePresence>
                {selectedCase && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCase(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--muted)]/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--foreground)]">{selectedCase.title || "Compliance Record"}</h3>
                                        <p className="text-sm text-[var(--muted-foreground)]">Filed by {selectedCase.user.firstName} {selectedCase.user.lastName} on {format(new Date(selectedCase.createdAt), "MMMM d, yyyy")}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCase(null)}
                                    className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                    {/* Left Column: Details */}
                                    <div className="lg:col-span-3 space-y-8">
                                        <section>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">Limitation Intelligence</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border)]">
                                                    <p className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-1">Country / Region</p>
                                                    <p className="font-semibold">{selectedCase.country || "N/A"}</p>
                                                </div>
                                                <div className="p-4 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border)]">
                                                    <p className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-1">Account Entity</p>
                                                    <p className="font-semibold">{selectedCase.accountType || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-4 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border)]">
                                                <p className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-1">Subject Narrative</p>
                                                <p className="text-sm leading-relaxed">{selectedCase.freeTextReason || "No statement provided by client."}</p>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">Comprehensive Intake Profile</h4>
                                            <div className="space-y-6">
                                                {/* Identity & Verification */}
                                                <div className="bg-[var(--muted)]/20 p-4 rounded-2xl border border-[var(--border)]">
                                                    <h5 className="text-[10px] font-black uppercase text-[var(--primary)] mb-3 tracking-widest">Identity & Verification</h5>
                                                    <div className="grid grid-cols-2 gap-y-3 text-xs">
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1 mr-4">
                                                            <span className="text-[var(--muted-foreground)]">ID Uploaded Before</span>
                                                            <span className="font-bold">{selectedCase.hasUploadedIDBefore ? "Yes" : "No"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Name Matches ID</span>
                                                            <span className="font-bold">{selectedCase.nameMatchesID ? "Yes" : "No"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1 mr-4">
                                                            <span className="text-[var(--muted-foreground)]">Upload Rejected Before</span>
                                                            <span className="font-bold">{selectedCase.hasHadUploadRejected ? "Yes" : "No"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Used VPN</span>
                                                            <span className="font-bold">{selectedCase.usedVPN ? "Yes" : "No"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Business Profile */}
                                                <div className="bg-[var(--muted)]/20 p-4 rounded-2xl border border-[var(--border)]">
                                                    <h5 className="text-[10px] font-black uppercase text-[var(--primary)] mb-3 tracking-widest">Business & Sales Activity</h5>
                                                    <div className="grid grid-cols-1 gap-y-3 text-xs">
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Selling Goods/Services</span>
                                                            <span className="font-bold uppercase">{selectedCase.sellingGoodsOrServices || "None"}</span>
                                                        </div>
                                                        {selectedCase.sellingGoodsOrServices !== 'none' && (
                                                            <>
                                                                <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                                    <span className="text-[var(--muted-foreground)]">Customers (Last 30d)</span>
                                                                    <span className="font-bold">{selectedCase.customerCount30Days || "0"}</span>
                                                                </div>
                                                                <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                                    <span className="text-[var(--muted-foreground)]">Issues Invoices</span>
                                                                    <span className="font-bold">{selectedCase.issuesInvoices ? "Yes" : "No"}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                                    <span className="text-[var(--muted-foreground)]">Product Description</span>
                                                                    <span className="font-bold">{selectedCase.whatExactlyDoYouSell || "N/A"}</span>
                                                                </div>
                                                                <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                                    <span className="text-[var(--muted-foreground)]">High Risk Items (Crypto/Betting)</span>
                                                                    <span className="font-bold text-red-600">{selectedCase.sellsProhibitedItems ? "Yes" : "No"}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                                    <span className="text-[var(--muted-foreground)]">Declared Business</span>
                                                                    <span className="font-bold">{selectedCase.declaredBusiness || "N/A"}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                                    <span className="text-[var(--muted-foreground)]">Actual Payment Purpose</span>
                                                                    <span className="font-bold">{selectedCase.actualCustomerPaymentFor || "N/A"}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Risk Indicators */}
                                                <div className="bg-[var(--muted)]/20 p-4 rounded-2xl border border-[var(--border)]">
                                                    <h5 className="text-[10px] font-black uppercase text-red-600 mb-3 tracking-widest">Risk & Anomaly Indicators</h5>
                                                    <div className="grid grid-cols-1 gap-y-3 text-xs">
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Sudden Volume Increase</span>
                                                            <span className={`font-bold ${selectedCase.suddenVolumeIncrease ? 'text-amber-600' : ''}`}>{selectedCase.suddenVolumeIncrease ? "Yes" : "No"}</span>
                                                        </div>
                                                        {selectedCase.suddenVolumeIncrease && (
                                                            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                                <span className="text-[var(--muted-foreground)]">Reason for Surge</span>
                                                                <span className="font-bold">{selectedCase.whyVolumeIncreased || "N/A"}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Disputes (90d)</span>
                                                            <span className="font-bold">{selectedCase.disputeCount90Days || "0"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Moving Funds Between Accounts</span>
                                                            <span className="font-bold">{selectedCase.movedFundsBetweenAccounts ? "Yes" : "No"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Early Withdrawal Attempt</span>
                                                            <span className="font-bold">{selectedCase.attemptedEarlyWithdrawal ? "Yes" : "No"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Account Inactive Previously</span>
                                                            <span className="font-bold">{selectedCase.longTermInactive ? "Yes" : "No"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Integrity & Communication */}
                                                <div className="bg-[var(--muted)]/20 p-4 rounded-2xl border border-[var(--border)]">
                                                    <h5 className="text-[10px] font-black uppercase text-blue-600 mb-3 tracking-widest">Integrity & Communication</h5>
                                                    <div className="grid grid-cols-1 gap-y-3 text-xs">
                                                        <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Physical Location Recorded</span>
                                                            <span className="font-bold">{selectedCase.physicalLocation || "N/A"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Had Other Accounts</span>
                                                            <span className="font-bold uppercase">{selectedCase.hadOtherAccounts || "No"}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Device/WiFi Sharing</span>
                                                            <span className="font-bold">{selectedCase.otherPersonUsingDevice || "None"}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-[var(--border)] pb-1">
                                                            <span className="text-[var(--muted-foreground)]">Reached Out To PayPal</span>
                                                            <span className="font-bold uppercase">{selectedCase.reachedOutToPayPal || "No"}</span>
                                                        </div>
                                                        {selectedCase.reachedOutToPayPal !== 'no' && (
                                                            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-1">
                                                                <span className="text-[var(--muted-foreground)]">Client's Explanation to PayPal</span>
                                                                <p className="font-medium italic text-[11px] leading-relaxed">"{selectedCase.whatDidYouTellPayPal || "No details provided."}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Lock size={12} className="text-[var(--primary)]" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Admin Notes (Internal Only)</h4>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-[var(--muted)] rounded text-[var(--muted-foreground)]">{selectedCase.notes?.length || 0} Records</span>
                                            </div>
                                            <form onSubmit={handleAddNote} className="mb-6">
                                                <div className="relative">
                                                    <textarea
                                                        className="w-full h-24 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary)] text-sm resize-none pr-12"
                                                        placeholder="Append specialized guidance or internal observation..."
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={noteLoading || !newNote.trim()}
                                                        className="absolute right-3 bottom-3 p-2 bg-[var(--primary)] text-white rounded-xl shadow-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-all"
                                                    >
                                                        {noteLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                                    </button>
                                                </div>
                                            </form>
                                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                {selectedCase.notes?.map((note: any) => (
                                                    <div key={note.id} className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl relative group shadow-sm">
                                                        <p className="text-xs font-bold text-[var(--muted-foreground)] mb-1">{format(new Date(note.createdAt), "MMM d, h:mm a")}</p>
                                                        <p className="text-sm">{note.content}</p>
                                                    </div>
                                                ))}
                                                {(!selectedCase.notes || selectedCase.notes.length === 0) && (
                                                    <div className="text-center py-8 border border-dashed border-[var(--border)] rounded-2xl">
                                                        <p className="text-xs text-[var(--muted-foreground)] italic">Secure audit trail is currently empty.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column: Files & Actions */}
                                    <div className="lg:col-span-2 space-y-8">
                                        <section>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">Uploaded Documentation</h4>
                                            <div className="space-y-3">
                                                {selectedCase.documents?.map((doc: any) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer group shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-white border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--muted-foreground)] group-hover:text-[var(--primary)] shadow-xs transition-colors">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-xs font-bold truncate max-w-[120px]">{doc.fileName}</p>
                                                                <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-tighter">{doc.fileType}</p>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={doc.filePath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 hover:bg-white rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] shadow-xs"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    </div>
                                                ))}
                                                {(!selectedCase.documents || selectedCase.documents.length === 0) && (
                                                    <p className="text-xs text-[var(--muted-foreground)] italic text-center py-4 bg-[var(--muted)]/10 rounded-2xl border border-dashed border-[var(--border)]">No evidentiary files provided.</p>
                                                )}
                                            </div>
                                        </section>

                                        <section className="p-6 bg-[var(--muted)]/30 rounded-3xl border border-[var(--border)] shadow-inner">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">Console Commands</h4>
                                            <div className="flex flex-col gap-3">
                                                <Button
                                                    className="w-full rounded-xl h-11 h-sm text-sm"
                                                    variant="primary"
                                                    onClick={() => setShowClassifyModal(true)}
                                                >
                                                    <AlertTriangle size={16} /> Give Classification Results
                                                </Button>
                                                <Button
                                                    className="w-full rounded-xl h-11 h-sm text-sm"
                                                    variant={selectedCase.status === 'RESOLVED' ? 'secondary' : 'primary'}
                                                    onClick={() => handleUpdateStatus(selectedCase.id, 'RESOLVED')}
                                                    disabled={selectedCase.status === 'RESOLVED'}
                                                >
                                                    <CheckCircle size={16} /> Mark Case as Resolved
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="w-full rounded-xl h-11 text-sm border-none shadow-sm"
                                                    onClick={() => handleUpdateStatus(selectedCase.id, 'UNDER_REVIEW')}
                                                    disabled={selectedCase.status === 'UNDER_REVIEW'}
                                                >
                                                    <Clock size={16} /> Set to Under Review
                                                </Button>
                                                <div className="pt-4 mt-2 border-t border-[var(--border)]">
                                                    <Button
                                                        variant="danger"
                                                        className="w-full rounded-xl h-11 text-sm shadow-md"
                                                        onClick={() => handleDeleteCase(selectedCase.id)}
                                                    >
                                                        <Trash2 size={16} /> Permanent Deletion
                                                    </Button>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Classification Modal */}
            <AnimatePresence>
                {showClassifyModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowClassifyModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-[var(--card)] rounded-3xl shadow-2xl p-8"
                        >
                            <h3 className="text-xl font-bold mb-6">Expert Case Classification</h3>
                            <form onSubmit={handleClassificationSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-3">Recovery Likelihood</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 text-sm font-bold"
                                        value={classificationForm.likelihood}
                                        onChange={(e) => setClassificationForm({ ...classificationForm, likelihood: e.target.value })}
                                    >
                                        <option value="LOW">Low Probability</option>
                                        <option value="MEDIUM">Medium Probability</option>
                                        <option value="HIGH">High Probability</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-3">Funds Release Probability</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 text-sm font-bold"
                                        value={classificationForm.fundLikelihood}
                                        onChange={(e) => setClassificationForm({ ...classificationForm, fundLikelihood: e.target.value })}
                                    >
                                        <option value="LOW">Low Probability</option>
                                        <option value="MEDIUM">Medium Probability</option>
                                        <option value="HIGH">High Probability</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-3">Expert Recommendation</label>
                                    <textarea
                                        className="w-full h-24 p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 text-sm font-medium resize-none shadow-inner"
                                        placeholder="Specific strategic steps for this case..."
                                        value={classificationForm.recommendation}
                                        onChange={(e) => setClassificationForm({ ...classificationForm, recommendation: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setShowClassifyModal(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary" className="flex-2 grow h-12 rounded-xl shadow-lg shadow-[var(--primary)]/20" disabled={!classificationForm.recommendation}>Submit Results</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
