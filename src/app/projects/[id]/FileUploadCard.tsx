"use client";

import { useEffect, useState } from "react";
import {
  FileEntry,
  listProjectFiles,
  uploadProjectFile,
  deleteProjectFile,
  renameProjectFile,
} from "../action";

export default function FileUploadCard({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const uploaded = files[0] || null;

  const loadFiles = async () => {
    const files = await listProjectFiles(projectId);
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setUploading(true);

    const result = await uploadProjectFile(projectId, file);
    if (!result) {
      alert("Upload failed.");
    }

    await loadFiles();
    setFile(null);
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!uploaded) return;
    await deleteProjectFile(projectId, uploaded.name);
    await loadFiles();
  };

  const handleRename = async () => {
    if (!uploaded || !newFileName.trim()) return;

    const renamed = await renameProjectFile(
      projectId,
      uploaded.name,
      newFileName.trim(),
    );
    if (!renamed) return alert("Rename failed.");

    setRenaming(false);
    setNewFileName("");
    await loadFiles();
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Attachment</h3>

      {uploaded ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded border text-sm">
            <a
              href={uploaded.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate max-w-[60%]"
            >
              {uploaded.name}
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRenaming(true);
                  setNewFileName(uploaded.name);
                }}
                className="text-xs font-medium px-2 py-1 border rounded"
              >
                Rename
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 border border-red-200 rounded"
              >
                Delete
              </button>
            </div>
          </div>

          {renaming && (
            <div className="flex items-center gap-2">
              <input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="text-sm border rounded px-2 py-1 w-full"
              />
              <button
                onClick={handleRename}
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setRenaming(false);
                  setNewFileName("");
                }}
                className="text-xs px-3 py-1 border border-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            onChange={handleChange}
            className="text-sm text-gray-700 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="truncate max-w-[70%]">{file.name}</span>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
