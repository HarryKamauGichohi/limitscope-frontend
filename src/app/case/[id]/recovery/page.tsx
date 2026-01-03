"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    ArrowLeft,
    Loader2,
    MessageSquare,
    CheckCircle2,
    HeadphonesIcon,
    Shield,
    Clock
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function RecoveryPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [caseData, setCaseData] = useState<any>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const response = await apiRequest(`/cases/${params.id}`);
                setCaseData(response.data);
            } catch (err) {
                console.error("Failed to fetch case data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [params.id]);

    const handleConnectSpecialist = async () => {
        setIsRedirecting(true);
        // Small delay for UX, then redirect to chat
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push(`/chat?caseId=${params.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Return to Dashboard</span>
                </Link>

                <div className="text-center mb-12 md:mb-16">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-emerald-600 font-bold text-xs uppercase tracking-widest border border-emerald-100 mb-6"
                    >
                        <ShieldCheck size={14} /> Expert Advisory Protocol
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tight mb-4">
                        Connect with Your Specialist Advisor
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Your case has been reviewed and classified. Our expert advisors are ready to guide you through the next steps with personalized support.
                    </p>
                </div>

                {/* Main CTA Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl relative overflow-hidden mb-8"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)]/5 to-emerald-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-[var(--primary)]/30">
                                <HeadphonesIcon size={36} className="text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-center mb-4">
                            One-on-One Expert Consultation
                        </h2>

                        <p className="text-center text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto">
                            Chat directly with a compliance specialist who will provide tailored guidance based on your specific case classification and circumstances.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="flex items-start gap-3 p-4 bg-[var(--muted)]/30 rounded-2xl">
                                <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-sm mb-1">Personalized Strategy</h3>
                                    <p className="text-xs text-[var(--muted-foreground)]">Custom recovery plan for your case</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[var(--muted)]/30 rounded-2xl">
                                <Shield size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-sm mb-1">Expert Support</h3>
                                    <p className="text-xs text-[var(--muted-foreground)]">Direct access to advisors</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[var(--muted)]/30 rounded-2xl">
                                <Clock size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-sm mb-1">Real-time Help</h3>
                                    <p className="text-xs text-[var(--muted-foreground)]">Immediate responses to questions</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleConnectSpecialist}
                            disabled={isRedirecting}
                            className="w-full bg-gradient-to-r from-[var(--primary)] to-emerald-600 text-white py-5 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[var(--primary)]/30 disabled:opacity-50"
                        >
                            {isRedirecting ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <MessageSquare size={24} />
                                    Talk to a Specialist Now
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
                            Your specialist will review your case details and provide step-by-step guidance
                        </p>
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center"
                >
                    <p className="text-sm text-blue-900 font-medium">
                        <strong className="font-black">What to expect:</strong> Your specialist will review your classification results, answer any questions, and provide detailed recovery steps tailored to your situation.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
