import Link from "next/link";
import prisma from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Layers,
  FileText,
  UserCheck,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  FileCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

const FALLBACK_SUBJECTS = [
  { id: "1", name: "Mathematics", slug: "mathematics", code: "MATH", description: "Advanced calculus, algebra, geometry, and trigonometry problem archives.", _count: { resources: 4 } },
  { id: "2", name: "Physics", slug: "physics", code: "PHYS", description: "Mechanics, thermodynamics, electrodynamics, and wave optics materials.", _count: { resources: 3 } },
  { id: "3", name: "Chemistry", slug: "chemistry", code: "CHEM", description: "Organic, inorganic, and physical chemistry authorized revision guides.", _count: { resources: 2 } },
  { id: "4", name: "Biology", slug: "biology", code: "BIO", description: "Cellular biology, genetics, physiology, and ecology practice papers.", _count: { resources: 2 } },
  { id: "5", name: "Informatics", slug: "informatics", code: "CS", description: "Algorithms, data structures, Python, and computer architecture.", _count: { resources: 2 } },
  { id: "6", name: "Kazakhstan History", slug: "kazakhstan-history", code: "KZHIST", description: "Ancient to modern statehood development and cultural heritage.", _count: { resources: 2 } },
];

export default async function LandingPage() {
  let subjects: Array<{
    id: string;
    name: string;
    slug: string;
    code: string;
    description: string | null;
    _count: { resources: number };
  }> = FALLBACK_SUBJECTS;
  try {
    const dbSubjects = await prisma.subject.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { resources: { where: { isPublished: true, authorizationStatus: "Authorized" } } },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
    if (dbSubjects && dbSubjects.length > 0) {
      subjects = dbSubjects;
    }
  } catch (error) {
    // Graceful fallback for initial builds or cold database starts
    console.warn("Prisma subjects query fallback active:", error);
  }

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[88vh] flex items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle Liquid Glow Ambient Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] bg-gradient-to-tr from-accent/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl pointer-events-none -z-10 animate-float-slow" />

        <div className="mx-auto max-w-5xl text-center flex flex-col items-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-border-glassLight dark:border-border-glassDark text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span className="font-semibold text-text-primaryLight dark:text-text-primaryDark">vxlious</span>
            <span>• Private Educational Archive</span>
          </div>

          {/* Large Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark max-w-4xl leading-[1.08] mb-6">
            Your academic archive.
          </h1>

          {/* Alternative supporting text */}
          <p className="text-base sm:text-lg md:text-xl text-text-secondaryLight dark:text-text-secondaryDark max-w-2xl leading-relaxed mb-10">
            Study smarter with a private archive of authorized previous-year assessment materials. Structured by subject, academic year, and quarter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-16">
            <Link href="/archive" className="w-full sm:w-auto">
              <GlassButton variant="primary" size="lg" className="w-full sm:w-auto shadow-md" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                Explore archive
              </GlassButton>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                How it works
              </GlassButton>
            </a>
          </div>

          {/* Abstract Liquid Glass Visualization Object */}
          <div className="relative w-full max-w-2xl mt-4">
            <div className="relative p-6 sm:p-8 rounded-3xl liquid-glass border border-white/40 dark:border-white/[0.08] shadow-2xl backdrop-blur-heavy overflow-hidden group">
              {/* Internal decorative document visualizer */}
              <div className="flex items-center justify-between pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                    archive://mathematics/2025-2026/q2
                  </span>
                </div>
                <GlassBadge variant="success" size="sm">
                  Authorized Archive
                </GlassBadge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
                <div className="p-3.5 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                  <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">Document Type</p>
                  <p className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark mt-0.5">Summative Practice</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                  <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">Year & Quarter</p>
                  <p className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark mt-0.5">2025–2026 • Quarter 2</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                  <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">Access Protocol</p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Encrypted Stream</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW VXLIOUS WORKS (4-STEP PROCESS) */}
      <section id="how-it-works" className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <GlassBadge variant="accent" size="sm" className="mb-3">
            Clear Workflow
          </GlassBadge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            How vxlious works.
          </h2>
          <p className="text-sm sm:text-base text-text-secondaryLight dark:text-text-secondaryDark mt-3">
            A secure four-stage process designed to verify academic integrity and deliver authorized study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01 */}
          <GlassCard variant="interactive" className="p-6 relative group">
            <div className="text-3xl font-mono font-bold text-accent/40 dark:text-accent/30 mb-4">
              01
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
              Create your account
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
              Register using your academic email and school credentials. Minimal information is collected solely to verify academic standing.
            </p>
          </GlassCard>

          {/* Step 02 */}
          <GlassCard variant="interactive" className="p-6 relative group">
            <div className="text-3xl font-mono font-bold text-accent/40 dark:text-accent/30 mb-4">
              02
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
              Verify your student status
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
              Upload a valid student card or enrollment certificate. Documents are stored privately and verified by archive administrators.
            </p>
          </GlassCard>

          {/* Step 03 */}
          <GlassCard variant="interactive" className="p-6 relative group">
            <div className="text-3xl font-mono font-bold text-accent/40 dark:text-accent/30 mb-4">
              03
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
              Choose your subject & materials
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
              Explore past assessments, revision summaries, and practice sets cataloged by subject, grade, and academic quarter.
            </p>
          </GlassCard>

          {/* Step 04 */}
          <GlassCard variant="interactive" className="p-6 relative group">
            <div className="text-3xl font-mono font-bold text-accent/40 dark:text-accent/30 mb-4">
              04
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
              Purchase access & unlock
            </h3>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
              Submit your payment confirmation receipt. Upon swift verification, the PDF is unlocked in your private library with encrypted streaming.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 3. SUBJECTS DIRECTORY SHOWCASE */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border-glassLight dark:border-border-glassDark">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <GlassBadge variant="neutral" size="sm" className="mb-2">
              Curated Curriculum
            </GlassBadge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
              Everything in one place.
            </h2>
            <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-2">
              Browse authorized academic resources organized by subject, year, and quarter.
            </p>
          </div>
          <Link href="/archive">
            <GlassButton variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View complete archive
            </GlassButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.slice(0, 6).map((sub) => (
            <Link key={sub.id} href={`/archive?subject=${sub.slug}`}>
              <GlassCard variant="interactive" className="p-5 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-accent">
                      {sub.code}
                    </span>
                    <span className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                      {sub._count.resources} materials
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark group-hover:text-accent transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1.5 line-clamp-2 leading-relaxed">
                    {sub.description || "Authorized revision papers and past practice materials."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark group-hover:text-text-primaryLight dark:group-hover:text-text-primaryDark">
                  <span>Quarters 1–4</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ACADEMIC QUARTERS BREAKDOWN */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border-glassLight dark:border-border-glassDark">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <GlassBadge variant="neutral" size="sm" className="mb-2">
            Quarterly Structure
          </GlassBadge>
          <h2 className="text-3xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Academic Quarters
          </h2>
          <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-2">
            Each academic quarter features authorized past assessments structured to follow formal syllabus milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { q: "Quarter 1", focus: "Foundations & Diagnostics", range: "September – October", tag: "Q1" },
            { q: "Quarter 2", focus: "Mid-Term Analytical Sets", range: "November – December", tag: "Q2" },
            { q: "Quarter 3", focus: "Comprehensive Practice", range: "January – March", tag: "Q3" },
            { q: "Quarter 4", focus: "Year-End Revision Packs", range: "April – May", tag: "Q4" },
          ].map((item) => (
            <GlassCard key={item.q} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-bold text-accent">{item.tag}</span>
                <span className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">{item.range}</span>
              </div>
              <h4 className="text-sm font-semibold text-text-primaryLight dark:text-text-primaryDark mb-1">
                {item.q}
              </h4>
              <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                {item.focus}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 5. PRIVACY & SECURITY CENTER PREVIEW */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border-glassLight dark:border-border-glassDark">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <GlassBadge variant="accent" size="sm" className="mb-3">
              Privacy by Design
            </GlassBadge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark leading-tight mb-4">
              Your data stays yours.
            </h2>
            <p className="text-sm sm:text-base text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-6">
              Student verification, payment confirmations, and private educational resources are protected by authenticated access and private storage. We never publish receipts or documents publicly.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                  <strong className="text-text-primaryLight dark:text-text-primaryDark">No Public Buckets:</strong> Raw documents are stored on an isolated private volume inaccessible via direct URLs.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                  <strong className="text-text-primaryLight dark:text-text-primaryDark">Short-Lived Signed Tokens:</strong> Document access tokens expire automatically in 120 seconds to prevent link sharing.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                  <strong className="text-text-primaryLight dark:text-text-primaryDark">Strict Administrative Audit:</strong> Every review, verification, and approval is logged with timestamp and administrator ID.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/privacy">
                <GlassButton variant="secondary" size="md">
                  Read full Privacy Center
                </GlassButton>
              </Link>
            </div>
          </div>

          {/* Privacy Visual Illustration */}
          <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/20 dark:border-white/[0.08] shadow-glass space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-text-primaryLight dark:text-text-primaryDark">
                  Security Architecture
                </span>
              </div>
              <GlassBadge variant="success" size="sm">
                Active Protocol
              </GlassBadge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Authentication</span>
                <span className="text-text-primaryLight dark:text-text-primaryDark">HTTP-Only Encrypted JWT</span>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">File Vault</span>
                <span className="text-text-primaryLight dark:text-text-primaryDark">Isolated Private Storage</span>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Stream Token</span>
                <span className="text-text-primaryLight dark:text-text-primaryDark">HMAC-SHA256 (120s TTL)</span>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">Verification</span>
                <span className="text-text-primaryLight dark:text-text-primaryDark">Server-Side Authorization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border-glassLight dark:border-border-glassDark">
        <div className="text-center mb-12">
          <GlassBadge variant="neutral" size="sm" className="mb-2">
            Clarifications
          </GlassBadge>
          <h2 className="text-3xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "What types of materials does vxlious provide?",
              a: "vxlious provides authorized historical previous-year assessment archives, revision summaries, sample tasks, and practice examination problems. We strictly prohibit current live tests, leaked examination papers, or cheating material.",
            },
            {
              q: "How does the student verification process work?",
              a: "When you sign up, you provide your school and grade, and upload a student ID card or certificate of enrollment. Our administrative staff reviews the document privately to confirm student eligibility before unlocking archive purchases.",
            },
            {
              q: "How do I purchase and unlock a resource?",
              a: "Once verified, click 'Request access' on any resource. Follow the bank/Kaspi transfer instructions provided, upload a screenshot or PDF of your receipt, and our administrators verify the transaction, granting immediate access to your library.",
            },
            {
              q: "Can I download or share the PDF documents?",
              a: "Documents are rendered in our secure viewer with dynamic digital watermarks containing your name and email. Sharing, re-hosting, or attempting to distribute archived files is strictly prohibited under our terms.",
            },
          ].map((faq, i) => (
            <GlassCard key={i} className="p-5">
              <h3 className="text-sm font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
                {faq.q}
              </h3>
              <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                {faq.a}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 7. FINAL HIGH-IMPACT CTA */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-20 mb-12">
        <div className="relative p-8 sm:p-14 rounded-3xl liquid-glass border border-white/40 dark:border-white/[0.08] shadow-glass text-center overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
              Start your academic preparation today.
            </h2>
            <p className="text-sm sm:text-base text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
              Join verified students using vxlious to master curriculum milestones with authorized previous-year materials.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <GlassButton variant="primary" size="lg" className="w-full sm:w-auto">
                  Create student account
                </GlassButton>
              </Link>
              <Link href="/archive" className="w-full sm:w-auto">
                <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse directory
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
