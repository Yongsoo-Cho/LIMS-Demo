"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import MultiSelectCombobox from "./MultiSelectCombobox";
import LabeledInput from "./LabeledInput";
import { TeamMember } from "@/app/types/project";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browserClient";

const uploadFields = [
  { label: "SOP Upload", type: "file", accept: ".pdf,.doc,.docx" },
  {
    label: "Benchling Protocol Link",
    type: "url",
    placeholder: "https://benchling.com/...",
  },
];

type NewProjectDialogProps = {
  isOpen: boolean;
  projectName: string;
  onChange: (value: string) => void;
  assignees: TeamMember[];
  setAssignees: (value: TeamMember[]) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function NewProjectDialog({
  isOpen,
  projectName,
  onChange,
  assignees,
  setAssignees,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  description,
  setDescription,
  onClose,
  onSubmit,
}: NewProjectDialogProps) {
  const supabase = createClient();

  const [userOptions, setUserOptions] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name");

      if (error) {
        console.error("Error fetching users", error);
      } else {
        const mapped = (data || []).map((user) => ({
          id: user.id,
          name: user.display_name,
        }));
        setUserOptions(mapped);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-6">
        <DialogPanel className="w-full max-w-3xl space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
          {/* Row: Project Name + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Team Members
            </label>
            <MultiSelectCombobox
              options={userOptions}
              selected={assignees}
              setSelected={setAssignees}
              placeholder="Search team members..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short project description..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resources & Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadFields.map((field, idx) => (
                <LabeledInput key={idx} {...field} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Submit
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
