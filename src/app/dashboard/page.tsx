"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    FileText,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Loader2,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    Info
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

interface Case {
    id: string;
    title: string;
    status: string;
    likelihood: string;
    fundLikelihood: string;
    recommendation: string;
    classificationViewed: boolean;
    isPaid: boolean;
    paidPlan?: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await apiRequest("/cases");
                if (response.success) {
                    setCases(response.data);
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch cases");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCases();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Please log in to view your dashboard</h2>
                <Link href="/auth/login" className="text-[var(--accent)] hover:underline mt-4 inline-block">Go to Login</Link>
            </div>
        );
    }

    const getLikelihoodColor = (l: string) => {
        switch (l) {
            case 'HIGH': return 'text-[var(--success)] bg-[var(--success-bg)]';
            case 'MEDIUM': return 'text-[var(--warning)] bg-[var(--warning-bg)]';
            case 'LOW': return 'text-[var(--danger)] bg-[var(--danger-bg)]';
            default: return 'text-[var(--muted-foreground)] bg-[var(--muted)]';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Compliance Dashboard</h1>
                    <p className="text-[var(--muted-foreground)] mt-1 font-medium">
                        Account ID: <span className="text-[var(--foreground)]">{user.email}</span> • Status: <span className="text-[var(--accent)] uppercase font-bold text-xs">{user.accountStatus}</span>
                    </p>
                </div>
                <Link
                    href="/case/new"
                    className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-button)] flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> New Case Intake
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Case List */}
                <div className="lg:col-span-2 space-y-6">
                    {cases.length === 0 ? (
                        <div className="bg-[var(--card)] rounded-3xl p-12 text-center border border-[var(--border)] shadow-[var(--shadow-card)]">
                            <div className="w-16 h-16 bg-[var(--color-teal-50)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-8 h-8 text-[var(--accent)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No Active Cases</h3>
                            <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto font-medium">
                                Submit an intake form to receive an automated assessment and compliance roadmap.
                            </p>
                            <Link href="/case/new" className="text-[var(--accent)] font-bold hover:underline">
                                Get Started →
                            </Link>
                        </div>
                    ) : (
                        cases.map((c) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow duration-150"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted-foreground)] mb-1 block">Case ID: {c.id.slice(0, 8)}</span>
                                            <h3 className="text-xl font-bold text-[var(--foreground)]">{c.title}</h3>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${!c.likelihood ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-[var(--color-teal-50)] text-[var(--accent)]'}`}>
                                            {!c.likelihood ? 'Pending Review' : c.status.replace("_", " ")}
                                        </span>
                                    </div>

                                    {c.likelihood ? (
                                        <>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                                <div className="p-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Recovery Likelihood</p>
                                                    <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${getLikelihoodColor(c.likelihood)}`}>
                                                        {c.likelihood}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Fund Release</p>
                                                    <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${getLikelihoodColor(c.fundLikelihood)}`}>
                                                        {c.fundLikelihood}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)] hidden sm:block">
                                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Date Submitted</p>
                                                    <p className="text-xs font-bold text-[var(--foreground)]">{new Date(c.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="bg-[var(--color-teal-50)]/50 border border-[var(--color-teal-100)] p-6 rounded-2xl relative shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                                                    <h4 className="text-xs font-bold text-[var(--color-navy-800)] uppercase tracking-wider">Expert Recommendation</h4>
                                                </div>
                                                <p className="text-sm text-[var(--foreground)] font-medium leading-relaxed">
                                                    {c.recommendation}
                                                </p>

                                                <div className="mt-6 flex flex-wrap gap-3">
                                                    <Link
                                                        href={`/case/${c.id}/results`}
                                                        className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all shadow-md"
                                                    >
                                                        Show Classification Result <ChevronRight size={14} />
                                                    </Link>

                                                    <Link
                                                        href={`/case/${c.id}/recovery`}
                                                        className="inline-flex items-center gap-2 bg-[#FACC15] text-[#001D3D] px-5 py-2.5 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-md"
                                                    >
                                                        Recovery Steps <FileText size={14} />
                                                    </Link>

                                                    {c.isPaid && (
                                                        <Link
                                                            href={`/case/${c.id}/chat`}
                                                            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-all shadow-md"
                                                        >
                                                            Chat with Advisor <Plus size={14} />
                                                        </Link>
                                                    )}
                                                </div>

                                                <Link
                                                    href={`/case/${c.id}/results`}
                                                    className="absolute bottom-4 right-4 text-[var(--accent)] hover:rotate-90 transition-transform duration-200"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-[var(--muted)]/30 border border-[var(--border)] p-6 rounded-2xl group cursor-pointer hover:bg-[var(--muted)]/50 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Submission Glimpse</h4>
                                                </div>
                                                <Link href={`/case/${c.id}/results`} className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest hover:underline">
                                                    View Details →
                                                </Link>
                                            </div>
                                            <p className="text-sm text-[var(--muted-foreground)] font-medium italic border-l-2 border-amber-200 pl-4 py-1">
                                                "Case submitted and awaiting analyst queue. Your strategic roadmap will be available here once classification is complete."
                                            </p>
                                            <div className="mt-6 flex gap-3 overflow-hidden">
                                                <div className="h-1 flex-1 bg-amber-200/50 rounded-full overflow-hidden">
                                                    <motion.div
                                                        animate={{ x: [-100, 200] }}
                                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                        className="h-full w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[var(--color-navy-800)] rounded-[2rem] p-8 text-white shadow-[var(--shadow-elevated)] relative overflow-hidden">
                        <ShieldCheck className="w-12 h-12 text-[var(--color-teal-400)] mb-6 relative z-10" />
                        <h3 className="text-xl font-bold mb-4 relative z-10">Advisory Notice</h3>
                        <p className="text-[var(--color-grey-400)] text-sm leading-relaxed mb-6 relative z-10 font-medium">
                            Our automated assessments are based on current PayPal compliance patterns. For complex
                            permanent limitations, our analysts will provide manual oversight.
                        </p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/20 blur-2xl rounded-full" />
                    </div>

                    <div className="bg-[var(--card)] rounded-3xl p-6 border border-[var(--border)] shadow-[var(--shadow-card)]">
                        <div className="flex items-center gap-2 mb-6">
                            <Info className="w-5 h-5 text-[var(--accent)]" />
                            <h3 className="font-bold text-[var(--foreground)]">Education Portal</h3>
                        </div>
                        <div className="space-y-4">
                            <Link href="/dashboard/education/180-day-rule" className="block p-4 rounded-2xl hover:bg-[var(--muted)] transition-all duration-150 border border-transparent hover:border-[var(--border)]">
                                <p className="text-sm font-bold text-[var(--foreground)] mb-1">Understanding 180-Day Rule</p>
                                <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Why PayPal holds funds for 6 months...</p>
                            </Link>
                            <Link href="/dashboard/education/kyc-vs-verification" className="block p-4 rounded-2xl hover:bg-[var(--muted)] transition-all duration-150 border border-transparent hover:border-[var(--border)]">
                                <p className="text-sm font-bold text-[var(--foreground)] mb-1">KYC vs Verification</p>
                                <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Differentiating between standard checks...</p>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[var(--primary)] rounded-3xl p-6 text-white shadow-[var(--shadow-elevated)] group hover:scale-[1.02] transition-transform duration-200">
                        <Link href="/dashboard/chat" className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"
                            >
                                <ExternalLink className="w-6 h-6" />
                            </motion.div>
                            <div className="text-center">
                                <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Secure Advisor Chat</p>
                                <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Connect with our compliance team</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-8 bg-[var(--danger-bg)] text-[var(--danger)] p-4 rounded-2xl border border-red-100 flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}
