import { createClient } from '@/lib/supabase/client';

export interface UploadFileInput {
  matchId: string;
  teamId: string;
  file: File;
}

export interface StoredFileMeta {
  fileName: string;
  fileUrl: string;
  fileType: string;
  storagePath: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export function validateTeamSheetFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, WEBP, and PDF team sheet files are allowed.');
  }
}

export function buildTeamSheetStoragePath(params: {
  season: string;
  matchId: string;
  teamId: string;
  fileName: string;
}): string {
  const safeName = params.fileName.replace(/\s+/g, '-').toLowerCase();
  return `team-sheets/${params.season}/${params.matchId}/${params.teamId}/${safeName}`;
}

export async function uploadTeamSheet(input: UploadFileInput): Promise<StoredFileMeta> {
  validateTeamSheetFile(input.file);

  const supabase = createClient();
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `${Date.now()}-${input.file.name}`;
  const storagePath = buildTeamSheetStoragePath({
    season: timestamp,
    matchId: input.matchId,
    teamId: input.teamId,
    fileName,
  });

  const { error } = await supabase.storage.from('team-sheets').upload(storagePath, input.file, {
    cacheControl: '3600',
    upsert: false,
    contentType: input.file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('team-sheets').getPublicUrl(storagePath);

  return {
    fileName,
    fileUrl: data.publicUrl,
    fileType: input.file.type,
    storagePath,
  };
}
