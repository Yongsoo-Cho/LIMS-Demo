"use client";

import { useState } from "react";

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
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setSaving(true);

    try {
      const res = await fetch("/api/updateProjectStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
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
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={saving}
        className="text-gray-800 text-base border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
}