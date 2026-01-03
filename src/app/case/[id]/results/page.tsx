"use client";

import { useState, useEffect } from "react";
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    ArrowLeft,
    Shield,
    ChevronRight,
    TrendingUp,
    Lock,
    HelpCircle,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function CaseResultsPage() {
    const { id } = useParams();
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const res = await apiRequest(`/cases/${id}`);
                setCaseData(res.data);

                // If it's classified, mark as viewed
                if (res.data?.likelihood) {
                    await apiRequest(`/cases/${id}/view-results`, { method: 'PUT' });
                }
            } catch (err) {
                console.error("Failed to fetch case data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-8">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-4">Case Not Found</h2>
                    <Link href="/dashboard" className="text-[var(--primary)] font-bold">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    const isPending = !caseData.likelihood;

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="text-[var(--primary)]" size={20} />
                        <span className="text-xs font-black uppercase tracking-widest opacity-40">Secure Compliance Record</span>
                    </div>
                </div>

                <div className="bg-[var(--card)] rounded-[40px] shadow-[var(--shadow-elevated)] border border-[var(--border)] overflow-hidden">
                    {isPending ? (
                        <div className="p-10 md:p-14 text-center bg-[var(--color-navy-800)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                            <div className="py-12 relative z-10">
                                <p className="text-xl md:text-3xl text-white leading-relaxed max-w-3xl mx-auto font-black uppercase tracking-tight">
                                    <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-8">GOOD NEWS !!!</span> <br className="mb-4" />
                                    <span className="normal-case font-bold text-slate-200">You can <span className="text-emerald-400 uppercase">RELAX</span> and breathe now, Your case is under review and pending classification from our analysts, in a few moments you'll have the, <span className="text-emerald-400 uppercase">RESULTS</span>, the likelihood of <span className="text-emerald-400 uppercase">GETTING YOUR FUNDS</span>, and <span className="text-emerald-400 uppercase">THE BEST</span> course of <span className="text-emerald-400 uppercase">ACTION</span> going forth.</span>
                                    <br className="mb-8" />
                                    <span className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 inline-block shadow-lg backdrop-blur-md normal-case font-bold text-white">
                                        In 12 out of 15 cases, its just a small issue and <span className="text-emerald-400 uppercase">FUNDS WILL BE RE-INSTATED !!</span>
                                    </span>
                                    <br className="mb-4" />
                                    <span className="text-sm font-bold text-slate-400 normal-case tracking-widest pt-4 block">Classification from our analysts may sometimes take a maximum of one day.</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Hero Section */}
                            <div className="p-10 md:p-14 border-b border-[var(--border)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--muted)]/50 border border-[var(--border)] mb-6">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Results Ready</span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6 tracking-tight leading-tight">
                                        Your Classification Results
                                    </h1>
                                    <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto font-medium">
                                        Our analysts have completed the evaluation of your {caseData.restrictionType?.toLowerCase() || 'account'} restriction. Please review the recovery strategy below.
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 md:p-12 space-y-10">
                                {/* Status Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-emerald-50 transition-colors"
                                    >
                                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                                            <TrendingUp size={32} />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Recovery Likelihood</h3>
                                        <p className="text-3xl font-black text-emerald-900 mb-2">{caseData.likelihood}</p>
                                        <p className="text-xs font-bold text-emerald-700/60 uppercase tracking-tighter">Based on current risk scoring</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Funds Release Probability</h3>
                                        <p className="text-3xl font-black text-blue-900 mb-2">{caseData.fundLikelihood}</p>
                                        <p className="text-xs font-bold text-blue-700/60 uppercase tracking-tighter">Projected release timeline impact</p>
                                    </motion.div>
                                </div>

                                {/* Recommendation Section */}
                                <div className="bg-[var(--muted)]/20 rounded-[32px] p-8 md:p-10 border border-[var(--border)]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                                            <HelpCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-[var(--foreground)]">Strategic Action Plan</h4>
                                            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Recommended by Lead Compliance Advisor</p>
                                        </div>
                                    </div>
                                    <div className="prose prose-sm max-w-none text-[var(--muted-foreground)] font-medium leading-relaxed">
                                        <p className="border-l-4 border-[var(--primary)] pl-6 py-4 bg-white/50 rounded-xl italic shadow-sm text-base md:text-lg">
                                            {caseData.recommendation || "Our analysts are finalizing your specific strategic steps. Please check back shortly."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {isPending && (
                    <div className="mt-8 grid grid-cols-3 gap-4 h-2 rounded-full overflow-hidden opacity-20">
                        <div className="bg-[var(--primary)]" />
                        <div className="bg-[var(--primary)] animate-pulse" />
                        <div className="bg-[var(--border)]" />
                    </div>
                )}
            </div>
        </div>
    );
}
