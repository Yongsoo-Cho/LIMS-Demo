import Papa from "papaparse";

// export type FieldMetadata = {
//   name: string;
//   type: FieldTypeName;
//   entries: string[];
//   values?: string[]; // Only use for inferred enum types.
// };

// export type MetadataSchema = {
//   fields: FieldMetadata[];
//   rowCount: number;
//   hasHeaderRow: boolean;
// };

// function generateMetadata(rows: string[][]): MetadataSchema {
//   const { hasHeader, headers } = inferHeaderRow(rows);
//   const dataRows = hasHeader ? rows.slice(1) : rows;

//   const fields: FieldMetadata[] = headers.map((header, colIndex) => {
//     const columnValues: string[] = dataRows.map(
//       (row) => row[colIndex]?.trim() ?? "",
//     );
//     const type = inferFieldType(columnValues);

//     const field: FieldMetadata = {
//       name: header,
//       type,
//       entries: columnValues,
//     };

//     if (type === "enum") {
//       field.values = [...new Set(columnValues)];
//     }

//     return field;
//   });

//   return {
//     fields,
//     rowCount: dataRows.length,
//     hasHeaderRow: hasHeader,
//   };
// }

// export async function handleCsvToMetadata(file: File): Promise<MetadataSchema> {
//   const rows = await parseCsv(file);
//   const metadata = generateMetadata(rows);
//   return metadata;
// }

export type FieldTypeName =
  | "boolean"
  | "number"
  | "datetime"
  | "enum"
  | "string";

export type Cell = {
  value: string;
  type: FieldTypeName;
};

export type TableData = {
  headers: string[] | null;
  types: FieldTypeName[];
  rows: Cell[][];
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
  let res = await parseCsv(file); // How to handle if promise fails???
  let hdr = inferHeaderRow(res).headers; // Get header

  // Infer cell types
  let types: FieldTypeName[] = [];
  for (let j = 0; j < hdr.length; j++) {
    let values: string[] = res.map((_, i) => res[i][j]);
    types.push(inferFieldType(values));
  }

  let dims: [number, number] = [res.length, hdr.length]; // Dimensions

  let _ = res.shift(); // Remove header
  let rows: Cell[][] = res.map((v, _) => {
    // Convert to cell type
    return v.map((s, idx) => {
      return {
        value: s,
        type: types[idx],
      };
    });
  });

  return {
    headers: hdr,
    types: types,
    rows: rows,
    dims: dims,
  };
}
