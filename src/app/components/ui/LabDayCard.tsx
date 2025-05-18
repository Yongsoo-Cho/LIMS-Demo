"use client";

import { useRouter } from "next/navigation";
import { UpcomingLabEntry } from "@/app/utils/fetchUpcomingLabDay";
import { formatDate } from "@/app/projects/utils";

export default function LabDayCard({
  start_date,
  projects,
}: {
  start_date: string | null;
  projects: UpcomingLabEntry[];
}) {
  const router = useRouter();

  if (!start_date || projects.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-md p-4 w-full max-w-2xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Lab Schedule
        </h2>
        <p className="text-sm text-gray-500">Nothing coming up.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full max-w-2xl border border-gray-200 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Lab Assignments for {formatDate(start_date)}
      </h2>
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
            <th className="px-4 py-2 rounded-tl-md">Assignee</th>
            <th className="px-4 py-2 rounded-tr-md">Project Name</th>
          </tr>
        </thead>
        <tbody>
          {projects.flatMap(({ id, name, assignees }, idx) =>
            assignees.map((a, i) => (
              <tr
                key={`${id}-${a.id}`}
                className={`border-b ${
                  (idx + i) % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition cursor-pointer`}
                onClick={() => router.push(`/projects/${id}`)}
              >
                <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                  {a.display_name || "Unknown"}
                </td>
                <td className="px-4 py-3 text-gray-700">{name}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
