import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <GlassCard className="p-8 sm:p-12 text-center max-w-md w-full space-y-4">
        <div className="w-12 h-12 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-accent mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <span className="font-mono text-xs uppercase font-bold text-accent">Error 404</span>
        <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Page not found.
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
          The requested educational document or page does not exist or has been relocated within the archive.
        </p>
        <div className="pt-2">
          <Link href="/archive">
            <GlassButton variant="primary" size="md">
              Return to Subject Archive
            </GlassButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
