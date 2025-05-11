"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import type { Database } from "@/lib/database.types";

export type MinimalProfile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "display_name"
>;

export type ProfileInfo = Database["public"]["Tables"]["profiles"]["Row"];

export async function fetchTeamProfiles(): Promise<ProfileInfo[]> {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, email")
    .order("display_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
