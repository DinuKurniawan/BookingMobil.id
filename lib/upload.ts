// ---------------------------------------------------------------------------
// Magic bytes → extension mapping for whitelisted image types
// ---------------------------------------------------------------------------
const MAGIC_BYTES: Record<string, readonly number[]> = {
  ".jpg": [0xff, 0xd8, 0xff],
  ".png": [0x89, 0x50, 0x4e, 0x47],
  ".webp": [0x52, 0x49, 0x46, 0x46],
};

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function detectExtension(buffer: Buffer): string | null {
  for (const [ext, sig] of Object.entries(MAGIC_BYTES)) {
    if (sig.every((byte, i) => buffer[i] === byte)) {
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
// Convert file to base64 data URL (works on Vercel serverless, no filesystem needed)
// ---------------------------------------------------------------------------
async function fileToDataUrl(file: File): Promise<string | null> {
  if (!file || file.size === 0 || !file.name) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = validateBuffer(buffer);
    if (!ext) {
      console.error(
        `[UPLOAD REJECTED] Invalid magic bytes, reported type: ${file.type}, name: ${file.name}`,
      );
      return null;
    }

    const mime = MIME_MAP[ext] || file.type || "image/jpeg";
    const base64 = buffer.toString("base64");
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.error("Error converting file to data URL:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function uploadCarImage(file: File): Promise<string | null> {
  return fileToDataUrl(file);
}

export async function uploadIdentityImage(file: File): Promise<string | null> {
  return fileToDataUrl(file);
}

export async function uploadPaymentProofImage(file: File): Promise<string | null> {
  return fileToDataUrl(file);
}

export async function deleteCarImage(_imageUrl: string): Promise<void> {
  // No-op: data URLs are stored inline, no external storage to clean up
}
