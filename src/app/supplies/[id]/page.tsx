import { fetchWorkspaces } from "../action";
import { notFound } from "next/navigation";
import AuthLayout from "@/app/components/layouts/AuthLayout";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

type PageParams = Promise<{ id: string }>;

export default async function WorkspaceDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const allWorkspaces = await fetchWorkspaces();

  const workspace = allWorkspaces.find((w) => w.id == Number(id));

  if (!workspace) return notFound();

  return (
    <AuthLayout>
      <main className="p-6 sm:p-10 space-y-6">
        <Link href="/supplies">
          <button className="flex items-center gap-2 text-sm mb-6 font-medium text-gray-600 hover:text-blue-600 transition">
            <FaArrowLeft className="text-base" />
            Back to Workspaces
          </button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {workspace.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Created on {new Date(workspace.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Description
          </h2>
          <p className="text-gray-800 leading-relaxed">
            {workspace.description || "No description provided."}
          </p>
        </div>
      </main>
    </AuthLayout>
  );
}
