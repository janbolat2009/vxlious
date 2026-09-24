import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { BookOpen, Calendar, Layers, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/library");
  }

  // Fetch all unlocked resources
  const accesses = await prisma.resourceAccess.findMany({
    where: {
      userId: user.id,
      status: "active",
    },
    include: {
      resource: {
        include: {
          subject: true,
          academicYear: true,
          quarter: true,
        },
      },
    },
    orderBy: { grantedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <GlassBadge variant="neutral" size="sm" className="mb-2">
            Personal Repository
          </GlassBadge>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            My Academic Library
          </h1>
          <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            Access and study your unlocked previous-year assessment materials.
          </p>
        </div>

        <Link href="/archive">
          <GlassButton variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            Browse more materials
          </GlassButton>
        </Link>
      </div>

      {accesses.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl liquid-glass border border-border-glassLight dark:border-border-glassDark text-center max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-text-secondaryLight dark:text-text-secondaryDark mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark mb-1">
            Your library is empty.
          </h3>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mb-6 leading-relaxed">
            You have not unlocked any archive materials yet. Browse available subjects and academic quarters to request access.
          </p>
          <Link href="/archive">
            <GlassButton variant="primary" size="md">
              Explore subject archive
            </GlassButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accesses.map((acc) => {
            const res = acc.resource;
            return (
              <GlassCard
                key={acc.id}
                variant="interactive"
                className="p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-accent">
                      {res.subject.name}
                    </span>
                    <GlassBadge variant="success" size="sm" className="gap-1">
                      <ShieldCheck className="w-3 h-3" /> Active License
                    </GlassBadge>
                  </div>

                  <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark group-hover:text-accent transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-text-secondaryLight/70" />
                      <span>{res.academicYear.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-text-secondaryLight/70" />
                      <span>{res.quarter.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-text-secondaryLight/70" />
                      <span>{res.pageCount} pages</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Unlocked {formatDate(acc.grantedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark font-mono">
                    ID: {res.id.slice(0, 8)}
                  </span>
                  <Link href={`/view/${res.id}`}>
                    <GlassButton variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                      Open
                    </GlassButton>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
