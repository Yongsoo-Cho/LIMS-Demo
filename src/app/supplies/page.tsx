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
          <li className="text-green-700">
            Safety: Uploading CSV is a destructive act since it overwrites
            previous table. Notify user before proceeding.
          </li>
          <li>
            Feedback:{" "}
            <span className="text-green-700">
              Show loading bar during fetch and update
            </span>{" "}
            |{" "}
            <span className="text-green-700">
              Feedback message to notify the upload to database is successful.
            </span>{" "}
          </li>
          <li>
            Improved efficiency: <span className="text-green-700">useMemo</span>{" "}
            | <span className="text-gray-600">Efficient Data Storage?</span> |{" "}
            <span>Slots of 20-30?</span> |{" "}
          </li>
          <li className="text-green-700">
            Search: Filter for input | select or deselect columns to include |
            reset button in column dropdown | <span className="text-green-700">Cancel/flush search button on search bar</span>
          </li>
          <li>
            Sort:{" "}
            <span className="text-green-700">
              sort asc, desc, or flush sort | based on a selected column
            </span>{" "}
            | <span className="text-green-700">debug flush</span>
            (maybe a icon beside each header?)
          </li>
          <li className="text-green-700">Type-based display: (bool) checkmark | (date) icon & text | <span>(enum) pill</span> | (number) usual </li>
          <li className="text-green-700">Type-based edit: (bool) checkbox | (date) calendar | <span className="text-green-700">(enum) pill dropdown</span> | (number) deny non-number inputs</li>
          <li className="text-green-700">
            Intelligent inference of data fields:
            (bool) only "true", "false", "0", "1" | (calendar & number) parse fails or passes | (enum) less than 10-15 types, string length less than 15-20 | string otherwise
          </li>
          <li className="text-green-700">Feature: add/delete rows & columns | undo changes (Ctrl + Z)</li>
          <li className="text-yellow-600">Debug: make table more responsive | cell internal states should be debugged, cell doesn't necessarily show do correct information during undo (Ctrl + Z) and Cancel | <span className="text-green-700">enum color debug, repetition scoring system of enum pills</span></li>
          <li className="text-green-700">Debug: changes log should support undo feature (sequential)</li>
          <li className="text-gray-600">Reordering suggestions (and perhaps a storefront if it fits)</li>
          <li className="text-gray-600">Debug: Limit the length of change logs and omit after a certain limit</li>
          <li className="text-gray-600">Alert configurations: when to send alerts to and to who</li>
          <li className="text-gray-600">
            A field in the database that takes a JSON called FEATURES that makess
            it so that uploaded columns arent limited to a predetermined schema.
          </li>
          <li className="text-gray-600">Merge suggestions for similar items</li>
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
