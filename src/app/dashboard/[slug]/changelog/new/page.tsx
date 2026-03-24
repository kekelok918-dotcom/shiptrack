"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function NewChangelogEntryPage({ params }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("feature");
  const handleTagChange = (value: string | null) => {
    if (value !== null) setTag(value);
  };
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  // Get slug from params
  useState(() => {
    params.then((p) => setSlug(p.slug));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const slugValue = (await params).slug;
      const res = await fetch(`/api/products/${slugValue}/changelog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, tag }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create entry");
        return;
      }

      router.push(`/dashboard/${slugValue}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <LinkButton href={`/dashboard/${slug}/changelog`} variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </LinkButton>
        <h1 className="text-3xl font-bold">New Changelog Entry</h1>
        <p className="text-muted-foreground mt-1">
          Share an update with your users
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Added dark mode support"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Select value={tag} onValueChange={handleTagChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="fix">Fix</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Categorize your update to help users understand the type of change
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Content</Label>
              <Textarea
                id="body"
                placeholder="Describe what changed. Markdown is supported..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px]"
                required
              />
              <p className="text-sm text-muted-foreground">
                Use markdown for formatting: **bold**, *italic*, `code`, etc.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Publishing..." : "Publish Entry"}
              </Button>
              <LinkButton href={`/dashboard/${slug}`} type="button" variant="outline">
                Cancel
              </LinkButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
