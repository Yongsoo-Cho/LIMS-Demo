import { describe, it, expect } from "vitest";
import { handleCsvToMetadata } from "../app/supplies/processMetadata";

//boolean type and mixed type tests outstanding
const enumCSV = `status\nactive\npending\nactive\ninactive`;
const mixedCSV = `id,name,is_verified,created_at\n1,Alice,true,2023-04-01\n2,Bob,false,2023-04-02\n3,Charlie,true,2023-04-03`;

describe("CSV Metadata Inference", () => {
  it("infers enum type with values", async () => {
    const meta = await handleCsvToMetadata(enumCSV);
    expect(meta.fields[0].type).toBe("enum");
    expect(meta.fields[0].values).toContain("active");
    expect(meta.fields[0].values).toContain("pending");
  });
  it("detects header row", async () => {
    const meta = await handleCsvToMetadata(mixedCSV);
    expect(meta.hasHeaderRow).toBe(true);
    expect(meta.fields[0].name).toBe("id");
  });
  it("counts rows correctly", async () => {
    const meta = await handleCsvToMetadata(mixedCSV);
    expect(meta.rowCount).toBe(3);
  });
});