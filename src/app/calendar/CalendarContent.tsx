"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Project } from "../types/project";

interface Props {
  projects: Project[];
  profileMap: Record<string, string>;
  highlightedDates: Date[];
}

export default function CalendarContent({
  projects,
  profileMap,
  highlightedDates,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const projectsForSelectedDate = projects.filter((project) =>
    project.start_date
      ? isSameDay(new Date(project.start_date), selectedDate || new Date())
      : false,
  );

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full">
      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2 border border-gray-200">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Selected Date</p>
          <p className="text-xl font-semibold text-blue-600">
            {selectedDate ? format(selectedDate, "PPP") : "None selected"}
          </p>
        </div>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{ highlighted: highlightedDates }}
          modifiersClassNames={{
            highlighted: "bg-blue-100 text-blue-800 font-semibold rounded-full",
          }}
          className="rounded-md [&_.rdp-day]:!h-10 [&_.rdp-day]:!w-10 [&_.rdp-caption_label]:text-base"
        />
      </div>

      {/* Project List */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Projects on this Day
        </h2>
        {projectsForSelectedDate.length > 0 ? (
          <ul className="space-y-3">
            {projectsForSelectedDate.map((project) => (
              <li
                key={project.id}
                className="border border-gray-100 rounded-lg px-4 py-3 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-blue-700">{project.name}</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {project.description || "No description provided."}
                </p>
                {project.assignees?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Assigned:{" "}
                    {project.assignees
                      .map((id) => profileMap[id]?.split("@")[0] ?? "Unknown")
                      .join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No projects scheduled for this day.
          </p>
        )}
      </div>
    </div>
  );
}
