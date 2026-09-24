import prisma from "@/lib/prisma";
import { AdminVerificationClient } from "./AdminVerificationClient";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const verifications = await prisma.studentVerification.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          school: true,
          grade: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = verifications.map((v) => ({
    id: v.id,
    studentIdNumber: v.studentIdNumber,
    documentName: v.documentName,
    documentPath: v.documentPath,
    mimeType: v.mimeType,
    fileSize: v.fileSize,
    status: v.status,
    rejectionReason: v.rejectionReason,
    createdAt: v.createdAt.toISOString(),
    user: v.user,
  }));

  return <AdminVerificationClient initialVerifications={formatted} />;
}
