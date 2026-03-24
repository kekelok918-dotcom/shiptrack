import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting helper
export async function checkRateLimit(
  visitorId: string,
  productSlug: string,
  limit = 10,
  windowSeconds = 60
): Promise<{ success: boolean; remaining: number }> {
  const key = `vote:${productSlug}:${visitorId}`;
  const current = await redis.get<number>(key);

  if (current !== null && current >= limit) {
    return { success: false, remaining: 0 };
  }

  await redis.incr(key);
  if (current === null) {
    await redis.expire(key, windowSeconds);
  }

  return { success: true, remaining: limit - (current ?? 0) - 1 };
}
