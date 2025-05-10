import React, { useState, useMemo } from "react";
import { TableData, Cell } from "../processMetadata";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from 'lucide-react';

type PropInterface = {
  data: TableData;
  editMode: boolean;
  handleCellChange: (val: string, pt: [number, number]) => boolean;
};

enum Sort {
  ASC, DESC, NONE
}

export default function Spreadsheet(props: PropInterface) {

  // MARK: Lifecycle
  const [edit, setEdit] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState<Sort>(Sort.NONE);
  const [sortHeader, setSortHeader] = useState<string | null>(null);

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
    // Button edit when it is to be edited
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
    
    // Button display when edit is closed
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

  const getHeaders = useMemo(() => {
    if (props.data === null || props.data.headers === null) return;

    let cells = props.data.headers.map((val, col_idx) => {
      return (
        <th
          key={col_idx}
          className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b sticky top-0 bg-muted/50 first:pl-6 last:pr-6"
        >
          <div className="flex items-center cursor-pointer hover:text-foreground transition-colors">
            {val}
          </div>
        </th>
      );
    });
    return cells;
  }, [props.data, props.editMode])

  const getBody = useMemo(() => {
    if (props.data === null) return;

    const getCells = (row: Cell[], row_idx: number) => {
      return row.map((cell, col_idx) => {
        let editCell =
          edit !== null && edit[0] === row_idx && edit[1] === col_idx;
        return (
          <td key={col_idx} className="px-4 py-3 text-sm font-medium text-left !text-black">
            {renderCell(props.editMode && editCell, cell, [row_idx, col_idx])}
          </td>
        );
      });
    };

    let body = props.data.rows.map((row, row_idx) => {
      return (
        <tr
          key={row_idx}
          className={`border-b last:border-b-0 hover:bg-muted/50 transition-colors
                    ${row_idx % 2 === 0 ? "bg-white" : "bg-muted/20"}`}
        >
          {getCells(row, row_idx)}
        </tr>
      );
    });

    return body;
  }, [edit, props.data, props.editMode])

  return (
    <Card className="w-full shadow-sm max-h-[550] overflow-scroll scrollbar-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Table</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search data..." className="w-full pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">{getHeaders}</tr>
            </thead>
            <tbody>
              {getBody}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

}
