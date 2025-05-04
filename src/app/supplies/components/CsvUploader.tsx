"use client";

import { useState, useEffect } from "react";
import { generateTableData, TableData } from "../processMetadata";

import { Save, X } from "lucide-react";
import { FaUpload } from "react-icons/fa";
import Spreadsheet from "./Spreadsheet";

export default function CsvUploader({
  workspaceId,
  initialMetadata,
}: {
  workspaceId: string;
  initialMetadata?: TableData;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [table, setTable] = useState<TableData>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  // This 'useEffect' setup prevents the cleanup bug
  useEffect(() => {
    const setMetadata = async () => {
      // Safety return
      if (!file && initialMetadata) {
        setTable(initialMetadata);
      }
      if (!file) return;

      // Get Metadata
      let new_table = await generateTableData(file);
      console.log(new_table);
      setTable(new_table);
      await fetch("/api/updateMetadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: workspaceId,
          metadata: new_table,
        }),
      });
    };

    setMetadata();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [file]);

  function buttonPanel() {
    if (editMode)
      return (
        <>
          <button
            type="button"
            className={
              "inline-flex align-middle content-center-safe gap-2 px-4 py-2 border !rounded-md text-white bg-green-600 hover:bg-green-700"
            }
            onClick={
              () => null /* Here, you'll handle the confirmation of changes*/
            }
          >
            <Save className="inline-block" size={16} />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={
              () => null /* Here, you'll handle cancellation of the changes */
            }
            className="px-4 py-2 border border-gray-200 !rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </>
      );

    return (
      <>
        <button
          type="button"
          className="px-4 py-2 border !rounded-md border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          Edit Mode
        </button>
        <button
          type="button"
          onClick={
            () => null /* Here you'll handle exporting the table as .csv*/
          }
          className="px-4 py-2 !rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Export CSV
        </button>
      </>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start align-middle gap-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload"
              className="h-fit inline-flex flex-row gap-2 text-sm font-medium items-center custom-file-upload cursor-pointer"
            >
              <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded border border-blue-200 cursor-pointer hover:bg-blue-100">
                <FaUpload className="text-blue-500 inline-block" />
                {file ? "Change File" : "Choose File"}
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <span className="text-gray-600">{file?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative w-[400px]">
          {/*Search Bar Logic Comes Here*/}
        </div>
        <div className="flex gap-3">{buttonPanel()}</div>
      </div>

      {editMode ? (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
          <p>
            <strong>Edit Mode Active:</strong> Click on any cell to edit its
            value. Press Enter to confirm or Esc to cancel. When finished, click
            "Save Changes" to apply all edits or "Cancel" to discard them.
          </p>
        </div>
      ) : null}
      <div>
        <Spreadsheet
          data={table}
          editMode={editMode}
          handleCellChange={(something: string, later: [number, number]) =>
            true
          }
        />
      </div>
    </div>
  );
}

//<div className="w-1 h-1 overflow-x-scroll overflow-y-scroll">
//</div>
