"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <GlassCard className="p-8 sm:p-12 text-center max-w-md w-full space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <span className="font-mono text-xs uppercase font-bold text-rose-500">Error 500</span>
        <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Something went wrong.
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
          An unexpected error occurred while processing your academic archive session. Our technical team has been notified.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <GlassButton variant="primary" size="md" onClick={() => reset()}>
            Try Again
          </GlassButton>
          <Link href="/">
            <GlassButton variant="secondary" size="md">
              Home
            </GlassButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
