import { supabase } from "./supabase";

const BUCKET_NAME = "team-sheets";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function validateTeamSheetFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and PDF team sheet files are allowed.");
  }
}

export async function uploadTeamSheet(
  file: File,
  matchId: string,
  teamId: string,
  seasonId?: string
): Promise<{ fileName: string; fileUrl: string; fileType: string }> {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${seasonId ?? "default"}/${matchId}/${teamId}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    fileName: file.name,
    fileUrl: publicUrl,
    fileType: file.type,
  };
}

export async function deleteTeamSheet(fileUrl: string): Promise<void> {
  const path = fileUrl.split(`${BUCKET_NAME}/`)[1];
  if (!path) throw new Error("Invalid file URL");

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function getTeamSheetDownloadUrl(
  fileUrl: string
): Promise<string> {
  const path = fileUrl.split(`${BUCKET_NAME}/`)[1];
  if (!path) throw new Error("Invalid file URL");

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    throw new Error(`Download URL failed: ${error.message}`);
  }

  return data.signedUrl;
}
