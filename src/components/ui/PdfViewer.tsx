"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { GlassBadge } from "./GlassBadge";
import { 
  ShieldCheck, 
  Lock, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  AlertCircle,
  EyeOff
} from "lucide-react";

interface PdfViewerProps {
  resourceId: string;
  title: string;
  userEmail?: string;
  userName?: string;
}

export function PdfViewer({
  resourceId,
  title,
  userEmail = "student@vxlious.kz",
  userName = "Verified Student",
}: PdfViewerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchSignedToken() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/secure-file/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceId }),
        });

        const data = await res.json();

        if (!mounted) return;

        if (!res.ok) {
          setError(data.error || "Unable to authorize document stream.");
          setLoading(false);
          return;
        }

        setToken(data.token);
        setLoading(false);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to establish secure connection.");
        setLoading(false);
      }
    }

    fetchSignedToken();

    // Auto-refresh token every 90 seconds (tokens expire in 120s)
    const interval = setInterval(fetchSignedToken, 90 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [resourceId]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoom(100);

  const toggleFullscreen = () => {
    const elem = document.getElementById(`viewer-container-${resourceId}`);
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const streamUrl = token
    ? `/api/secure-file/stream?token=${encodeURIComponent(token)}&resourceId=${encodeURIComponent(resourceId)}#toolbar=0&navpanes=0&scrollbar=1`
    : "";

  return (
    <div
      id={`viewer-container-${resourceId}`}
      className="relative flex flex-col w-full rounded-2xl overflow-hidden liquid-glass border border-border-glassLight dark:border-border-glassDark select-none"
    >
      {/* Viewer Header / Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black/[0.03] dark:bg-white/[0.04] border-b border-border-glassLight dark:border-border-glassDark">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark">
            Encrypted Session
          </span>
          <GlassBadge variant="success" size="sm" className="hidden sm:inline-flex gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified Academic Access
          </GlassBadge>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="p-1.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-text-secondaryLight dark:text-text-secondaryDark"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium px-1 text-text-secondaryLight dark:text-text-secondaryDark">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="p-1.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-text-secondaryLight dark:text-text-secondaryDark"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            className="p-1.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-text-secondaryLight dark:text-text-secondaryDark"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="p-1.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-text-secondaryLight dark:text-text-secondaryDark"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reader Viewport */}
      <div 
        className="relative w-full h-[700px] sm:h-[820px] bg-neutral-900/90 dark:bg-black flex items-center justify-center overflow-auto"
        onContextMenu={(e) => e.preventDefault()}
      >
        {loading && (
          <div className="flex flex-col items-center gap-3 text-center p-6 text-white/70">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <p className="text-sm font-medium">Authorizing access key & establishing secure stream...</p>
            <p className="text-xs text-white/40">Tokens are cryptographically signed and non-transferable.</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center text-center p-8 max-w-md">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">Access Restricted</h4>
            <p className="text-xs text-white/60 mb-4">{error}</p>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry Session
            </GlassButton>
          </div>
        )}

        {!loading && !error && streamUrl && (
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            {/* Dynamic Security Watermark Overlay (deter unauthorized screenshots/distribution) */}
            <div 
              aria-hidden="true" 
              className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-around opacity-[0.07] dark:opacity-[0.09] select-none overflow-hidden"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-16 -rotate-12 whitespace-nowrap text-xs font-mono tracking-widest text-text-primaryLight dark:text-text-primaryDark">
                  <span>vxlious private archive • {userEmail} • {userName}</span>
                  <span>ID:{resourceId.slice(0, 8)} • Single Student Academic License</span>
                </div>
              ))}
            </div>

            {/* Embedded Stream */}
            <iframe
              src={streamUrl}
              title={title}
              className="w-full h-full border-0 transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            />
          </div>
        )}
      </div>

      {/* Reader Footer Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[11px] text-text-secondaryLight dark:text-text-secondaryDark bg-black/[0.02] dark:bg-white/[0.02] border-t border-border-glassLight dark:border-border-glassDark">
        <div className="flex items-center gap-1.5">
          <EyeOff className="w-3.5 h-3.5 text-text-secondaryLight/70 dark:text-text-secondaryDark/70" />
          <span>Private document viewer. Dynamic watermarking active.</span>
        </div>
        <div className="font-mono text-[10px] opacity-75">
          Session Token: {token ? `${token.slice(0, 10)}...${token.slice(-6)}` : "Inactive"}
        </div>
      </div>
    </div>
  );
}
