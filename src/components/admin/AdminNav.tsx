"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  CreditCard,
  FileBox,
  Users,
  Layers,
  History,
  Settings,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { GlassBadge } from "../ui/GlassBadge";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Verification", href: "/admin/verification", icon: <UserCheck className="w-4 h-4" /> },
    { name: "Payments / Orders", href: "/admin/orders", icon: <CreditCard className="w-4 h-4" /> },
    { name: "Resources", href: "/admin/resources", icon: <FileBox className="w-4 h-4" /> },
    { name: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { name: "Subjects & Years", href: "/admin/subjects", icon: <Layers className="w-4 h-4" /> },
    { name: "Audit Logs", href: "/admin/audit", icon: <History className="w-4 h-4" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full border-b border-black/[0.06] dark:border-white/[0.08] mb-8 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
          </Link>
          <span className="text-text-secondaryLight/30">•</span>
          <GlassBadge variant="accent" size="sm" className="gap-1 font-mono">
            <ShieldAlert className="w-3 h-3" /> Archive Admin Vault
          </GlassBadge>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto pb-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-black/[0.08] dark:bg-white/[0.12] text-text-primaryLight dark:text-text-primaryDark shadow-sm"
                  : "text-text-secondaryLight dark:text-text-secondaryDark hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
