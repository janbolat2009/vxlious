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
    const verificationId = params.id;

    const body = await req.json();
    const { action, reason } = body; // action: "approve" | "reject"

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action. Must be approve or reject." }, { status: 400 });
    }

    const verification = await prisma.studentVerification.findUnique({
      where: { id: verificationId },
      include: { user: true },
    });

    if (!verification) {
      return NextResponse.json({ error: "Verification submission not found" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "verified" : "rejected";
    const rejectionReason =
      action === "reject"
        ? reason || "Student verification documentation could not confirm active enrollment."
        : null;

    // Update verification record and user status
    await prisma.$transaction([
      prisma.studentVerification.update({
        where: { id: verificationId },
        data: {
          status: newStatus,
          rejectionReason,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: verification.userId },
        data: {
          studentStatus: newStatus,
        },
      }),
      prisma.notification.create({
        data: {
          userId: verification.userId,
          title: action === "approve" ? "Student Verification Approved" : "Verification Update",
          message:
            action === "approve"
              ? "Your student status has been verified. You can now access and purchase archived educational materials."
              : `Your student verification could not be approved: ${rejectionReason}`,
          type: action === "approve" ? "success" : "warning",
          link: "/dashboard",
        },
      }),
    ]);

    // Audit log
    await logAdminAction({
      adminId: admin.id,
      action: action === "approve" ? "VERIFICATION_APPROVED" : "VERIFICATION_REJECTED",
      targetType: "Verification",
      targetId: verificationId,
      details: {
        userId: verification.userId,
        userEmail: verification.user.email,
        rejectionReason,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Verification ${action === "approve" ? "approved" : "rejected"} successfully.`,
    });
  } catch (error: unknown) {
    console.error("Admin verification review error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to review verification." },
      { status: 500 }
    );
  }
}
