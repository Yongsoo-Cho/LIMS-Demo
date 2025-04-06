import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { Project } from "@/app/types/project";

type ProfilesType = Record<string, string>;
type ProjectsType = Project[];

interface ProjectContextType {
  projects: ProjectsType;
  setProjects: Dispatch<SetStateAction<ProjectsType>>;
  profiles: ProfilesType;
  setProfiles: Dispatch<SetStateAction<ProfilesType>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
  initialProjects?: ProjectsType;
  initialProfiles?: ProfilesType;
}

export const ProjectProvider = ({
  children,
  initialProjects = [],
  initialProfiles = {},
}: ProjectProviderProps) => {
  const [projects, setProjects] = useState<ProjectsType>(initialProjects);
  const [profiles, setProfiles] = useState<ProfilesType>(initialProfiles);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        profiles,
        setProfiles,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
