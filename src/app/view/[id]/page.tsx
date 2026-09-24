import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PdfViewer } from "@/components/ui/PdfViewer";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { GlassBadge } from "@/components/ui/GlassBadge";

export const dynamic = "force-dynamic";

export default async function ViewResourcePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/view/${params.id}`);
  }

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

  // Authorization check
  const isAdmin = user.role === "admin" || user.role === "super_admin";
  if (!isAdmin) {
    const access = await prisma.resourceAccess.findUnique({
      where: {
        userId_resourceId: {
          userId: user.id,
          resourceId: resource.id,
        },
      },
    });

    if (!access || access.status !== "active") {
      redirect(`/resource/${params.id}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href={`/resource/${resource.id}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Document Overview
        </Link>

        <div className="flex items-center gap-3">
          <GlassBadge variant="success" size="sm" className="gap-1">
            <ShieldCheck className="w-3 h-3" />
            Licensed Academic Session
          </GlassBadge>
          <span className="text-xs text-text-secondaryLight dark:text-text-secondaryDark hidden sm:inline">
            {user.firstName} {user.lastName} ({user.email})
          </span>
        </div>
      </div>

      {/* Reader Title Bar */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
          {resource.title}
        </h1>
        <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
          {resource.subject.name} • {resource.academicYear.name} • {resource.quarter.name} • {resource.pageCount} Pages
        </p>
      </div>

      {/* Embedded Secure PDF Viewer */}
      <div className="flex-1 w-full">
        <PdfViewer
          resourceId={resource.id}
          title={resource.title}
          userEmail={user.email}
          userName={`${user.firstName} ${user.lastName}`}
        />
      </div>
    </div>
  );
}
