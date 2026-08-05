import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Magic bytes → extension mapping for whitelisted image/PDF types
// ---------------------------------------------------------------------------
const MAGIC_BYTES: Record<string, readonly number[]> = {
  // JPEG: FF D8 FF
  ".jpg": [0xff, 0xd8, 0xff],
  // PNG: 89 50 4E 47
  ".png": [0x89, 0x50, 0x4e, 0x47],
  // WebP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
  ".webp": [0x52, 0x49, 0x46, 0x46],
  // PDF: 25 50 44 46
  ".pdf": [0x25, 0x50, 0x44, 0x46],
};

function detectExtension(buffer: Buffer): string | null {
  for (const [ext, sig] of Object.entries(MAGIC_BYTES)) {
    if (sig.every((byte, i) => buffer[i] === byte)) {
      // Extra check for WebP: bytes 8-11 must be "WEBP"
      if (ext === ".webp") {
        const webpTag = buffer.slice(8, 12).toString("ascii");
        if (webpTag !== "WEBP") continue;
      }
      return ext;
    }
  }
  return null;
}

function validateBuffer(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  return detectExtension(buffer);
}

// ---------------------------------------------------------------------------
// Shared upload core
// ---------------------------------------------------------------------------
async function saveUploadedFile(
  file: File,
  subdir: string,
  prefix: string,
): Promise<string | null> {
  if (!file || file.size === 0 || !file.name) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate via magic bytes
    const ext = validateBuffer(buffer);
    if (!ext) {
      console.error(`[UPLOAD REJECTED] Invalid magic bytes for ${prefix} upload, reported type: ${file.type}, name: ${file.name}`);
      return null;
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", subdir);
    await fs.mkdir(uploadDir, { recursive: true });

    // Always use random name + verified extension (ignores original filename)
    const uniqueName = `${prefix}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    await fs.writeFile(filePath, buffer);
    return `/uploads/${subdir}/${uniqueName}`;
  } catch (error) {
    console.error(`Error saving uploaded ${prefix} file:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function uploadCarImage(file: File): Promise<string | null> {
  return saveUploadedFile(file, "cars", "car");
}

export async function uploadIdentityImage(file: File): Promise<string | null> {
  return saveUploadedFile(file, "identities", "ktp");
}

export async function uploadPaymentProofImage(file: File): Promise<string | null> {
  return saveUploadedFile(file, "payments", "pay");
}

export async function deleteCarImage(imageUrl: string): Promise<void> {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cars");
    const resolved = path.resolve(process.cwd(), "public", imageUrl.replace(/^\//, ""));
    if (path.dirname(resolved).toLowerCase() !== uploadDir.toLowerCase()) return;
    await fs.unlink(resolved);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Error deleting image:", error);
    }
  }
}
