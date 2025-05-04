import { fetchWorkspace } from "../action";
import { notFound } from "next/navigation";
import AuthLayout from "@/app/components/layouts/AuthLayout";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import CsvUploader from "../components/CsvUploader";
import { TableData } from "../processMetadata";

type PageParams = Promise<{ id: string }>;

export default async function WorkspaceDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const workspace = await fetchWorkspace(id);
  if (!workspace) return notFound();

  const initialMetadata: TableData | undefined =
    typeof workspace.metadata === "string"
      ? JSON.parse(workspace.metadata)
      : (workspace.metadata as TableData | undefined);

  return (
    <AuthLayout>
      <main className="p-6 sm:p-10 space-y-6 overflow-scroll">
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

        <div className="border-t pt-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Description
            </h2>
            <p className="text-gray-800 leading-relaxed">
              {workspace.description || "No description provided."}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Upload Data
            </h2>
            <CsvUploader workspaceId={id} initialMetadata={initialMetadata} />
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
