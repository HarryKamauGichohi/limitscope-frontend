"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Shield,
    TrendingUp,
    Lock,
    Loader2,
    CheckCircle,
    AlertTriangle,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminClassifyPage() {
    const { id } = useParams();
    const router = useRouter();
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        likelihood: "MEDIUM",
        fundLikelihood: "MEDIUM",
        recommendation: ""
    });

    useEffect(() => {
        const fetchCase = async () => {
            try {
                // We'll reuse the client endpoint since it's accessible by ID, 
                // but in production we'd use an admin-specific one.
                const res = await apiRequest(`/cases/${id}`);
                setCaseData(res.data);
                setForm({
                    likelihood: res.data.likelihood || "MEDIUM",
                    fundLikelihood: res.data.fundLikelihood || "MEDIUM",
                    recommendation: res.data.recommendation || ""
                });
            } catch (err) {
                console.error("Failed to fetch case", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiRequest(`/admin/cases/${id}/classify`, {
                method: "PUT",
                body: JSON.stringify(form)
            });
            router.push("/admin/dashboard");
        } catch (err) {
            console.error("Failed to classify", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="text-[var(--primary)]" size={20} />
                        <span className="text-xs font-black uppercase tracking-widest opacity-40">Admin Console / Classification</span>
                    </div>
                </div>

                <div className="bg-[var(--card)] rounded-[40px] shadow-[var(--shadow-elevated)] border border-[var(--border)] overflow-hidden p-8 md:p-12">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-[var(--foreground)] mb-2 tracking-tight">Expert Classification</h1>
                        <p className="text-[var(--muted-foreground)] font-medium">Providing manual assessment for Case <span className="text-[var(--foreground)] font-bold">#{id?.slice(0, 8)}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                                    <TrendingUp size={14} className="text-emerald-500" /> Recovery Likelihood
                                </label>
                                <select
                                    className="w-full h-14 px-5 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                                    value={form.likelihood}
                                    onChange={(e) => setForm({ ...form, likelihood: e.target.value })}
                                >
                                    <option value="LOW">Low Probability</option>
                                    <option value="MEDIUM">Medium Probability</option>
                                    <option value="HIGH">High Probability</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                                    <Lock size={14} className="text-blue-500" /> Funds Release
                                </label>
                                <select
                                    className="w-full h-14 px-5 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                                    value={form.fundLikelihood}
                                    onChange={(e) => setForm({ ...form, fundLikelihood: e.target.value })}
                                >
                                    <option value="LOW">Low Probability</option>
                                    <option value="MEDIUM">Medium Probability</option>
                                    <option value="HIGH">High Probability</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                                <FileText size={14} className="text-[var(--primary)]" /> Custom Strategic Recommendation
                            </label>
                            <textarea
                                className="w-full h-40 p-5 rounded-3xl border border-[var(--border)] bg-[var(--muted)]/30 text-sm font-medium focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all resize-none"
                                placeholder="Explain the rationale and steps the client should take next..."
                                value={form.recommendation}
                                onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[var(--foreground)] text-[var(--background)] py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle size={24} /> Publish Assessment Results</>}
                            </button>
                            <p className="text-center mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] opacity-50">
                                This action will immediately notify the client and update their dashboard.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <div>
                        <p className="text-xs font-bold text-amber-900 mb-1 leading-tight">Regulatory Compliance Override</p>
                        <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                            Manual classification overrides rules-based scoring. Ensure your assessment aligns with current advisory guidelines for {caseData?.restrictionType?.toLowerCase() || 'account'} restrictions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
