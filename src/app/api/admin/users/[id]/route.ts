import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const userId = params.id;

    const body = await req.json();
    const { isActive, studentStatus, role } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Protect super_admin from accidental demotion by another admin
    if (user.role === "super_admin" && admin.role !== "super_admin") {
      return NextResponse.json({ error: "Only super administrators can modify super_admin accounts." }, { status: 403 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(studentStatus !== undefined && { studentStatus }),
        ...(role !== undefined && { role }),
      },
    });

    await logAdminAction({
      adminId: admin.id,
      action: "USER_MODIFIED",
      targetType: "User",
      targetId: userId,
      details: {
        targetEmail: user.email,
        changes: { isActive, studentStatus, role },
      },
    });

    return NextResponse.json({
      message: "User status updated successfully.",
      user: {
        id: updated.id,
        email: updated.email,
        role: updated.role,
        studentStatus: updated.studentStatus,
        isActive: updated.isActive,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user." },
      { status: 500 }
    );
  }
}
