"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { GlassButton } from "./ui/GlassButton";
import { GlassBadge } from "./ui/GlassBadge";
import { 
  Menu, 
  X, 
  BookOpen, 
  Shield, 
  User as UserIcon, 
  LogOut, 
  Lock, 
  Compass, 
  HelpCircle,
  Sparkles
} from "lucide-react";

interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  studentStatus: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Archive", href: "/archive", icon: <Compass className="w-4 h-4" /> },
    { name: "How it works", href: "/#how-it-works", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Privacy", href: "/privacy", icon: <Shield className="w-4 h-4" /> },
    { name: "Support", href: "/support", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav className="relative flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 rounded-full liquid-glass border border-border-glassLight dark:border-border-glassDark">
          {/* Brand Logo - lowercase "vxlious" */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              v
            </div>
            <span className="font-semibold text-lg tracking-tight text-text-primaryLight dark:text-text-primaryDark">
              vxlious
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    active
                      ? "bg-black/[0.06] dark:bg-white/[0.10] text-text-primaryLight dark:text-text-primaryDark"
                      : "text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {user ? (
              <>
                <NotificationBell />

                <Link href="/library" className="hidden sm:inline-flex">
                  <GlassButton variant="secondary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                    Library
                  </GlassButton>
                </Link>

                <Link href="/dashboard" className="hidden sm:inline-flex">
                  <GlassButton variant="secondary" size="sm" icon={<UserIcon className="w-3.5 h-3.5" />}>
                    Dashboard
                  </GlassButton>
                </Link>

                {user.role === "admin" || user.role === "super_admin" ? (
                  <Link href="/admin" className="hidden sm:inline-flex">
                    <GlassBadge variant="accent" size="sm" className="gap-1 cursor-pointer">
                      <Lock className="w-3 h-3" />
                      Admin
                    </GlassBadge>
                  </Link>
                ) : null}

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors liquid-glass-subtle text-text-secondaryLight dark:text-text-secondaryDark hover:text-rose-500"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <GlassButton variant="ghost" size="sm">
                    Login
                  </GlassButton>
                </Link>
                <Link href="/register">
                  <GlassButton variant="primary" size="sm">
                    Get started
                  </GlassButton>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open mobile menu"
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center liquid-glass-subtle text-text-primaryLight dark:text-text-primaryDark"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-3xl liquid-glass border border-border-glassLight dark:border-border-glassDark shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 pb-3 border-b border-border-glassLight dark:border-border-glassDark">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-primaryLight dark:text-text-primaryDark hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  <span className="text-text-secondaryLight dark:text-text-secondaryDark">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="pt-2 space-y-2">
                <div className="px-3.5 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/library"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-primaryLight dark:text-text-primaryDark hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  <BookOpen className="w-4 h-4 text-accent" />
                  My Library
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-primaryLight dark:text-text-primaryDark hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  <UserIcon className="w-4 h-4 text-accent" />
                  Dashboard
                </Link>
                {user.role === "admin" || user.role === "super_admin" ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-accent hover:bg-accent/10"
                  >
                    <Lock className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : null}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <GlassButton variant="secondary" size="md" className="w-full">
                    Login
                  </GlassButton>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <GlassButton variant="primary" size="md" className="w-full">
                    Get started
                  </GlassButton>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
