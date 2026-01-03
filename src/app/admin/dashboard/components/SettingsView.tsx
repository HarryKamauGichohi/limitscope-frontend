"use client";

import { useState } from "react";
import {
    Shield,
    Mail,
    Lock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Input, PasswordInput, Button } from "@/components/ui";
import { motion } from "framer-motion";

export default function SettingsView() {
    const { user, updateUser } = useAuth();
    const [emailForm, setEmailForm] = useState({ email: user?.email || "" });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState({ email: false, password: false });
    const [status, setStatus] = useState<{ type: 'email' | 'password', status: 'success' | 'error', message: string } | null>(null);

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading({ ...loading, email: true });
        setStatus(null);
        try {
            const res = await apiRequest("/auth/email", {
                method: "PUT",
                body: JSON.stringify({ email: emailForm.email })
            });
            if (res.success) {
                setStatus({ type: 'email', status: 'success', message: "Administrator email updated successfully." });
                updateUser({ ...user!, email: emailForm.email });
            }
        } catch (err: any) {
            setStatus({ type: 'email', status: 'error', message: err.message || "Failed to update email structure." });
        } finally {
            setLoading({ ...loading, email: false });
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return setStatus({ type: 'password', status: 'error', message: "New passwords do not match." });
        }
        setLoading({ ...loading, password: true });
        setStatus(null);
        try {
            const res = await apiRequest("/auth/password", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });
            if (res.success) {
                setStatus({ type: 'password', status: 'success', message: "Security credentials updated." });
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (err: any) {
            setStatus({ type: 'password', status: 'error', message: err.message || "Failed to finalize security update." });
        } finally {
            setLoading({ ...loading, password: false });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Console Configuration</h2>
                <p className="text-[var(--muted-foreground)]">Manage high-level administrative credentials and security settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Update */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-[var(--color-teal-50)] text-[var(--accent)] rounded-xl flex items-center justify-center">
                            <Mail size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Admin Identity</h3>
                    </div>

                    <form onSubmit={handleUpdateEmail} className="space-y-6">
                        <Input
                            label="Master Email Address"
                            type="email"
                            required
                            icon={<Mail className="w-5 h-5" />}
                            value={emailForm.email}
                            onChange={(e) => setEmailForm({ email: e.target.value })}
                        />

                        {status?.type === 'email' && (
                            <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 ${status.status === 'success'
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                {status.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {status.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full rounded-2xl h-12 shadow-lg group"
                            disabled={loading.email}
                        >
                            {loading.email ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
                            Apply Changes
                        </Button>
                    </form>
                </div>

                {/* Password Update */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <Lock size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Security Terminal</h3>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <PasswordInput
                            label="Current Credentials"
                            placeholder="Confirm current password"
                            required
                            icon={<Lock className="w-5 h-5" />}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />
                        <PasswordInput
                            label="New Security Code"
                            placeholder="Minimum 6 characters"
                            required
                            icon={<Shield className="w-5 h-5" />}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        />
                        <PasswordInput
                            label="Verify Code"
                            placeholder="Repeat new password"
                            required
                            icon={<CheckCircle2 className="w-5 h-5" />}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />

                        {status?.type === 'password' && (
                            <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 ${status.status === 'success'
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                {status.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {status.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full rounded-2xl h-12 border-none shadow-md mt-2"
                            disabled={loading.password}
                        >
                            {loading.password ? <Loader2 size={18} className="animate-spin" /> : "Authorize Password Update"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* System Info */}
            <div className="p-8 bg-[var(--color-navy-900)] text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Protocol 7.2 Active</h3>
                        <p className="text-[var(--color-grey-400)] text-sm max-w-lg">Your administrative terminal is running on the latest security protocols. All interactions are logged and encrypted using enterprise-grade standards.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Systems Nominal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
