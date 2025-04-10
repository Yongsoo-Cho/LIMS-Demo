"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "./flowparts/DnDContext";
import { Project } from "@/app/types/project";
import InnerProjectFlow from "./flowparts/InnerProjectFlow";

type ProjectFlowProps = {
  projects: Project[];
  profiles: Record<string, string>;
};

export default function ProjectFlow({ projects, profiles }: ProjectFlowProps) {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <InnerProjectFlow projects={projects} profiles={profiles} />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
