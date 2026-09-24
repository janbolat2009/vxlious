"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { formatPriceKZT, formatFileSize, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  Lock,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Clock,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface ResourceDetailData {
  id: string;
  title: string;
  description: string | null;
  documentType: string;
  pageCount: number;
  fileSize: number;
  price: number;
  authorizationStatus: string;
  createdAt: string;
  subject: {
    name: string;
    slug: string;
    code: string;
  };
  academicYear: {
    name: string;
    code: string;
  };
  quarter: {
    name: string;
    quarterNumber: number;
  };
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  school: string;
  grade: string;
  role: string;
  studentStatus: string;
}

interface ResourceDetailClientProps {
  resource: ResourceDetailData;
  user: UserProfile | null;
  isUnlocked: boolean;
  paymentInstructions: string;
}

export function ResourceDetailClient({
  resource,
  user,
  isUnlocked,
  paymentInstructions,
}: ResourceDetailClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid JPG, PNG, WEBP, or PDF file.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError("Receipt file size cannot exceed 15MB.");
        return;
      }
      setError(null);
      setReceiptFile(file);
    }
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      setError("Please attach your payment confirmation receipt.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("resourceId", resource.id);
      formData.append("paymentReceipt", receiptFile);
      formData.append("paymentMethod", "Kaspi / Bank Transfer");

      const res = await fetch("/api/orders/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit payment request.");
        setLoading(false);
        return;
      }

      setSuccessOrder(data.orderId);
      setLoading(false);
    } catch {
      setError("Network error submitting payment request.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/archive"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject Archive
        </Link>
      </div>

      {/* Main Resource Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metadata & Access Status */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-accent">
                {resource.subject.name}
              </span>
              <GlassBadge variant="success" size="sm">
                Authorized
              </GlassBadge>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark mb-3">
              {resource.title}
            </h1>

            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-6">
              {resource.description || "Authorized previous-year assessment archive prepared for independent student preparation."}
            </p>

            {/* Spec Table */}
            <div className="space-y-2.5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Subject</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{resource.subject.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Academic Year</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{resource.academicYear.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Quarter</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{resource.quarter.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Document Type</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{resource.documentType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Pages</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{resource.pageCount} pages</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">File Size</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{formatFileSize(resource.fileSize)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.03] dark:border-white/[0.03]">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Publication Date</span>
                <span className="font-medium text-text-primaryLight dark:text-text-primaryDark">{formatDate(resource.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Access Status</span>
                {isUnlocked ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Access Unlocked</span>
                ) : (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Access Required</span>
                )}
              </div>
            </div>

            {/* Access Call to Action */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
              {isUnlocked ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Your academic license is active for this document.</span>
                  </div>
                  <Link href={`/view/${resource.id}`} className="block">
                    <GlassButton variant="primary" size="lg" className="w-full" icon={<BookOpen className="w-4 h-4" />}>
                      Open Immersive Reader
                    </GlassButton>
                  </Link>
                </div>
              ) : !user ? (
                <div className="space-y-3 text-center">
                  <div className="text-xl font-bold text-text-primaryLight dark:text-text-primaryDark">
                    {formatPriceKZT(resource.price)}
                  </div>
                  <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                    Sign in with your verified student account to request access.
                  </p>
                  <Link href={`/login?redirect=/resource/${resource.id}`} className="block">
                    <GlassButton variant="primary" size="md" className="w-full">
                      Sign in to request access
                    </GlassButton>
                  </Link>
                </div>
              ) : user.studentStatus !== "verified" && user.role !== "admin" && user.role !== "super_admin" ? (
                <div className="space-y-3 text-center">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs text-left leading-relaxed">
                    <p className="font-semibold mb-1">Student Verification Required</p>
                    Please verify your student credentials before purchasing archived assessment materials.
                  </div>
                  <Link href="/verify" className="block">
                    <GlassButton variant="primary" size="md" className="w-full">
                      Complete student verification
                    </GlassButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] uppercase font-semibold text-text-secondaryLight dark:text-text-secondaryDark">
                        Archive Access
                      </span>
                      <span className="text-2xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
                        {formatPriceKZT(resource.price)}
                      </span>
                    </div>
                    <GlassBadge variant="neutral" size="sm">
                      Single License
                    </GlassBadge>
                  </div>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setModalOpen(true)}
                  >
                    Request access
                  </GlassButton>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Academic Integrity Box */}
          <div className="p-5 rounded-2xl liquid-glass-subtle text-xs text-text-secondaryLight dark:text-text-secondaryDark space-y-2">
            <div className="flex items-center gap-2 text-text-primaryLight dark:text-text-primaryDark font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Authorized Content Guarantee</span>
            </div>
            <p className="leading-relaxed">
              This document is an authorized historical assessment resource. vxlious strictly complies with academic integrity standards and does not distribute confidential school tests or examination leaks.
            </p>
          </div>
        </div>

        {/* Right Column: PDF Viewer or Access Preview Container */}
        <div className="lg:col-span-2">
          {isUnlocked ? (
            <PdfViewer
              resourceId={resource.id}
              title={resource.title}
              userEmail={user?.email}
              userName={user ? `${user.firstName} ${user.lastName}` : "Verified Student"}
            />
          ) : (
            <div className="h-[600px] sm:h-[750px] rounded-3xl liquid-glass border border-border-glassLight dark:border-border-glassDark flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              {/* Decorative blurred background mock pages */}
              <div className="absolute inset-0 opacity-10 blur-sm pointer-events-none select-none flex flex-col justify-around p-8">
                <div className="h-6 bg-current rounded w-3/4" />
                <div className="h-4 bg-current rounded w-full" />
                <div className="h-4 bg-current rounded w-5/6" />
                <div className="h-4 bg-current rounded w-2/3" />
                <div className="h-32 bg-current rounded w-full" />
                <div className="h-4 bg-current rounded w-4/5" />
              </div>

              <div className="relative z-10 max-w-md space-y-4">
                <div className="w-14 h-14 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-text-primaryLight dark:text-text-primaryDark mx-auto shadow-sm">
                  <Lock className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
                  Access required to view PDF.
                </h3>
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                  This document is encrypted and stored in our private academic archive. Verified students can unlock access by submitting a purchase request.
                </p>

                <div className="pt-2">
                  {user && user.studentStatus === "verified" ? (
                    <GlassButton
                      variant="primary"
                      size="md"
                      onClick={() => setModalOpen(true)}
                    >
                      Request access for {formatPriceKZT(resource.price)}
                    </GlassButton>
                  ) : (
                    <Link href="/archive">
                      <GlassButton variant="secondary" size="md">
                        Explore other materials
                      </GlassButton>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PURCHASE / CHECKOUT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl liquid-glass border border-white/30 dark:border-white/[0.12] shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
                  Request Archive Access
                </h3>
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">
                  Complete manual transfer and upload confirmation
                </p>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSuccessOrder(null);
                  setError(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondaryLight hover:text-text-primaryLight dark:hover:text-text-primaryDark"
              >
                ✕
              </button>
            </div>

            {successOrder ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark">
                  Payment Submitted Successfully
                </h4>
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                  Your payment receipt has been uploaded and queued for administrative review. Once verified, access will automatically unlock.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/dashboard">
                    <GlassButton variant="primary" size="md">
                      Go to Purchases
                    </GlassButton>
                  </Link>
                  <GlassButton
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setModalOpen(false);
                      setSuccessOrder(null);
                    }}
                  >
                    Close
                  </GlassButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePurchaseSubmit} className="space-y-5">
                {/* Resource Summary */}
                <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primaryLight dark:text-text-primaryDark">
                      {resource.title}
                    </span>
                    <span className="font-bold text-accent">
                      {formatPriceKZT(resource.price)}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark mt-1">
                    {resource.subject.name} • {resource.academicYear.name} • {resource.quarter.name}
                  </p>
                </div>

                {/* Pre-populated User Details (Disabled/Read-only so student doesn't re-enter) */}
                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    label="First Name"
                    value={user?.firstName || ""}
                    disabled
                    readOnly
                  />
                  <GlassInput
                    label="Last Name"
                    value={user?.lastName || ""}
                    disabled
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    readOnly
                  />
                  <GlassInput
                    label="Phone Number"
                    value={user?.phoneNumber || ""}
                    disabled
                    readOnly
                  />
                </div>

                {/* Administrator Payment Instructions */}
                <div className="p-4 rounded-2xl bg-accent/[0.06] border border-accent/15 space-y-2">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                    Payment Instructions
                  </p>
                  <pre className="text-xs text-text-primaryLight dark:text-text-primaryDark whitespace-pre-wrap font-sans leading-relaxed">
                    {paymentInstructions}
                  </pre>
                </div>

                {/* Receipt Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark uppercase tracking-wide">
                    Upload Payment Confirmation (JPG, PNG, WEBP, PDF)
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl cursor-pointer hover:border-accent/50 transition-colors bg-white/40 dark:bg-white/[0.02]">
                    <Upload className="w-6 h-6 text-text-secondaryLight mb-2" />
                    <span className="text-xs font-medium text-text-primaryLight dark:text-text-primaryDark">
                      {receiptFile ? receiptFile.name : "Select or drop payment screenshot"}
                    </span>
                    <span className="text-[10px] text-text-secondaryLight mt-1">
                      Max 15MB. Stored strictly in private encrypted storage.
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
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <GlassButton
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading || !receiptFile}
                  >
                    {loading ? "Submitting..." : "Submit Payment Confirmation"}
                  </GlassButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
