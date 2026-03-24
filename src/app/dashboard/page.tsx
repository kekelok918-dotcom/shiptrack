import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Plus, ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }

  const userId = session.id;

  let products: Awaited<ReturnType<typeof db.product.findMany>> = [];
  try {
    products = await db.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { changelogEntries: true, featureRequests: true },
        },
      },
    });
  } catch (err) {
    console.error("[Dashboard] DB error:", err);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Products</h1>
          <p className="text-muted-foreground">
            Manage your changelogs and feature boards
          </p>
        </div>
        <LinkButton href="/dashboard/new">
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </LinkButton>
      </div>

      {products.length === 0 ? (
        <Card className="bg-card/50 border-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No products yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create your first product to start publishing changelogs and
              collecting feature requests.
            </p>
            <LinkButton href="/dashboard/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-card/50 border-primary/10 hover:border-primary/25 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {product._count.changelogEntries} entries
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product._count.featureRequests} ideas
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span className="font-mono text-xs">{product.slug}</span>
                </div>
                <div className="flex gap-2">
                  <LinkButton
                    href={`/dashboard/${product.slug}`}
                    variant="ghost"
                    size="sm"
                  >
                    Dashboard
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </LinkButton>
                  <LinkButton
                    href={`/${product.slug}`}
                    size="sm"
                    variant="outline"
                  >
                    View Public Page
                  </LinkButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
