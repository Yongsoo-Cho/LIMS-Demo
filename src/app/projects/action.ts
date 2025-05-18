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
    .select(
      `
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
    `,
    )
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

type UpdateProjectStatusInput = {
  projectId: string;
  status: "Planning" | "In Progress" | "Completed";
};

export async function updateProjectStatus({
  projectId,
  status,
}: UpdateProjectStatusInput) {
  const supabase = await createSupabaseServerComponentClient();

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);

  if (error) throw new Error(error.message);
}

type UpdateProjectDateInput = {
  projectId: string;
  start_date?: string;
  end_date?: string;
};

export async function updateProjectDate({
  projectId,
  start_date,
  end_date,
}: UpdateProjectDateInput) {
  const supabase = await createSupabaseServerComponentClient();

  const updatePayload: Record<string, string> = {};
  if (start_date) updatePayload["start_date"] = start_date;
  if (end_date) updatePayload["end_date"] = end_date;

  const { error } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", projectId);

  if (error) throw new Error(error.message);
}

export async function updateProjectAssignees({
  projectId,
  assignees,
}: {
  projectId: string;
  assignees: string[];
}) {
  const supabase = await createSupabaseServerComponentClient();
  const { error } = await supabase
    .from("projects")
    .update({ assignees })
    .eq("id", projectId);
  if (error) throw new Error(error.message);
}

export async function updateProjectName({
  projectId,
  name,
}: {
  projectId: string;
  name: string;
}) {
  const supabase = await createSupabaseServerComponentClient();
  const { error } = await supabase
    .from("projects")
    .update({ name })
    .eq("id", projectId);
  if (error) throw new Error(error.message);
}

export async function updateProjectDescription({
  projectId,
  description,
}: {
  projectId: string;
  description: string;
}) {
  const supabase = await createSupabaseServerComponentClient();

  const { error } = await supabase
    .from("projects")
    .update({ description })
    .eq("id", projectId);

  if (error) throw new Error(error.message);
}

export async function deleteProject({ projectId }: { projectId: string }) {
  const supabase = await createSupabaseServerComponentClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  return { success: true };
}

export async function updateComment({
  id,
  body,
}: {
  id: number;
  body: string;
}) {
  const supabase = await createSupabaseServerComponentClient();
  const { error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteComment({ id }: { id: number }) {
  const supabase = await createSupabaseServerComponentClient();
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type FileEntry = {
  name: string;
  signedUrl: string;
};

export async function listProjectFiles(
  projectId: string,
): Promise<FileEntry[]> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase.storage
    .from("project-files")
    .list(projectId, { limit: 100 });

  if (error) {
    console.error("Failed to list files:", error.message);
    return [];
  }

  const signedFiles: FileEntry[] = await Promise.all(
    data.map(async (file) => {
      const { data: signed, error: signedError } = await supabase.storage
        .from("project-files")
        .createSignedUrl(`${projectId}/${file.name}`, 60 * 60); // 1 hour

      if (signedError) {
        console.error(
          `Error generating signed URL for ${file.name}:`,
          signedError.message,
        );
      }

      return {
        name: file.name,
        signedUrl: signed?.signedUrl || "#",
      };
    }),
  );

  return signedFiles;
}

export async function uploadProjectFile(
  projectId: string,
  file: File,
): Promise<string | null> {
  const supabase = await createSupabaseServerComponentClient();
  const path = `${projectId}/${file.name}`;

  const { error } = await supabase.storage
    .from("project-files")
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  return file.name;
}

export async function deleteProjectFile(
  projectId: string,
  fileName: string,
): Promise<boolean> {
  const supabase = await createSupabaseServerComponentClient();
  const { error } = await supabase.storage
    .from("project-files")
    .remove([`${projectId}/${fileName}`]);

  if (error) {
    console.error("Delete failed:", error.message);
    return false;
  }

  return true;
}

export async function renameProjectFile(
  projectId: string,
  oldName: string,
  newName: string,
) {
  const supabase = await createSupabaseServerComponentClient();
  const oldPath = `${projectId}/${oldName}`;
  const newPath = `${projectId}/${newName}`;

  const { data: download, error: downloadError } = await supabase.storage
    .from("project-files")
    .download(oldPath);

  if (downloadError || !download) {
    console.error("Download failed:", downloadError?.message);
    return false;
  }

  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(newPath, download, { upsert: true });

  if (uploadError) {
    console.error("Re-upload failed:", uploadError.message);
    return false;
  }

  const { error: deleteError } = await supabase.storage
    .from("project-files")
    .remove([oldPath]);

  if (deleteError) {
    console.error("Delete failed:", deleteError.message);
    return false;
  }

  return true;
}

export type ExtractionResult = {
  success: boolean;
  parsedText?: string;
  error?: string;
};

export async function handleExtractFromPDF(
  projectId: string,
  fileName: string,
): Promise<ExtractionResult> {
  try {
    const res = await fetch("/api/parseMaterials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, fileName }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error:", errorText);
      return { success: false, error: "Failed to extract materials." };
    }

    const data = await res.json();

    return {
      success: true,
      parsedText: data.parsedText,
    };
  } catch (err) {
    console.error("Network or unexpected error:", err);
    return { success: false, error: "Network error or unexpected failure." };
  }
}
