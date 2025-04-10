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

// add further when migrating
// import type { Database } from "@/lib/database.types";
// export type MinimalProfile = Pick<
//   Database['public']['Tables']['profiles']['Row'],
//   'id' | 'display_name'
// >;

// export type MinimalProject = Pick<
//   Database['public']['Tables']['projects']['Row'],
//   'id' | 'description' | 'name' | 'status' | 'due_date' | 'assignees'
// >;
