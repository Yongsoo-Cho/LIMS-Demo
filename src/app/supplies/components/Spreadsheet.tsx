import React, { useState, useMemo, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Filter,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CalendarIcon,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { download_file } from "../export";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Types & Utils
import { TableData, Cell, Row } from "../processMetadata";
import { BooleanCell, CellProps, DateCell, DefaultCell, EnumCell, NumberCell } from "./Cells";
import { to_boolean, to_number, to_date } from "../typeConvert";

// Dropdown Imports
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@headlessui/react";
import { format } from "date-fns";
import { propagateServerField } from "next/dist/server/lib/render-server";

type PropInterface = {
  data: TableData;
  editMode: boolean;
  handleCellChange: (val: string, pt: [number, number]) => boolean;
};

enum Sort {
  ASC = "asc",
  DESC = "desc",
  NONE = "none",
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
  };

  const pill_binds = useMemo(() => {
    // Bind enum values of each enum column with indices
    if (!props.data) return null;

    const enum_cols = props.data.types
      .map((val, idx) => (val === "enum" ? idx : -1))
      .filter((idx) => idx !== -1);

    if (enum_cols.length === 0) return null;

    const binds: { [key: number]: { [key: string]: number } } = {};

    for (let i = 0; i < enum_cols.length; i++) {
      const col = enum_cols[i];
      const uniq = [
        ...new Set(
          props.data.rows.map((val) => {
            return val.cells[col].value;
          }),
        ),
      ];
      const _bind: { [key: string]: number } = {};
      uniq.forEach((val, idx) => {
        _bind[val] = idx;
      });
      binds[col] = _bind;
    }

    return binds;
  }, [props.data]);

  // MARK: Filter/Search/Sort
  // Filter
  const [searchHeaders, setSearchHeaders] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  // Search
  const [search, setSearch] = useState<string>("");
  // Sort
  const [sort, setSort] = useState<Sort>(Sort.NONE);
  const [sortHeader, setSortHeader] = useState<string | null>(null);

  // Filter by Column Search Headers
  const constrained: TableData = useMemo(() => {
    if (!props.data) return props.data;

    const hidxs = props.data.headers.map((v, i) =>
      searchHeaders.includes(v) ? i : -1,
    ); // Get indexes of search headers
    const htypes = props.data.types.filter((_, i) => hidxs.includes(i)); // Get types of search header indexes
    return {
      dims: props.data.dims,
      headers: props.data.headers.filter((v) => searchHeaders.includes(v)),
      types: htypes,
      rows: props.data.rows.map((row: Row) => {
        return {
          key: row.key,
          cells: row.cells.filter((v) => searchHeaders.includes(v.header)),
        } as Row;
      }),
    };
  }, [props.data, searchHeaders]);

  // Filter by Search Input
  const filtered: TableData = useMemo(() => {
    // Filter the table rows based if they contain search string
    if (search === "" || !constrained) return constrained;

    const copy = { ...constrained };
    copy.rows = constrained.rows.filter((v) => {
      const values = v.cells
        .map((cell) => cell.value)
        .join("")
        .toLowerCase();
      return values.includes(search.toLowerCase());
    });

    return copy;
  }, [constrained, search]);

  // Filter by Sort Column and Type
  const sorted: TableData = useMemo(() => {
    // Sort based on included headers and
    if (sort === Sort.NONE || !filtered || !sortHeader) return filtered;

    const sort_idx = filtered.headers.indexOf(sortHeader);

    const copy = { ...filtered };
    if (sort === Sort.ASC) {
      // Sort: Ascending
      copy.rows = filtered.rows.sort((a, b) =>
        a.cells[sort_idx].value
          .toLowerCase()
          .localeCompare(b.cells[sort_idx].value.toLowerCase()),
      );
    } else {
      // Sort: Descending
      copy.rows = filtered.rows.sort((a, b) =>
        b.cells[sort_idx].value
          .toLowerCase()
          .localeCompare(a.cells[sort_idx].value.toLowerCase()),
      );
    }

    return copy;
  }, [filtered, sort, sortHeader]);

  // MARK: Lifecycle

  useEffect(() => {
    // Set initial searchHeaders
    if (!props.data) return;

    // console.log(props.data.types)

    setSearchHeaders(props.data.headers);
  }, [props.data?.headers]);

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
    );

    switch (cell.type) {
      case "string":
        return standard_edit;
      case "boolean":
        const value = cell.value === "true" || cell.value === "1";
        return (
          <div className="flex justify-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                value
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }
            `}
              aria-label={value ? "True" : "False"}
            >
              {value ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </div>
          </div>
        );
      case "datetime":
        return standard_edit;
      case "enum":
        return standard_edit;
      case "number":
        return standard_edit;
      default:
        return standard_edit;
    }
  }

  // Display Mode Cell Render
  function renderDispType(cell: Cell, pt: [number, number]) {
    const standard_disp = (
      <button
        onClick={() => {
          if (props.editMode) setEdit(pt);
        }}
      >
        {cell.value}
      </button>
    );

    switch (cell.type) {
      case "string":
        return standard_disp;
      case "boolean":
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={to_boolean(cell.value) === true}
              className={cn(
                "h-5 w-5 rounded-sm border transition-colors",
                cell.value ? "border-green-500 bg-green-500 text-primary-foreground" : "border-input bg-background",
              )}
            />
          </div>
        )
      case "datetime":
        return <div className="flex items-center justify-between group">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>{format(to_date(cell.value)!, "MMM d, yyyy")}</span>
            <Clock className="mx-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>{format(to_date(cell.value)!, "h:mm a")}</span>
          </div>
        </div>
      case "enum":
        if (!pill_binds || cell.value === "" || cell.value === null)
          return standard_disp; // Will not happen if enum exists
        let key: number = -1;
        try {
          key = pill_binds[pt[1]][cell.value];
        } catch {
          console.log("Key isn't found in the list of pills");
          return standard_disp;
        }

        /* Here comes a pill box w/ dropdown */
        return (
          <span
            className={`w-fit max-w-32 inline-flex items-center text-center rounded-full px-2 py-0.5 m-1 text-xs font-medium truncate ${enum_styles[key]}`}
          >
            {cell.value}
          </span>
        );
      case "number":
        return <div className="w-full h-full flex items-center align-middle">
          {standard_disp}
        </div>
      default:
        return standard_disp;
    }
  }

  // MARK: Renderers

  function renderCell(isEditing: boolean, cell: Cell, pt: [number, number]) {

    let params: CellProps = {
      isEditing: isEditing,
      isEditMode: props.editMode,
      cell: cell,
      pt: pt,
      handleKeyDown: handleKeyDown,
      handleCellChange: props.handleCellChange,
      setEdit: setEdit
    }

    switch (cell.type) {
      case "string": return <DefaultCell {...params} />;
      case "boolean": return <BooleanCell {...params} />;
      case "datetime": return <DateCell {...params} />;
      case "enum": return <EnumCell {...params} />;
      case "number": return <NumberCell {...params} />;
      default: return <DefaultCell {...params} />;
    }
  }

  // Dependency list for the table
  const table_dependencies = [edit, props.editMode, sorted];

  // Render Headers
  const getHeaders = useMemo(() => {
    if (sorted === null || sorted.headers === null) return;

    const cells = sorted.headers.map((val, col_idx) => {
      return (
        <th
          key={col_idx}
          className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b sticky top-0 bg-muted/50 first:pl-6 last:pr-6"
        >
          <div className="flex align-middle items-center cursor-pointer hover:text-foreground transition-colors">
            {val}
            <button
              className="flex align-middle items-center ml-1 p-0.5 rounded-sm hover:bg-muted/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              onClick={() => {
                setSort(
                  sortHeader !== val
                    ? Sort.ASC
                    : sort === Sort.NONE
                      ? Sort.ASC
                      : sort === Sort.ASC
                        ? Sort.DESC
                        : Sort.NONE,
                );
                setSortHeader(sort === Sort.DESC ? null : val);
              }}
            >
              {sortHeader !== val || sort === Sort.NONE ? (
                <ArrowUpDown className="inline-block h-3.5 w-3.5 text-muted-foreground" />
              ) : sort === Sort.ASC ? (
                <ArrowUp className="inline-block h-3.5 w-3.5 text-primary" />
              ) : (
                <ArrowDown className="inline-block h-3.5 w-3.5 text-primary" />
              )}
            </button>
          </div>
        </th>
      );
    });
    return cells;
  }, table_dependencies);

  const getBody = useMemo(() => {
    if (!sorted) return;

    const getCells = (row: Cell[], row_idx: number) => {
      return row.map((cell, col_idx) => {
        const editCell =
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

    const body = sorted.rows.map((row, idx) => {
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
  }, table_dependencies);

  // MARK: Return
  return (
    <Card
      className="w-full shadow-sm max-h-[550] overflow-scroll scrollbar-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Table</CardTitle>
          <div className="flex items-center gap-2">
            {/* Search Input Field */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search data..."
                className="w-full pl-8"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            {/* Filter and Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              {/* Dropdown Trigger Button */}
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              {/* Dropdown Menu & Item Listing */}
              <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel>Select Search Columns</DropdownMenuLabel>

                {props.data?.headers.map((v, i) => {
                  return (
                    <div
                      key={i}
                      className="flex items-center px-3 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => {
                        if (searchHeaders.includes(v)) {
                          const remove_idx = searchHeaders.indexOf(v);
                          const new_headers = [...searchHeaders];
                          new_headers.splice(remove_idx, 1);
                          setSearchHeaders(new_headers);
                        } else {
                          setSearchHeaders(searchHeaders.concat([v]));
                        }
                      }}
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary mr-2">
                        {searchHeaders.includes(v) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      <span>{v}</span>
                    </div>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Export Button */}
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