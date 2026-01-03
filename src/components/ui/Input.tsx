"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, icon, error, id, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={twMerge(
                            clsx(
                                "w-full rounded-xl border bg-[var(--card)] text-[var(--foreground)] transition-all duration-150",
                                "placeholder:text-[var(--muted-foreground)]",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent",
                                icon ? "pl-10 pr-4" : "px-4",
                                "py-3",
                                error
                                    ? "border-[var(--danger)] focus:ring-[var(--danger)]"
                                    : "border-[var(--border)]",
                                className
                            )
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--danger)]">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
