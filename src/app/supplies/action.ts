"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import { Database } from "@/lib/database.types";

export type SupplyFolder = Pick<
  Database["public"]["Tables"]["supplies"]["Row"],
  "id" | "title" | "created_at" | "description" | "metadata"
>;

export type WorkspaceInput = {
  title: string;
  description?: string;
};

export async function fetchWorkspaces(): Promise<SupplyFolder[]> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("supplies")
    .select("id, title, created_at, description, metadata");
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function fetchWorkspace(id: string): Promise<SupplyFolder> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("supplies")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data ?? {};
}

export async function insertWorkspace({
  title,
  description = "",
}: WorkspaceInput) {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("supplies")
    .insert([
      {
        title,
        description,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export type WorkspaceMetadata = {
  headers: string[];
  types: string[];
  rows: string[][];
  dims: [number, number];
};

export type UpdateWorkspaceMetadataInput = {
  id: string;
  metadata: WorkspaceMetadata;
};

export async function updateWorkspaceMetadata({
  id,
  metadata,
}: UpdateWorkspaceMetadataInput) {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("supplies")
    .update({ metadata })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
// npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > database.types.ts
