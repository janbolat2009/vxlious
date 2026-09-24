import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ResourceDetailClient } from "./ResourceDetailClient";

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: {
      subject: true,
      academicYear: true,
      quarter: true,
    },
  });

  if (!resource || !resource.isPublished) {
    notFound();
  }

  // Check access status
  let isUnlocked = false;
  if (user) {
    if (user.role === "admin" || user.role === "super_admin") {
      isUnlocked = true;
    } else {
      const access = await prisma.resourceAccess.findUnique({
        where: {
          userId_resourceId: {
            userId: user.id,
            resourceId: resource.id,
          },
        },
      });
      isUnlocked = access?.status === "active";
    }
  }

  // Fetch administrator payment instructions from system settings
  const paymentSetting = await prisma.systemSetting.findUnique({
    where: { key: "PAYMENT_INSTRUCTIONS" },
  });

  const paymentInstructions =
    paymentSetting?.value ||
    `Transfer the exact fee (${resource.price} ₸) via Kaspi Gold or QR to:\nPhone: +7 (777) 000-0001\nRecipient: Alikhan B. (vxlious Archive)\nComment: Order access request\nUpload screenshot below.`;

  const formattedResource = {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    documentType: resource.documentType,
    pageCount: resource.pageCount,
    fileSize: resource.fileSize,
    price: resource.price,
    authorizationStatus: resource.authorizationStatus,
    createdAt: resource.createdAt.toISOString(),
    subject: {
      name: resource.subject.name,
      slug: resource.subject.slug,
      code: resource.subject.code,
    },
    academicYear: {
      name: resource.academicYear.name,
      code: resource.academicYear.code,
    },
    quarter: {
      name: resource.quarter.name,
      quarterNumber: resource.quarter.quarterNumber,
    },
  };

  const userProfile = user
    ? {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        school: user.school,
        grade: user.grade,
        role: user.role,
        studentStatus: user.studentStatus,
      }
    : null;

  return (
    <ResourceDetailClient
      resource={formattedResource}
      user={userProfile}
      isUnlocked={isUnlocked}
      paymentInstructions={paymentInstructions}
    />
  );
}
