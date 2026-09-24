import Link from "next/link";
import { ShieldCheck, Lock, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-glassLight dark:border-border-glassDark bg-black/[0.01] dark:bg-white/[0.01]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-indigo-400 flex items-center justify-center text-white font-bold text-xs">
                v
              </div>
              <span className="font-semibold text-base tracking-tight text-text-primaryLight dark:text-text-primaryDark">
                vxlious
              </span>
            </Link>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark max-w-md leading-relaxed">
              A private educational archive for students. Providing verified access to authorized previous-year assessment materials, practice papers, revision guides, and structured study resources.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified Student Access
              </span>
              <span className="text-text-secondaryLight/30">•</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                <Lock className="w-3.5 h-3.5 text-accent" />
                Private Storage Architecture
              </span>
            </div>
          </div>

          {/* Academic Archive Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primaryLight dark:text-text-primaryDark">
              Archive
            </h4>
            <ul className="space-y-2 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
              <li>
                <Link href="/archive" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  Subject Directory
                </Link>
              </li>
              <li>
                <Link href="/archive?year=2025-2026" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  2025–2026 Materials
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primaryLight dark:text-text-primaryDark">
              Privacy & Legal
            </h4>
            <ul className="space-y-2 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
              <li>
                <Link href="/privacy" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  Privacy Center
                </Link>
              </li>
              <li>
                <Link href="/privacy#authorized-materials" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  Content Authorization
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  Academic Support Desk
                </Link>
              </li>
              <li>
                <Link href="/privacy#data-protection" className="hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
                  Data Protection
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl liquid-glass-subtle text-[11px] text-text-secondaryLight dark:text-text-secondaryDark space-y-1.5 leading-relaxed">
          <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">
            Academic Integrity & Content Policy
          </p>
          <p>
            vxlious does not host, distribute, or endorse unauthorized examination leaks, stolen school assessment documents, current live assessments, or answer keys intended for academic dishonesty. All archive materials consist strictly of authorized historical practice papers and revision summaries for independent study.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border-glassLight dark:border-border-glassDark flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
          <p>© {new Date().getFullYear()} vxlious. All rights reserved.</p>
          <p className="font-mono text-[10px]">vxlious academic archive v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
