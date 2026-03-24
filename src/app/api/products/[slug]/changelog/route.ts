import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

const changelogSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  tag: z.enum(["feature", "fix", "improvement"]).default("feature"),
});

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const entries = await db.changelogEntry.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("[CHANGELOG_GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (product.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = changelogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const entry = await db.changelogEntry.create({
      data: {
        productId: product.id,
        title: parsed.data.title,
        body: parsed.data.body,
        tag: parsed.data.tag,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("[CHANGELOG_POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
