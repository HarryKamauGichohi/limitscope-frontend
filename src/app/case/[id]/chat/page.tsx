"use client";

import { useState, useEffect, useRef } from "react";
import {
    Send,
    ArrowLeft,
    Shield,
    MessageSquare,
    Loader2,
    UserIcon,
    Circle,
    Lock
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

import { useParams, useRouter } from "next/navigation";

export default function ClientChatPage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            // First check if case is paid
            const caseRes = await apiRequest(`/cases/${params.id}`);
            if (!caseRes.data.isPaid) {
                router.push(`/case/${params.id}/recovery`);
                return;
            }

            const res = await apiRequest(`/chat/messages/${params.id}`);
            setMessages(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [params.id]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await apiRequest(`/chat/messages/${params.id}`, {
                method: "POST",
                body: JSON.stringify({ content: newMessage })
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-160px)]">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="text-[var(--primary)]" size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">End-to-End Encrypted Advisory Line</span>
                    </div>
                </div>

                <div className="flex-grow flex flex-col bg-[var(--card)] rounded-[40px] shadow-[var(--shadow-elevated)] border border-[var(--border)] overflow-hidden relative">
                    {/* Chat Header */}
                    <div className="px-8 py-5 border-b border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-[var(--foreground)] tracking-tight">Compliance Advisor</h3>
                                <div className="flex items-center gap-2">
                                    <Circle fill="currentColor" size={6} className="text-green-500 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">System Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end opacity-40">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Session ID</span>
                            <span className="text-[10px] font-bold font-mono">#{user?.id?.slice(0, 8).toUpperCase()}</span>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar bg-[var(--muted)]/5">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 gap-6 text-center max-w-xs mx-auto">
                                <div className="w-20 h-20 bg-[var(--muted)] rounded-[32px] flex items-center justify-center shadow-inner">
                                    <MessageSquare size={32} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-2">Secure Message Initialized</h4>
                                    <p className="text-xs font-medium leading-relaxed">Send a message to speak directly with an advisor regarding your case or limitation status.</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.isAdminSender ? "justify-start" : "justify-end"}`}
                                >
                                    <div className={`max-w-[75%] p-5 rounded-3xl text-sm shadow-sm relative ${msg.isAdminSender
                                        ? "bg-white border border-[var(--border)] text-[var(--foreground)] rounded-tl-none"
                                        : "bg-[var(--primary)] text-white rounded-tr-none"
                                        }`}>
                                        <p className="font-medium leading-relaxed">{msg.content}</p>
                                        <p className={`text-[9px] mt-2 font-black uppercase tracking-tighter opacity-50 ${msg.isAdminSender ? "text-left" : "text-right"}`}>
                                            {format(new Date(msg.createdAt), "h:mm a")}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] relative z-10">
                        <form onSubmit={handleSendMessage} className="flex gap-4">
                            <div className="flex-grow relative">
                                <input
                                    className="w-full h-14 pl-6 pr-14 rounded-2xl text-sm font-bold border-none bg-[var(--muted)]/50 focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50"
                                    placeholder="Type your message to the advisor..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                                    <Lock size={16} />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="w-14 h-14 bg-[var(--foreground)] text-[var(--background)] rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                            >
                                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
