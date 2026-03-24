import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
    take: 10,
  });

  return NextResponse.json({
    product: {
      name: product.name,
      slug: product.slug,
    },
    features: features.map((f) => ({
      ...f,
      votes: f._count.votes,
      _count: undefined,
    })),
  });
}
