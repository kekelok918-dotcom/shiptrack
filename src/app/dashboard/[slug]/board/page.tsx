import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BoardActions } from "./_components/BoardActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardBoardPage({ params }: Props) {
  const { slug } = await params;
  const hd = await headers();
  const userId = hd.get("x-user-id");
  if (!userId) {
    redirect("/auth/signin");
  }

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

  if (product.userId !== userId) {
    redirect("/dashboard");
  }

  const statusOrder = ["open", "planned", "shipped", "declined"] as const;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <LinkButton href={`/dashboard/${slug}`} variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </LinkButton>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name} Board</h1>
            <p className="text-muted-foreground mt-1">
              Manage feature requests from your users
            </p>
          </div>
          <LinkButton href={`/${slug}/board`} target="_blank">
            View Public Board
          </LinkButton>
        </div>
      </div>

      {product.featureRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">
              No feature requests yet
            </p>
            <LinkButton href={`/${slug}/board`}>
              Visit Public Board
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {statusOrder.map((status) => {
            const features = product.featureRequests.filter(
              (f: typeof product.featureRequests[number]) => f.status === status
            );
            if (features.length === 0) return null;

            return (
              <div key={status} className="space-y-3">
                <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                  {status}
                  <Badge variant="secondary">{features.length}</Badge>
                </h2>
                <div className="space-y-3">
                  {features.map((feature: typeof features[number]) => (
                    <Card key={feature.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base flex-1">
                            {feature.title}
                          </CardTitle>
                          <BoardActions
                            featureId={feature.id}
                            currentStatus={feature.status}
                            productSlug={slug}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {feature.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{feature._count.votes} votes</span>
                          <span>
                            {format(new Date(feature.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
