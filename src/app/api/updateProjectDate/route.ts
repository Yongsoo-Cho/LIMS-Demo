import { NextRequest, NextResponse } from "next/server";
import { updateProjectDate } from "@/app/projects/action";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { projectId, date } = body;

  console.log(projectId);
  console.log(date);

  if (!projectId || !date) {
    return NextResponse.json({ error: "Missing projectId or date" }, { status: 400 });
  }

  try {
    await updateProjectDate({ projectId, date });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}