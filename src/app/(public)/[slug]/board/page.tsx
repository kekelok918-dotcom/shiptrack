import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import { format } from "date-fns";
import { FeatureBoardClient } from "./_components/FeatureBoardClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicBoardPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      featureRequests: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { votes: true },
          },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const sortedFeatures = [...product.featureRequests].sort(
    (a, b) => b._count.votes - a._count.votes
  );

  const statusColors: Record<string, string> = {
    open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    shipped: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    declined: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-sm text-muted-foreground">{product.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <LinkButton href={`/${product.slug}`} variant="outline" size="sm">
              ← Changelog
            </LinkButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Feature Board</h2>
          <p className="text-muted-foreground">
            Vote on what matters most. The top features will be shipped first.
          </p>
        </div>

        <FeatureBoardClient
          features={sortedFeatures}
          productSlug={slug}
          statusColors={statusColors}
        />
      </main>
    </div>
  );
}
