import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { VerifyClient } from "./VerifyClient";

export const dynamic = "force-dynamic";

export default async function VerifyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/verify");
  }

  const latestVerification = await prisma.studentVerification.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <VerifyClient
      user={{
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        school: user.school,
        grade: user.grade,
        studentStatus: user.studentStatus,
      }}
      latestVerification={
        latestVerification
          ? {
              status: latestVerification.status,
              documentName: latestVerification.documentName,
              rejectionReason: latestVerification.rejectionReason,
            }
          : null
      }
    />
  );
}
