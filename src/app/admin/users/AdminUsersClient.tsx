"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { formatDate } from "@/lib/utils";
import { Search, ShieldCheck, UserX, UserCheck, Lock } from "lucide-react";

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  school: string;
  grade: string;
  role: string;
  studentStatus: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    orders: number;
    resourceAccess: number;
  };
}

export function AdminUsersClient({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = `${u.firstName} ${u.lastName}`.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesSchool = u.school.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesSchool) return false;
      }
      if (statusFilter !== "all" && u.studentStatus !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [users, search, statusFilter]);

  const toggleUserActive = async (id: string, currentActive: boolean) => {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isActive: !currentActive } : u))
        );
      }
      setLoadingId(null);
    } catch {
      setLoadingId(null);
    }
  };

  const manualVerifyStudent = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentStatus: "verified" }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, studentStatus: "verified" } : u))
        );
      }
      setLoadingId(null);
    } catch {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Academic User Directory
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            Manage student access standing, view enrollment credentials, and manage suspensions.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondaryLight" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or school..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-xl px-3 py-2.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none"
        >
          <option value="all">All Verification Statuses</option>
          <option value="verified">Verified Students</option>
          <option value="pending">Pending Review</option>
          <option value="unverified">Unverified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <GlassCard key={u.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-text-primaryLight dark:text-text-primaryDark">
                  {u.firstName} {u.lastName}
                </span>
                <GlassBadge
                  variant={
                    u.studentStatus === "verified"
                      ? "success"
                      : u.studentStatus === "pending"
                      ? "warning"
                      : "error"
                  }
                  size="sm"
                >
                  {u.studentStatus}
                </GlassBadge>
                {u.role !== "student" && (
                  <GlassBadge variant="accent" size="sm">
                    {u.role}
                  </GlassBadge>
                )}
                {!u.isActive && (
                  <GlassBadge variant="error" size="sm">
                    Suspended
                  </GlassBadge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-0.5 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                <p>Email: <span className="text-text-primaryLight dark:text-text-primaryDark">{u.email}</span></p>
                <p>Phone: <span className="text-text-primaryLight dark:text-text-primaryDark">{u.phoneNumber}</span></p>
                <p>School: <span className="text-text-primaryLight dark:text-text-primaryDark">{u.school} (Grade {u.grade})</span></p>
                <p>Unlocked: <span className="font-semibold">{u._count.resourceAccess} resources</span></p>
                <p>Purchases: <span className="font-semibold">{u._count.orders} orders</span></p>
                <p>Joined: <span>{formatDate(u.createdAt)}</span></p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {u.studentStatus !== "verified" && (
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => manualVerifyStudent(u.id)}
                  disabled={loadingId === u.id}
                  icon={<UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
                >
                  Verify Student
                </GlassButton>
              )}

              {u.role === "student" && (
                <GlassButton
                  variant={u.isActive ? "danger" : "secondary"}
                  size="sm"
                  onClick={() => toggleUserActive(u.id, u.isActive)}
                  disabled={loadingId === u.id}
                >
                  {u.isActive ? "Suspend" : "Activate"}
                </GlassButton>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
