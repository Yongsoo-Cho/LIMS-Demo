"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import { Database } from "@/lib/database.types";

export type SupplyFolder = Pick<
  Database["public"]["Tables"]["supplies"]["Row"],
  "id" | "title" | "created_at" | "description"
>;

export type WorkspaceInput = {
  title: string;
  description?: string;
};

export async function fetchWorkspaces(): Promise<SupplyFolder[]> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("supplies")
    .select("id, title, created_at, description");
  if (error) throw new Error(error.message);
  return data ?? [];
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

// npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > database.types.ts
