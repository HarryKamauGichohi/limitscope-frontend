"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, PasswordInput } from "@/components/ui";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[AdminLogin] Form submitted", { email });
        setError("");
        setIsLoading(true);

        try {
            const user = await login({ email, password });
            if (user?.isAdmin) {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to site</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="bg-[var(--card)] p-8 rounded-2xl shadow-[var(--shadow-elevated)] border border-[var(--border)] overflow-hidden relative">
                    {/* Admin portal badge */}
                    <div className="absolute top-0 right-0 bg-[var(--primary)] text-white px-6 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-widest shadow-sm">
                        Admin Portal
                    </div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--color-navy-900)] rounded-2xl mb-4 shadow-lg ring-4 ring-[var(--color-navy-800)]">
                            <ShieldCheck className="w-10 h-10 text-[var(--color-teal-400)]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Internal Access</h1>
                        <p className="text-[var(--muted-foreground)]">Authorized personnel only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[var(--danger-bg)] text-[var(--danger)] p-4 rounded-xl text-sm font-medium border border-[var(--danger)]/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Administrator Email"
                                type="email"
                                placeholder="name@company.com"
                                icon={<Mail className="w-5 h-5" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <PasswordInput
                                label="Secure Password"
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In to Console"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                        <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-tighter font-semibold">
                            Security Warning
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            Unauthorised access to this area is prohibited and subject to monitoring.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-[var(--muted-foreground)] text-sm">
                        Forgot your credentials? <span className="text-[var(--accent)] font-semibold cursor-help">Contact IT Support</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
