"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, ArrowRight, Activity, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-[var(--card)] pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div {...fadeIn}>
              <span className="bg-[var(--color-teal-50)] text-[var(--accent)] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block">
                Professional Compliance Advisory
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--foreground)] leading-tight mb-6">
                <span className="block">Recover <span className="text-[var(--accent)]">YOUR FUNDS!</span></span>
                <span className="block">Navigate <span className="text-[var(--accent)]">LIMITATIONS!</span></span>
                <span className="block">And Access <span className="text-[var(--accent)]">YOUR ACCOUNT!</span></span>
              </h1>
              <p className="text-xl text-[var(--muted-foreground)] mb-10 leading-relaxed">
                Expert guidance for understanding limitations, assessing recovery options,
                and following compliant resolution steps to secure your business funds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-button)] flex items-center justify-center gap-2"
                >
                  Start Case Assessment <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-yellow-200)] transition-all duration-150 flex items-center justify-center"
                >
                  Learn How It Works
                </Link>
              </div>
            </motion.div>

            {/* Hero Image with Subtle Zoom Animation */}
            <div className="hidden lg:block overflow-hidden rounded-3xl">
              <motion.div
                style={{ scale: imageScale }}
                className="origin-center"
              >
                <Image
                  src="/hero-image.jpg"
                  alt="Happy customer celebrating fund recovery"
                  width={500}
                  height={600}
                  className="rounded-3xl object-cover"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--color-teal-50)] rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--color-grey-100)] rounded-full blur-3xl opacity-50" />
      </section>

      {/* Services Section - White background with deep yellow boxes */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Our Core Advisory Services</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              We provide structured, compliant pathways to resolve account issues
              without shortcuts or illegitimate methods.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-10 h-10 text-[var(--color-navy-800)]" />,
                title: "Limitation Diagnosis",
                desc: "Deep analysis of why your account was limited by evaluating transaction history and communication from PayPal."
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-[var(--color-navy-800)]" />,
                title: "Recovery Assessment",
                desc: "Honest evaluation of funds accessibility vs. account restoration vs. 180-day fund release scenarios."
              },
              {
                icon: <FileText className="w-10 h-10 text-[var(--color-navy-800)]" />,
                title: "Compliant Resolution",
                desc: "Step-by-step guidance on gathering required documentation and writing professional appeals to PayPal."
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -12, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-[#f59e0b] p-8 rounded-2xl border-2 border-[#d97706] shadow-lg hover:shadow-2xl hover:border-[#b45309] transition-all duration-300 cursor-pointer"
              >
                <div className="mb-6 bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[var(--color-navy-900)]">{service.title}</h3>
                <p className="text-[var(--color-navy-800)] leading-relaxed font-medium">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Standards Section */}
      <section className="container mx-auto px-4 py-20 bg-[var(--color-navy-800)] rounded-3xl text-white overflow-hidden relative mt-20">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Commitment to Compliance</h2>
            <p className="text-[var(--color-grey-400)] mb-8 text-lg">
              We operate exclusively within legal and policy-compliant frameworks.
              Our goal is to resolve issues through legitimate documentation and proper communication.
            </p>
            <ul className="space-y-4">
              {[
                "We do NOT hack or bypass PayPal security",
                "We do NOT impersonate users or PayPal staff",
                "We do NOT provide fake or forged documentation",
                "We follow official PayPal appeal procedures"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-[var(--color-grey-300)]">
                  <CheckCircle2 className="text-[var(--color-teal-400)] w-5 h-5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-navy-700)] p-8 rounded-2xl border border-[var(--color-navy-600)]">
            <h3 className="text-xl font-bold mb-4">Risk Assessment Disclaimer</h3>
            <p className="text-[var(--color-grey-400)] leading-relaxed">
              Every account limitation case is unique. While our advisory services significantly
              improve clarity and communication, final decisions are made at the sole
              discretion of PayPal. We provide the tools for you to represent your
              business professionally and compliantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
