"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import CasesView from "./components/CasesView";
import UsersView from "./components/UsersView";
import ChatView from "./components/ChatView";
import SettingsView from "./components/SettingsView";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

    const handleOpenChat = (userId: string) => {
        setSelectedChatUserId(userId);
        setActiveTab("chat");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "overview": return <Overview />;
            case "cases": return <CasesView onOpenChat={handleOpenChat} />;
            case "users": return <UsersView onOpenChat={handleOpenChat} />;
            case "chat": return <ChatView selectedUserId={selectedChatUserId} />;
            case "settings": return <SettingsView />;
            default: return <Overview />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--background)] overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-grow h-screen overflow-y-auto relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-8 pb-20"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
