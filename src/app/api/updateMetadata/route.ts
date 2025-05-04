import { updateWorkspaceMetadata } from "@/app/supplies/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const { id, metadata } = body;
    const updated = await updateWorkspaceMetadata({ id, metadata });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
