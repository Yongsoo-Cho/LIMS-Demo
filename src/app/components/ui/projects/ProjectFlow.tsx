'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import { initialNodes as baseNodes } from './flowparts/Nodes';
import { generateEdgesFromProjects } from './flowparts/Edges';
import { projectConfigs } from './flowparts/Nodes';
import '@xyflow/react/dist/style.css';

const baseEdges = generateEdgesFromProjects(projectConfigs);

export default function ProjectFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);

  return (
    <div className="w-full h-[80vh] rounded-xl bg-white shadow border border-gray-200">
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
  );
}