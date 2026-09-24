import prisma from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { formatDateTime } from "@/lib/utils";
import { History, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      admin: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Administrative Audit Trail
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
          Cryptographically sequenced record of all sensitive review actions, access grants, uploads, and deletions.
        </p>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.03] dark:bg-white/[0.04] border-b border-black/[0.06] dark:border-white/[0.08] text-text-secondaryLight dark:text-text-secondaryDark uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Administrator</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Scope</th>
                <th className="px-4 py-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondaryLight">
                    No administrative audit events recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-text-secondaryLight">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-text-primaryLight dark:text-text-primaryDark">
                        {log.admin.firstName} {log.admin.lastName}
                      </span>
                      <span className="block text-[10px] text-text-secondaryLight">
                        {log.admin.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-accent">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <GlassBadge variant="neutral" size="sm">
                        {log.targetType}: {log.targetId.slice(0, 10)}
                      </GlassBadge>
                    </td>
                    <td className="px-4 py-3 text-text-secondaryLight max-w-md truncate">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
