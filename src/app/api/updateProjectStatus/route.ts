import { NextRequest, NextResponse } from "next/server";
import { updateProjectStatus } from "@/app/projects/action";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { projectId, status } = body;

  if (!projectId || !status) {
    return NextResponse.json({ error: "Missing projectId or status" }, { status: 400 });
  }

  try {
    await updateProjectStatus({ projectId, status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}