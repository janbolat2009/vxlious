import { GlassCard } from "@/components/ui/GlassCard";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ShieldCheck, Lock, EyeOff, FileCheck, Database, KeyRound, UserX, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <GlassBadge variant="accent" size="sm" className="mb-3">
          Trust & Architecture
        </GlassBadge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Privacy Center
        </h1>
        <p className="text-sm sm:text-base text-text-secondaryLight dark:text-text-secondaryDark mt-3 leading-relaxed">
          vxlious is built on the principle that academic resources should be structured and accessible, while student data remains strictly private, isolated, and confidential.
        </p>
      </div>

      {/* Main Privacy Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <GlassCard className="p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            What Data We Collect & Why
          </h2>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            We collect only the bare minimum required to authenticate student eligibility and process archive access:
          </p>
          <ul className="text-xs text-text-secondaryLight dark:text-text-secondaryDark space-y-1.5 list-disc pl-4 pt-1">
            <li><strong>Account Profile:</strong> Name, academic email, phone number, school, and current grade.</li>
            <li><strong>Student Verification:</strong> Student card image or enrollment document to confirm active student standing.</li>
            <li><strong>Payment Receipts:</strong> Transaction screenshots or receipts to verify bank/Kaspi transfer clearance.</li>
            <li><strong>Session Logs:</strong> IP address and audit timestamps for server security and fraud prevention.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            Private Storage Isolation
          </h2>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            Unlike standard web apps that host files on publicly accessible CDN buckets, vxlious uses isolated private filesystem vaults:
          </p>
          <ul className="text-xs text-text-secondaryLight dark:text-text-secondaryDark space-y-1.5 list-disc pl-4 pt-1">
            <li><strong>No Public URLs:</strong> Physical files cannot be accessed via static browser URLs or guessed storage paths.</li>
            <li><strong>Signed Ephemeral Access:</strong> Viewing requests require HMAC-SHA256 signed access keys that expire automatically in 120 seconds.</li>
            <li><strong>Non-Guessable Keys:</strong> All uploaded files are immediately renamed with cryptographically randomized UUIDs.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            Payment Confirmations & Retention
          </h2>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            Payment screenshots are reviewed solely by appointed administrative personnel.
          </p>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            We never store banking credentials, PINs, or CVV codes. Payment screenshots are archived exclusively in encrypted storage for reconciliation purposes and are automatically purged after statutory accounting periods.
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <EyeOff className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            Zero Public Disclosure
          </h2>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            We never sell, rent, monetize, or display student data publicly:
          </p>
          <ul className="text-xs text-text-secondaryLight dark:text-text-secondaryDark space-y-1.5 list-disc pl-4 pt-1">
            <li>No public user directories, profiles, or leaderboards.</li>
            <li>Phone numbers and emails are never exposed to other students.</li>
            <li>Administrative review notes remain confidential and internal.</li>
          </ul>
        </GlassCard>
      </div>

      {/* Content Safety & Anti-Leak Statement */}
      <div id="authorized-materials" className="p-8 rounded-3xl liquid-glass border border-white/20 dark:border-white/[0.08] shadow-glass space-y-4 mb-16">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-text-primaryLight dark:text-text-primaryDark">
            Content Safety & Academic Integrity Policy
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
          vxlious distinguishes firmly between <strong>authorized educational study materials</strong> and <strong>unauthorized confidential assessment leaks</strong>:
        </p>
        <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] space-y-2 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
          <p>
            • <strong>Authorized Materials:</strong> Previous-year sample tasks, past exam practice sets, formative revision packs, and curriculum exercises authorized for student preparation.
          </p>
          <p>
            • <strong>Strict Prohibition:</strong> Current live assessments, stolen examination keys, confidential school administration documents, or materials intended for cheating during active test windows are strictly barred from our repository.
          </p>
        </div>
      </div>

      {/* Data Subject Rights & Deletion */}
      <div id="data-protection" className="p-8 rounded-3xl liquid-glass-subtle space-y-4 text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
        <h3 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark">
          Right to Erasure & Account Deletion
        </h3>
        <p>
          Under our data protection commitments, students have the right to request full erasure of their personal account, verification records, and uploaded payment receipts.
        </p>
        <p>
          To request account deletion or data export, submit a formal request via the Academic Support Desk or write to <span className="font-mono text-accent">privacy@vxlious.kz</span>. All verification files will be scrubbed from our private vaults within 7 business days.
        </p>
        <div className="pt-2">
          <Link href="/support">
            <GlassButton variant="secondary" size="sm">
              Contact Privacy Officer
            </GlassButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
