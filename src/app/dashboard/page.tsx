import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  // Fetch student orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      resource: {
        include: {
          subject: true,
          quarter: true,
          academicYear: true,
        },
      },
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch student unlocked access records
  const accesses = await prisma.resourceAccess.findMany({
    where: {
      userId: user.id,
      status: "active",
    },
    include: {
      resource: {
        include: {
          subject: true,
          quarter: true,
          academicYear: true,
        },
      },
    },
    orderBy: { grantedAt: "desc" },
  });

  // Fetch verifications
  const verifications = await prisma.studentVerification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        school: user.school,
        grade: user.grade,
        role: user.role,
        studentStatus: user.studentStatus,
        createdAt: user.createdAt.toISOString(),
      }}
      orders={orders.map((o) => ({
        id: o.id,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        resource: {
          id: o.resource.id,
          title: o.resource.title,
          subject: { name: o.resource.subject.name },
          quarter: { name: o.resource.quarter.name },
          academicYear: { name: o.resource.academicYear.name },
        },
        receipt: o.receipt
          ? {
              originalName: o.receipt.originalName,
              uploadedAt: o.receipt.uploadedAt.toISOString(),
            }
          : null,
      }))}
      accesses={accesses.map((a) => ({
        id: a.id,
        grantedAt: a.grantedAt.toISOString(),
        resource: {
          id: a.resource.id,
          title: a.resource.title,
          subject: { name: a.resource.subject.name },
          quarter: { name: a.resource.quarter.name },
          academicYear: { name: a.resource.academicYear.name },
        },
      }))}
      verifications={verifications.map((v) => ({
        id: v.id,
        documentName: v.documentName,
        status: v.status,
        rejectionReason: v.rejectionReason,
        createdAt: v.createdAt.toISOString(),
      }))}
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        link: n.link,
      }))}
    />
  );
}
