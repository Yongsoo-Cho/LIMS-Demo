export function sortData(data: any[], key: string, asc: boolean) {
  return [...data].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return asc ? -1 : 1;
    if (valA > valB) return asc ? 1 : -1;
    return 0;
  });
}

export function filterData(data: any[], query: string) {
  return data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    ),
  );
}

export function toggleSetItem(set: Set<string>, id: string): Set<string> {
  const copy = new Set(set);
  if (copy.has(id)) copy.delete(id);
  else copy.add(id);
  return copy;
}

export function getCSV(data: any[], columns: string[]): string {
  const headers = columns.join(",");
  const rows = data.map((item) =>
    columns.map((col) => item[col] ?? "").join(","),
  );
  return [headers, ...rows].join("\n");
}
