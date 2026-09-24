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

    if (user.studentStatus !== "verified" && user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Student verification is required before requesting archive access." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const resourceId = formData.get("resourceId") as string;
    const paymentReceiptFile = formData.get("paymentReceipt") as File | null;
    const paymentMethod = (formData.get("paymentMethod") as string) || "Manual Bank / Kaspi Transfer";

    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
    }

    if (!paymentReceiptFile) {
      return NextResponse.json(
        { error: "Please upload your payment confirmation receipt (JPG, PNG, WEBP, or PDF)." },
        { status: 400 }
      );
    }

    // Verify resource exists and is authorized
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource || !resource.isPublished) {
      return NextResponse.json({ error: "Resource not found or unavailable." }, { status: 404 });
    }

    if (resource.authorizationStatus !== "Authorized") {
      return NextResponse.json(
        { error: "This resource is currently pending content authorization." },
        { status: 403 }
      );
    }

    // Check if user already has access
    const existingAccess = await prisma.resourceAccess.findUnique({
      where: {
        userId_resourceId: {
          userId: user.id,
          resourceId: resource.id,
        },
      },
    });

    if (existingAccess && existingAccess.status === "active") {
      return NextResponse.json(
        { error: "You already have active access to this archive resource." },
        { status: 400 }
      );
    }

    // Save payment receipt privately
    const arrayBuffer = await paymentReceiptFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = await savePrivateFile(
      "receipts",
      buffer,
      paymentReceiptFile.name,
      paymentReceiptFile.type || "application/octet-stream"
    );

    // Create Order and PaymentReceipt inside transaction
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          resourceId: resource.id,
          amount: resource.price,
          currency: "KZT",
          status: "pending",
        },
      });

      const receipt = await tx.paymentReceipt.create({
        data: {
          orderId: order.id,
          filePath: saved.storageKey,
          originalName: saved.sanitizedName,
          mimeType: paymentReceiptFile.type || "application/octet-stream",
          fileSize: saved.fileSize,
          paymentMethod,
        },
      });

      return { order, receipt };
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Payment Receipt Submitted",
        message: `Your payment request for ${resource.title} (${resource.price} ₸) has been received and is under review.`,
        type: "info",
        link: "/dashboard",
      },
    });

    return NextResponse.json({
      message: "Payment receipt uploaded successfully. Access will be unlocked upon admin verification.",
      orderId: result.order.id,
    });
  } catch (error: unknown) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process payment request." },
      { status: 500 }
    );
  }
}
