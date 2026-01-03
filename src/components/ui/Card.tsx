"use client";

import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "outlined";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const baseStyles = "rounded-2xl bg-[var(--card)]";

        const variants = {
            default: "border border-[var(--border)] shadow-[var(--shadow-card)]",
            elevated: "shadow-[var(--shadow-elevated)]",
            outlined: "border border-[var(--border)]",
        };

        return (
            <div
                ref={ref}
                className={twMerge(clsx(baseStyles, variants[variant], className))}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge("p-6 pb-4", className)}
            {...props}
        />
    )
);

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge("p-6 pt-0", className)}
            {...props}
        />
    )
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge("p-6 pt-4 border-t border-[var(--border)]", className)}
            {...props}
        />
    )
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
