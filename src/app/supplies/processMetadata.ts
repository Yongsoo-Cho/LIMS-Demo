import Papa from "papaparse";

export function parseCsv(text: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(text, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data as string[][]),
      error: (err: unknown) => reject(err),
    });
  });
}

function inferHeaderRow(rows: string[][]): { hasHeader: boolean; headers: string[] } {
  const firstRow = rows[0];
  const secondRow = rows[1];

  const isFirstRowAllStrings = firstRow.every(val => isNaN(Number(val)));
  const isSecondRowNumericOrMixed = secondRow?.some(val => !isNaN(Number(val))) ?? false;

  return {
    hasHeader: isFirstRowAllStrings && isSecondRowNumericOrMixed,
    headers: isFirstRowAllStrings ? firstRow : rows[0].map((_, i) => `column_${i + 1}`)
  };
}

function inferFieldType(values: string[]): string {
  const unique = [...new Set(values.map(v => v.trim().toLowerCase()))];

  if (unique.every(v => v === "0" || v === "1" || v === "true" || v === "false")) {
    return "boolean";
  }
  if (unique.every(v => !isNaN(Number(v)))) {
    return "number";
  }
  if (unique.every(v => !isNaN(Date.parse(v)))) {
    return "datetime";
  }
  if (unique.length <= 10) {
    return "enum";
  }
  return "string";
}

function generateMetadata(rows: string[][]) {
  const { hasHeader, headers } = inferHeaderRow(rows);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const fields = headers.map((header, colIndex) => {
    const columnValues = dataRows.map(row => row[colIndex]?.trim() ?? "");
    const type = inferFieldType(columnValues);

    const field: any = {
      name: header,
      type,
      entries: columnValues,
    };

    if (type === "enum") {
      field.values = [...new Set(columnValues)];
    }

    return field;
  });

  return {
    fields,
    rowCount: dataRows.length,
    hasHeaderRow: hasHeader,
  };
}

export async function handleCsvToMetadata(csvText: string) {
  const rows = await parseCsv(csvText);
  const metadata = generateMetadata(rows);
  return metadata;
}