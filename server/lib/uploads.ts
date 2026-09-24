import multer from "multer";
import { nanoid } from "nanoid";
import { dbError, getSupabase } from "./supabase";

const BUCKET = "uploads";
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

// Serverless functions have a read-only filesystem outside /tmp and no shared disk between
// invocations, so files are held in memory just long enough to forward to Supabase Storage.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(Object.assign(new Error("Unsupported file type. Please upload a JPEG, PNG, WebP, GIF or SVG image."), { status: 400 }));
      return;
    }
    cb(null, true);
  },
});

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  const dot = file.originalname.lastIndexOf(".");
  const ext = dot === -1 ? "" : file.originalname.slice(dot).toLowerCase();
  const filename = `${nanoid()}${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file.buffer, {
    contentType: file.mimetype,
    cacheControl: "31536000",
  });
  if (error) throw dbError(error);

  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}
