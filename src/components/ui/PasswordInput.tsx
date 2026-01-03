"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, icon, error, id, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

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
                        type={showPassword ? "text" : "password"}
                        className={twMerge(
                            clsx(
                                "w-full rounded-xl border bg-[var(--card)] text-[var(--foreground)] transition-all duration-150",
                                "placeholder:text-[var(--muted-foreground)]",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent",
                                icon ? "pl-10" : "pl-4",
                                "pr-12 py-3",
                                error
                                    ? "border-[var(--danger)] focus:ring-[var(--danger)]"
                                    : "border-[var(--border)]",
                                className
                            )
                        )}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--danger)]">{error}</p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
