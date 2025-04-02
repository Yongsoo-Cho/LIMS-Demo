import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import MultiSelectCombobox from "../../MultiSelectCombobox";
import LabeledInput from "./LabeledInput";
import { ProjectAssignee } from "@/app/types/project";

const uploadFields = [
  { label: "SBOL Upload", type: "file", accept: ".xml,.sbol" },
  { label: "SOP Upload", type: "file", accept: ".pdf,.doc,.docx" },
  {
    label: "Benchling Protocol Link",
    type: "url",
    placeholder: "https://benchling.com/...",
  },
  {
    label: "Google Doc Link",
    type: "url",
    placeholder: "https://docs.google.com/...",
  },
];

type NewProjectDialogProps = {
  isOpen: boolean;
  projectName: string;
  onChange: (value: string) => void;
  assignees: ProjectAssignee[];
  setAssignees: (value: ProjectAssignee[]) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function NewProjectDialog({
  isOpen,
  projectName,
  onChange,
  assignees,
  setAssignees,
  onClose,
  onSubmit,
}: NewProjectDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-6">
        <DialogPanel className="w-full max-w-3xl space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-200">
          {/* Title */}
          <DialogTitle as="div">
            <input
              type="text"
              placeholder="Project Name..."
              value={projectName}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 placeholder-gray-400"
            />
          </DialogTitle>

          {/* Instructions */}
          <p className="text-sm text-gray-500">
            Upload relevant files and links for the protocol execution. All
            resources will be saved as part of this project.
          </p>

          {/* Upload Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadFields.map((field, idx) => (
              <LabeledInput key={idx} {...field} />
            ))}
          </div>

          {/* Day in Lab */}
          <LabeledInput label="Day in Lab" type="date" />

          {/* Assignees */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Assign Team Members
            </label>
            <MultiSelectCombobox
              options={dummy}
              selected={assignees}
              setSelected={setAssignees}
              placeholder="Search team members..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 pt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-md border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-5 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            >
              Submit
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

const dummy = [
  { id: "1", name: "Yongsoo" },
  { id: "2", name: "Mike" },
  { id: "3", name: "Cho" },
  { id: "4", name: "Miek" },
];
