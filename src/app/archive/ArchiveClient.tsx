"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { formatPriceKZT } from "@/lib/utils";
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

interface ResourceItem {
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
    id: string;
    name: string;
    slug: string;
    code: string;
  };
  academicYear: {
    id: string;
    name: string;
    code: string;
  };
  quarter: {
    id: string;
    name: string;
    quarterNumber: number;
  };
  isUnlocked: boolean;
}

interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  code: string;
}

interface YearItem {
  id: string;
  name: string;
  code: string;
}

interface ArchiveClientProps {
  initialResources: ResourceItem[];
  subjects: SubjectItem[];
  academicYears: YearItem[];
  initialSubject?: string;
  initialYear?: string;
  initialQuarter?: string;
  userVerified: boolean;
}

export function ArchiveClient({
  initialResources,
  subjects,
  academicYears,
  initialSubject,
  initialYear,
  initialQuarter,
  userVerified,
}: ArchiveClientProps) {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || "all");
  const [selectedYear, setSelectedYear] = useState<string>(initialYear || "all");
  const [selectedQuarter, setSelectedQuarter] = useState<string>(initialQuarter || "all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");

  const filteredResources = useMemo(() => {
    return initialResources.filter((r) => {
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q);
        const matchesSubject = r.subject.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSubject) return false;
      }

      // Subject filter
      if (selectedSubject !== "all" && r.subject.slug !== selectedSubject) {
        return false;
      }

      // Year filter
      if (selectedYear !== "all" && r.academicYear.code !== selectedYear) {
        return false;
      }

      // Quarter filter
      if (selectedQuarter !== "all" && String(r.quarter.quarterNumber) !== selectedQuarter) {
        return false;
      }

      // Doc type filter
      if (selectedDocType !== "all" && r.documentType !== selectedDocType) {
        return false;
      }

      return true;
    });
  }, [
    initialResources,
    search,
    selectedSubject,
    selectedYear,
    selectedQuarter,
    selectedDocType,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <GlassBadge variant="neutral" size="sm" className="mb-2">
          Academic Repository
        </GlassBadge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Authorized Subject Archive
        </h1>
        <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-2 max-w-2xl">
          Browse vetted previous-year assessment archives, practice papers, and revision summaries across all approved academic disciplines.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-6 rounded-3xl liquid-glass border border-border-glassLight dark:border-border-glassDark shadow-glass mb-10 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondaryLight dark:text-text-secondaryDark" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, keyword, or document name..."
            className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm bg-white/70 dark:bg-white/[0.04] backdrop-blur-md text-text-primaryLight dark:text-text-primaryDark placeholder:text-text-secondaryLight/60 dark:placeholder:text-text-secondaryDark/50 border border-black/[0.08] dark:border-white/[0.08] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs rounded-xl px-3 py-2 bg-white/60 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-text-primaryLight dark:text-text-primaryDark outline-none focus:border-accent"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs rounded-xl px-3 py-2 bg-white/60 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-text-primaryLight dark:text-text-primaryDark outline-none focus:border-accent"
            >
              <option value="all">All Years</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.code}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quarter Filter */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark mb-1">
              Quarter
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full text-xs rounded-xl px-3 py-2 bg-white/60 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-text-primaryLight dark:text-text-primaryDark outline-none focus:border-accent"
            >
              <option value="all">All Quarters</option>
              <option value="1">Quarter 1</option>
              <option value="2">Quarter 2</option>
              <option value="3">Quarter 3</option>
              <option value="4">Quarter 4</option>
            </select>
          </div>

          {/* Document Type Filter */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark mb-1">
              Format
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full text-xs rounded-xl px-3 py-2 bg-white/60 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] text-text-primaryLight dark:text-text-primaryDark outline-none focus:border-accent"
            >
              <option value="all">All Formats</option>
              <option value="Practice Paper">Practice Paper</option>
              <option value="Revision PDF">Revision PDF</option>
              <option value="Sample Assessment">Sample Assessment</option>
              <option value="Authorized Archive">Authorized Archive</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Action */}
        {(selectedSubject !== "all" ||
          selectedYear !== "all" ||
          selectedQuarter !== "all" ||
          selectedDocType !== "all" ||
          search) && (
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-text-secondaryLight dark:text-text-secondaryDark">
              Found {filteredResources.length} matching materials
            </span>
            <button
              onClick={() => {
                setSearch("");
                setSelectedSubject("all");
                setSelectedYear("all");
                setSelectedQuarter("all");
                setSelectedDocType("all");
              }}
              className="text-accent hover:underline font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {filteredResources.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-16 rounded-3xl liquid-glass border border-border-glassLight dark:border-border-glassDark text-center max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-text-secondaryLight dark:text-text-secondaryDark mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark mb-1">
            No materials found.
          </h3>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mb-6 leading-relaxed">
            Try adjusting your search keyword, or selecting another subject or academic quarter.
          </p>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedSubject("all");
              setSelectedYear("all");
              setSelectedQuarter("all");
              setSelectedDocType("all");
            }}
          >
            Clear Search Criteria
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <GlassCard
              key={res.id}
              variant="interactive"
              className="p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag / Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-accent">
                    {res.subject.name}
                  </span>
                  {res.isUnlocked ? (
                    <GlassBadge variant="success" size="sm" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </GlassBadge>
                  ) : (
                    <GlassBadge variant="neutral" size="sm" className="gap-1">
                      <Lock className="w-3 h-3" /> Access Required
                    </GlassBadge>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark group-hover:text-accent transition-colors line-clamp-2">
                  {res.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-2 line-clamp-2 leading-relaxed">
                  {res.description || "Authorized previous-year assessment resource."}
                </p>

                {/* Meta details */}
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
                    <span>{res.documentType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-text-secondaryLight/70" />
                    <span>{res.pageCount} pages</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer / Action */}
              <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-text-secondaryLight dark:text-text-secondaryDark">
                    Archive Fee
                  </span>
                  <span className="text-sm font-bold text-text-primaryLight dark:text-text-primaryDark">
                    {formatPriceKZT(res.price)}
                  </span>
                </div>

                <Link href={`/resource/${res.id}`}>
                  {res.isUnlocked ? (
                    <GlassButton variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                      Open PDF
                    </GlassButton>
                  ) : (
                    <GlassButton variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Get access
                    </GlassButton>
                  )}
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
