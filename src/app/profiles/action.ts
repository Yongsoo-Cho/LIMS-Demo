"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import type { Database } from "@/lib/database.types";

export type MinimalProfile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "display_name" | "avatar_url"
>;

export async function fetchTeamProfiles(): Promise<MinimalProfile[]> {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .order("display_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
