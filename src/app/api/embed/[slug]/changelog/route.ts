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

  const entries = await db.changelogEntry.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    product: {
      name: product.name,
      slug: product.slug,
    },
    entries,
  });
}
