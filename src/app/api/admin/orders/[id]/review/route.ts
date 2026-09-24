import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const orderId = params.id;

    const body = await req.json();
    const { action, adminNotes } = body; // action: "approve" | "reject"

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action. Must be approve or reject." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        resource: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (action === "approve") {
      // Execute in transaction: update order status, upsert resource access, notify student
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "approved",
            adminNotes: adminNotes || "Payment verified by administrator",
          },
        });

        // Grant resource access
        await tx.resourceAccess.upsert({
          where: {
            userId_resourceId: {
              userId: order.userId,
              resourceId: order.resourceId,
            },
          },
          update: {
            status: "active",
            orderId: order.id,
            grantedAt: new Date(),
          },
          create: {
            userId: order.userId,
            resourceId: order.resourceId,
            orderId: order.id,
            status: "active",
          },
        });

        // Create notification
        await tx.notification.create({
          data: {
            userId: order.userId,
            title: "Access Granted",
            message: `Your payment for ${order.resource.title} has been approved. The document is now available in your Library.`,
            type: "success",
            link: `/resource/${order.resourceId}`,
          },
        });
      });
    } else {
      // Reject
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: "rejected",
            adminNotes: adminNotes || "Payment could not be verified",
          },
        }),
        prisma.notification.create({
          data: {
            userId: order.userId,
            title: "Payment Update",
            message: "Your payment could not be verified. Please contact support or submit a new payment receipt.",
            type: "warning",
            link: "/support",
          },
        }),
      ]);
    }

    // Admin audit log
    await logAdminAction({
      adminId: admin.id,
      action: action === "approve" ? "PAYMENT_APPROVED" : "PAYMENT_REJECTED",
      targetType: "Payment",
      targetId: orderId,
      details: {
        orderId,
        resourceId: order.resourceId,
        resourceTitle: order.resource.title,
        studentId: order.userId,
        amount: order.amount,
        adminNotes,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Order ${action === "approve" ? "approved and access granted" : "rejected"} successfully.`,
    });
  } catch (error: unknown) {
    console.error("Admin order review error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to review order." },
      { status: 500 }
    );
  }
}
