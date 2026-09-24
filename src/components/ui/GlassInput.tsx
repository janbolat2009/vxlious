import React from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none",
              "bg-white/70 dark:bg-white/[0.05] backdrop-blur-md",
              "text-text-primaryLight dark:text-text-primaryDark placeholder:text-text-secondaryLight/60 dark:placeholder:text-text-secondaryDark/50",
              "border border-black/[0.08] dark:border-white/[0.10]",
              "focus:border-accent focus:ring-2 focus:ring-accent/20 dark:focus:ring-accent/30",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-500 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
