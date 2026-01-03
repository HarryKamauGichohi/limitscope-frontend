"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Mail, Lock, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { Input, PasswordInput } from "@/components/ui";

export default function AdminSettingsPage() {
    const router = useRouter();
    const { user, loading: authLoading, updateUser } = useAuth();

    const [emailForm, setEmailForm] = useState({ email: "" });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
        if (user && !user.isAdmin) {
            router.push("/dashboard");
        }
        if (user) {
            setEmailForm({ email: user.email });
        }
    }, [user, authLoading, router]);

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");
        setEmailSuccess("");
        setEmailLoading(true);

        try {
            const response = await apiRequest("/auth/email", {
                method: "PUT",
                body: JSON.stringify({ email: emailForm.email }),
            });
            if (response.success) {
                setEmailSuccess("Email updated successfully!");
                updateUser({ ...user!, email: emailForm.email });
            }
        } catch (err: any) {
            setEmailError(err.message || "Failed to update email");
        } finally {
            setEmailLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await apiRequest("/auth/password", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });
            if (response.success) {
                setPasswordSuccess("Password updated successfully!");
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (err: any) {
            setPasswordError(err.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-[var(--color-teal-50)] rounded-2xl flex items-center justify-center">
                        <Settings className="w-7 h-7 text-[var(--accent)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Settings</h1>
                        <p className="text-[var(--muted-foreground)]">Manage your account credentials</p>
                    </div>
                </div>

                {/* Email Update Form */}
                <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="w-5 h-5 text-[var(--accent)]" />
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Update Email</h2>
                    </div>

                    {emailError && (
                        <div className="bg-[var(--danger-bg)] text-[var(--danger)] p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {emailError}
                        </div>
                    )}

                    {emailSuccess && (
                        <div className="bg-[var(--success-bg)] text-[var(--success)] p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            {emailSuccess}
                        </div>
                    )}

                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            icon={<Mail className="w-5 h-5" />}
                            value={emailForm.email}
                            onChange={(e) => setEmailForm({ email: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={emailLoading}
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 disabled:opacity-50 flex items-center gap-2"
                        >
                            {emailLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Update Email
                        </button>
                    </form>
                </div>

                {/* Password Update Form */}
                <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-5 h-5 text-[var(--accent)]" />
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Update Password</h2>
                    </div>

                    {passwordError && (
                        <div className="bg-[var(--danger-bg)] text-[var(--danger)] p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="bg-[var(--success-bg)] text-[var(--success)] p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            {passwordSuccess}
                        </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <PasswordInput
                            label="Current Password"
                            required
                            placeholder="Enter current password"
                            icon={<Lock className="w-5 h-5" />}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />

                        <PasswordInput
                            label="New Password"
                            required
                            placeholder="Enter new password"
                            icon={<Lock className="w-5 h-5" />}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            required
                            placeholder="Confirm new password"
                            icon={<Lock className="w-5 h-5" />}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 disabled:opacity-50 flex items-center gap-2"
                        >
                            {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Admin Info Card */}
                <div className="mt-6 bg-[var(--color-navy-800)] rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="w-5 h-5 text-[var(--color-teal-400)]" />
                        <span className="font-bold">Admin Account</span>
                    </div>
                    <p className="text-sm text-[var(--color-grey-400)]">
                        You are logged in as an administrator. Changes to your credentials will take effect immediately.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
