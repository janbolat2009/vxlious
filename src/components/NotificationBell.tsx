"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(
            (data.notifications || []).filter((n: NotificationItem) => !n.isRead).length
          );
        }
      } catch {
        // Silently fail if unauthenticated
      }
    }

    loadNotifications();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="View notifications"
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 liquid-glass-subtle text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl liquid-glass border border-border-glassLight dark:border-border-glassDark shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-glassLight dark:border-border-glassDark">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border-glassLight dark:divide-border-glassDark">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 transition-colors ${
                    !n.isRead
                      ? "bg-accent/5 dark:bg-accent/10"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-accent" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">
                        {n.title}
                      </p>
                      <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-text-secondaryLight/70 dark:text-text-secondaryDark/70">
                          {formatDate(n.createdAt)}
                        </span>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setOpen(false)}
                            className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
