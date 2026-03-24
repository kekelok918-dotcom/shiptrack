import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicChangelogPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      changelogEntries: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const tagColors = {
    feature: "bg-green-500/10 text-green-600 border-green-500/20",
    fix: "bg-red-500/10 text-red-600 border-red-500/20",
    improvement: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              {product.description && (
                <p className="text-muted-foreground mt-1">{product.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">ShipTrack</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Changelog</h2>
            <LinkButton href={`/${slug}/board`} variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Feature Board
            </LinkButton>
          </div>

          {product.changelogEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground">
                  No changelog entries yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {product.changelogEntries.map((entry: typeof product.changelogEntries[number], index: number) => (
                <div key={entry.id}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={tagColors[entry.tag as keyof typeof tagColors]}
                        >
                          {entry.tag}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {format(new Date(entry.createdAt), "MMMM d, yyyy")}
                      </p>
                      <CardContent className="p-0">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{entry.body}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                  {index < product.changelogEntries.length - 1 && (
                    <div className="mt-8 border-t" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Powered by{" "}
            <Link href="/" className="text-primary hover:underline">
              ShipTrack
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
