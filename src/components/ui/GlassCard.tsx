import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "interactive";
  className?: string;
}

export function GlassCard({
  children,
  variant = "default",
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variant === "default" &&
          "bg-surface-light dark:bg-surface-dark backdrop-blur-glass border border-border-glassLight dark:border-border-glassDark shadow-glass dark:shadow-glassDark",
        variant === "subtle" &&
          "bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm border border-black/[0.04] dark:border-white/[0.06]",
        variant === "interactive" &&
          "bg-surface-cardLight dark:bg-surface-cardDark backdrop-blur-glass border border-border-glassLight dark:border-border-glassDark shadow-glass hover:shadow-glassHover dark:hover:shadow-glassHoverDark hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
