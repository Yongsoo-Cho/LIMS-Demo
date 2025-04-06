"use client";

import {
  ReactFlow,
  Background,
  useReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  Connection,
  addEdge,
} from "@xyflow/react";
import { useEffect, useCallback, useRef } from "react";
import { Project } from "@/app/types/project";
import { transformProjectToNode } from "./Nodes";
import Sidebar from "./Sidebar";
import DownloadButton from "./DownloadButton";

type InnerFlowProps = {
  projects: Project[];
};

export default function InnerProjectFlow({ projects }: InnerFlowProps) {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const projectId = event.dataTransfer.getData("application/project-id");
      if (!projectId) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const project = projects.find((p) => p.id == projectId);
      if (!project) return;

      const newNode = transformProjectToNode({
        ...project,
        coordinates: [position.x, position.y]
      });

      setNodes((nds) => [...nds, newNode]);
    },
    [projects, nodes, screenToFlowPosition]
  );

  useEffect(() => {
    const placedProjects = projects.filter((p) => p.coordinates !== null);
    const placedNodes = placedProjects.map(transformProjectToNode);
    setNodes(placedNodes);
  }, [projects]);

  return (
    <div className="flex w-full h-[80vh] rounded-xl bg-white shadow border border-gray-200 overflow-hidden">
      <Sidebar projects={projects} />
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="download-image"
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <DownloadButton />
        </ReactFlow>
      </div>
    </div>
  );
}