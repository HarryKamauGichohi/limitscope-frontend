"use client";

import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "success" | "warning" | "danger" | "neutral" | "info";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "neutral", children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider";

        const variants = {
            success: "bg-[var(--success-bg)] text-[var(--success)]",
            warning: "bg-[var(--warning-bg)] text-[var(--warning)]",
            danger: "bg-[var(--danger-bg)] text-[var(--danger)]",
            neutral: "bg-[var(--muted)] text-[var(--muted-foreground)]",
            info: "bg-[var(--color-teal-50)] text-[var(--accent)]",
        };

        return (
            <span
                ref={ref}
                className={twMerge(clsx(baseStyles, variants[variant], className))}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
