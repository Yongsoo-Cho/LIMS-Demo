"use client";

import AuthLayout from "./components/layouts/AuthLayout";
import LabDayCard from "./components/ui/LabDayCard";

const assignees = [
  {
    id: "1",
    name: "Renee V",
    position: "Wet Lab Lead",
    protocol: "Protein Extraction",
  },
  {
    id: "2",
    name: "Brandon W",
    position: "Wet Lab Jr.",
    protocol: "Transformation",
  },
];

export default function Dashboard() {
  return (
    <AuthLayout>
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start p-6 w-full">
        {/* Roadmap Section */}
        <section className="w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-2">
            Roadmap: Upcoming Features
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-800">
            <li>
              <strong>Darwin Module:</strong> Document parsing and data
              extraction
            </li>
            <li>
              <strong>Protocol Execution:</strong> Benchling integration and
              automated logging
            </li>
            <li>
              <strong>Inventory Status:</strong> Low-stock alerts, and email
              notifications
            </li>
            <li>
              <strong>HP:</strong> Hub for traceable conversations for HP and
              outreach
            </li>
          </ul>
        </section>

        {/* UI Component Showcase */}
        <section className="w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-2">
            Example UI Component: Lab Day Card (Still Working on It)
          </h2>
          <LabDayCard date="March 31, 2025" assignees={assignees} />
        </section>
      </main>
    </AuthLayout>
  );
}
