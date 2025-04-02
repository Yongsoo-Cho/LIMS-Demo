"use client";

import { ChangeEvent } from "react";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
}

export default function CsvUploader({ onUpload }: CsvUploaderProps) {
  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n").filter(Boolean);
      const headers = rows[0].split(",").map((h) => h.trim());

      const parsedData = rows.slice(1).map((row, idx) => {
        const values = row.split(",").map((v) => v.trim());
        const entry: any = { id: `csv-${idx}` };
        headers.forEach((header, i) => {
          const value = values[i];
          entry[header] = isNaN(Number(value)) ? value : Number(value);
        });
        return entry;
      });

      onUpload(parsedData);
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Upload CSV:</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
