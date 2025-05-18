"use client";

import { useState } from "react";

const statusColor = {
  Planning: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
};
import { FaChevronDown } from "react-icons/fa"; // Import an arrow icon
import { updateProjectStatus } from "../action";

export default function StatusCard({
  status,
  projectId,
}: {
  status: string;
  projectId: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as
      | "Planning"
      | "In Progress"
      | "Completed";
    setCurrentStatus(newStatus);
    setSaving(true);

    try {
      await updateProjectStatus({ projectId, status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Status</h3>
      <div className="relative w-fit">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={saving}
          className={`appearance-none text-base pr-10 border border-gray-300 rounded-md px-3 py-1 focus:outline-none ${statusColor[currentStatus as keyof typeof statusColor]}`}
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <FaChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs ${statusColor[currentStatus as keyof typeof statusColor]}`}
        />
      </div>
    </div>
  );
}
