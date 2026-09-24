import Link from "next/link";
import prisma from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { formatPriceKZT, formatDateTime } from "@/lib/utils";
import {
  Users,
  UserCheck,
  CreditCard,
  FileBox,
  Clock,
  ArrowRight,
  ShieldCheck,
  History,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    totalUsers,
    verifiedStudents,
    pendingVerifications,
    pendingPayments,
    approvedPurchases,
    totalResources,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { studentStatus: "verified" } }),
    prisma.studentVerification.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "approved" } }),
    prisma.resource.count({ where: { isPublished: true } }),
    prisma.auditLog.findMany({
      include: { admin: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Archive Administration Overview
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
          Monitor verified academic membership, pending receipt reconciliations, and curriculum repository status.
        </p>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-text-secondaryLight dark:text-text-secondaryDark mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
            {totalUsers}
          </div>
          <p className="text-[10px] text-text-secondaryLight mt-0.5">Enrolled accounts</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-text-secondaryLight dark:text-text-secondaryDark mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verified</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
            {verifiedStudents}
          </div>
          <p className="text-[10px] text-text-secondaryLight mt-0.5">Verified students</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-text-secondaryLight dark:text-text-secondaryDark mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verifications</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {pendingVerifications}
          </div>
          <p className="text-[10px] text-text-secondaryLight mt-0.5">Pending reviews</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-text-secondaryLight dark:text-text-secondaryDark mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pending Orders</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {pendingPayments}
          </div>
          <p className="text-[10px] text-text-secondaryLight mt-0.5">Awaiting clearance</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-text-secondaryLight dark:text-text-secondaryDark mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
            {approvedPurchases}
          </div>
          <p className="text-[10px] text-text-secondaryLight mt-0.5">Granted accesses</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-text-secondaryLight dark:text-text-secondaryDark mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Resources</span>
            <FileBox className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-extrabold text-text-primaryLight dark:text-text-primaryDark">
            {totalResources}
          </div>
          <p className="text-[10px] text-text-secondaryLight mt-0.5">Authorized archives</p>
        </GlassCard>
      </div>

      {/* Action Shortcut Banners if pending items exist */}
      {(pendingVerifications > 0 || pendingPayments > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingVerifications > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                    {pendingVerifications} Student verification requests pending
                  </p>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80">
                    Review uploaded student certificates to unlock access.
                  </p>
                </div>
              </div>
              <Link href="/admin/verification">
                <GlassButton variant="primary" size="sm">
                  Review
                </GlassButton>
              </Link>
            </div>
          )}

          {pendingPayments > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                    {pendingPayments} Payment receipts pending reconciliation
                  </p>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-400/80">
                    Approve receipts to auto-grant student resource access.
                  </p>
                </div>
              </div>
              <Link href="/admin/orders">
                <GlassButton variant="primary" size="sm">
                  Reconcile
                </GlassButton>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Administrative Audit Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
              Recent Administrative Activity Logs
            </h3>
          </div>
          <Link href="/admin/audit" className="text-xs text-accent hover:underline font-semibold">
            View full audit trail
          </Link>
        </div>

        <GlassCard className="overflow-hidden">
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06] text-xs">
            {recentAuditLogs.length === 0 ? (
              <div className="p-6 text-center text-text-secondaryLight">No audit entries yet.</div>
            ) : (
              recentAuditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-accent text-[11px]">
                        {log.action}
                      </span>
                      <GlassBadge variant="neutral" size="sm">
                        {log.targetType}
                      </GlassBadge>
                    </div>
                    <p className="text-xs text-text-primaryLight dark:text-text-primaryDark mt-1 truncate">
                      {log.details || `Modified ${log.targetType} (${log.targetId})`}
                    </p>
                    <p className="text-[10px] text-text-secondaryLight mt-0.5">
                      By {log.admin.firstName} {log.admin.lastName} ({log.admin.email})
                    </p>
                  </div>
                  <span className="text-[10px] text-text-secondaryLight shrink-0 font-mono">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
