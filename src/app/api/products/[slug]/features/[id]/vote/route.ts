import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { Redis } from "@upstash/redis";

const voteSchema = z.object({
  visitorId: z.string().min(1),
});

interface Params {
  params: Promise<{ slug: string; id: string }>;
}

let redis: Redis | null = null;

function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const { slug, id } = await params;

    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const feature = await db.featureRequest.findUnique({
      where: { id, productId: product.id },
    });
    if (!feature) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { visitorId } = parsed.data;

    // Check rate limit via Upstash Redis (5 votes per visitor per hour)
    const redis = getRedis();
    const rateLimitKey = `vote:${visitorId}:${new Date().toISOString().slice(0, 13)}`;
    const count = await redis.incr(rateLimitKey);
    if (count === 1) {
      await redis.expire(rateLimitKey, 3600);
    }
    if (count > 5) {
      return NextResponse.json(
        { error: "Too many votes. Please try again later." },
        { status: 429 }
      );
    }

    // Check if already voted
    const existingVote = await db.vote.findUnique({
      where: {
        featureRequestId_visitorId: {
          featureRequestId: id,
          visitorId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this feature" },
        { status: 409 }
      );
    }

    await db.vote.create({
      data: {
        featureRequestId: id,
        visitorId,
      },
    });

    const totalVotes = await db.vote.count({
      where: { featureRequestId: id },
    });

    return NextResponse.json({ success: true, votes: totalVotes });
  } catch (error) {
    console.error("[VOTE_POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
