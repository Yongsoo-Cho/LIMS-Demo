"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import { Project } from "../types/project";

export async function fetchProjects(): Promise<Project[]> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase.from("projects").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProfiles(): Promise<Record<string, string>> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name");
  if (error) throw new Error(error.message);

  const profileMap: Record<string, string> = {};
  for (const profile of data || []) {
    profileMap[profile.id] = profile.display_name;
  }
  return profileMap;
}
