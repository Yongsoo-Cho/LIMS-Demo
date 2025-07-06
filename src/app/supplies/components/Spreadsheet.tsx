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
  Zap
} from "lucide-react";
import { download_file } from "../export";

// Types & Utils
import { TableData, Cell, Row } from "../processMetadata";
import { BooleanCell, CellProps, DateCell, DefaultCell, EnumCell, EnumProps, NumberCell } from "./Cells";

// Dropdown Imports
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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

  useEffect(() => {
    return // so far nothing happens
  }, []);

  useEffect(() => {
    // Set initial searchHeaders
    if (!props.data) return;

    setSearchHeaders(props.data.headers);
  }, [props.data?.headers]);
  
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
      enums: props.data.enums,
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
    if (!filtered || !sortHeader) return filtered;

    const sort_idx = filtered.headers.indexOf(sortHeader);

    const copy = { ...filtered };
    if (sort === Sort.ASC) {
      // Sort: Ascending
      copy.rows = [...filtered.rows].sort((a, b) =>
        a.cells[sort_idx].value
          .toLowerCase()
          .localeCompare(b.cells[sort_idx].value.toLowerCase()),
      );
    } else if (sort === Sort.DESC) {
      // Sort: Descending
      copy.rows = [...filtered.rows].sort((a, b) =>
        b.cells[sort_idx].value
          .toLowerCase()
          .localeCompare(a.cells[sort_idx].value.toLowerCase()),
      );
    } else {
      return filtered; // No sort
    }

    return copy;
  }, [filtered, sort, sortHeader]);

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

    if (!props.data) return <span></span>;

    let params: CellProps = {
      isEditing: isEditing,
      isEditMode: props.editMode,
      cell: cell,
      pt: pt,
      handleKeyDown: handleKeyDown,
      handleCellChange: props.handleCellChange,
      setEdit: setEdit
    }

    let hdr = cell.header;
    let binds = props.data.enums[hdr];

    let enum_params: EnumProps = {
      ...params,
      hdr: hdr,
      binds: binds,
      updateType: function (h: string, v: string, c: [number, number, number]): void {
        throw new Error("Function not implemented.");
      },
      addType: function (h: string, v: string, c: [number, number, number]): void {
        throw new Error("Function not implemented.");
      },
      delType: function (h: string, v: string, c: [number, number, number]): void {
        throw new Error("Function not implemented.");
      }
    }

    switch (cell.type) {
      case "string": return <DefaultCell {...params} />;
      case "boolean": return <BooleanCell {...params} />;
      case "datetime": return <DateCell {...params} />;
      case "enum": return <EnumCell {...enum_params} />;
      case "number": return <NumberCell {...params} />;
      default: return <DefaultCell {...params} />;
    }
  }

  // Dependency list for the table
  const table_dependencies = [edit, props.editMode, sorted, props.data];

  // Render Headers
  const getHeaders = useMemo(() => {
    if (sorted === null || sorted.headers === null) return;

    const cells = sorted.headers.map((val, col_idx) => {
      return (
        <th
          key={col_idx}
          className="backdrop-blur-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b sticky top-0 bg-muted/50 first:pl-6 last:pr-6"
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
            id={`cell-${row_idx}-${col_idx}`} // Used for document scrolling
            key={col_idx}
            className={`px-4 py-3 text-sm font-medium text-left !text-black ${ (edit && edit[0] === row_idx && edit[1] === col_idx) ? "bg-blue-200" : ""}`}
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
      className="w-full shadow-sm max-h-[550] min-w-[500px]"
    >
      <CardHeader> { /* className="pb-1.5" */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* <CardTitle className="text-xl font-semibold">Table</CardTitle> */}
          <div className="flex items-center gap-2">
            {/* Search Input Field */}
            <div className="relative w-full md:w-64 min-w-[200px]">
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
            {/* Flush Button */}
            <Button
              variant="outline"
              size="icon"
              disabled={props.editMode}
              onClick={() => {
                setSearch("");
                setSearchHeaders(props.data?.headers || []);
                setSort(Sort.NONE);
                setSortHeader(null);
                setDropdownOpen(false);
                setEdit(null);
              }}
            >
              <Zap className="h-3.5 w-3.5 text-slate-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-scroll scrollbar-hidden">
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">{getHeaders}</tr>
            </thead>
            <tbody className="overflow-y-scroll scrollbar-hidden">{getBody}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}