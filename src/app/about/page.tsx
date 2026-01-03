"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Target,
    Scale,
    HelpCircle,
    BookOpen,
    AlertTriangle,
    FileSearch,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const principles = [
        {
            title: "Objective Analysis",
            desc: "We analyze each PayPal limitation case against current compliance standards to provide a realistic roadmap.",
            icon: <FileSearch className="w-6 h-6 text-[var(--accent)]" />
        },
        {
            title: "Document Excellence",
            desc: "Our primary focus is helping users prepare high-quality documentation that meets PayPal's specific verification requirements.",
            icon: <BookOpen className="w-6 h-6 text-[var(--accent)]" />
        },
        {
            title: "Transparent Assessment",
            desc: "We prioritize truth. If a case is unlikely to be recovered, we provide that feedback early to save you time.",
            icon: <Scale className="w-6 h-6 text-[var(--accent)]" />
        }
    ];

    return (
        <div className="bg-[var(--background)] min-h-screen">
            {/* Hero Section */}
            <section className="bg-[var(--card)] border-b border-[var(--border)] py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <motion.div {...fadeIn}>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-teal-50)] rounded-2xl mb-6">
                            <ShieldCheck className="w-10 h-10 text-[var(--accent)]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-6 tracking-tight">
                            Trusted PayPal <span className="text-[var(--accent)]">Compliance Advisory</span>
                        </h1>
                        <p className="text-xl text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
                            We help businesses and individuals navigate the complexities of account limitations
                            through education, documentation, and lawful resolution processes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Mission */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-[var(--foreground)]">Our Professional Commitment</h2>
                            <p className="text-[var(--muted-foreground)] leading-relaxed font-medium">
                                PayPal Compliance Advisory was founded on the principle that many account limitations
                                stem from simple documentation errors or a lack of understanding of complex compliance standards.
                            </p>
                            <p className="text-[var(--muted-foreground)] leading-relaxed font-medium">
                                Our mission is to provide an objective lens through which users can assess their limitation
                                status and prepare the most professional response possible to the PayPal Risk and Compliance teams.
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 gap-4">
                            {principles.map((p, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] flex items-start gap-4"
                                >
                                    <div className="p-3 bg-[var(--color-teal-50)] rounded-xl flex-shrink-0">{p.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-[var(--foreground)] mb-1">{p.title}</h3>
                                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{p.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Important Disclaimer Section */}
            <section className="py-20 bg-[var(--color-navy-800)] text-white overflow-hidden relative">
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="bg-[var(--card)]/5 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-8 h-8 text-[var(--warning)]" />
                            <h2 className="text-2xl font-bold">Important Notice & Transparency</h2>
                        </div>
                        <div className="space-y-6 text-[var(--color-grey-300)]">
                            <p className="text-lg leading-relaxed">
                                As a compliance advisory service, we maintain strict adherence to legal and ethical standards.
                                Our role is to analyze, educate, and assist—not to manipulate systems.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6 mt-8 text-sm">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-teal-400)] flex-shrink-0" />
                                    <p>We do <strong>NOT</strong> guarantee account recovery. The final decision always rests with PayPal.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-teal-400)] flex-shrink-0" />
                                    <p>We do <strong>NOT</strong> provide &quot;bypass&quot; services or hacking methods.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-teal-400)] flex-shrink-0" />
                                    <p>Our focus is on helping users avoid <strong>irreversible mistakes</strong> during the appeal process.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-teal-400)] flex-shrink-0" />
                                    <p>All guidance is provided based on objective analysis of current financial regulations.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>

            {/* Call to Action */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">Need an Objective Assessment?</h2>
                    <p className="text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto font-medium">
                        Start your case intake today to understand your situation
                        from a professional compliance perspective.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            href="/case/new"
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-button)]"
                        >
                            Submit New Case
                        </Link>
                        <Link
                            href="/auth/login"
                            className="border border-[var(--border)] text-[var(--muted-foreground)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--card)] transition-all duration-150"
                        >
                            Contact Analyst
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
