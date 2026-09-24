"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassInput } from "@/components/ui/GlassInput";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

export function AdminSettingsClient({
  initialSettings,
}: {
  initialSettings: SettingItem[];
}) {
  const [paymentInstructions, setPaymentInstructions] = useState(
    initialSettings.find((s) => s.key === "PAYMENT_INSTRUCTIONS")?.value || ""
  );
  const [supportContact, setSupportContact] = useState(
    initialSettings.find((s) => s.key === "SUPPORT_CONTACT")?.value || ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "PAYMENT_INSTRUCTIONS",
            value: paymentInstructions,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "SUPPORT_CONTACT",
            value: supportContact,
          }),
        }),
      ]);

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Failed to update system settings.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          Archive System Configuration
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
          Configure payment instructions displayed to students during checkout and official support contact channels.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark uppercase tracking-wider">
              Student Checkout Payment Instructions
            </label>
            <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
              These instructions are displayed to students on the purchase screen when requesting access to an archived PDF.
            </p>
            <textarea
              rows={6}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              className="w-full text-xs font-mono rounded-xl p-3.5 bg-white/70 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 outline-none leading-relaxed"
              required
            />
          </div>

          <GlassInput
            label="Support Contact Information"
            value={supportContact}
            onChange={(e) => setSupportContact(e.target.value)}
            placeholder="support@vxlious.kz | Telegram: @vxlious_archive"
            required
          />

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings saved successfully and reflected in checkout flows.</span>
            </div>
          )}

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
            icon={<Save className="w-4 h-4" />}
          >
            {loading ? "Saving Settings..." : "Save Configuration"}
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
}
