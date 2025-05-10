import AuthLayout from "@/app/components/layouts/AuthLayout";
import { fetchProfilesByProject, fetchProject } from "../action";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Comments from "./Comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PageParams = Promise<{ id: string }>;

export default async function WorkspaceDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const project = await fetchProject(id);
  const profiles = await fetchProfilesByProject(id);

  const projectInfoCards = [
    {
      title: "Status",
      content: project.status,
    },
    {
      title: "Due Date",
      content: new Date(project.due_date).toLocaleDateString(),
    },
    {
      title: "Assignees",
      content: (
        <div className="flex -space-x-2 overflow-hidden">
          {project.assignees.map((assigneeId: string) => {
            const profile = profiles[assigneeId];
            return (
              <Avatar
                key={assigneeId}
                className="w-8 h-8 border-2 border-white"
              >
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>
      ),
    },
    {
      title: "Notifications",
      content: "None",
    },
  ];

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

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {project.name}
        </h1>

        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {projectInfoCards.map(({ title, content }, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </h3>
              <div className="text-gray-800 text-base">{content}</div>
            </div>
          ))}
        </div>

        <Comments projectId={id}/>
      </main>
    </AuthLayout>
  );
}
