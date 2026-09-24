import React from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-medium gap-1.5",
    md: "px-5 py-2.5 text-sm font-medium gap-2",
    lg: "px-7 py-3.5 text-base font-semibold gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-text-primaryLight dark:bg-text-primaryDark text-background-light dark:text-background-dark hover:opacity-90 active:scale-[0.98] shadow-sm",
    secondary:
      "bg-white/60 dark:bg-white/[0.08] backdrop-blur-md text-text-primaryLight dark:text-text-primaryDark border border-black/[0.08] dark:border-white/[0.12] hover:bg-white/80 dark:hover:bg-white/[0.14] active:scale-[0.98] shadow-subtle",
    danger:
      "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]",
    ghost:
      "bg-transparent text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
