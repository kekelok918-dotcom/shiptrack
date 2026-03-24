import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const changelogSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  tag: z.enum(["feature", "fix", "improvement"]).default("feature"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const entries = await db.changelogEntry.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
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
        ...parsed.data,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating changelog entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID required" },
        { status: 400 }
      );
    }

    const entry = await db.changelogEntry.updateMany({
      where: {
        id,
        productId: product.id,
      },
      data,
    });

    if (entry.count === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const updated = await db.changelogEntry.findUnique({ where: { id } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating changelog entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
