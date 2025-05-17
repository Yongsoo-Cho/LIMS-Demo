import React, { useState, useMemo } from "react";
import { TableData, Cell } from "../processMetadata";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from "lucide-react";
import { download_file } from "../export";

type PropInterface = {
  data: TableData;
  editMode: boolean;
  handleCellChange: (val: string, pt: [number, number]) => boolean;
};

enum Sort {
  ASC,
  DESC,
  NONE,
}

export default function Spreadsheet(props: PropInterface) {
  // MARK: Lifecycle & Helpers
  const [edit, setEdit] = useState<[number, number] | null>(null);

  const enum_styles: { [key: number]: string } = {
    0: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    1: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    2: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    3: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400",
    4: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    5: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
    6: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400",
    7: "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400",
    8: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    9: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
  }

  const pill_binds = useMemo(() => {
    // Bind enum values of each enum column with indices
    if (!props.data) return null;

    const enum_cols = props.data.types.map((val, idx) => (val === 'enum') ? idx : -1).filter((idx) => idx !== -1)

    if (enum_cols.length === 0) return null;

    const binds: { [key: number]: { [key: string]: number } } = {}

    for (let i=0;i<enum_cols.length;i++) {
      let col = enum_cols[i];
      const uniq = [...(new Set(props.data.rows.map((val, _) => { return val.cells[col].value })))];
      const _bind: { [key: string]: number } = {}
      uniq.map((val, idx) => {
        _bind[val] = idx;
      })
      binds[col] = _bind;
    }

    console.log(props.data)
    console.log(binds)
    return binds;
  }, [props.data])
  
  // MARK: Search/Sort
  // Search
  const [search, setSearch] = useState<string>("");
  const [searchHeaders, setSearchHeaders] = useState<string[]>([]); // Might change later based on desired use
  // Sort
  const [sort, setSort] = useState<Sort>(Sort.NONE);
  const [sortHeader, setSortHeader] = useState<string | null>(null);

  const assign_key = useMemo(() => {
    // needed to track original change positions
  }, [props.data])

  const filter_dependency: any[] = [props.data, search, searchHeaders];
  const filtered = useMemo(() => {
    // Filter the table rows based if they contain search string
    if (search === "") return props.data;

    return props.data

  }, filter_dependency)

  const sort_dependency = filter_dependency.concat([sort, sortHeader]);
  const sorted = useMemo(() => {
    // Sort based on included headers and 
    if (sort === Sort.NONE) return filtered;
    
    return filtered;
  }, sort_dependency)


  // MARK: Event Handlers

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEdit(null);
    } else if (e.key === "Escape") {
      // Revert this specific cell edit
      console.log(null);
    }
  };

  // MARK: Type-Based Render

  function renderEditType(cell: Cell, pt: [number, number]) {

    const standard_edit = (
        <input
          type="text"
          value={cell.value}
          onChange={(e) => props.handleCellChange(e.target.value, pt)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEdit(null)}
          className="w-full px-1 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    )

    switch (cell.type) {
      case "string": return standard_edit
      case "boolean": return standard_edit
      case "datetime": return standard_edit
      case "enum": return standard_edit
      case "number": return standard_edit
      default: return standard_edit
    }
  }

  function renderDispType(cell: Cell, pt: [number, number]) {

    const standard_disp = (
      <button onClick={() => { if (props.editMode) setEdit(pt); }}>
        {cell.value}
      </button>
    )

    switch (cell.type) {
      case "string":
        return standard_disp
      case "boolean": 
        return standard_disp
      case "datetime": 
        return standard_disp
      case "enum":

        if (!pill_binds || cell.value === "" || cell.value === null) return standard_disp; // Will not happen if enum exists
        let key: number = -1
        try {
          key = pill_binds[pt[1]][cell.value];
        } catch {
          console.log('Key isn\' found in the list of pills')
          return standard_disp
        }

        /* Here comes a pill box w/ dropdown */
        return (
          <span className={`w-fit max-w-32 inline-flex items-center text-center rounded-full px-2 py-0.5 m-1 text-xs font-medium truncate ${enum_styles[key]}`}>
            {cell.value}
          </span>
        )
      case "number":
        return standard_disp
      default:
        return standard_disp
    }
  }

  // MARK: Renderers

  function renderCell(isEditing: boolean, cell: Cell, pt: [number, number]) {
    // Button edit when it is to be edited
    if (isEditing) return renderEditType(cell, pt);
    
    // Button display when edit is closed
    return renderDispType(cell, pt);
  }

  const getHeaders = useMemo(() => {
    if (sorted === null || sorted.headers === null) return;

    let cells = sorted.headers.map((val, col_idx) => {
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
  }, [props.data, props.editMode]);

  const table_dependency = sort_dependency.concat([edit, props.data, props.editMode])
  const getBody = useMemo(() => {
    if (sorted === null) return;

    const getCells = (row: Cell[], row_idx: number) => {
      return row.map((cell, col_idx) => {
        let editCell =
          edit !== null && edit[0] === row_idx && edit[1] === col_idx;
        return (
          <td
            key={col_idx}
            className="px-4 py-3 text-sm font-medium text-left !text-black"
          >
            {renderCell(props.editMode && editCell, cell, [row_idx, col_idx])}
          </td>
        );
      });
    };

    let body = sorted.rows.map((row, idx) => {
      return (
        <tr
          key={row.key}
          className={`border-b last:border-b-0 hover:bg-muted/50 transition-colors
                    ${idx % 2 === 0 ? "bg-white" : "bg-muted/20"}`}
        >
          {getCells(row.cells, row.key)}
        </tr>
      );
    });

    return body;
  }, table_dependency)

  return (
    <Card className="w-full shadow-sm max-h-[550] overflow-scroll scrollbar-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Table</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search data..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                download_file(props.data, "export.csv");
              }}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">{getHeaders}</tr>
            </thead>
            <tbody>{getBody}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
