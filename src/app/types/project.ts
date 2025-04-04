export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Planning" | "In Progress" | "Completed";
  assignees: string[];
  due_date: string;
  coordinates?: [number, number];
}

export type TeamMember = {
  id: string;
  name: string;
};

export type MultiSelectComboboxProps = {
  options: TeamMember[];
  selected: TeamMember[];
  setSelected: (value: TeamMember[]) => void;
  placeholder?: string;
};
