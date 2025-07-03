"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { generateTableData, TableData } from "../processMetadata";
import { fetchWorkspace } from "../action";

import { Save, X } from "lucide-react";
import { FaUpload } from "react-icons/fa";
import Spreadsheet from "./Spreadsheet";
import LoadingScreen from "@/app/components/ui/LoadingScreen";
import { ModalHandler } from "./Modal";
import UploadModal from "./Modal";
// import { time } from "node:console";

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

  const [loading, setLoading] = useState<boolean>(true);
  // Modal (Warning) Screen Handling
  const [modal, setModal] = useState<ModalHandler | null>(null);
  // Save Success Message Handling
  const [success, setSuccess] = useState<boolean>(false);

  // MARK: Log Changes

  const [log, setLog] = useState<[number, number, string][]>([])
  const pressed = useRef(false);

  useEffect(() => { console.log(log)}, [log]); // Debug purposes
  useEffect(() => { console.log(pressed.current) }, [pressed.current]); // Debug purposes

  // Undo Feature w/ Ctrl + z
  useEffect(() => {
    // Key down handler
    function handleKeyDown(e: KeyboardEvent) {
      if (!editMode || log.length < 1) return;
      if (e.ctrlKey && (e.key === "z" || e.key === "Z")) {
        if (!pressed.current) {
          pressed.current = true;
          e.preventDefault();
          // Scroll to last change
          const latest = log[log.length - 1]
          console.log(latest)
          const el = document.getElementById(`cell-${latest[0]}-${latest[1]}`);
          if (el) { 
            el.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
          }
          // Pop the latest change
          popLatestChange();
        }
      }
    }
    // Key up handler (reset)
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "z" || e.key === "Z") {
        pressed.current = false;
      }
    }
    // Add & remove event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  })

  const flushChanges = () => {
    setLog([]);
  };

  const popLatestChange = () => {
    setLog((prevLog) => {
      if (prevLog.length === 0) return [];
      return prevLog.slice(0, -1);
    })
  }

  // MARK: Fuse and Upload
  const fuseChanges: TableData = useMemo(() => {
    if (table === null || table === undefined) return null;
    
    const fused = Object.assign({}, table);
    for (let i=0;i<log.length;i++) {
      const [row, col, val] = log[i];
      fused.rows[row].cells[col].value = val;
    }

    return fused;
  }, [log, table]);

  function uploadChanges() {
    // Fuse changes
    const upload_table: TableData = fuseChanges;
    // Safety
    if (upload_table === null) return;
    // Update database
    fetch("/api/updateMetadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: workspaceId,
        metadata: upload_table,
      }),
    })
      .then(async () => {
        console.log("Changes Uploaded to Database.");
        // Reset CsvUploader
        flushChanges();
        setFile(null);
        // Re-set file via fetch (or try at least)
        const reload = (await fetchWorkspace(workspaceId)).metadata as
          | TableData
          | undefined;
        if (reload) {
          setTable(reload);
        } else {
          console.log("Incompatible table. Cannot read.");
          setTable(null);
        }
        console.log("Editor Re-set.");
      })
      .catch(() => {
        console.log("Database update has failed.");
      });
  }

  // MARK: Lifecycle

  // Only runs first render
  useEffect(() => {
    if (initialMetadata) {
      setTable(initialMetadata);
      console.log("Database metadata exists and set to table.");
    } else {
      console.log("Empty workspace. No file to upload");
    }
    setLoading(false);
  }, []);

  // This 'useEffect' setup prevents the cleanup bug
  useEffect(() => {
    const setMetadata = async () => {
      // Safety return
      if (!file) return;

      // Get Metadata
      setLoading(true);
      const new_table: TableData = await generateTableData(file);
      setTable(new_table);
      await fetch("/api/updateMetadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: workspaceId,
          metadata: new_table,
        }),
      });
      setLoading(false);
      console.log("File set to table.");
    };

    setMetadata();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [file]);

  useEffect(() => {
    if (!success) return;

    async function timeSuccess(ms: number): Promise<void> {
      await new Promise((res) => setTimeout(res, ms));
      setSuccess(false);
    }

    timeSuccess(3000);

    return () => {
      // unmount
    };
  }, [success]);

  // MARK: Display

  const buttonPanel = useMemo(() => {
    if (editMode)
      return (
        <>
          <button
            type="button"
            className={
              //"inline-flex align-middle content-center-safe gap-2 px-4 py-2 border !rounded-md text-white bg-green-600 hover:bg-green-700"
              "px-4 py-2 border !rounded-md text-white bg-green-600 hover:bg-green-700 flex items-center gap-2"
            }
            onClick={() => {
              setEditMode(false);
              setLoading(true);
              uploadChanges(); // fuse changes | upload to supabase | reload
              setSuccess(true);
              setLoading(false);
            }}
          >
            <Save className="inline-block" size={16} />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={() => {
              flushChanges();
              setEditMode(false);
            }}
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
            setSuccess(false);
            setEditMode(true);
          }}
        >
          Edit Mode
        </button>
      </>
    );
  }, [editMode]);

  return (
    <div key={`${editMode}`}>
      {loading ? (
        <LoadingScreen message="Loading up the spreadsheet, this may take a few seconds..." />
      ) : null}
      {modal ? <UploadModal modal={modal} /> : null}
      <div className="w-full h-fit">
        <div className="mb-6">
          <div className="flex items-start align-middle gap-4">
            <div className="flex items-center gap-2">
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
                  disabled={editMode}
                  onChange={(e) => {
                    if (!table) {
                      setFile(e.target.files?.[0] || null);
                      return;
                    }

                    const handler: ModalHandler = {
                      title: "Warning",
                      message:
                        "Uploading a .csv file will overwrite the previous and changes will be instantly sent to the database. Do you wish to continue?",
                      confirm: () => {
                        setFile(e.target.files?.[0] || null);
                        setModal(null);
                      },
                      cancel: () => {
                        e.target.value = ""; // This is needed to allow the reselection of the same file.
                        setModal(null);
                      },
                    };

                    setModal(handler);
                  }}
                />
              </label>
              <span className="text-gray-500 text-xs">{file?.name}</span>
            </div>
          </div>
        </div>

        {
          // If a table exists when not loading, display as usual. Info message otherwise
          loading || table ? (
            <>
              <div className="w-full h-fit flex justify-end mb-6">
                <div className="flex gap-3">{buttonPanel}</div>
              </div>

              {editMode ? (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                  <p>
                    <strong>Edit Mode Active:</strong> Click on any cell to edit
                    its value. Press Enter to confirm or Esc to cancel. When
                    finished, click &quot;Save Changes&quot; to apply all edits
                    or &quot;Cancel&quot; to discard them.
                  </p>
                </div>
              ) : success ? (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                  <p>
                    <strong>Success!</strong> Saved changes to database.
                  </p>
                </div>
              ) : null}

              <div className="w-full h-fit">
                <Spreadsheet
                  data={fuseChanges} // Show local updates
                  editMode={editMode}
                  handleCellChange={(
                    val: string,
                    [row, col]: [number, number],
                  ) => {

                    setLog((prevLog) => {

                      if (prevLog.length === 0) return [[row, col, val]];
                      
                      let _new = [...prevLog];
                      let [lrow, lcol, _] = prevLog[prevLog.length - 1]
                      if (lrow === row && lcol === col) _new.pop(); // Pop if last update is same spot
                      _new.push([row, col, val]); // Push new log
                      return _new;
                    })

                    return true; // Might remove later
                  }}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-150 flex flex-col align-middle items-center">
              <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Welcome!
              </h1>
              <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
                In this workspace, you can upload your spreadsheets and track
                your inventory with ease. Upload your .csv file data to start
                editing.
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
}