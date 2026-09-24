"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import {
  ShieldCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Lock,
} from "lucide-react";

interface VerifyClientProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    school: string;
    grade: string;
    studentStatus: string;
  };
  latestVerification: {
    status: string;
    documentName: string;
    rejectionReason: string | null;
  } | null;
}

export function VerifyClient({ user, latestVerification }: VerifyClientProps) {
  const router = useRouter();
  const [school, setSchool] = useState(user.school || "");
  const [grade, setGrade] = useState(user.grade || "10");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!validTypes.includes(selected.type)) {
        setError("Please upload an image (JPG, PNG, WEBP) or PDF document.");
        return;
      }
      if (selected.size > 15 * 1024 * 1024) {
        setError("File size cannot exceed 15MB.");
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please attach your student verification document.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("document", file);
      formData.append("school", school);
      formData.append("grade", grade);
      if (studentIdNumber) {
        formData.append("studentIdNumber", studentIdNumber);
      }

      const res = await fetch("/api/verification/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Submission failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      router.refresh();
    } catch {
      setError("Network error submitting verification.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <GlassBadge variant="accent" size="sm" className="mb-2">
          Academic Standing
        </GlassBadge>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Student Verification
        </h1>
        <p className="text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-2 max-w-xl mx-auto leading-relaxed">
          vxlious is a private academic archive reserved exclusively for active students. Please confirm your academic enrollment to access past assessments.
        </p>
      </div>

      {/* Current Status Banner */}
      {user.studentStatus === "verified" ? (
        <GlassCard className="p-8 text-center space-y-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            Your Student Status is Verified
          </h2>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark max-w-md mx-auto leading-relaxed">
            Your academic standing has been authenticated. You have full permission to browse subjects and request archived assessment materials.
          </p>
          <div className="pt-2">
            <Link href="/archive">
              <GlassButton variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Subject Archive
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      ) : success || user.studentStatus === "pending" ? (
        <GlassCard className="p-8 text-center space-y-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            Verification Submission Under Review
          </h2>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark max-w-md mx-auto leading-relaxed">
            We have received your student credentials. Archive administrators review submissions within 24 hours. You will receive an internal notification upon review completion.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/dashboard">
              <GlassButton variant="secondary" size="md">
                View Dashboard
              </GlassButton>
            </Link>
            <Link href="/archive">
              <GlassButton variant="primary" size="md">
                Browse Directory
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {/* Rejection notice if previously rejected */}
          {latestVerification?.status === "rejected" && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Previous Verification Could Not Be Verified
              </p>
              <p className="opacity-90 pl-5">
                {latestVerification.rejectionReason ||
                  "The provided document could not confirm active student enrollment. Please submit a clearer document."}
              </p>
            </div>
          )}

          {/* Privacy statement callout */}
          <div className="p-4 rounded-2xl liquid-glass-subtle text-xs text-text-secondaryLight dark:text-text-secondaryDark flex items-start gap-3">
            <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Data Privacy Notice:</strong> We collect only the information required to verify student access and process your account. Your submitted document is encrypted and stored in private vault storage accessible only by authenticated archive administrators.
            </p>
          </div>

          {/* Verification Submission Form */}
          <GlassCard className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Student Full Name"
                  value={`${user.firstName} ${user.lastName}`}
                  disabled
                  readOnly
                />
                <GlassInput
                  label="Academic Email"
                  value={user.email}
                  disabled
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="School / Educational Institution"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Nazarbayev Intellectual School"
                  required
                />
                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark uppercase tracking-wide mb-1.5">
                    Academic Grade
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
                    <option value="University">Undergraduate / College</option>
                  </select>
                </div>
              </div>

              <GlassInput
                label="Student ID Number (Optional)"
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                placeholder="e.g. STU-2025-XXXX (optional)"
              />

              {/* Document upload container */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark uppercase tracking-wide">
                  Student Verification Document (Card, Certificate, or Portal Screenshot)
                </label>
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl cursor-pointer hover:border-accent/50 transition-colors bg-white/40 dark:bg-white/[0.02]">
                  <Upload className="w-8 h-8 text-text-secondaryLight mb-3" />
                  <span className="text-sm font-semibold text-text-primaryLight dark:text-text-primaryDark">
                    {file ? file.name : "Select or drag student document here"}
                  </span>
                  <span className="text-xs text-text-secondaryLight mt-1">
                    Accepts JPG, PNG, WEBP, or PDF up to 15MB.
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || !file}
              >
                {loading ? "Submitting for verification..." : "Submit for Student Verification"}
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
