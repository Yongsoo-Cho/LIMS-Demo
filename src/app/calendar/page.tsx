"use client";

import AuthLayout from "../components/layouts/AuthLayout";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import { supabase } from "../config/supabaseClient";
import { Project } from "../types/project";
import "react-day-picker/dist/style.css";
//import { TeamMember } from "../types/project";
import { useCachedFetch } from "../hooks/useCachedFetch";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

  const { data: profileData } = useCachedFetch<Record<string, string>>(
    "cached_profiles",
    async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name");
      if (error) throw error;
      const profileMap: Record<string, string> = {};
      for (const profile of data || []) {
        profileMap[profile.id] = profile.display_name;
      }
      return profileMap;
    },
  );

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
        const datesWithProjects = (data || [])
          .filter((p) => p.due_date)
          .map((p) => new Date(p.due_date));
        setHighlightedDates(datesWithProjects);
      }
    };
    fetchProjects();
  }, []);

  const projectsForSelectedDate = projects.filter((project) =>
    project.due_date
      ? isSameDay(new Date(project.due_date), selectedDate || new Date())
      : false,
  );

  return (
    <AuthLayout>
      <main className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lab Calendar
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Track important dates for lab projects, protocols, and deadlines.
            Days with scheduled projects are highlighted. Things to work on in
            this page include hierarchical design (one pane should be bigger
            than other), export to calendar, and sorting by team member.
          </p>
        </div>

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
                highlighted:
                  "bg-blue-100 text-blue-800 font-semibold rounded-full",
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
                      <p className="font-medium text-blue-700">
                        {project.name}
                      </p>
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
                          .map(
                            (assigneeId) =>
                              profileData?.[assigneeId].split("@")[0] ??
                              "Unknown",
                          )
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
      </main>
    </AuthLayout>
  );
}
