import prisma from "./prisma";

export async function logAdminAction(params: {
  adminId: string;
  action: string;
  targetType: "Payment" | "User" | "Resource" | "Verification" | "Setting";
  targetId: string;
  details?: Record<string, unknown> | string;
  ipAddress?: string;
}) {
  try {
    const detailsStr =
      typeof params.details === "object"
        ? JSON.stringify(params.details)
        : params.details || null;

    await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        details: detailsStr,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
