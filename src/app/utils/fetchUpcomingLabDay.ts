"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import { ProfileInfo } from "../profiles/action";

export type UpcomingLabEntry = {
  id: string;
  name: string;
  start_date: string;
  assignees: ProfileInfo[];
};

export async function fetchUpcomingLabDay(): Promise<{
  start_date: string | null;
  projects: UpcomingLabEntry[];
}> {
  const supabase = await createSupabaseServerComponentClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, start_date, assignees")
    .gte("start_date", today)
    .order("start_date", { ascending: true });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return { start_date: null, projects: [] };

  const closestDate = data[0].start_date;
  const projectsForThatDay = data.filter((p) => p.start_date === closestDate);

  const assigneeIds = [
    ...new Set(projectsForThatDay.flatMap((p) => p.assignees ?? [])),
  ];
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", assigneeIds);

  if (profileError) throw new Error(profileError.message);

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p])
  );

  const enrichedProjects: UpcomingLabEntry[] = projectsForThatDay.map((p) => ({
    ...p,
    assignees: (p.assignees ?? []).map((id: string) => profileMap[id]).filter(Boolean),
  }));

  return {
    start_date: closestDate,
    projects: enrichedProjects,
  };
}