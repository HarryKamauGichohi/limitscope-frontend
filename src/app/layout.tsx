import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PayPal Compliance Advisory | Account Limitation Help",
  description: "Expert guidance for PayPal account limitations, fund recovery, and compliant resolution steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
        <footer className="bg-[var(--card)] border-t border-[var(--border)] py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-[var(--muted-foreground)] text-sm">
            <p>&copy; {new Date().getFullYear()} PayPal Compliance Advisory. All rights reserved.</p>
            <p className="mt-2 text-xs">
              This service is for advisory purposes only. We do not hack, bypass, or impersonate PayPal.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
