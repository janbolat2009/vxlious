import { NextRequest, NextResponse } from "next/server";
import { verifySignedAccessToken, getPrivateFilePath } from "@/lib/storage";
import prisma from "@/lib/prisma";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const resourceId = searchParams.get("resourceId");
    const scope = (searchParams.get("scope") as "pdf_view" | "receipt_view" | "verification_view") || "pdf_view";

    if (!token || !resourceId) {
      return new NextResponse("Unauthorized: Missing access credentials.", { status: 401 });
    }

    // Verify cryptographic token & expiration
    const verified = await verifySignedAccessToken(token, resourceId, scope);
    if (!verified) {
      return new NextResponse("Forbidden: Access token has expired or is invalid.", { status: 403 });
    }

    let storageKey = "";
    let mimeType = "application/pdf";
    let downloadFilename = "vxlious-document.pdf";

    if (scope === "pdf_view") {
      const resource = await prisma.resource.findUnique({
        where: { id: resourceId },
      });
      if (!resource) {
        return new NextResponse("Not Found: Resource does not exist.", { status: 404 });
      }
      storageKey = resource.filePath;
      downloadFilename = resource.fileName || "vxlious-archive.pdf";
      mimeType = "application/pdf";
    } else if (scope === "receipt_view") {
      const receipt = await prisma.paymentReceipt.findUnique({
        where: { orderId: resourceId },
      });
      if (!receipt) {
        return new NextResponse("Not Found: Receipt document not found.", { status: 404 });
      }
      storageKey = receipt.filePath;
      downloadFilename = receipt.originalName || "receipt";
      mimeType = receipt.mimeType;
    } else if (scope === "verification_view") {
      const verification = await prisma.studentVerification.findUnique({
        where: { id: resourceId },
      });
      if (!verification) {
        return new NextResponse("Not Found: Verification document not found.", { status: 404 });
      }
      storageKey = verification.documentPath;
      downloadFilename = verification.documentName || "student-verification";
      mimeType = verification.mimeType;
    }

    // Get physical path securely
    const filePath = getPrivateFilePath(storageKey);
    const fileStat = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    // Convert node readstream to web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new NextResponse(readable, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": fileStat.size.toString(),
        "Content-Disposition": `inline; filename="${encodeURIComponent(downloadFilename)}"`,
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error: unknown) {
    console.error("Stream error:", error);
    return new NextResponse("Internal Server Error while streaming document.", { status: 500 });
  }
}
