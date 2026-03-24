import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      hasSession: !!session,
      session: session,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
