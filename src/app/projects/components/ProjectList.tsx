"use client";

import { Project } from "@/app/types/project";
import { FaBars, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatDate } from "../utils";

const statusColor = {
  Planning: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
};

type ProjectListProps = {
  projects: Project[];
  profiles: Record<string, string>; // userId -> display_name
};

export default function ProjectList({ projects, profiles }: ProjectListProps) {
  const router = useRouter();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="relative border border-gray-200 rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="absolute top-3 right-3">
            <button
              onClick={() => router.push(`/projects/${project.id}`)}
              className="text-gray-400 hover:text-blue-600 transition"
              title="More Info"
            >
              <FaBars className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {project.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {project.description.length > 150
                ? project.description.slice(0, 150) + "..."
                : project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto pr-1">
              {project.assignees.map((assignee) => (
                <span
                  key={assignee}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                >
                  <FaUser className="text-gray-500 text-xs" />
                  {profiles[assignee]}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
            <span
              className={`px-2 py-1 rounded-md font-medium ${statusColor[project.status]}`}
            >
              {project.status}
            </span>
            <span className="text-gray-400">{formatDate(project.start_date)} – {formatDate(project.end_date)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
