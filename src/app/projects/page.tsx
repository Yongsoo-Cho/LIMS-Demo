"use client";

import AuthLayout from "@/app/components/layouts/AuthLayout";
import { useState } from "react";
import { FaPlus, FaProjectDiagram, FaListUl } from "react-icons/fa";
import { Project } from "../types/project";
import ProjectList from "../components/ui/projects/ProjectList";
import ProjectFlow from "../components/ui/projects/ProjectFlow";
import NewProjectModal from "../components/ui/projects/modals/NewProjectModal";

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Find a lab space",
    description: "Reach out to the BI and beg.",
    status: "In Progress",
    assignees: ["Binjal P", "Bogdana B", "Alice P", "Arnica K"],
    due_date: "2025-04-15",
  },
  {
    id: "2",
    name: "Make Competent Cells",
    description: "The only thing I know we need to do when we go in lab.",
    status: "Planning",
    assignees: ["Lavan C", "Bohmie S"],
    due_date: "2025-04-30",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "flow">("list");

  return (
    <AuthLayout>
      <main className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6">
        <NewProjectModal isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Project Tracker</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "flow" : "list")}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 text-sm transition"
            >
              {viewMode === "list" ? (
                <>
                  <FaProjectDiagram /> Flow View
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

        {viewMode === "list" ? (
          <ProjectList projects={projects} />
        ) : (
          <ProjectFlow />
        )}
      </main>
    </AuthLayout>
  );
}
