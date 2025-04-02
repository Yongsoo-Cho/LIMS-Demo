"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import {
  sortData,
  filterData,
  getCSV,
  toggleSetItem,
} from "@/app/utils/tableUtils";

interface SuppliesTableProps {
  data: any[];
  setData: (data: any[]) => void;
}

export default function SuppliesTable({ data, setData }: SuppliesTableProps) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const columns = Array.from(
    new Set(data.flatMap((item) => Object.keys(item))),
  );

  const filteredData = filterData(data, searchQuery);
  const sortedData = sortKey
    ? sortData(filteredData, sortKey, sortAsc)
    : filteredData;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((item) => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(toggleSetItem(selected, id));
  };

  const exportCSV = () => {
    const csv = getCSV(data, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "supplies_export.csv");
  };

  const handleChange = (id: string, key: string, value: string) => {
    setData(
      data.map((item) =>
        item.id === id
          ? { ...item, [key]: isNaN(Number(value)) ? value : Number(value) }
          : item,
      ),
    );
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 items-center mb-4 justify-between">
        <input
          type="text"
          placeholder="Search supplies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border rounded-md text-sm text-gray-800"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md border border-gray-300 shadow-sm"
          >
            {editMode ? "Exit Edit Mode" : "Edit Mode"}
          </button>
          <button
            onClick={exportCSV}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md shadow-sm"
          >
            Export CSV
          </button>
          {editMode && (
            <>
              <button
                onClick={toggleSelectAll}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md border border-gray-300 shadow-sm"
              >
                {selected.size === data.length ? "Unselect All" : "Select All"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {editMode && <th className="px-2">#</th>}
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2 whitespace-nowrap cursor-pointer hover:underline"
                >
                  {col} {sortKey === col ? (sortAsc ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-blue-50">
                {editMode && (
                  <td className="px-2">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-2 text-gray-700 whitespace-nowrap"
                  >
                    {editMode ? (
                      <input
                        className="w-full border px-2 py-1 rounded"
                        value={item[col] ?? ""}
                        onChange={(e) =>
                          handleChange(item.id, col, e.target.value)
                        }
                      />
                    ) : (
                      (item[col] ?? "-")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
