"use client";

import { useState } from "react";
import { updateProjectName } from "../action";

export default function ProjectNameCard({
  name,
  projectId,
}: {
  name: string;
  projectId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!projectName.trim()) return;
    setSaving(true);
    try {
      await updateProjectName({ projectId, name: projectName });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the project name.");
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    setProjectName(name);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl">
      {isEditing ? (
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-3xl font-bold text-gray-900 tracking-tight border px-3 py-2 rounded focus:outline-none focus:ring-0 min-w-0 flex-grow"
            style={{ maxWidth: "100%" }}
          />
          <button
            onClick={handleCancel}
            className="text-base px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !projectName.trim()}
            className={`text-base px-4 py-2 rounded-md text-white transition ${
              saving || !projectName.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-600"
            }`}
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-3xl font-bold text-gray-900 tracking-tight p-3 bg-transparent hover:bg-gray-200 rounded-sm transition duration-100"
        >
          {projectName}
        </button>
      )}
    </div>
  );
}
