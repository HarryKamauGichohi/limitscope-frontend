"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    Clock,
    ShieldCheck,
    AlertTriangle,
    FileText,
    CreditCard,
    Briefcase,
    CheckCircle2,
    Info
} from "lucide-react";
import Link from "next/link";

export default function Rule180DayPage() {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors mb-8 font-bold group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-12"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-teal-50)] text-[var(--accent)] text-xs font-black uppercase tracking-widest border border-[var(--color-teal-100)]"
                        >
                            <Clock className="w-4 h-4" />
                            Compliance Guide
                        </motion.div>
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight"
                        >
                            THE 180 DAY RULE
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto font-medium leading-relaxed"
                        >
                            The **PayPal 180-day rule** refers to the time limits PayPal applies to **disputes, claims, chargebacks, and account limitations**. It is primarily a **risk-management and buyer-protection policy**, affecting both buyers and sellers.
                        </motion.p>
                    </div>

                    {/* Main Content Sections */}
                    <div className="grid gap-8">
                        {/* Section 1 */}
                        <motion.section variants={itemVariants} className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-[var(--shadow-card)]">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-[var(--color-teal-50)] rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">1. Buyer disputes and claims (180 days)</h2>
                                    <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mt-1">What it means</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-[var(--foreground)]">
                                <p className="font-medium leading-relaxed">
                                    A buyer has <span className="text-[var(--accent)] font-bold">up to 180 days from the transaction date</span> to open a **dispute** for:
                                </p>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    <li className="flex items-center gap-2 p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm font-bold">
                                        <div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Item Not Received (INR)
                                    </li>
                                    <li className="flex items-center gap-2 p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm font-bold">
                                        <div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Significantly Not as Described (SNAD)
                                    </li>
                                </ul>
                                <div className="bg-[var(--warning-bg)]/30 border border-amber-200 p-6 rounded-2xl space-y-3">
                                    <h4 className="text-amber-800 font-bold text-sm flex items-center gap-2">
                                        <Info className="w-4 h-4" /> Why it exists & Implication for sellers
                                    </h4>
                                    <p className="text-amber-800 text-sm leading-relaxed font-medium">
                                        It protects buyers who discover issues long after payment. For sellers, this means funds are **not fully risk-free** until the 180 days pass. Always retain proof of delivery and communication records.
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 2 */}
                        <motion.section variants={itemVariants} className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-[var(--shadow-card)]">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">2. Chargebacks via card issuers</h2>
                                    <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mt-1">Up to 180 days or more</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[var(--foreground)] font-medium leading-relaxed">
                                    If a buyer paid using a credit or debit card, their bank may allow a chargeback. Even if PayPal closes a case, a **bank chargeback can still override it**.
                                </p>
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-xs text-red-800 font-bold leading-relaxed">
                                        PayPal will temporarily debit your account while the chargeback is reviewed, regardless of previous internal resolutions.
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 3 */}
                        <motion.section variants={itemVariants} className="bg-[var(--color-navy-800)] rounded-[2.5rem] p-10 text-white shadow-[var(--shadow-elevated)] relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/2 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest">
                                        Critical Alert
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight">3. Account limitations and fund holds (180 days)</h2>
                                    <p className="text-[var(--color-grey-400)] text-sm leading-relaxed font-medium">
                                        If PayPal detects unusual activity, flags compliance issues, or suspects policy violations, they may **limit your account** and **hold your balance for up to 180 days**.
                                    </p>
                                </div>
                                <div className="md:w-1/2 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-4">
                                    <h4 className="text-[var(--accent)] font-bold text-sm uppercase tracking-wider">Why 180 Days?</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-[var(--color-teal-400)]" /> Potential disputes coverage
                                        </li>
                                        <li className="flex items-center gap-2 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-[var(--color-teal-400)]" /> Chargeback protection window
                                        </li>
                                        <li className="flex items-center gap-2 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-[var(--color-teal-400)]" /> Fraud claim evaluation
                                        </li>
                                    </ul>
                                    <p className="text-[10px] text-white/60 pt-2 italic">
                                        After 180 days, if no unresolved claims exist, withdrawal is usually allowed.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 blur-3xl rounded-full" />
                        </motion.section>

                        {/* Section 4 & 5 Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.section variants={itemVariants} className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)]">
                                <Briefcase className="w-8 h-8 text-[var(--accent)] mb-4" />
                                <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">4. Impact on Businesses</h3>
                                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed font-medium">
                                    New accounts, high-value transactions, and rapid growth are treated as **higher risk**, increasing the chance of reserves and limitations.
                                </p>
                            </motion.section>

                            <motion.section variants={itemVariants} className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)]">
                                <ShieldCheck className="w-8 h-8 text-[var(--accent)] mb-4" />
                                <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">5. Protective Measures</h3>
                                <ul className="space-y-2 text-sm font-bold text-[var(--foreground)]">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Use tracked shipping</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Document everything</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Accurate descriptions</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Quick dispute response</li>
                                </ul>
                            </motion.section>
                        </div>

                        {/* Key Takeaway */}
                        <motion.section variants={itemVariants} className="bg-[var(--color-teal-50)] border-2 border-dashed border-[var(--color-teal-200)] rounded-3xl p-8 text-center">
                            <h3 className="text-2xl font-black text-[var(--accent)] mb-4 uppercase tracking-tighter">Key Takeaway</h3>
                            <p className="text-[var(--color-navy-800)] font-bold text-lg leading-relaxed max-w-2xl mx-auto">
                                The 180-day rule is a structural risk management policy. For sellers, it means funds are
                                <span className="text-[var(--accent)]"> conditionally yours </span>
                                for up to 6 months. Compliance and documentation are your best defense.
                            </p>
                        </motion.section>
                    </div>

                    <div className="flex justify-center pt-8">
                        <Link
                            href="/dashboard"
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-elevated)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Back to my Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
