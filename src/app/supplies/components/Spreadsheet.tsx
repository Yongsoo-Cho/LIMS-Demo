import React, { useState, useEffect } from "react";
import { TableData, Cell } from "../processMetadata";

type PropInterface = {
  data: TableData;
  editMode: boolean;
  handleCellChange: (val: string, pt: [number, number]) => boolean;
};

export default function Spreadsheet(props: PropInterface) {
  // MARK: State Handlers
  const [edit, setEdit] = useState<[number, number] | null>(null);

  // MARK: Event Handlers

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEdit(null);
    } else if (e.key === "Escape") {
      // Revert this specific cell edit
      console.log(null);
    }
  };

  // MARK: Renderers

  function renderCell(isEditing: boolean, cell: Cell, pt: [number, number]) {
    // Render cell based on if it's being edited
    if (isEditing)
      return (
        <input
          type="text"
          value={cell.value}
          onChange={(e) => props.handleCellChange(e.target.value, pt)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEdit(null)}
          className="w-full px-1 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );

    return (
      <button
        onClick={() => {
          if (props.editMode) setEdit(pt);
        }}
      >
        {cell.value}
      </button>
    );
  }

  function getHeaders() {
    if (props.data === null || props.data.headers === null) return;

    let cells = props.data.headers.map((val, col_idx) => {
      return (
        <th
          key={col_idx}
          className="text-left px-4 py-3 font-medium !text-black"
        >
          {val}
        </th>
      );
    });
    return cells;
  }

  function getBody() {
    if (props.data === null) return;

    const getCells = (row: Cell[], row_idx: number) => {
      return row.map((cell, col_idx) => {
        let editCell =
          edit !== null && edit[0] === row_idx && edit[1] === col_idx;
        return (
          <td key={col_idx} className="px-4 py-3 border-t !text-black">
            {renderCell(props.editMode && editCell, cell, [row_idx, col_idx])}
          </td>
        );
      });
    };

    let body = props.data.rows.map((row, row_idx) => {
      return (
        <tr
          key={row_idx}
          className={row_idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
        >
          {getCells(row, row_idx)}
        </tr>
      );
    });

    return body;
  }

  if (props.data === null) return <></>;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">{getHeaders()}</tr>
          </thead>
          <tbody>{getBody()}</tbody>
        </table>
      </div>
    </div>
  );
}
