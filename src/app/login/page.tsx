"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { Lock, ArrowRight, AlertCircle, ShieldCheck, Key } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your academic email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Network error during login.");
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
              v
            </div>
            <span className="font-semibold text-2xl tracking-tight text-text-primaryLight dark:text-text-primaryDark">
              vxlious
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Sign in to your academic account
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
            Access authorized previous-year materials and study libraries.
          </p>
        </div>

        {/* Login Glass Card */}
        <GlassCard className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Academic Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.kz"
              required
              autoComplete="email"
            />

            <GlassInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In"}
              </GlassButton>
            </div>
          </form>

          {/* Quick Demo Credentials for Testing */}
          <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark flex items-center gap-1.5">
              <Key className="w-3 h-3 text-accent" /> Quick Demo Accounts (Password: Password123!)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("student@vxlious.kz")}
                className="p-2 rounded-xl text-left bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              >
                <span className="block font-semibold text-text-primaryLight dark:text-text-primaryDark">Verified Student</span>
                <span className="text-[10px] text-text-secondaryLight">student@vxlious.kz</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@vxlious.kz")}
                className="p-2 rounded-xl text-left bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              >
                <span className="block font-semibold text-text-primaryLight dark:text-text-primaryDark">Super Admin</span>
                <span className="text-[10px] text-text-secondaryLight">admin@vxlious.kz</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Footer Link */}
        <p className="text-center text-xs text-text-secondaryLight dark:text-text-secondaryDark">
          Don't have an academic account?{" "}
          <Link href="/register" className="text-accent hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
