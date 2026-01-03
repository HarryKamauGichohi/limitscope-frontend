"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input, PasswordInput } from "@/components/ui";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            const user = await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            });
            if (user?.isAdmin) {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Registration failed");
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
                        <h1 className="text-2xl font-bold text-[var(--foreground)]">Create your account</h1>
                        <p className="text-[var(--muted-foreground)] mt-2">Join our advisory platform today</p>
                    </div>

                    {error && (
                        <div className="bg-[var(--danger-bg)] text-[var(--danger)] p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                required
                                placeholder="John"
                                className="w-full"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <Input
                                label="Last Name"
                                required
                                placeholder="Doe"
                                className="w-full"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>

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

                        <PasswordInput
                            label="Confirm Password"
                            required
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5" />}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-button)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Sign Up"} <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-[var(--muted-foreground)] mt-8 text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-[var(--accent)] font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
