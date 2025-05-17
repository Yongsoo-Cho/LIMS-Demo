import { Project } from "@/app/types/project";
//import { useDnD } from "./DnDContext";
import type { DragEvent as ReactDragEvent } from "react";
import { formatDate } from "../../utils";

interface SidebarProps {
  projects: Project[];
}

export default function Sidebar({ projects }: SidebarProps) {
  // const [_, setType] = useDnD();

  const onDragStart = (
    event: ReactDragEvent<HTMLLIElement>,
    projectId: string,
  ) => {
    event.dataTransfer.setData("application/project-id", projectId);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Available Projects
      </h2>
      <ul className="space-y-1">
        {projects.map((project, index) => {
          const placed = project.coordinates !== null;
          const isFirst = index === 0;
          const isLast = index === projects.length - 1;

          return (
            <li
              key={project.id}
              draggable={!placed}
              onDragStart={(e) => !placed && onDragStart(e, project.id)}
              className={`text-sm px-3 py-2 select-none transition ${
                placed
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-800 bg-white hover:bg-blue-50 cursor-move"
              } ${isFirst ? "rounded-t-md" : ""} ${
                isLast ? "rounded-b-md" : ""
              }`}
            >
              <div className="font-medium">{project.name}</div>
              <div className="text-xs text-gray-500">
                {project.start_date && project.end_date ? (
                  <>
                    {formatDate(project.start_date)} – {formatDate(project.end_date)}
                  </>
                ) : (
                  "No date range"
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
