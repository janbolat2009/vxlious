"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { formatPriceKZT, formatDateTime } from "@/lib/utils";
import { Check, X, Eye, CreditCard, AlertCircle } from "lucide-react";

interface OrderItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    school: string;
  };
  resource: {
    id: string;
    title: string;
    subject: { name: string };
  };
  receipt: {
    id: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    paymentMethod: string;
    uploadedAt: string;
  } | null;
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: OrderItem[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [previewOrderId, setPreviewOrderId] = useState<string | null>(null);

  const handleAction = async (orderId: string, action: "approve" | "reject") => {
    try {
      setLoadingId(orderId);
      const res = await fetch(`/api/admin/orders/${orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: action === "approve" ? "approved" : "rejected" } : o
          )
        );
      }
      setLoadingId(null);
      router.refresh();
    } catch {
      setLoadingId(null);
    }
  };

  const openReceiptPreview = async (orderId: string) => {
    try {
      const res = await fetch("/api/secure-file/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: orderId, scope: "receipt_view" }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setPreviewToken(data.token);
        setPreviewOrderId(orderId);
      }
    } catch {
      alert("Failed to sign access key for receipt preview.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
            Purchase Orders & Payment Clearance
          </h1>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            Reconcile manual bank/Kaspi transfers. Approving an order immediately grants student library access.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <GlassCard className="p-12 text-center text-text-secondaryLight text-xs">
          No payment orders recorded yet.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <GlassCard key={order.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-text-primaryLight dark:text-text-primaryDark">
                    {order.id}
                  </span>
                  <GlassBadge
                    variant={
                      order.status === "approved"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="sm"
                  >
                    {order.status === "approved"
                      ? "Approved & Granted"
                      : order.status === "pending"
                      ? "Pending Verification"
                      : "Rejected"}
                  </GlassBadge>
                  <span className="font-bold text-sm text-accent">
                    {formatPriceKZT(order.amount)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                  <p>Student: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{order.user.firstName} {order.user.lastName}</span></p>
                  <p>Email: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{order.user.email}</span></p>
                  <p>Phone: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{order.user.phoneNumber}</span></p>
                  <p className="sm:col-span-2">Resource: <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">{order.resource.title} ({order.resource.subject.name})</span></p>
                  <p>Submitted: <span className="font-mono">{formatDateTime(order.createdAt)}</span></p>
                </div>

                {order.receipt && (
                  <p className="text-[11px] text-text-secondaryLight font-mono">
                    Receipt: {order.receipt.originalName} ({order.receipt.paymentMethod})
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {order.receipt && (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => openReceiptPreview(order.id)}
                    icon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Receipt
                  </GlassButton>
                )}

                {order.status === "pending" && (
                  <>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(order.id, "approve")}
                      disabled={loadingId === order.id}
                      icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                    >
                      Approve & Grant
                    </GlassButton>
                    <GlassButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleAction(order.id, "reject")}
                      disabled={loadingId === order.id}
                      icon={<X className="w-3.5 h-3.5" />}
                    >
                      Reject
                    </GlassButton>
                  </>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Receipt Preview Modal */}
      {previewToken && previewOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-3xl h-[80vh] rounded-3xl liquid-glass border border-white/20 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <span className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">
                Private Payment Confirmation Preview ({previewOrderId})
              </span>
              <button
                onClick={() => {
                  setPreviewToken(null);
                  setPreviewOrderId(null);
                }}
                className="text-text-secondaryLight hover:text-text-primaryLight dark:hover:text-text-primaryDark text-sm"
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={`/api/secure-file/stream?token=${encodeURIComponent(previewToken)}&resourceId=${encodeURIComponent(previewOrderId)}&scope=receipt_view`}
              className="w-full flex-1 rounded-xl border border-white/10 bg-neutral-900"
              title="Receipt Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
