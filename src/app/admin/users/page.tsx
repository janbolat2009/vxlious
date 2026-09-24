import prisma from "@/lib/prisma";
import { AdminUsersClient } from "./AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          resourceAccess: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = users.map((u) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phoneNumber: u.phoneNumber,
    school: u.school,
    grade: u.grade,
    role: u.role,
    studentStatus: u.studentStatus,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    _count: u._count,
  }));

  return <AdminUsersClient initialUsers={formatted} />;
}
