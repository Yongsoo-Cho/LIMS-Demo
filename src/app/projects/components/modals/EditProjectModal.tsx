"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browserClient";
import { Project, TeamMember } from "@/app/types/project";
import MultiSelectCombobox from "../../../components/ui/MultiSelectCombobox";

type EditProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  profiles: TeamMember[];
  onSave?: () => void;
};

export default function EditProjectModal({
  isOpen,
  onClose,
  project,
  profiles,
  onSave,
}: EditProjectModalProps) {
  const supabase = createClient();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);
  const [assignees, setAssignees] = useState<TeamMember[]>(
    profiles.filter((p) => project.assignees.includes(p.id)),
  );

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Project name is required.");
      return;
    }

    if (!status) {
      alert("Project status is required.");
      return;
    }
    if (assignees.length === 0) {
      alert("At least one assignee is required.");
      return;
    }
    const { error } = await supabase
      .from("projects")
      .update({
        name,
        description,
        status,
        assignees: assignees.map((a) => a.id),
      })
      .eq("id", project.id);

    if (error) {
      alert("Error updating project: " + error.message);
    } else {
      onSave?.();
      onClose();
    }
  };
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      alert("Error deleting project: " + error.message);
    } else {
      onSave?.();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 space-y-6 shadow-lg border border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Edit Project
          </DialogTitle>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
            className="w-full border px-3 py-2 rounded-md text-sm"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            rows={3}
            className="w-full border px-3 py-2 rounded-md text-sm resize-none"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Assign Team Members
            </label>
            <MultiSelectCombobox
              options={profiles}
              selected={assignees}
              setSelected={setAssignees}
              placeholder="Select team members..."
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-4">
            <button
              onClick={handleDelete}
              className="text-sm px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
            >
              Delete Project
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="text-sm px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !status || assignees.length === 0}
                className={`text-sm px-4 py-2 rounded-md text-white transition ${
                  !name.trim() || !status || assignees.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
