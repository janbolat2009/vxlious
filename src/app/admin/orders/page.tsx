import prisma from "@/lib/prisma";
import { AdminOrdersClient } from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          school: true,
        },
      },
      resource: {
        select: {
          id: true,
          title: true,
          subject: { select: { name: true } },
        },
      },
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = orders.map((o) => ({
    id: o.id,
    amount: o.amount,
    currency: o.currency,
    status: o.status,
    adminNotes: o.adminNotes,
    createdAt: o.createdAt.toISOString(),
    user: o.user,
    resource: o.resource,
    receipt: o.receipt
      ? {
          id: o.receipt.id,
          originalName: o.receipt.originalName,
          mimeType: o.receipt.mimeType,
          fileSize: o.receipt.fileSize,
          paymentMethod: o.receipt.paymentMethod,
          uploadedAt: o.receipt.uploadedAt.toISOString(),
        }
      : null,
  }));

  return <AdminOrdersClient initialOrders={formatted} />;
}
