import prisma from "@/lib/prisma";
import { AdminSubjectsClient } from "./AdminSubjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage() {
  const [subjects, years] = await Promise.all([
    prisma.subject.findMany({
      include: {
        _count: { select: { resources: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.academicYear.findMany({
      orderBy: { code: "desc" },
    }),
  ]);

  return (
    <AdminSubjectsClient
      initialSubjects={subjects}
      initialYears={years}
    />
  );
}
