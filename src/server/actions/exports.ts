"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireRole } from "@/server/queries/auth";
import type { ExportFormat, ExportPlayerFilters, ExportType } from "@/types/database";

export async function createExportJob(input: {
  exportType: ExportType;
  fileFormat: ExportFormat;
  filters?: ExportPlayerFilters;
}) {
  const profile = await requireRole(["admin"]);
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("export_jobs")
    .insert({
      requested_by_user_id: profile.id,
      export_type: input.exportType,
      file_format: input.fileFormat,
      filters_json: input.filters ?? {},
      status: "pending",
    })
    .select("id, status, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
