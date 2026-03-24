"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CheckCircle, ArrowUp, Loader2, AlertCircle } from "lucide-react";

interface FeatureRequest {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date | string;
  _count: {
    votes: number;
  };
}

interface Props {
  features: FeatureRequest[];
  productSlug: string;
  statusColors: Record<string, string>;
}

export function FeatureBoardClient({ features, productSlug, statusColors }: Props) {
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(features.map((f) => [f.id, f._count.votes]))
  );
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New request form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newSubmitted, setNewSubmitted] = useState(false);

  const visitorId =
    typeof window !== "undefined"
      ? localStorage.getItem(`shiptrack_visitor_${productSlug}`) ||
        (() => {
          const id = Math.random().toString(36).slice(2);
          localStorage.setItem(`shiptrack_visitor_${productSlug}`, id);
          return id;
        })()
      : "";

  const handleVote = async (featureId: string) => {
    if (hasVoted[featureId]) return;
    setSubmitting(featureId);
    setError(null);

    try {
      const res = await fetch(
        `/api/products/${productSlug}/features/${featureId}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        }
      );

      if (res.ok) {
        setHasVoted((prev) => ({ ...prev, [featureId]: true }));
        setVotes((prev) => ({ ...prev, [featureId]: (prev[featureId] || 0) + 1 }));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to vote");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(null);
    }
  };

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmittingNew(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productSlug}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, visitorId }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setNewSubmitted(true);
        setTimeout(() => setNewSubmitted(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmittingNew(false);
    }
  };

  const statusLabel: Record<string, string> = {
    open: "Open",
    planned: "Planned",
    shipped: "Shipped",
    declined: "Declined",
  };

  return (
    <div className="space-y-10">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Feature list */}
      {features.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">No feature requests yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to suggest a feature below
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <Card key={feature.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Vote button */}
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      size="sm"
                      variant={
                        hasVoted[feature.id] ? "default" : "outline"
                      }
                      className="h-8 w-8 p-0"
                      disabled={hasVoted[feature.id] || submitting === feature.id}
                      onClick={() => handleVote(feature.id)}
                    >
                      {submitting === feature.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : hasVoted[feature.id] ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm font-medium">{votes[feature.id] ?? feature._count.votes}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{feature.title}</h3>
                      <Badge
                        className={`text-xs ${statusColors[feature.status] || statusColors.open}`}
                      >
                        {statusLabel[feature.status] || feature.status}
                      </Badge>
                    </div>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(
                        new Date(feature.createdAt),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submit new request */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Suggest a Feature</h3>
        {newSubmitted ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="font-medium">Feature submitted!</p>
              <p className="text-sm text-muted-foreground">
                Thanks for the suggestion. Vote on others while you wait.
              </p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div>
              <Label htmlFor="title">Feature title</Label>
              <Input
                id="title"
                placeholder="What would you like to see?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us more about this feature..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={submittingNew || !title.trim()}>
              {submittingNew ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feature"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
