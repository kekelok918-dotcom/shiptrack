import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      hasSession: !!session,
      session: session
        ? { user: session.user, expires: session.expires }
        : null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message, type: e?.constructor?.name }, { status: 500 });
  }
}
