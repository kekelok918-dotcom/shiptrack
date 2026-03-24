import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/redis";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const cookieStore = await cookies();
  const visitorId =
    cookieStore.get("visitor_id")?.value ||
    `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  // Rate limit check
  const rateLimitResult = await checkRateLimit(visitorId, slug, 20, 60);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Verify product exists
  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Verify feature exists
  const feature = await db.featureRequest.findUnique({
    where: { id },
  });

  if (!feature || feature.productId !== product.id) {
    return NextResponse.json(
      { error: "Feature not found" },
      { status: 404 }
    );
  }

  try {
    // Try to create vote, unique constraint handles duplicates
    const vote = await db.vote.create({
      data: {
        featureRequestId: id,
        visitorId,
      },
    });

    // Set visitor cookie if not set
    const response = NextResponse.json({ success: true, vote });
    if (!cookieStore.get("visitor_id")) {
      response.cookies.set("visitor_id", visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    // Unique constraint violation = already voted
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "You have already voted for this feature" },
        { status: 409 }
      );
    }
    throw error;
  }
}
