import type { Edge } from '@xyflow/react';
import type { Project } from '@/app/types/project';

export const generateEdgesFromProjects = (
  projects: (Project & { x: number; y: number; next?: string[] })[]
): Edge[] => {
  const edges: Edge[] = [];

  for (const project of projects) {
    if (project.next) {
      for (const targetId of project.next) {
        edges.push({
          id: `e-${project.id}-${targetId}`,
          source: project.id,
          target: targetId,
          label: 'Next Step',
          style: { stroke: '#cbd5e1' },
          labelStyle: { fill: '#64748b', fontSize: 12 },
        });
      }
    }
  }

  return edges;
};