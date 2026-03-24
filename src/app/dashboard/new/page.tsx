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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
    setSubdomain(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, slug, subdomain }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create product");
        return;
      }

      router.push(`/dashboard/${data.slug}`);
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
        <LinkButton href="/dashboard" variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </LinkButton>
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground mt-1">
          Set up your product to start publishing changelogs
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Product"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                This will appear on your public changelog page
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your product"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="my-product"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  shiptrack.com/{slug || "..."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  placeholder="my-product"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(generateSlug(e.target.value))
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {subdomain || "..."}.shiptrack.com
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
              <LinkButton href="/dashboard" type="button" variant="outline">
                Cancel
              </LinkButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
