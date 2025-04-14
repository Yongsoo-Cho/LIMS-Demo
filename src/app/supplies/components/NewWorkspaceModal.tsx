"use client";

import { useState } from "react";
import { insertWorkspace } from "../action";

type NewWorkspaceModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
};

export default function NewWorkspaceModal({
  isOpen,
  setIsOpen,
  onSuccess,
}: NewWorkspaceModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a workspace title.");
      return;
    }

    try {
      await insertWorkspace({ title, description });
      handleClose();
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error creating workspace: ${err.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800">New Workspace</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="e.g. Buffers, General Storage, Enzymes"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
            rows={4}
            placeholder="Optional description for this workspace"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
