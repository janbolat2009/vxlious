"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { formatDate, formatDateTime, formatFileSize } from "@/lib/utils";
import {
  UserCheck,
  Check,
  X,
  FileText,
  Clock,
  ExternalLink,
  AlertCircle,
  Eye,
} from "lucide-react";

interface VerificationItem {
  id: string;
  studentIdNumber: string | null;
  documentName: string;
  documentPath: string;
  mimeType: string;
  fileSize: number;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    school: string;
    grade: string;
  };
}

export function AdminVerificationClient({
  initialVerifications,
}: {
  initialVerifications: VerificationItem[];
}) {
  const router = useRouter();
  const [verifications, setVerifications] = useState(initialVerifications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/verification/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "reject" ? rejectReason : undefined,
        }),
      });

      if (res.ok) {
        setVerifications((prev) =>
          prev.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status: action === "approve" ? "verified" : "rejected",
                  rejectionReason: action === "reject" ? rejectReason : null,
                }
              : v
          )
        );
        setRejectingId(null);
        setRejectReason("");
      }
      setLoadingId(null);
      router.refresh();
    } catch {
      setLoadingId(null);
    }
  };

  const openDocumentPreview = async (id: string) => {
    try {
      const res = await fetch("/api/secure-file/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: id, scope: "verification_view" }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setPreviewToken(data.token);
        setPreviewId(id);
      }
    } catch {
      alert("Failed to sign access key for document preview.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Student Verification Submissions
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            Review academic enrollment credentials to grant verified student status.
          </p>
        </div>
      </div>

      {verifications.length === 0 ? (
        <GlassCard className="p-12 text-center text-text-secondaryLight text-xs">
          No student verification requests on record.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => (
            <GlassCard key={v.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text-primaryLight dark:text-text-primaryDark">
                    {v.user.firstName} {v.user.lastName}
                  </span>
                  <GlassBadge
                    variant={
                      v.status === "verified"
                        ? "success"
                        : v.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="sm"
                  >
                    {v.status}
                  </GlassBadge>
                  {v.studentIdNumber && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.05]">
                      {v.studentIdNumber}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                  <p>Email: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{v.user.email}</span></p>
                  <p>Phone: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{v.user.phoneNumber}</span></p>
                  <p>Institution: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{v.user.school} (Grade {v.user.grade})</span></p>
                  <p>Document: <span className="font-mono">{v.documentName} ({formatFileSize(v.fileSize)})</span></p>
                  <p>Submitted: <span className="font-mono">{formatDateTime(v.createdAt)}</span></p>
                </div>

                {v.rejectionReason && (
                  <p className="text-xs text-rose-500 pt-1">
                    Rejection Note: {v.rejectionReason}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => openDocumentPreview(v.id)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  View Document
                </GlassButton>

                {v.status === "pending" && (
                  <>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(v.id, "approve")}
                      disabled={loadingId === v.id}
                      icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                    >
                      Approve
                    </GlassButton>
                    <GlassButton
                      variant="danger"
                      size="sm"
                      onClick={() => setRejectingId(v.id)}
                      disabled={loadingId === v.id}
                      icon={<X className="w-3.5 h-3.5" />}
                    >
                      Reject
                    </GlassButton>
                  </>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
              Reject Student Verification
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
              Provide a clear, respectful explanation for the student (e.g. document is blurry or does not state grade).
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Enrollment document does not clearly display student name and current academic session."
              className="w-full text-xs rounded-xl p-3 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
            />
            <div className="flex justify-end gap-2">
              <GlassButton variant="ghost" size="sm" onClick={() => setRejectingId(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                variant="danger"
                size="sm"
                onClick={() => handleAction(rejectingId, "reject")}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewToken && previewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-3xl h-[80vh] rounded-3xl liquid-glass border border-white/20 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <span className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">
                Private Verification Document Viewer
              </span>
              <button
                onClick={() => {
                  setPreviewToken(null);
                  setPreviewId(null);
                }}
                className="text-text-secondaryLight hover:text-text-primaryLight dark:hover:text-text-primaryDark text-sm"
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={`/api/secure-file/stream?token=${encodeURIComponent(previewToken)}&resourceId=${encodeURIComponent(previewId)}&scope=verification_view`}
              className="w-full flex-1 rounded-xl border border-white/10 bg-neutral-900"
              title="Verification Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
