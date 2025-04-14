"use client";

import { useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import { FaPlus } from "react-icons/fa";
import WorkspaceTable from "./components/WorkspaceTable";
import NewWorkspaceModal from "./components/NewWorkspaceModal"; // Make sure path matches your file structure
import { fetchWorkspaces } from "./action";
import { useCachedFetch } from "../hooks/useCachedFetch";
import { SupplyFolder } from "./action";

export default function SuppliesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: supplyFolders,
    loading: loadingSupplyFolders,
    refetch: refetchSupplyFolders,
  } = useCachedFetch<SupplyFolder[]>("cached_supply_folders", fetchWorkspaces);

  const handleSuccess = async () => {
    await refetchSupplyFolders();
    setIsModalOpen(false);
  };

  return (
    <AuthLayout>
      <main className="flex flex-col gap-6 w-full p-6">
        <header className="w-full flex justify-between">
          <section className="text-2xl font-semibold text-gray-800">
            Supply Workspaces
          </section>
          <section>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm shadow"
            >
              <FaPlus className="text-sm" /> New Workspace
            </button>
          </section>
        </header>

        {loadingSupplyFolders ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <WorkspaceTable workspaces={supplyFolders ?? []} />
        )}

        <NewWorkspaceModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onSuccess={handleSuccess}
        />
      </main>
    </AuthLayout>
  );
}
