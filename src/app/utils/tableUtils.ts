// Sorts an array of objects by a given key
export function sortData<T extends Record<string, unknown>>(
  data: T[],
  key: keyof T,
  asc: boolean,
): T[] {
  return [...data].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === "number" && typeof valB === "number") {
      return asc ? valA - valB : valB - valA;
    }

    return String(valA).localeCompare(String(valB)) * (asc ? 1 : -1);
  });
}

// Filters data by a search query across all fields
export function filterData<T extends Record<string, unknown>>(
  data: T[],
  query: string,
): T[] {
  return data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    ),
  );
}

// Toggles a string ID in a Set
export function toggleSetItem(set: Set<string>, id: string): Set<string> {
  const copy = new Set(set);
  if (copy.has(id)) copy.delete(id);
  else copy.add(id);
  return copy;
}

// Generates CSV string from data and column order
export function getCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: (keyof T)[],
): string {
  const headers = columns.join(",");
  const rows = data.map((item) =>
    columns.map((col) => String(item[col] ?? "")).join(","),
  );
  return [headers, ...rows].join("\n");
}
