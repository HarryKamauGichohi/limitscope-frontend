"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        ...(user ? [{ name: "Dashboard", href: "/dashboard" }] : []),
        ...(user?.isAdmin ? [{ name: "Admin Settings", href: "/admin-settings" }] : []),
    ];

    return (
        <nav className="bg-[var(--color-navy-800)] border-b border-[var(--color-navy-700)] sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <ShieldCheck className="text-[var(--color-teal-400)] w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight text-white">
                            PayPal <span className="text-[var(--color-teal-400)]">Advisory</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[var(--color-grey-300)] hover:text-white font-medium transition-colors duration-150"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4 border-l border-[var(--color-navy-600)] pl-8 ml-4">
                            {user ? (
                                <>
                                    <span className="text-[var(--color-grey-400)] text-sm hidden lg:inline">{user.email}</span>
                                    <button
                                        onClick={logout}
                                        className="text-[var(--color-grey-300)] hover:text-red-400 font-medium transition-colors duration-150"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="text-[var(--color-grey-300)] hover:text-white font-medium">
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="bg-[var(--color-teal-500)] text-white px-5 py-2 rounded-lg font-medium hover:bg-[var(--color-teal-400)] transition-colors duration-150"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--color-navy-700)] border-b border-[var(--color-navy-600)] overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-[var(--color-grey-300)] px-4 py-2 rounded-md hover:bg-[var(--color-navy-600)] hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-[var(--color-navy-600)]" />
                            {user ? (
                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="text-lg font-medium text-red-400 px-4 py-2 text-left"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-[var(--color-grey-300)] px-4 py-2"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-[var(--color-teal-500)] text-white px-4 py-3 rounded-lg font-medium text-center"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
