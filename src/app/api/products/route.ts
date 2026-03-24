import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await db.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { changelogEntries: true, featureRequests: true },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, slug, description } = parsed.data;

    const existing = await db.product.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This slug is already taken" },
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: { name, slug, description, userId },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
