import React from "react";
import { cn } from "@/lib/utils";

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "success" | "warning" | "error" | "accent";
  className?: string;
  size?: "sm" | "md";
}

export function GlassBadge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}: GlassBadgeProps) {
  const variantStyles = {
    neutral:
      "bg-black/[0.04] dark:bg-white/[0.06] text-text-secondaryLight dark:text-text-secondaryDark border border-black/[0.06] dark:border-white/[0.08]",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    error:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
    accent:
      "bg-accent/10 text-accent dark:text-accent-light border border-accent/20",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium tracking-wide",
    md: "px-3 py-1 text-xs font-semibold tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full backdrop-blur-sm",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
