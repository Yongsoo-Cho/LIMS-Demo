"use client";

import { useState } from "react";

export default function DueDateCard({
  date,
  projectId,
}: {
  date: string;
  projectId: string;
}) {
  const [dueDate, setDueDate] = useState(date);
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    setSaving(true);

    try {
      const res = await fetch("/api/updateProjectDate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, date: newDate }),
      });
      if (!res.ok) throw new Error("Failed to update due date");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the due date.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Due Date</h3>
      <input
        type="date"
        value={dueDate}
        onChange={handleChange}
        disabled={saving}
        className="w-full text-base border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}