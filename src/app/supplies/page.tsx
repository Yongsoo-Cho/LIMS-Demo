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

        <ul className="list-disc ml-6 space-y-2 text-gray-800">
          <li className="text-green-700">
            Automatic determination of header rows
          </li>
          <li className="text-green-700">Safety: Uploading CSV is a destructive act since it overwrites previous table. Notify user before proceeding.</li>
          <li>Feedback: <span className="text-green-700">Show loading bar during fetch and update</span> | <span className="text-yellow-600">Feedback message to notify the upload to database is successful.</span> </li>
          <li>Improved efficiency: <span className="text-green-700">useMemo</span> | <span className="text-yellow-600">Efficient Data Storage?</span> | <span>Render piece-by-piece?</span> | <span>Disallow files over 2000-3000 lines for efficiency?</span></li>
          <li>
            Intelligent inference of data fields e.g. a whole column is 0 and
            1s, infer that this a boolean field. Ability to add or at least
            infer ENUM types? like dropdowns, idk how
          </li>
          <li>Reordering suggestions (and perhaps a storefront if it fits)</li>
          <li>Alert configurations: when to send alerts to and to who</li>s
          <li>
            A field in the database that takes a JSON called FEATURES that makes
            it so that uploaded columns arent limited to a predetermined schema.
          </li>
          <li>Merge suggestions for similar items</li>
          <li>
            Feedback: Show loading bar during fetch and update | Feedback
            message to notify the upload to database is successful.
          </li>
          <li>
            Safety: Uploading CSV is a destructive act since it overwrites
            previous table. Notify user before proceeding.
          </li>
          <li>More efficient way to store local changes (faster runtime)?</li>
        </ul>

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
