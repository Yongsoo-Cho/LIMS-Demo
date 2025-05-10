"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import { Project } from "../types/project";
import { ProfileInfo } from "../profiles/action";
import type { Database } from "@/lib/database.types";
import { revalidatePath } from "next/cache";

export async function fetchProjects(): Promise<Project[]> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase.from("projects").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProject(id: string): Promise<Project> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data ?? null;
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

export async function fetchProfilesByProject(
  projectId: string,
): Promise<Record<string, ProfileInfo>> {
  const supabase = await createSupabaseServerComponentClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("assignees")
    .eq("id", projectId)
    .single();

  if (projectError) throw new Error(projectError.message);
  if (!project || !project.assignees || project.assignees.length === 0)
    return {};

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, email")
    .in("id", project.assignees);

  if (profileError) throw new Error(profileError.message);

  const profileMap: Record<string, ProfileInfo> = {};
  for (const p of profiles || []) {
    profileMap[p.id] = {
      id: p.id,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
      email: p.email,
    };
  }

  return profileMap;
}

export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export async function fetchComments(project_id: string): Promise<Comment[]> {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      body,
      created_at,
      mentions,
      user_id,
      project_id,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq("project_id", project_id);

  if (error) throw new Error(error.message);

  return (data ?? []).map((c) => ({
    id: c.id,
    body: c.body,
    created_at: c.created_at,
    mentions: c.mentions,
    user_id: c.user_id,
    project_id: c.project_id,
    profiles: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles,
  }));
}

export async function postComment({
  project_id,
  body,
}: {
  project_id: string;
  body: string;
}) {
  const supabase = await createSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("comments").insert({
    project_id,
    body,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/projects/${project_id}`);
}