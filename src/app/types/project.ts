export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Planning" | "In Progress" | "Completed";
  assignees: string[];
  due_date: string;
}

export type ProjectAssignee = {
  id: string;
  name: string;
};

export type MultiSelectComboboxProps = {
  options: ProjectAssignee[];
  selected: ProjectAssignee[];
  setSelected: (value: ProjectAssignee[]) => void;
  placeholder?: string;
};
