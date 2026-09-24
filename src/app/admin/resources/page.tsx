import prisma from "@/lib/prisma";
import { AdminResourcesClient } from "./AdminResourcesClient";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const [resources, subjects, academicYears, quarters] = await Promise.all([
    prisma.resource.findMany({
      include: {
        subject: { select: { id: true, name: true } },
        academicYear: { select: { id: true, name: true } },
        quarter: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subject.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.academicYear.findMany({
      select: { id: true, name: true },
      orderBy: { code: "desc" },
    }),
    prisma.quarter.findMany({
      select: { id: true, name: true },
      orderBy: { quarterNumber: "asc" },
    }),
  ]);

  const formatted = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    documentType: r.documentType,
    price: r.price,
    pageCount: r.pageCount,
    fileSize: r.fileSize,
    fileName: r.fileName,
    isPublished: r.isPublished,
    authorizationStatus: r.authorizationStatus,
    createdAt: r.createdAt.toISOString(),
    subject: r.subject,
    academicYear: r.academicYear,
    quarter: r.quarter,
  }));

  return (
    <AdminResourcesClient
      initialResources={formatted}
      subjects={subjects}
      academicYears={academicYears}
      quarters={quarters}
    />
  );
}
