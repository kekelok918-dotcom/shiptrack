import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, CheckCircle, ExternalLink, MessageSquare, Clock } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

const DEMO_CHANGELOG = [
  {
    id: "1",
    title: "AI task prioritization is now live",
    body: "NovaTask now automatically ranks your tasks by deadline, urgency, and your team's availability. The AI looks at your calendar, past completion times, and who's online — then reshuffles your queue. Less planning, more doing.",
    tag: "feature",
    createdAt: "Mar 22, 2026",
  },
  {
    id: "2",
    title: "Dashboard load time reduced by 40%",
    body: "We rewrote the dashboard query layer from scratch. Parallel data fetching, aggressive caching, and a new virtual list for long task lists. Everything should feel noticeably snappier, especially on slower connections.",
    tag: "improvement",
    createdAt: "Mar 18, 2026",
  },
  {
    id: "3",
    title: "Slack notification outage — all alerts resent",
    body: "Our Slack webhook provider had a 3-hour outage on March 15. If you missed notifications during that window, they've now been resent. Sorry for the noise — we've added a fallback provider to prevent this going forward.",
    tag: "fix",
    createdAt: "Mar 17, 2026",
  },
  {
    id: "4",
    title: "CSV bulk import launches",
    body: "You can now import tasks in bulk via CSV. Columns map to: title, due_date, priority, assignee, labels. Export works too. Great for teams migrating from spreadsheets or Trello.",
    tag: "feature",
    createdAt: "Mar 10, 2026",
  },
  {
    id: "5",
    title: "Timezone-aware scheduling",
    body: "Due dates now respect each teammate's local timezone. A task due 'tomorrow at 9am' will show as tomorrow at 9am for your teammate in Tokyo, not 9am UTC.",
    tag: "feature",
    createdAt: "Mar 4, 2026",
  },
];

const DEMO_FEATURES = [
  {
    id: "1",
    title: "Dark mode",
    description: "Full dark theme across web and mobile. Respects system preference or manual toggle.",
    status: "planned",
    votes: 87,
  },
  {
    id: "2",
    title: "iOS & Android app",
    description: "Native mobile apps with offline support and push notifications.",
    status: "open",
    votes: 64,
  },
  {
    id: "3",
    title: "Slack integration",
    description: "Create tasks from Slack messages. Get task reminders in Slack channels.",
    status: "open",
    votes: 52,
  },
  {
    id: "4",
    title: "Zapier / Make.com integration",
    description: "Connect NovaTask to 5000+ apps. Automate workflows without code.",
    status: "open",
    votes: 41,
  },
  {
    id: "5",
    title: "Recurring tasks",
    description: "Set tasks to repeat daily, weekly, monthly, or custom intervals.",
    status: "shipped",
    votes: 38,
  },
  {
    id: "6",
    title: "Team analytics dashboard",
    description: "Velocity charts, team workload heatmaps, and sprint retrospectives.",
    status: "open",
    votes: 29,
  },
];

const TAG_STYLES: Record<string, string> = {
  feature: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  improvement: "bg-green-500/10 text-green-400 border-green-500/20",
  fix: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_STYLES: Record<string, string> = {
  open: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  planned: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  shipped: "bg-green-500/10 text-green-400 border-green-500/20",
  declined: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  planned: "Planned",
  shipped: "Shipped",
  declined: "Declined",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-base font-bold text-primary">N</span>
            </div>
            <div>
              <span className="font-bold">NovaTask</span>
              <span className="text-xs text-muted-foreground ml-2 bg-primary/10 px-2 py-0.5 rounded-full">
                Demo
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <LinkButton href="#changelog" size="sm" variant="ghost">
              Changelog
            </LinkButton>
            <LinkButton href="#board" size="sm" variant="ghost">
              Feature Board
            </LinkButton>
            <LinkButton href="/auth/signup" size="sm">
              Build Your Own
            </LinkButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Product intro */}
        <div className="mb-12">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            ✨ This is a live preview
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            NovaTask — AI task manager for remote teams
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            NovaTask uses AI to prioritize your task queue, sync across timezones,
            and keep your distributed team aligned. 2,400+ remote teams trust
            NovaTask to cut planning overhead in half.
          </p>
          <div className="flex gap-3 mt-5">
            <LinkButton href="/auth/signup" size="sm">
              Try NovaTask Free
            </LinkButton>
            <LinkButton href="#board" size="sm" variant="outline">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Request a Feature
            </LinkButton>
          </div>
        </div>

        {/* Changelog */}
        <section id="changelog" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Changelog</h2>
            <Badge variant="outline" className="text-xs">
              Latest updates
            </Badge>
          </div>

          <div className="space-y-0">
            {DEMO_CHANGELOG.map((entry, i) => (
              <div
                key={entry.id}
                className={`border-l-2 py-6 px-5 ${
                  entry.tag === "feature"
                    ? "border-blue-500/40"
                    : entry.tag === "fix"
                    ? "border-red-500/40"
                    : "border-green-500/40"
                } ${i !== DEMO_CHANGELOG.length - 1 ? "border-b border-border/30" : ""}`}
              >
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-semibold text-base">{entry.title}</h3>
                  <Badge
                    variant="outline"
                    className={`text-xs ${TAG_STYLES[entry.tag] ?? ""}`}
                  >
                    {entry.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {entry.createdAt}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-primary/10 bg-primary/5 text-center">
            <p className="text-sm text-muted-foreground">
              This is a demo of the changelog widget.{" "}
              <LinkButton href="/auth/signup" variant="link" size="sm" className="text-primary">
                Build your own →
              </LinkButton>
            </p>
          </div>
        </section>

        {/* Feature Board */}
        <section id="board">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Feature Board</h2>
            <Badge variant="outline" className="text-xs">
              Community requests
            </Badge>
          </div>

          <p className="text-muted-foreground mb-6">
            Vote on what you want next. The highest-voted features get built first.
          </p>

          <div className="space-y-3">
            {DEMO_FEATURES.sort((a, b) => b.votes - a.votes).map((feature) => (
              <Card
                key={feature.id}
                className="border-primary/10 hover:border-primary/25 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Vote */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-primary/20 bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4 text-primary" />
                      </button>
                      <span className="text-sm font-semibold text-primary">
                        {feature.votes}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-medium text-sm">{feature.title}</h3>
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_STYLES[feature.status] ?? ""}`}
                        >
                          {STATUS_LABELS[feature.status] ?? feature.status}
                        </Badge>
                        {feature.status === "shipped" && (
                          <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                        )}
                      </div>
                      {feature.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-primary/10 bg-primary/5 text-center">
            <p className="text-sm text-muted-foreground">
              This is a demo of the feature board.{" "}
              <LinkButton href="/auth/signup" variant="link" size="sm" className="text-primary">
                Create your own →{" "}
              </LinkButton>
            </p>
          </div>
        </section>
      </main>

      {/* Bottom CTA */}
      <section className="border-t border-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Want this for your product?
          </h2>
          <p className="text-muted-foreground mb-6">
            Set up your changelog and feature board in 5 minutes. Free to start.
          </p>
          <LinkButton href="/auth/signup" size="lg" className="neon-glow">
            Get Started Free <ArrowUp className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
