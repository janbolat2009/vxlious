import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ArchiveClient } from "./ArchiveClient";

export const dynamic = "force-dynamic";

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: { subject?: string; year?: string; quarter?: string };
}) {
  let user = null;
  let resources: any[] = [];
  let subjects: any[] = [];
  let academicYears: any[] = [];
  let unlockedResourceIds = new Set<string>();

  try {
    user = await getCurrentUser();

    [resources, subjects, academicYears] = await Promise.all([
      prisma.resource.findMany({
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
      }),
      prisma.subject.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.academicYear.findMany({
        orderBy: { code: "desc" },
      }),
    ]);

    if (user) {
      if (user.role === "admin" || user.role === "super_admin") {
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
  } catch (error) {
    console.warn("Archive database query fallback:", error);
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
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    subject: {
      id: r.subject?.id || "sub",
      name: r.subject?.name || "Subject",
      slug: r.subject?.slug || "subject",
      code: r.subject?.code || "SUB",
    },
    academicYear: {
      id: r.academicYear?.id || "yr",
      name: r.academicYear?.name || "2025–2026",
      code: r.academicYear?.code || "2025-2026",
    },
    quarter: {
      id: r.quarter?.id || "q",
      name: r.quarter?.name || "Quarter 1",
      quarterNumber: r.quarter?.quarterNumber || 1,
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
