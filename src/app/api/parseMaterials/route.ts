import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import PDFParser from "pdf2json";
import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";

export async function POST(req: Request) {
  try {
    const { projectId, fileName } = await req.json();

    if (!projectId || !fileName) {
      return NextResponse.json(
        { error: "Missing projectId or fileName." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerComponentClient();
    const { data: signed, error: signedError } = await supabase.storage
      .from("project-files")
      .createSignedUrl(`${projectId}/${fileName}`, 60 * 60);

    if (signedError || !signed?.signedUrl) {
      console.error("Failed to generate signed URL:", signedError?.message);
      return NextResponse.json(
        { error: "Failed to generate signed URL." },
        { status: 500 },
      );
    }

    const fileRes = await fetch(signed.signedUrl);
    if (!fileRes.ok) {
      console.error("Failed to fetch PDF from signed URL");
      return NextResponse.json(
        { error: "Failed to download file." },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const tempPath = path.join("/tmp", `${uuidv4()}.pdf`);
    await fs.writeFile(tempPath, buffer);

    const fullText = await parsePDF(tempPath);
    const parsedText = extractMaterialsSection(fullText);

    return NextResponse.json({
      success: true,
      parsedText,
    });
  } catch (err) {
    console.error("Unexpected error in parse-materials:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function parsePDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });

    pdfParser.loadPDF(filePath);
  });
}

function extractMaterialsSection(parsedText: string): string {
  const lines = parsedText.split(/\r?\n/);
  const startIdx = lines.findIndex((line) => /^materials$/i.test(line));
  const endIdx = lines.findIndex(
    (line, idx) => idx > startIdx && /^procedure$/i.test(line),
  );

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    console.warn("Unable to locate Materials section");
    return "";
  }

  const materialsLines = lines.slice(startIdx + 1, endIdx);

  return materialsLines.join("\n");
}
