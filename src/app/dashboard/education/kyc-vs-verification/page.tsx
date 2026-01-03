"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    Shield,
    UserCheck,
    UserPlus,
    CreditCard,
    Building2,
    Search,
    Info,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function KYCvsVerificationPage() {
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
                            <Shield className="w-4 h-4" />
                            Regulatory Insights
                        </motion.div>
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight"
                        >
                            KYC vs VERIFICATION
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto font-medium leading-relaxed"
                        >
                            On PayPal, **“KYC” and “verification” are related but not identical concepts**. PayPal uses the word *verification* in the UI, while *KYC* is the underlying regulatory process driving it.
                        </motion.p>
                    </div>

                    {/* Main Content Sections */}
                    <div className="grid gap-8">
                        {/* Section 1 */}
                        <motion.section variants={itemVariants} className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-[var(--shadow-card)]">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-[var(--color-teal-50)] rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Search className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">1. What KYC means (regulatory concept)</h2>
                                    <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mt-1">Regulatory Requirement</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-[var(--foreground)]">
                                <p className="font-medium leading-relaxed">
                                    **KYC (Know Your Customer)** is a **legal requirement** imposed on financial institutions to prevent money laundering, fraud, and comply with international banking regulations.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-widest">Typical KYC Data</h4>
                                        <ul className="space-y-2">
                                            {["Full legal name", "Date of birth", "National ID / passport", "Proof of address"].map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-sm font-bold">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-[var(--muted)]/50 border border-[var(--border)] rounded-2xl">
                                        <AlertCircle className="w-5 h-5 text-[var(--accent)] mb-2" />
                                        <p className="text-xs font-bold leading-relaxed">
                                            KYC is **not optional**. PayPal must perform KYC to legally operate in most countries, including Kenya.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 2 */}
                        <motion.section variants={itemVariants} className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-[var(--shadow-card)]">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <UserCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">2. What “verification” means on PayPal</h2>
                                    <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mt-1">Product-Level Term</p>
                                </div>
                            </div>
                            <p className="text-[var(--foreground)] font-medium leading-relaxed mb-6">
                                **Verification** is PayPal’s **user-facing status** that indicates how much KYC has been validated. Labels like *Unverified*, *Verified*, or *Confirmed* reflect the level of validated identity.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl border-2 border-dashed border-[var(--border)] text-center">
                                    <p className="text-[10px] font-black uppercase text-[var(--muted-foreground)] mb-1">Low Trust</p>
                                    <p className="text-sm font-black text-gray-500">Unverified</p>
                                </div>
                                <div className="p-4 rounded-2xl border-2 border-dashed border-[var(--accent)]/30 text-center bg-[var(--color-teal-50)]/30">
                                    <p className="text-[10px] font-black uppercase text-[var(--accent)] mb-1">Standard Trust</p>
                                    <p className="text-sm font-black text-[var(--accent)]">Verified</p>
                                </div>
                                <div className="p-4 rounded-2xl border-2 border-dashed border-blue-200 text-center bg-blue-50/30">
                                    <p className="text-[10px] font-black uppercase text-blue-600 mb-1">Maximum Trust</p>
                                    <p className="text-sm font-black text-blue-600">Confirmed</p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 3 */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-center">3. Verification types and mapping to KYC</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                                    <UserPlus className="w-6 h-6 text-[var(--muted-foreground)] mb-3" />
                                    <h4 className="font-bold mb-2">Email Verification</h4>
                                    <p className="text-xs text-[var(--muted-foreground)] font-medium mb-2">Confirms tool control.</p>
                                    <span className="text-[10px] font-black uppercase text-red-500">Not KYC</span>
                                </div>
                                <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                                    <CreditCard className="w-6 h-6 text-blue-500 mb-3" />
                                    <h4 className="font-bold mb-2">Card or Bank Verification</h4>
                                    <p className="text-xs text-[var(--muted-foreground)] font-medium mb-2">Validates financial ownership.</p>
                                    <span className="text-[10px] font-black uppercase text-amber-600">Partial KYC</span>
                                </div>
                                <div className="bg-[var(--color-navy-800)] p-6 rounded-3xl text-white shadow-xl md:col-span-2 flex flex-col md:flex-row gap-6 md:items-center">
                                    <div className="md:w-1/2">
                                        <h4 className="font-black text-xl mb-2 text-[var(--accent)]">Identity Verification</h4>
                                        <p className="text-sm text-gray-300 font-medium">This is the **Full KYC** stage. Requires Government ID, address proof, and sometimes a selfie.</p>
                                    </div>
                                    <div className="md:w-1/2 grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-white/5 rounded-xl text-[10px] font-bold">Higher Limits</div>
                                        <div className="p-3 bg-white/5 rounded-xl text-[10px] font-bold">Reduced Freezes</div>
                                        <div className="p-3 bg-white/5 rounded-xl text-[10px] font-bold">Full Trust</div>
                                        <div className="p-3 bg-[var(--accent)] text-white rounded-xl text-[10px] font-black text-center">KYC Complete</div>
                                    </div>
                                </div>
                                <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] border-l-4 border-l-[var(--accent)] shadow-sm md:col-span-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building2 className="w-5 h-5 text-[var(--accent)]" />
                                        <h4 className="font-extrabold">Business Verification (KYB)</h4>
                                    </div>
                                    <p className="text-sm text-[var(--muted-foreground)] font-medium">Requires Business Registration, Owners info, and proof of operations.</p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section 4 Table */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-center">4. Key differences summarized</h2>
                            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)]">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--muted)]/50 font-black uppercase text-[10px] tracking-widest text-[var(--muted-foreground)]">
                                            <th className="px-6 py-4 border-b border-[var(--border)]">Aspect</th>
                                            <th className="px-6 py-4 border-b border-[var(--border)]">KYC</th>
                                            <th className="px-6 py-4 border-b border-[var(--border)]">PayPal Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {[
                                            ["Nature", "Legal requirement", "Product status"],
                                            ["Visibility", "Backend process", "Visible to user"],
                                            ["Optional", "No", "No (eventually)"],
                                            ["Scope", "Identity + risk", "Indicates completeness"],
                                            ["Applies to", "Entities", "PayPal accounts"]
                                        ].map(([label, kyc, verification]) => (
                                            <tr key={label} className="hover:bg-[var(--muted)]/20">
                                                <td className="px-6 py-4 font-black">{label}</td>
                                                <td className="px-6 py-4 font-medium text-[var(--muted-foreground)]">{kyc}</td>
                                                <td className="px-6 py-4 font-bold text-[var(--accent)]">{verification}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>

                        {/* Why People Confusion */}
                        <motion.section variants={itemVariants} className="bg-amber-50 border border-amber-200 rounded-3xl p-8 flex gap-6 items-start">
                            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Info className="w-6 h-6 text-amber-700" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-amber-900">5. Why people get confused</h3>
                                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                                    PayPal rarely uses the term *KYC* in the UI. Users see “Verify your account” and assume it is optional. In reality, **verification is how PayPal executes KYC in stages**.
                                </p>
                            </div>
                        </motion.section>

                        {/* Practical Implications */}
                        <motion.section variants={itemVariants} className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-lg relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-black">6. Practical implications for you</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className="text-xs font-bold text-red-900">**Unverified** → strict limits, high freeze risk</p>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                        <p className="text-xs font-bold text-amber-900">**Partially verified** → usable but monitored</p>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <p className="text-xs font-bold text-green-900">**Fully verified (KYC complete)** → highest trust level</p>
                                    </div>
                                </div>
                                <p className="bg-[var(--muted)]/50 p-6 rounded-2xl text-sm font-medium border border-[var(--border)]">
                                    For businesses or cross-border payments, Full KYC/KYB is **non-negotiable**. Incomplete verification is a common cause of **180-day holds** and **permanent limitations**.
                                </p>
                            </div>
                        </motion.section>

                        {/* Bottom line */}
                        <motion.section variants={itemVariants} className="bg-[var(--accent)] rounded-3xl p-8 text-white text-center shadow-xl">
                            <h3 className="text-3xl font-black mb-6 uppercase tracking-tight italic">The Bottom Line</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase opacity-60">Legal</p>
                                    <p className="text-xl font-bold italic">KYC = The Law</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase opacity-60">Implementation</p>
                                    <p className="text-xl font-bold italic">Verification = Execution</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase opacity-60">Reality</p>
                                    <p className="text-xl font-bold italic underline">Cannot be avoided</p>
                                </div>
                            </div>
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
