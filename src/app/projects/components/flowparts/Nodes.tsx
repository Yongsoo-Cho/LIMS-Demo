import type { Node } from "@xyflow/react";
import { Project } from "@/app/types/project";
import Link from "next/link";

export const baseNodeStyle = {
  padding: 20,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  width: 280,
};

export const transformProjectToNode = (
  project: Project,
  profiles: Record<string, string>,
): Node => ({
  id: project.id + "",
  position: {
    x: project.coordinates?.[0] || 0,
    y: project.coordinates?.[1] || 0,
  },
  data: {
    label: (
      <div className="flex flex-col gap-3 text-left">
        <div>
          <h3 className="text-base font-semibold text-gray-900 leading-snug">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              project.status === "Completed"
                ? "bg-green-100 text-green-800"
                : project.status === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {project.status}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            Due: {project.due_date}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {project.assignees.map((id, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {profiles[id]}
            </span>
          ))}
        </div>

        <Link href={`/projects/${project.id}`}>
          <button className="w-fit text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 transition hover:underline">
            View Details →
          </button>
        </Link>
      </div>
    ),
  },
  style: baseNodeStyle,
});
