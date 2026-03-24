import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("shiptrack_session");
  const nextAuthCookie = cookieStore.get("next-auth.session-token");
  const secureNextAuthCookie = cookieStore.get("__Secure-next-auth.session-token");

  const token = sessionCookie?.value
    ?? nextAuthCookie?.value
    ?? secureNextAuthCookie?.value;

  let verified = null;
  if (token) {
    try {
      verified = await verifyToken(token);
    } catch (e) {
      verified = { error: String(e) };
    }
  }

  return NextResponse.json({
    env: {
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    },
    cookies: {
      shiptrack_session: sessionCookie?.value ? "(present)" : null,
      "next-auth.session-token": nextAuthCookie?.value ? "(present)" : null,
      "__Secure-next-auth.session-token": secureNextAuthCookie?.value ? "(present)" : null,
    },
    tokenLength: token?.length ?? null,
    verified,
  });
}
