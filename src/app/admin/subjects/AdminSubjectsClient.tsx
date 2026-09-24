"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { Layers, Plus, BookOpen } from "lucide-react";

interface SubjectRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  isActive: boolean;
  _count: { resources: number };
}

interface YearRow {
  id: string;
  name: string;
  code: string;
  isCurrent: boolean;
}

export function AdminSubjectsClient({
  initialSubjects,
  initialYears,
}: {
  initialSubjects: SubjectRow[];
  initialYears: YearRow[];
}) {
  const router = useRouter();
  const [subjects, setSubjects] = useState(initialSubjects);
  const [years, setYears] = useState(initialYears);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Curriculum Subjects & Academic Periods
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
          Configure authorized educational disciplines, academic calendar years, and quarters.
        </p>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
          Authorized Subjects ({subjects.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <GlassCard key={sub.id} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.05] text-accent">
                    {sub.code}
                  </span>
                  <GlassBadge variant={sub.isActive ? "success" : "neutral"} size="sm">
                    {sub.isActive ? "Active" : "Inactive"}
                  </GlassBadge>
                </div>
                <h3 className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark">
                  {sub.name}
                </h3>
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1 line-clamp-2">
                  {sub.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[11px] text-text-secondaryLight">
                <span>{sub._count.resources} materials linked</span>
                <span className="font-mono">/{sub.slug}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Academic Years */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
          Academic Years
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {years.map((y) => (
            <GlassCard key={y.id} className="p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark">
                  {y.name}
                </span>
                <p className="text-[10px] text-text-secondaryLight font-mono mt-0.5">
                  Code: {y.code}
                </p>
              </div>
              {y.isCurrent && (
                <GlassBadge variant="success" size="sm">Current Cycle</GlassBadge>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
