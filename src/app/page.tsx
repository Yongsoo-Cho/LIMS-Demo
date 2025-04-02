"use client";

import AuthLayout from "./components/layouts/AuthLayout";
import LabDayCard from "./components/ui/LabDayCard";

export default function Dashboard() {
  return (
    <AuthLayout>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start p-1">
        <ul>
          <li>darwin module</li>
          <li>protocol execution module</li>
          <li>inventory status module: get to this much much later</li>
          <LabDayCard
            date="March 31, 2025" //get date from LabDay class
            assignees={assignees}
          />
        </ul>
      </main>
    </AuthLayout>
  );
}

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
