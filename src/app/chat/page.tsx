"use client";

import { Suspense } from "react";
import UnifiedChatPage from "./UnifiedChatPage";

// Wrap the chat page in Suspense to fix Next.js prerender errors
export default function ChatPageWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading chat...</div>}>
            <UnifiedChatPage />
        </Suspense>
    );
}
