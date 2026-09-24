import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSignedAccessToken } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { resourceId, scope = "pdf_view" } = body;

    if (!resourceId) {
      return NextResponse.json({ error: "Resource identifier is required" }, { status: 400 });
    }

    // Role-based and authorization checks
    const isAdmin = user.role === "admin" || user.role === "super_admin";

    if (scope === "pdf_view") {
      // Must be admin OR have verified student status AND active purchased resource access
      if (!isAdmin) {
        if (user.studentStatus !== "verified") {
          return NextResponse.json(
            { error: "Student verification required to view academic documents." },
            { status: 403 }
          );
        }

        const access = await prisma.resourceAccess.findUnique({
          where: {
            userId_resourceId: {
              userId: user.id,
              resourceId: resourceId,
            },
          },
        });

        if (!access || access.status !== "active") {
          return NextResponse.json(
            { error: "Access required. You have not unlocked this archive resource." },
            { status: 403 }
          );
        }
      }
    } else if (scope === "receipt_view") {
      // Must be admin OR owner of the order receipt
      if (!isAdmin) {
        const order = await prisma.order.findUnique({
          where: { id: resourceId },
        });
        if (!order || order.userId !== user.id) {
          return NextResponse.json({ error: "Forbidden access to receipt." }, { status: 403 });
        }
      }
    } else if (scope === "verification_view") {
      // Must be admin OR owner of the verification document
      if (!isAdmin) {
        const verification = await prisma.studentVerification.findUnique({
          where: { id: resourceId },
        });
        if (!verification || verification.userId !== user.id) {
          return NextResponse.json({ error: "Forbidden access to document." }, { status: 403 });
        }
      }
    }

    // Generate short-lived signed token (valid for 2 minutes)
    const token = await generateSignedAccessToken(user.id, resourceId, scope);

    return NextResponse.json({ token, expiresIn: 120 });
  } catch (error: unknown) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign access key." },
      { status: 500 }
    );
  }
}
