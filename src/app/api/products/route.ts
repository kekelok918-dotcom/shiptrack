import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  subdomain: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Subdomain must be lowercase letters, numbers, and hyphens"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { changelogEntries: true, featureRequests: true },
      },
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, description, slug, subdomain } = parsed.data;

    // Check for existing slug/subdomain
    const existing = await db.product.findFirst({
      where: {
        OR: [{ slug }, { subdomain }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug or subdomain already taken" },
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        slug,
        subdomain,
        userId: session.user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
