"use client";

import { useState, useEffect, useRef } from "react";
import {
    Send,
    User as UserIcon,
    Search,
    MessageSquare,
    Loader2,
    Circle,
    UserCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Input, Button } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function ChatView() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const res = await apiRequest(`/chat/conversations`);
            setUsers(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const res = await apiRequest(`/chat/messages/${userId}`);
            setMessages(res.data || []);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
            const interval = setInterval(() => fetchMessages(selectedUser.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        setSending(true);
        try {
            const res = await apiRequest(`/chat/messages/${selectedUser.id}`, {
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
        <div className="h-[calc(100vh-160px)] flex gap-6">
            {/* User List Sidebar */}
            <div className="w-80 flex flex-col bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <Input
                            placeholder="Find client..."
                            className="pl-10 text-xs h-10 border-none shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto no-scrollbar p-2 space-y-1">
                    {loading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-[var(--muted)]/20 rounded-xl animate-pulse mx-2 mb-2" />
                        ))
                    ) : users.length === 0 ? (
                        <p className="text-center py-8 text-xs text-[var(--muted-foreground)] font-medium">No results found.</p>
                    ) : (
                        users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${selectedUser?.id === user.id
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                    : "hover:bg-[var(--muted)]"
                                    }`}
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selectedUser?.id === user.id ? "bg-white/20" : "bg-[var(--muted)] group-hover:bg-white border border-[var(--border)]"
                                    }`}>
                                    <UserIcon size={20} className={selectedUser?.id === user.id ? "text-white" : "text-[var(--primary)]"} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="font-bold text-sm truncate">{user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</p>
                                    <div className="flex items-center gap-1 opacity-70">
                                        <Circle fill="currentColor" size={6} className={selectedUser?.id === user.id ? "text-white" : "text-green-500"} />
                                        <p className="text-[10px] font-bold uppercase tracking-tighter">Available</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-grow flex flex-col bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)] relative">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center shadow-md">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--foreground)]">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--card)] bg-[var(--muted)] overflow-hidden">
                                            <UserCircle className="w-full h-full text-[var(--muted-foreground)]" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-[var(--muted-foreground)] ml-2">Secure Line Active</span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar bg-[var(--muted)]/5">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
                                    <MessageSquare size={48} />
                                    <p className="text-sm font-bold uppercase tracking-widest">Beginning of communication record</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.isAdminSender ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${msg.isAdminSender
                                            ? "bg-[var(--primary)] text-white rounded-tr-none"
                                            : "bg-white border border-[var(--border)] text-[var(--foreground)] rounded-tl-none"
                                            }`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                            <p className={`text-[10px] mt-2 font-bold uppercase tracking-tighter opacity-60 ${msg.isAdminSender ? "text-right" : "text-left"
                                                }`}>
                                                {format(new Date(msg.createdAt), "h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <Input
                                    className="flex-grow rounded-2xl h-12 text-sm border-none bg-[var(--muted)]/50 focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="Type your secure response here..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <Button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="w-12 h-12 p-0 rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0"
                                >
                                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)] p-12 text-center">
                        <div className="w-20 h-20 bg-[var(--muted)]/50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                            <MessageSquare size={32} className="opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Internal Messaging Console</h3>
                        <p className="text-sm max-w-xs mx-auto leading-relaxed">Select a client from the registry to initiate a secure, encrypted communication line.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
