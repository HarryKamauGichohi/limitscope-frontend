"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input, PasswordInput } from "@/components/ui";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await login({ email: formData.email, password: formData.password });
            if (user?.isAdmin) {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="bg-[var(--card)] p-8 rounded-2xl shadow-[var(--shadow-elevated)] border border-[var(--border)]">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-teal-50)] rounded-2xl mb-4">
                            <ShieldCheck className="w-8 h-8 text-[var(--accent)]" />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--foreground)]">Welcome back</h1>
                        <p className="text-[var(--muted-foreground)] mt-2">Log in to manage your cases</p>
                    </div>

                    {error && (
                        <div className="bg-[var(--danger-bg)] text-[var(--danger)] p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            placeholder="name@company.com"
                            icon={<Mail className="w-5 h-5" />}
                            className="w-full"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <PasswordInput
                            label="Password"
                            required
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5" />}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-button)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Log In"} <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-[var(--muted-foreground)] mt-8 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="text-[var(--accent)] font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
