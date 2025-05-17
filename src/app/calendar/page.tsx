import AuthLayout from "../components/layouts/AuthLayout";
import { fetchProjectsWithAssignees } from "./action";
import CalendarContent from "./CalendarContent";
import "react-day-picker/dist/style.css";

export default async function CalendarPage() {
  const { projects, profileMap } = await fetchProjectsWithAssignees();

  const highlightedDates = projects
    .filter((p) => p.start_date)
    .map((p) => new Date(p.start_date));

  return (
    <AuthLayout>
      <main className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lab Calendar
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Track important dates for lab projects, protocols, and deadlines.
            Days with scheduled projects are highlighted.
          </p>
        </div>

        <CalendarContent
          projects={projects}
          profileMap={profileMap}
          highlightedDates={highlightedDates}
        />
      </main>
    </AuthLayout>
  );
}
