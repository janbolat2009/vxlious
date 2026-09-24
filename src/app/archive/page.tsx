import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ArchiveClient } from "./ArchiveClient";

export const dynamic = "force-dynamic";

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: { subject?: string; year?: string; quarter?: string };
}) {
  const user = await getCurrentUser();

  // Fetch authorized resources
  const resources = await prisma.resource.findMany({
    where: {
      isPublished: true,
      authorizationStatus: "Authorized",
    },
    include: {
      subject: true,
      academicYear: true,
      quarter: true,
    },
    orderBy: [{ subject: { sortOrder: "asc" } }, { quarter: { quarterNumber: "asc" } }],
  });

  // Get subjects & years
  const subjects = await prisma.subject.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const academicYears = await prisma.academicYear.findMany({
    orderBy: { code: "desc" },
  });

  // Get user access set if logged in
  let unlockedResourceIds = new Set<string>();
  if (user) {
    if (user.role === "admin" || user.role === "super_admin") {
      // Admins have access to everything
      unlockedResourceIds = new Set(resources.map((r) => r.id));
    } else {
      const userAccess = await prisma.resourceAccess.findMany({
        where: {
          userId: user.id,
          status: "active",
        },
        select: { resourceId: true },
      });
      unlockedResourceIds = new Set(userAccess.map((a) => a.resourceId));
    }
  }

  const formattedResources = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    documentType: r.documentType,
    pageCount: r.pageCount,
    fileSize: r.fileSize,
    price: r.price,
    authorizationStatus: r.authorizationStatus,
    createdAt: r.createdAt.toISOString(),
    subject: {
      id: r.subject.id,
      name: r.subject.name,
      slug: r.subject.slug,
      code: r.subject.code,
    },
    academicYear: {
      id: r.academicYear.id,
      name: r.academicYear.name,
      code: r.academicYear.code,
    },
    quarter: {
      id: r.quarter.id,
      name: r.quarter.name,
      quarterNumber: r.quarter.quarterNumber,
    },
    isUnlocked: unlockedResourceIds.has(r.id),
  }));

  return (
    <ArchiveClient
      initialResources={formattedResources}
      subjects={subjects}
      academicYears={academicYears}
      initialSubject={searchParams.subject}
      initialYear={searchParams.year}
      initialQuarter={searchParams.quarter}
      userVerified={user?.studentStatus === "verified"}
    />
  );
}
