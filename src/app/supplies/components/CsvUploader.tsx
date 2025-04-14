"use client";

import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function CsvUploader() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-6 border rounded-xl bg-gray-50 space-y-4 w-full max-w-md shadow-sm">
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition custom-file-upload"
      >
        <FaUpload className="text-blue-500" />
        {file ? "Change File" : "Upload CSV"}
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
}