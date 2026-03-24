import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  visitorId: z.string().optional(),
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

    const features = await db.featureRequest.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { votes: true } },
      },
    });

    return NextResponse.json(features);
  } catch (error) {
    console.error("[FEATURES_GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = featureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { title, description, visitorId } = parsed.data;

    // If visitorId is provided (public submission), no ownership check needed
    // Otherwise require auth
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId && !visitorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const feature = await db.featureRequest.create({
      data: {
        productId: product.id,
        title,
        description,
      },
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error("[FEATURES_POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
