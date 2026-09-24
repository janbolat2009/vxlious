"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { HelpCircle, CheckCircle2, AlertCircle, MessageSquare, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TicketItem {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  adminResponse: string | null;
  createdAt: string;
}

interface SupportClientProps {
  initialTickets: TicketItem[];
  userLoggedIn: boolean;
}

export function SupportClient({ initialTickets, userLoggedIn }: SupportClientProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [category, setCategory] = useState("Payment");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please provide a subject and description of your inquiry.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit ticket.");
        setLoading(false);
        return;
      }

      setTickets([data.ticket, ...tickets]);
      setSubject("");
      setMessage("");
      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Network error submitting support inquiry.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <GlassBadge variant="neutral" size="sm" className="mb-2">
          Academic Help Desk
        </GlassBadge>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Support & Academic Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-2">
          Need help with payment clearance, verification review, or document access? Our academic coordinators are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              Submit a Support Ticket
            </h2>

            {!userLoggedIn ? (
              <div className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] text-center space-y-3">
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                  Please log in with your academic account to submit support tickets and track responses.
                </p>
                <a href="/login?redirect=/support">
                  <GlassButton variant="primary" size="sm">
                    Log in to continue
                  </GlassButton>
                </a>
              </div>
            ) : success ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-semibold text-text-primaryLight dark:text-text-primaryDark">
                  Support Ticket Received
                </h3>
                <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark max-w-md mx-auto">
                  Your ticket has been assigned to our archive support desk. You will receive an internal notification when an administrator replies.
                </p>
                <GlassButton variant="secondary" size="sm" onClick={() => setSuccess(false)}>
                  Submit Another Ticket
                </GlassButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/70 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.10] text-text-primaryLight dark:text-text-primaryDark outline-none focus:border-accent"
                  >
                    <option value="Payment">Payment / Transfer Verification</option>
                    <option value="Verification">Student Status Verification</option>
                    <option value="Resource issue">Resource or Document Question</option>
                    <option value="Technical issue">Technical or Viewer Issue</option>
                    <option value="Other">General Academic Archive Inquiry</option>
                  </select>
                </div>

                <GlassInput
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide relevant details (order ID, subject, error details)..."
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm bg-white/70 dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.10] text-text-primaryLight dark:text-text-primaryDark placeholder:text-text-secondaryLight/60 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <GlassButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                  className="w-full"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  {loading ? "Submitting..." : "Send Ticket"}
                </GlassButton>
              </form>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Active Tickets & Channels */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark mb-4">
              Direct Channels
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">Support Email</p>
                <p className="text-accent font-mono mt-0.5">support@vxlious.kz</p>
              </div>
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">Operating Hours</p>
                <p className="text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">Mon–Sat: 09:00 – 21:00 (GMT+5)</p>
              </div>
            </div>
          </GlassCard>

          {/* Past User Tickets */}
          {userLoggedIn && (
            <GlassCard className="p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondaryLight dark:text-text-secondaryDark mb-4">
                Your Tickets ({tickets.length})
              </h3>
              {tickets.length === 0 ? (
                <p className="text-xs text-text-secondaryLight">No past tickets filed.</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primaryLight dark:text-text-primaryDark truncate">
                          {t.subject}
                        </span>
                        <GlassBadge
                          variant={t.status === "resolved" ? "success" : "warning"}
                          size="sm"
                        >
                          {t.status}
                        </GlassBadge>
                      </div>
                      <p className="text-[11px] text-text-secondaryLight line-clamp-2">
                        {t.message}
                      </p>
                      {t.adminResponse && (
                        <div className="mt-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] text-accent font-medium">
                          Staff: {t.adminResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
