import Papa from "papaparse";

export type FieldTypeName =
  | "boolean"
  | "number"
  | "datetime"
  | "enum"
  | "string";

export type Cell = {
  value: string;
  type: FieldTypeName;
  header: string;
};

export type Row = {
  key: number,
  cells: Cell[]
}

export type TableData = {
  headers: string[];
  types: FieldTypeName[];
  rows: Row[];
  dims: [number, number];
} | null;

export function parseCsv(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data as string[][]),
      error: (err: unknown) => reject(err),
    });
  });
}

function inferHeaderRow(rows: string[][]): {
  hasHeader: boolean;
  headers: string[];
} {
  const firstRow = rows[0];
  const secondRow = rows[1];

  const isFirstRowAllStrings = firstRow.every((val) => isNaN(Number(val)));
  const isSecondRowNumericOrMixed =
    secondRow?.some((val) => !isNaN(Number(val))) ?? false;

  return {
    hasHeader: isFirstRowAllStrings && isSecondRowNumericOrMixed,
    headers: isFirstRowAllStrings
      ? firstRow
      : rows[0].map((_, i) => `column_${i + 1}`),
  };
}

function inferFieldType(values: string[]): FieldTypeName {
  //console.log(values);
  const unique = [...new Set(values.map((v) => v.trim().toLowerCase()))];

  if (
    unique.every((v) => v === "0" || v === "1" || v === "true" || v === "false")
  ) {
    return "boolean";
  }
  if (unique.every((v) => !isNaN(Number(v)))) {
    return "number";
  }
  if (unique.every((v) => !isNaN(Date.parse(v)))) {
    return "datetime";
  }
  if (unique.length <= 10) {
    return "enum";
  }
  return "string";
}

export async function generateTableData(file: File): Promise<TableData> {
  const res = await parseCsv(file); // How to handle if promise fails???
  const hdr = inferHeaderRow(res).headers; // Get header

  // Infer cell types
  const types: FieldTypeName[] = [];
  for (let j = 0; j < hdr.length; j++) {
    const values: string[] = res.map((_, i) => res[i][j]);
    types.push(inferFieldType(values));
  }

  const dims: [number, number] = [res.length, hdr.length]; // Dimensions

  res.shift(); // Remove header
  const rows: Row[] = res.map((v, i) => {
    // Convert to cell type
    const new_row: Row = { key: i, cells: [] }
    new_row.cells = v.map((s, j) => {
      return {
        value: s,
        type: types[j],
        header: hdr[j]
      };
    });
    return new_row;
  });

  return {
    headers: hdr,
    types: types,
    rows: rows,
    dims: dims,
  };
}
