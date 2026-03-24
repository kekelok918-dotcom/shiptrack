import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signToken, sessionCookieOptions } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const opts = sessionCookieOptions();
    response.cookies.set({
      name: opts.name,
      value: token,
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: opts.maxAge,
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
