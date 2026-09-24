"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { Lock, AlertCircle, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("10");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phoneNumber || !password || !school || !grade) {
      setError("Please fill in all required registration fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          school,
          grade,
          studentIdNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
              v
            </div>
            <span className="font-semibold text-2xl tracking-tight text-text-primaryLight dark:text-text-primaryDark">
              vxlious
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Create your student account
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark max-w-md mx-auto">
            Join the private educational archive for verified academic preparation.
          </p>
        </div>

        {/* Notice of why info is collected */}
        <div className="p-4 rounded-2xl liquid-glass-subtle text-xs text-text-secondaryLight dark:text-text-secondaryDark flex items-start gap-3">
          <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Privacy Pledge:</strong> We collect only the information required to verify student access and process your account. No student data is ever shown publicly.
          </p>
        </div>

        {/* Registration Card */}
        <GlassCard className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Dias"
                required
              />
              <GlassInput
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Nurmukhametov"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="Academic Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.kz"
                required
              />
              <GlassInput
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+7 (701) 000-0000"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <GlassInput
                  label="School / Institution"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Nazarbayev Intellectual School"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark uppercase tracking-wide mb-1.5">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/70 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.10] text-text-primaryLight dark:text-text-primaryDark outline-none focus:border-accent"
                >
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                  <option value="University">Undergraduate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="Student ID (Optional)"
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                placeholder="e.g. NIS-2025-XXXX"
              />
              <GlassInput
                label="Create Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />
            </div>

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
                {loading ? "Creating Account..." : "Register Academic Account"}
              </GlassButton>
            </div>
          </form>
        </GlassCard>

        {/* Footer Link */}
        <p className="text-center text-xs text-text-secondaryLight dark:text-text-secondaryDark">
          Already registered?{" "}
          <Link href="/login" className="text-accent hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
