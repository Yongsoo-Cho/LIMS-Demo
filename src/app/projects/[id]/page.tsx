import AuthLayout from "@/app/components/layouts/AuthLayout";
import { fetchProject } from "../action";

type PageParams = Promise<{ id: string }>;

export default async function WorkspaceDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const project = await fetchProject(id);


  return (
    <AuthLayout>
      {project.name}
      {project.description}
    </AuthLayout>
  );
}