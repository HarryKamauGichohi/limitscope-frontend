"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    CreditCard,
    Smartphone,
    CheckCircle2,
    ArrowLeft,
    AlertCircle,
    Loader2,
    Lock
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function RecoveryPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [caseData, setCaseData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const response = await apiRequest(`/cases/${params.id}`);
                setCaseData(response.data);
            } catch (err) {
                console.error("Failed to fetch case data", err);
            }
        };
        fetchCaseData();
    }, [params.id]);

    const handlePayment = async (plan: string) => {
        setIsProcessing(true);
        try {
            // Mocking payment delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mark as paid in backend
            const response = await apiRequest(`/cases/${params.id}/pay`, {
                method: "PUT",
                body: JSON.stringify({ plan })
            });

            if (response.success) {
                router.push(`/case/${params.id}/chat`);
            }
        } catch (err) {
            console.error("Payment failed", err);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!caseData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Return to Dashboard</span>
                </Link>

                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-emerald-600 font-bold text-xs uppercase tracking-widest border border-emerald-100 mb-6"
                    >
                        <ShieldCheck size={14} /> Secure Recovery Channel
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight mb-4">
                        Activate Recovery Protocol
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto font-medium">
                        Select the plan corresponding to your account type to begin the specialized recovery process with a dedicated advisor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Personal Plan */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Standard Recovery</span>
                            <h3 className="text-2xl font-bold mb-4">Personal Account</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black">$10</span>
                                <span className="text-slate-400 text-sm font-bold">.00</span>
                            </div>

                            <ul className="space-y-4 mb-10 text-sm font-medium text-slate-600">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Personal Limitation Removal</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Direct Advisor Chat Access</span>
                                </li>
                                <li className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span className="font-bold text-emerald-700 underline decoration-emerald-200 underline-offset-4">Single Case Resolution</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handlePayment('PERSONAL')}
                            disabled={isProcessing}
                            className="w-full bg-[var(--foreground)] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Smartphone size={18} /> Pay with Google Pay
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Business Plan */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-[var(--color-navy-800)] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col border-4 border-[var(--primary)]/20"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-[var(--primary)] text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                                RECOMMENDED
                            </div>
                        </div>

                        <div className="relative z-10 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Premium Recovery</span>
                            <h3 className="text-2xl font-bold mb-4">Business Account</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black">$19.99</span>
                            </div>

                            <ul className="space-y-4 mb-10 text-sm font-medium text-slate-200">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-[var(--color-teal-400)]" />
                                    <span>Merchant & Business Support</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-[var(--color-teal-400)]" />
                                    <span>Priority Advisor Assignment</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-[var(--color-teal-400)]" />
                                    <span>Advanced Documents & Invoicing</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handlePayment('BUSINESS')}
                            disabled={isProcessing}
                            className="w-full bg-[var(--primary)] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[var(--primary)]/30"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Smartphone size={18} /> Pay with Google Pay
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                        <Lock size={12} /> SSL Secure
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                        <CreditCard size={12} /> PCI Compliant
                    </div>
                </div>
            </div>
        </div>
    );
}
