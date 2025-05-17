import AuthLayout from "@/app/components/layouts/AuthLayout";
import { fetchProfilesByProject, fetchProject } from "../action";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Comments from "./Comments";
import AssigneesCard from "./AssigneesCard";
import DueDateCard from "./DueDateCard";
import NotificationsCard from "./NotificationsCard";
import StatusCard from "./StatusCard";
import ProjectNameCard from "./ProjectName";
import DescriptionCard from "./DescriptionCard";
import ProjectActionsDropdown from "./ProjectActionsDropdown";

type PageParams = Promise<{ id: string }>;

export default async function WorkspaceDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const project = await fetchProject(id);
  const profiles = await fetchProfilesByProject(id);

  return (
    <AuthLayout>
      <main className="p-6 sm:p-10 space-y-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <FaArrowLeft className="text-base" />
          Back to Projects
        </Link>

        <div className="flex items-center justify-between">
          <ProjectNameCard name={project.name} projectId={id} />
          <ProjectActionsDropdown projectId={id} />
        </div>

        <div className="grid grid-cols-[25%_75%] grid-rows-2 gap-4">
          <StatusCard status={project.status} projectId={id} />
          <DueDateCard date={project.due_date} projectId={id} />
          <AssigneesCard
            assigneeIds={project.assignees}
            profiles={profiles}
            projectId={id}
          />
          <NotificationsCard message="None" />
        </div>

        <DescriptionCard projectId={id} description={project.description} />
        <Comments projectId={id} />
      </main>
    </AuthLayout>
  );
}
