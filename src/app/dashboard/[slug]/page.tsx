import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Plus, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDashboardPage({ params }: Props) {
  const { slug } = await params;

  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("[auth] session error:", e);
  }

  const userId = (session?.user as { id?: string } | null | undefined)?.id;
  if (!userId) {
    redirect("/auth/signin");
  }

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      changelogEntries: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
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

  const embedCodeChangelog = `<div id="shiptrack-changelog"></div>
<script src="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/embed.js" data-slug="${slug}" data-type="changelog"></script>`;

  const embedCodeBoard = `<div id="shiptrack-board"></div>
<script src="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/embed.js" data-slug="${slug}" data-type="board"></script>`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.description && (
            <p className="text-muted-foreground mt-1">{product.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <LinkButton href={`/${product.slug}`} target="_blank" variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Public Page
          </LinkButton>
        </div>
      </div>

      <Tabs defaultValue="changelog" className="space-y-6">
        <TabsList>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
          <TabsTrigger value="features">Feature Board</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
        </TabsList>

        <TabsContent value="changelog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Changelog Entries</h2>
            <LinkButton href={`/dashboard/${slug}/changelog/new`} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </LinkButton>
          </div>

          {product.changelogEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No changelog entries yet
                </p>
                <LinkButton href={`/dashboard/${slug}/changelog/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Entry
                </LinkButton>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {product.changelogEntries.map((entry: typeof product.changelogEntries[number]) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{entry.title}</CardTitle>
                        <Badge
                          variant={
                            entry.tag === "feature"
                              ? "default"
                              : entry.tag === "fix"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {entry.tag}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {entry.body.slice(0, 200)}
                      {entry.body.length > 200 && "..."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Feature Requests</h2>
            <LinkButton href={`/dashboard/${slug}/board`} size="sm">
              Manage Board
            </LinkButton>
          </div>

          {product.featureRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No feature requests yet
                </p>
                <LinkButton href={`/${slug}/board`}>View Public Board</LinkButton>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {product.featureRequests.map((feature: typeof product.featureRequests[number]) => (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          feature.status === "shipped"
                            ? "default"
                            : feature.status === "planned"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{feature._count.votes} votes</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>
                        {format(new Date(feature.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="embed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embed Widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Changelog Widget</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Show your latest changelog entries on any website
                </p>
                <div className="relative">
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>{embedCodeChangelog}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={async () => {
                      await navigator.clipboard.writeText(embedCodeChangelog);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Feature Board Widget</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Show top voted feature requests on any website
                </p>
                <div className="relative">
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>{embedCodeBoard}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={async () => {
                      await navigator.clipboard.writeText(embedCodeBoard);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
