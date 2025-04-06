"use client";

import AuthLayout from "@/app/components/layouts/AuthLayout";
import { useState } from "react";
import { FaPlus, FaProjectDiagram, FaListUl } from "react-icons/fa";
import { Project } from "../types/project";
import ProjectList from "../components/ui/projects/ProjectList";
import ProjectFlow from "../components/ui/projects/ProjectFlow";
import NewProjectModal from "../components/ui/projects/modals/NewProjectModal";
import { supabase } from "../config/supabaseClient";
import { useCachedFetch } from "../hooks/useCachedFetch";

import '@xyflow/react/dist/style.css';

export default function ProjectsPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "flow">("list");

  const {
    data: projects,
    loading: loadingProjects,
    refetch: refetchProjects,
  } = useCachedFetch<Project[]>("cached_projects", async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data;
  });

  const {
    data: profileData,
    loading: loadingProfiles,
    refetch: refetchProfiles,
  } = useCachedFetch<Record<string, string>>("cached_profiles", async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name");
    if (error) throw error;
    const profileMap: Record<string, string> = {};
    for (const profile of data || []) {
      profileMap[profile.id] = profile.display_name;
    }
    return profileMap;
  });

  const loading = loadingProjects || loadingProfiles;

  return (
    <AuthLayout>
      <main className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6">
        <NewProjectModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={() => {
            refetchProjects();
            refetchProfiles();
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Project Tracker</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "flow" : "list")}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 text-sm transition"
            >
              {viewMode === "list" ? (
                <>
                  <FaProjectDiagram /> Flow Editor
                </>
              ) : (
                <>
                  <FaListUl /> List View
                </>
              )}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm shadow"
            >
              <FaPlus className="text-sm" /> New Project
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : viewMode === "list" ? (
          <ProjectList
            projects={projects || []}
            profiles={profileData || {}}
            refetchProjects={refetchProjects}
          />
        ) : (
          <ProjectFlow projects={projects || []} profiles={profileData || {}} />
        )}
      </main>
    </AuthLayout>
  );
}
