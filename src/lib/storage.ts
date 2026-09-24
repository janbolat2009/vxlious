import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

const STORAGE_ROOT = path.resolve(process.cwd(), "data", "storage");
const PRIVATE_DIR = path.join(STORAGE_ROOT, "private");
const FOLDERS = {
  resources: path.join(PRIVATE_DIR, "resources"),
  receipts: path.join(PRIVATE_DIR, "receipts"),
  verifications: path.join(PRIVATE_DIR, "verifications"),
};

// Ensure private storage directories exist
export function initStorage() {
  for (const dir of Object.values(FOLDERS)) {
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
    }
  }
}

// Secret for signing short-lived access tokens
const TOKEN_SECRET = new TextEncoder().encode(
  (process.env.JWT_SECRET || "vxlious-academic-archive-secret-key-super-secure-production-2026") + "_storage"
);

export type StorageCategory = "resources" | "receipts" | "verifications";

const ALLOWED_MIME_TYPES: Record<StorageCategory, string[]> = {
  resources: ["application/pdf"],
  receipts: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  verifications: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};

const MAX_SIZES: Record<StorageCategory, number> = {
  resources: 50 * 1024 * 1024, // 50 MB
  receipts: 15 * 1024 * 1024,  // 15 MB
  verifications: 15 * 1024 * 1024, // 15 MB
};

/**
 * Save an uploaded buffer securely into private storage
 */
export async function savePrivateFile(
  category: StorageCategory,
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<{ storageKey: string; fileSize: number; sanitizedName: string }> {
  initStorage();

  // Validate MIME type
  const allowed = ALLOWED_MIME_TYPES[category];
  if (!allowed.includes(mimeType.toLowerCase())) {
    throw new Error(`Invalid file type: ${mimeType}. Allowed: ${allowed.join(", ")}`);
  }

  // Validate Size
  if (fileBuffer.length > MAX_SIZES[category]) {
    throw new Error(`File exceeds maximum size of ${MAX_SIZES[category] / (1024 * 1024)}MB`);
  }

  // Extract safe extension
  const ext = path.extname(originalFilename).toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9.]/g, "") || (mimeType === "application/pdf" ? ".pdf" : ".bin");

  // Generate non-guessable storage key (UUID + hash)
  const uniqueId = crypto.randomUUID();
  const safeFilename = `${uniqueId}${safeExt}`;
  const targetDir = FOLDERS[category];
  const fullPath = path.join(targetDir, safeFilename);

  // Guard against path traversal
  if (!fullPath.startsWith(targetDir)) {
    throw new Error("Invalid storage path destination");
  }

  await fs.writeFile(fullPath, fileBuffer);

  return {
    storageKey: `${category}/${safeFilename}`,
    fileSize: fileBuffer.length,
    sanitizedName: path.basename(originalFilename).replace(/[^a-zA-Z0-9._-]/g, "_"),
  };
}

/**
 * Resolve full path and check existence
 */
export function getPrivateFilePath(storageKey: string): string {
  // Disallow parent directory navigation
  if (storageKey.includes("..") || storageKey.startsWith("/")) {
    throw new Error("Invalid storage key");
  }

  const fullPath = path.join(PRIVATE_DIR, storageKey);
  if (!fullPath.startsWith(PRIVATE_DIR)) {
    throw new Error("Directory traversal detected");
  }

  if (!fsSync.existsSync(fullPath)) {
    throw new Error("File not found in private storage");
  }

  return fullPath;
}

/**
 * Generate a short-lived cryptographically signed access token (valid 120 seconds)
 * Tied specifically to userId, resourceId, and scope
 */
export async function generateSignedAccessToken(
  userId: string,
  resourceId: string,
  scope: "pdf_view" | "receipt_view" | "verification_view"
): Promise<string> {
  return new SignJWT({ userId, resourceId, scope })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2m") // Expires in 2 minutes
    .sign(TOKEN_SECRET);
}

/**
 * Verify signed temporary token
 */
export async function verifySignedAccessToken(
  token: string,
  expectedResourceId: string,
  expectedScope: "pdf_view" | "receipt_view" | "verification_view"
): Promise<{ userId: string; resourceId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, TOKEN_SECRET);
    if (
      payload.resourceId !== expectedResourceId ||
      payload.scope !== expectedScope
    ) {
      return null;
    }
    return {
      userId: payload.userId as string,
      resourceId: payload.resourceId as string,
    };
  } catch {
    return null;
  }
}
