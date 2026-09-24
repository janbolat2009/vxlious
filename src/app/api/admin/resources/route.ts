import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { savePrivateFile } from "@/lib/storage";
import { logAdminAction } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const resources = await prisma.resource.findMany({
      include: {
        subject: true,
        academicYear: true,
        quarter: true,
        _count: {
          select: {
            orders: true,
            accessRecords: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resources });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const subjectId = formData.get("subjectId") as string;
    const academicYearId = formData.get("academicYearId") as string;
    const quarterId = formData.get("quarterId") as string;
    const documentType = (formData.get("documentType") as string) || "Practice Paper";
    const price = parseInt((formData.get("price") as string) || "2000", 10);
    const pageCount = parseInt((formData.get("pageCount") as string) || "1", 10);
    const authorizationStatus = (formData.get("authorizationStatus") as string) || "Authorized";
    const isPublished = formData.get("isPublished") === "true";
    const file = formData.get("file") as File | null;

    if (!title || !subjectId || !academicYearId || !quarterId || !file) {
      return NextResponse.json(
        { error: "Title, subject, academic year, quarter, and PDF file are required." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only authorized PDF documents are permitted." },
        { status: 400 }
      );
    }

    // Save PDF in private storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = await savePrivateFile(
      "resources",
      buffer,
      file.name,
      "application/pdf"
    );

    const resource = await prisma.resource.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        subjectId,
        academicYearId,
        quarterId,
        documentType,
        price,
        pageCount,
        filePath: saved.storageKey,
        fileName: saved.sanitizedName,
        fileSize: saved.fileSize,
        isPublished,
        authorizationStatus,
      },
    });

    await logAdminAction({
      adminId: admin.id,
      action: "RESOURCE_UPLOADED",
      targetType: "Resource",
      targetId: resource.id,
      details: {
        title: resource.title,
        price: resource.price,
        authorizationStatus: resource.authorizationStatus,
      },
    });

    return NextResponse.json({
      message: "Resource uploaded and added to the academic archive.",
      resource,
    });
  } catch (error: unknown) {
    console.error("Resource creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload resource." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id, title, description, price, pageCount, isPublished, authorizationStatus, documentType } = body;

    if (!id) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
    }

    const updated = await prisma.resource.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(pageCount !== undefined && { pageCount: Number(pageCount) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(authorizationStatus && { authorizationStatus }),
        ...(documentType && { documentType }),
      },
    });

    await logAdminAction({
      adminId: admin.id,
      action: "RESOURCE_UPDATED",
      targetType: "Resource",
      targetId: id,
      details: {
        title: updated.title,
        price: updated.price,
        isPublished: updated.isPublished,
        authorizationStatus: updated.authorizationStatus,
      },
    });

    return NextResponse.json({
      message: "Resource updated successfully.",
      resource: updated,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update resource." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    await prisma.resource.delete({
      where: { id },
    });

    await logAdminAction({
      adminId: admin.id,
      action: "RESOURCE_DELETED",
      targetType: "Resource",
      targetId: id,
      details: {
        deletedTitle: resource.title,
      },
    });

    return NextResponse.json({
      message: "Resource removed from archive successfully.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete resource." },
      { status: 500 }
    );
  }
}
