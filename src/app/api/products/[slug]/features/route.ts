import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const featureSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

const updateFeatureSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "planned", "shipped", "declined"]).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
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

  const features = await db.featureRequest.findMany({
    where: { productId: product.id },
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
  });

  // Transform to include vote count
  const result = features.map((f) => ({
    ...f,
    votes: f._count.votes,
    _count: undefined,
  }));

  return NextResponse.json(result);
}

export async function POST(
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

  try {
    const body = await request.json();
    const parsed = featureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const feature = await db.featureRequest.create({
      data: {
        productId: product.id,
        ...parsed.data,
      },
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error("Error creating feature request:", error);
    return NextResponse.json(
      { error: "Failed to create feature request" },
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
    const parsed = updateFeatureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const feature = await db.featureRequest.updateMany({
      where: {
        id,
        productId: product.id,
      },
      data,
    });

    if (feature.count === 0) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    const updated = await db.featureRequest.findUnique({
      where: { id },
      include: { _count: { select: { votes: true } } },
    });

    return NextResponse.json({ ...updated, votes: updated?._count.votes ?? 0 });
  } catch (error) {
    console.error("Error updating feature:", error);
    return NextResponse.json(
      { error: "Failed to update feature" },
      { status: 500 }
    );
  }
}
