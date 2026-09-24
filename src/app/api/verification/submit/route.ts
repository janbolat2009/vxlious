import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { savePrivateFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    const studentIdNumber = (formData.get("studentIdNumber") as string) || null;
    const school = (formData.get("school") as string) || user.school;
    const grade = (formData.get("grade") as string) || user.grade;

    if (!file) {
      return NextResponse.json(
        { error: "Verification document is required (Student ID or enrollment certificate)." },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save in private storage
    const saved = await savePrivateFile(
      "verifications",
      buffer,
      file.name,
      file.type || "application/pdf"
    );

    // Create verification record
    const verification = await prisma.studentVerification.create({
      data: {
        userId: user.id,
        studentIdNumber,
        documentPath: saved.storageKey,
        documentName: saved.sanitizedName,
        mimeType: file.type || "application/pdf",
        fileSize: saved.fileSize,
        status: "pending",
      },
    });

    // Update user info & status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        school,
        grade,
        studentStatus: "pending",
      },
    });

    // Add user notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Verification Submitted",
        message: "Your student verification document is currently being reviewed by academic archive staff.",
        type: "info",
        link: "/dashboard",
      },
    });

    return NextResponse.json({
      message: "Verification submitted successfully. Academic staff will review your submission shortly.",
      verification,
    });
  } catch (error: unknown) {
    console.error("Verification submit error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload verification document." },
      { status: 500 }
    );
  }
}
