"use client";

import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { useEffect } from "react";
import { Project } from "@/app/types/project";
import { supabase } from "@/app/config/supabaseClient";
import { transformProjectToNode } from "./flowparts/Nodes";
import "@xyflow/react/dist/style.css";

type ProjectFlowProps = {
  projects: Project[];
  profiles?: Record<string, string>;
};

export default function ProjectFlow({ projects }: ProjectFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // Load only the nodes with coordinates initially
  useEffect(() => {
    const placedProjects = projects.filter((p) => p.coordinates !== null);
    const placedNodes = placedProjects.map(transformProjectToNode);
    setNodes(placedNodes);
  }, [projects]);

  // Drag/drop handler
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const projectId = event.dataTransfer.getData("application/project-id");
    if (!projectId) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    // Save coordinates to Supabase
    const { error } = await supabase
      .from("projects")
      .update({ coordinates: [position.x, position.y] })
      .eq("id", projectId);

    if (error) {
      console.error("Failed to update coordinates", error);
      return;
    }

    // Add to local canvas
    const newNode = transformProjectToNode({
      ...project,
      coordinates: [position.x, position.y],
    });

    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className="flex w-full h-[80vh] rounded-xl bg-white shadow border border-gray-200 overflow-hidden">
      {/* Sidebar */}
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
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/project-id", project.id);
                }}
                className={`text-sm px-3 py-2 select-none ${
                  placed
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-800 bg-white hover:bg-blue-50 cursor-move"
                } ${isFirst ? "rounded-t-md" : ""} ${isLast ? "rounded-b-md" : ""}`}
              >
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-gray-500">
                  {project.due_date
                    ? new Date(project.due_date).toLocaleDateString()
                    : "No due date"}
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Canvas */}
      <div
        className="flex-1"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} color="#f3f4f6" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
