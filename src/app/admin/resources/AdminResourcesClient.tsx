"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { formatPriceKZT, formatFileSize, formatDate } from "@/lib/utils";
import {
  FileBox,
  Upload,
  Plus,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  documentType: string;
  price: number;
  pageCount: number;
  fileSize: number;
  fileName: string;
  isPublished: boolean;
  authorizationStatus: string;
  createdAt: string;
  subject: { id: string; name: string };
  academicYear: { id: string; name: string };
  quarter: { id: string; name: string };
}

interface SubjectItem {
  id: string;
  name: string;
}

interface YearItem {
  id: string;
  name: string;
}

interface QuarterItem {
  id: string;
  name: string;
}

interface AdminResourcesClientProps {
  initialResources: ResourceRow[];
  subjects: SubjectItem[];
  academicYears: YearItem[];
  quarters: QuarterItem[];
}

export function AdminResourcesClient({
  initialResources,
  subjects,
  academicYears,
  quarters,
}: AdminResourcesClientProps) {
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [academicYearId, setAcademicYearId] = useState(academicYears[0]?.id || "");
  const [quarterId, setQuarterId] = useState(quarters[0]?.id || "");
  const [documentType, setDocumentType] = useState("Practice Paper");
  const [price, setPrice] = useState("2000");
  const [pageCount, setPageCount] = useState("10");
  const [authorizationStatus, setAuthorizationStatus] = useState("Authorized");
  const [isPublished, setIsPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file || !subjectId || !academicYearId || !quarterId) {
      setError("Please fill in all required fields and attach the PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("subjectId", subjectId);
      formData.append("academicYearId", academicYearId);
      formData.append("quarterId", quarterId);
      formData.append("documentType", documentType);
      formData.append("price", price);
      formData.append("pageCount", pageCount);
      formData.append("authorizationStatus", authorizationStatus);
      formData.append("isPublished", String(isPublished));
      formData.append("file", file);

      const res = await fetch("/api/admin/resources", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to upload resource.");
        setLoading(false);
        return;
      }

      setModalOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setLoading(false);
      router.refresh();
    } catch {
      setError("Network error uploading resource.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
        setDeleteConfirmId(null);
        router.refresh();
      }
    } catch {
      alert("Failed to delete resource.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Academic Resource Repository
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            Manage authorized previous-year materials, curriculum alignment, and pricing.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Upload New Resource
        </GlassButton>
      </div>

      {/* Internal Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Legal & Academic Integrity Notice for Administrators</p>
          <p className="leading-relaxed opacity-90">
            Only upload educational materials that you are legally authorized to distribute (previous-year practice materials, syllabus revision packages, and authorized sample exercises). Do not upload confidential live examination papers or cheating materials.
          </p>
        </div>
      </div>

      {/* Resources Table / Cards */}
      <div className="space-y-3">
        {resources.map((r) => (
          <GlassCard key={r.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">
                  {r.subject.name}
                </span>
                <GlassBadge
                  variant={
                    r.authorizationStatus === "Authorized"
                      ? "success"
                      : r.authorizationStatus === "Pending review"
                      ? "warning"
                      : "error"
                  }
                  size="sm"
                >
                  {r.authorizationStatus}
                </GlassBadge>
                {r.isPublished ? (
                  <GlassBadge variant="neutral" size="sm">Published</GlassBadge>
                ) : (
                  <GlassBadge variant="error" size="sm">Hidden</GlassBadge>
                )}
                <span className="font-bold text-xs text-text-primaryLight dark:text-text-primaryDark">
                  {formatPriceKZT(r.price)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark">
                {r.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                <span>{r.academicYear.name}</span>
                <span>•</span>
                <span>{r.quarter.name}</span>
                <span>•</span>
                <span>{r.documentType}</span>
                <span>•</span>
                <span>{r.pageCount} pages ({formatFileSize(r.fileSize)})</span>
                <span>•</span>
                <span>Added {formatDate(r.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a href={`/resource/${r.id}`} target="_blank" rel="noopener noreferrer">
                <GlassButton variant="secondary" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                  View
                </GlassButton>
              </a>
              <GlassButton
                variant="danger"
                size="sm"
                onClick={() => setDeleteConfirmId(r.id)}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </GlassButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
              Confirm Resource Deletion
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
              Are you sure you want to permanently delete this resource from the academic archive? This action will be logged in the administrative audit trail.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <GlassButton variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                variant="danger"
                size="sm"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete Resource
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Upload Resource Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl liquid-glass border border-white/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
                Upload Authorized Academic Resource
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-secondaryLight hover:text-text-primaryLight text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <GlassInput
                label="Resource Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mathematics Grade 10 - Summative Practice Archive"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight uppercase mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full text-xs rounded-xl p-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight uppercase mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    className="w-full text-xs rounded-xl p-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
                  >
                    {academicYears.map((y) => (
                      <option key={y.id} value={y.id}>{y.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight uppercase mb-1">
                    Quarter
                  </label>
                  <select
                    value={quarterId}
                    onChange={(e) => setQuarterId(e.target.value)}
                    className="w-full text-xs rounded-xl p-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
                  >
                    {quarters.map((q) => (
                      <option key={q.id} value={q.id}>{q.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight uppercase mb-1">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full text-xs rounded-xl p-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
                  >
                    <option value="Practice Paper">Practice Paper</option>
                    <option value="Revision PDF">Revision PDF</option>
                    <option value="Sample Assessment">Sample Assessment</option>
                    <option value="Authorized Archive">Authorized Archive</option>
                  </select>
                </div>

                <GlassInput
                  label="Price (₸ KZT)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <GlassInput
                  label="Page Count"
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondaryLight uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics covered in this authorized archive..."
                  className="w-full text-xs rounded-xl p-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight uppercase mb-1">
                    Content Authorization Status
                  </label>
                  <select
                    value={authorizationStatus}
                    onChange={(e) => setAuthorizationStatus(e.target.value)}
                    className="w-full text-xs rounded-xl p-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
                  >
                    <option value="Authorized">Authorized (Purchasable)</option>
                    <option value="Pending review">Pending review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <label htmlFor="isPublishedCheck" className="text-xs font-medium">
                    Publish in Public Directory
                  </label>
                </div>
              </div>

              {/* PDF File Picker */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-text-secondaryLight uppercase">
                  PDF Document (Private Storage Vault)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-rose-500">{error}</p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <GlassButton variant="ghost" size="md" onClick={() => setModalOpen(false)}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" size="md" type="submit" disabled={loading}>
                  {loading ? "Uploading..." : "Save & Add to Archive"}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
