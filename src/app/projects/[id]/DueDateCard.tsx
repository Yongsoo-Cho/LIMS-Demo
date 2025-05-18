"use client";

import { useState } from "react";
import { updateProjectDate } from "../action";

export default function DateRangeCard({
  start_date,
  end_date,
  projectId,
}: {
  start_date: string;
  end_date: string;
  projectId: string;
}) {
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const [saving, setSaving] = useState(false);

  const handleChange = async (
    key: "start_date" | "end_date",
    value: string,
  ) => {
    if (key === "start_date") setStartDate(value);
    else setEndDate(value);

    setSaving(true);

    try {
      await updateProjectDate({ projectId, [key]: value });
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the date.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-sm font-medium text-gray-600 mb-2">Date Range</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleChange("start_date", e.target.value)}
            disabled={saving}
            className="w-full text-base border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleChange("end_date", e.target.value)}
            disabled={saving}
            className="w-full text-base border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
