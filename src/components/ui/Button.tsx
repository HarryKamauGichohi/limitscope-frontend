"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-[var(--shadow-button)] focus:ring-[var(--accent)]",
            secondary: "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--color-neutral-200)] focus:ring-[var(--accent)]",
            ghost: "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:ring-[var(--accent)]",
            danger: "bg-[var(--danger)] text-white hover:bg-red-700 focus:ring-red-500",
        };

        const sizes = {
            sm: "text-sm px-4 py-2",
            md: "text-sm px-6 py-3",
            lg: "text-lg px-8 py-4",
        };

        return (
            <button
                ref={ref}
                className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
