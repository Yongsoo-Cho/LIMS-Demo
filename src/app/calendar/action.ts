"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";

export async function fetchProjectsWithAssignees() {
  const supabase = await createSupabaseServerComponentClient();

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("*");

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name");

  if (projectError || profileError) {
    console.error("Error fetching data:", projectError || profileError);
    return { projects: [], profileMap: {} };
  }

  const profileMap: Record<string, string> = {};
  for (const profile of profiles || []) {
    profileMap[profile.id] = profile.display_name;
  }

  return { projects: projects || [], profileMap };
}
