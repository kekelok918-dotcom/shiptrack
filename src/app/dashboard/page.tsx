import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();

  const products = await db.product.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { changelogEntries: true, featureRequests: true },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and their changelogs
          </p>
        </div>
        <LinkButton href="/dashboard/new">
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </LinkButton>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first product to start publishing changelogs
              </p>
              <LinkButton href="/dashboard/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product: typeof products[number]) => (
            <Card key={product.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <LinkButton href={`/dashboard/${product.slug}`} variant="ghost" size="sm">
                    Dashboard
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </LinkButton>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">
                      {product._count.changelogEntries}
                    </span>
                    changelog entries
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">
                      {product._count.featureRequests}
                    </span>
                    feature requests
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {product.slug}
                  </Badge>
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t">
                  <Link
                    href={`/${product.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View public changelog
                  </Link>
                  <Link
                    href={`/${product.slug}/board`}
                    className="text-sm text-primary hover:underline"
                  >
                    View feature board
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
