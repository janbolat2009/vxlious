"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { formatPriceKZT, formatDate, formatDateTime } from "@/lib/utils";
import {
  User,
  ShieldCheck,
  Clock,
  AlertCircle,
  BookOpen,
  ShoppingBag,
  Bell,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

interface DashboardClientProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    school: string;
    grade: string;
    role: string;
    studentStatus: string;
    createdAt: string;
  };
  orders: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    resource: {
      id: string;
      title: string;
      subject: { name: string };
      quarter: { name: string };
      academicYear: { name: string };
    };
    receipt: {
      originalName: string;
      uploadedAt: string;
    } | null;
  }>;
  accesses: Array<{
    id: string;
    grantedAt: string;
    resource: {
      id: string;
      title: string;
      subject: { name: string };
      quarter: { name: string };
      academicYear: { name: string };
    };
  }>;
  verifications: Array<{
    id: string;
    documentName: string;
    status: string;
    rejectionReason: string | null;
    createdAt: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    link: string | null;
  }>;
}

export function DashboardClient({
  user,
  orders,
  accesses,
  verifications,
  notifications,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "library" | "purchases" | "verification" | "profile">("overview");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-text-secondaryLight dark:text-text-secondaryDark tracking-wider">
              Student Dashboard
            </span>
            {user.studentStatus === "verified" ? (
              <GlassBadge variant="success" size="sm" className="gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Student
              </GlassBadge>
            ) : user.studentStatus === "pending" ? (
              <GlassBadge variant="warning" size="sm" className="gap-1">
                <Clock className="w-3 h-3" /> Verification Pending
              </GlassBadge>
            ) : (
              <GlassBadge variant="error" size="sm" className="gap-1">
                <AlertCircle className="w-3 h-3" /> Verification Required
              </GlassBadge>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Welcome back, {user.firstName}.
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            {user.school} • Grade {user.grade} • {user.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/archive">
            <GlassButton variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore Archive
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* Verification Notice Banner if not verified */}
      {user.studentStatus !== "verified" && (
        <div className="p-4 sm:p-5 rounded-2xl mb-8 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 text-amber-500" />
            <div>
              <p className="text-xs font-semibold">Student Verification Action Required</p>
              <p className="text-xs opacity-90 mt-0.5">
                {user.studentStatus === "pending"
                  ? "Your verification documents have been submitted and are under review by archive staff."
                  : "Submit your student card or certificate to enable access to archived academic materials."}
              </p>
            </div>
          </div>
          {user.studentStatus !== "pending" && (
            <Link href="/verify" className="shrink-0">
              <GlassButton variant="primary" size="sm">
                Verify Status Now
              </GlassButton>
            </Link>
          )}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-3 mb-8 overflow-x-auto">
        {[
          { id: "overview", label: "Overview" },
          { id: "library", label: `My Library (${accesses.length})` },
          { id: "purchases", label: `Purchases (${orders.length})` },
          { id: "verification", label: "Verification" },
          { id: "profile", label: "Profile" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-black/[0.08] dark:bg-white/[0.12] text-text-primaryLight dark:text-text-primaryDark shadow-sm"
                : "text-text-secondaryLight dark:text-text-secondaryDark hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <GlassCard className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark">
                Unlocked Materials
              </span>
              <div className="mt-2 text-3xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
                {accesses.length}
              </div>
              <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark mt-1">
                Active academic licenses
              </p>
            </GlassCard>

            <GlassCard className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark">
                Purchase Requests
              </span>
              <div className="mt-2 text-3xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
                {orders.length}
              </div>
              <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark mt-1">
                {orders.filter((o) => o.status === "pending").length} pending review
              </p>
            </GlassCard>

            <GlassCard className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark">
                Verification Status
              </span>
              <div className="mt-2 text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark capitalize">
                {user.studentStatus}
              </div>
              <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark mt-1">
                Grade {user.grade} student account
              </p>
            </GlassCard>
          </div>

          {/* Recently Unlocked Materials */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
                Recently Unlocked Materials
              </h3>
              <Link href="/library" className="text-xs font-semibold text-accent hover:underline">
                View all
              </Link>
            </div>

            {accesses.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <BookOpen className="w-8 h-8 text-text-secondaryLight mx-auto mb-2 opacity-50" />
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                  No unlocked resources yet. Browse the subject archive to begin studying.
                </p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accesses.slice(0, 4).map((acc) => (
                  <GlassCard key={acc.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-semibold uppercase text-accent">
                        {acc.resource.subject.name} • {acc.resource.quarter.name}
                      </span>
                      <h4 className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark truncate mt-0.5">
                        {acc.resource.title}
                      </h4>
                      <p className="text-[10px] text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">
                        Unlocked {formatDate(acc.grantedAt)}
                      </p>
                    </div>
                    <Link href={`/view/${acc.resource.id}`} className="shrink-0">
                      <GlassButton variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                        Open
                      </GlassButton>
                    </Link>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* Recent Purchases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
                Recent Purchase Orders
              </h3>
              <button
                onClick={() => setActiveTab("purchases")}
                className="text-xs font-semibold text-accent hover:underline"
              >
                View all
              </button>
            </div>

            {orders.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <ShoppingBag className="w-8 h-8 text-text-secondaryLight mx-auto mb-2 opacity-50" />
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                  No purchases recorded yet.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <GlassCard key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                          {order.id}
                        </span>
                        {order.status === "approved" ? (
                          <GlassBadge variant="success" size="sm">
                            Access Granted
                          </GlassBadge>
                        ) : order.status === "pending" ? (
                          <GlassBadge variant="warning" size="sm">
                            Pending Review
                          </GlassBadge>
                        ) : (
                          <GlassBadge variant="error" size="sm">
                            Verification Failed
                          </GlassBadge>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark">
                        {order.resource.title}
                      </h4>
                      <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">
                        {formatPriceKZT(order.amount)} • Submitted {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {order.status === "approved" && (
                      <Link href={`/view/${order.resource.id}`}>
                        <GlassButton variant="secondary" size="sm">
                          Open in Library
                        </GlassButton>
                      </Link>
                    )}
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY LIBRARY */}
      {activeTab === "library" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
              All Unlocked Materials ({accesses.length})
            </h3>
            <Link href="/archive">
              <GlassButton variant="secondary" size="sm">
                Add More Materials
              </GlassButton>
            </Link>
          </div>

          {accesses.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
              <h4 className="text-sm font-semibold mb-1">No materials currently unlocked</h4>
              <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mb-4">
                Explore the archive directory to request access to past assessments.
              </p>
              <Link href="/archive">
                <GlassButton variant="primary" size="sm">
                  Browse Archive
                </GlassButton>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {accesses.map((acc) => (
                <GlassCard key={acc.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-accent">
                      {acc.resource.subject.name} • {acc.resource.quarter.name}
                    </span>
                    <h4 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark mt-1 mb-2 line-clamp-2">
                      {acc.resource.title}
                    </h4>
                    <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                      Academic Year: {acc.resource.academicYear.name}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] text-text-secondaryLight">
                      Unlocked {formatDate(acc.grantedAt)}
                    </span>
                    <Link href={`/view/${acc.resource.id}`}>
                      <GlassButton variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                        Open PDF
                      </GlassButton>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PURCHASES */}
      {activeTab === "purchases" && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
            Purchase History & Payment Confirmations
          </h3>

          {orders.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-text-secondaryLight mx-auto mb-3 opacity-50" />
              <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                You haven't requested any resources yet.
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <GlassCard key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-text-primaryLight dark:text-text-primaryDark">
                        {order.id}
                      </span>
                      {order.status === "approved" ? (
                        <GlassBadge variant="success" size="sm">
                          Access Granted
                        </GlassBadge>
                      ) : order.status === "pending" ? (
                        <GlassBadge variant="warning" size="sm">
                          Under Review
                        </GlassBadge>
                      ) : (
                        <GlassBadge variant="error" size="sm">
                          Verification Failed
                        </GlassBadge>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">
                      {order.resource.title}
                    </p>
                    <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                      Amount: {formatPriceKZT(order.amount)} • Submitted: {formatDateTime(order.createdAt)}
                    </p>
                    {order.receipt && (
                      <p className="text-[10px] text-text-secondaryLight font-mono">
                        Receipt: {order.receipt.originalName}
                      </p>
                    )}
                  </div>

                  <div>
                    {order.status === "approved" ? (
                      <Link href={`/view/${order.resource.id}`}>
                        <GlassButton variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                          Open Document
                        </GlassButton>
                      </Link>
                    ) : order.status === "pending" ? (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        Verification in progress
                      </span>
                    ) : (
                      <Link href="/support">
                        <GlassButton variant="danger" size="sm">
                          Contact Support
                        </GlassButton>
                      </Link>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VERIFICATION */}
      {activeTab === "verification" && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
              Student Verification Status
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
              vxlious verifies student status to maintain an authentic academic environment.
            </p>
          </div>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-xs font-semibold text-text-secondaryLight dark:text-text-secondaryDark">
                Current Status
              </span>
              {user.studentStatus === "verified" ? (
                <GlassBadge variant="success" size="md">
                  Verified Academic Account
                </GlassBadge>
              ) : user.studentStatus === "pending" ? (
                <GlassBadge variant="warning" size="md">
                  Verification Under Review
                </GlassBadge>
              ) : (
                <GlassBadge variant="error" size="md">
                  Not Verified
                </GlassBadge>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-text-secondaryLight">Enrolled School</span>
                <span className="font-semibold">{user.school}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondaryLight">Academic Grade</span>
                <span className="font-semibold">{user.grade}</span>
              </div>
            </div>

            {user.studentStatus !== "verified" && (
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <Link href="/verify">
                  <GlassButton variant="primary" size="md" className="w-full">
                    Upload or Update Verification Document
                  </GlassButton>
                </Link>
              </div>
            )}
          </GlassCard>

          {/* Past Submissions */}
          {verifications.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-text-secondaryLight tracking-wider">
                Submitted Documents
              </h4>
              {verifications.map((v) => (
                <GlassCard key={v.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-text-primaryLight dark:text-text-primaryDark">
                      {v.documentName}
                    </p>
                    <p className="text-[11px] text-text-secondaryLight mt-0.5">
                      Uploaded {formatDate(v.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="capitalize font-semibold text-text-primaryLight dark:text-text-primaryDark">
                      {v.status}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-6 max-w-xl">
          <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
            Account Profile
          </h3>
          <GlassCard className="p-6 space-y-4">
            <GlassInput label="Full Name" value={`${user.firstName} ${user.lastName}`} disabled readOnly />
            <GlassInput label="Email Address" value={user.email} disabled readOnly />
            <GlassInput label="Phone Number" value={user.phoneNumber} disabled readOnly />
            <GlassInput label="School" value={user.school} disabled readOnly />
            <GlassInput label="Grade" value={user.grade} disabled readOnly />
            <div className="pt-2 text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
              Account created {formatDate(user.createdAt)}. To update personal credentials, submit a ticket via Support.
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
