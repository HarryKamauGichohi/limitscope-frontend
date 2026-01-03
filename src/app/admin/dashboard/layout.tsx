"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push("/admin/login");
        }
    }, [user, loading, router]);

    if (loading || !user || !user.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
