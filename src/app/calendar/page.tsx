"use client";

import AuthLayout from "../components/layouts/AuthLayout";
import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  return (
    <AuthLayout>
      <main className="flex flex-col gap-6 w-full p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Lab Calendar</h1>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl w-full border border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Selected Date:</p>
            <p className="text-lg font-semibold text-blue-600">
              {selectedDate ? format(selectedDate, "PPP") : "None selected"}
            </p>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
          />

          <div className="mt-6 text-sm text-gray-600">
            Assigned users, protocols, or notes for this day will show here.
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
