import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  MessageSquare,
  History,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Code2,
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: History,
    title: "Beautiful Changelog",
    desc: "Publish updates tagged as feature, fix, or improvement. Markdown support with a clean reader experience.",
  },
  {
    icon: MessageSquare,
    title: "Feature Voting Board",
    desc: "Let users submit ideas and vote. One vote per browser — no account needed to participate.",
  },
  {
    icon: Zap,
    title: "One-Line Embed",
    desc: "Drop a script tag on any site. Your changelog and board appear instantly — no dev work required.",
  },
  {
    icon: Star,
    title: "Build Trust",
    desc: "Active changelog signals you're shipping. Feature board shows you listen. Both build credibility.",
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    desc: "REST API + embed JSON endpoints. Webhook-ready. Integrate with your existing workflow.",
  },
  {
    icon: Rocket,
    title: "Zero Maintenance",
    desc: "We host everything. You ship updates. No database to manage, no infrastructure to maintain.",
  },
];

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for one product or side project.",
    features: [
      "1 product",
      "Unlimited changelog entries",
      "Feature board with voting",
      "Public changelog page",
      "Embed widget",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "per product / month",
    description: "For indie hackers running multiple products.",
    features: [
      "5 products",
      "Everything in Starter",
      "Custom branding",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
    cta: "Start Pro Trial",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Unlimited",
    price: "$20",
    period: "per month",
    description: "For teams and agencies managing many products.",
    features: [
      "Unlimited products",
      "Everything in Pro",
      "White-label widget",
      "Dedicated support",
      "Custom domain",
      "Team seats",
    ],
    cta: "Contact Us",
    href: "/auth/signup?plan=unlimited",
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────── */}
      <header className="border-b border-primary/10 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary neon-glow flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">ShipTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Demo
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <LinkButton href="/auth/signin" size="sm">
              Sign In
            </LinkButton>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className="gradient-hero py-28 md:py-40 relative overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            Live Demo Available
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
            Keep users in the loop with{" "}
            <span className="text-primary neon-text-glow">beautiful changelogs</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            ShipTrack lets indie hackers publish a changelog, collect feature
            requests, and let users vote — in under 5 minutes. No credit card.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/auth/signup" size="lg" className="neon-glow">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
            <LinkButton href="#demo" size="lg" variant="outline">
              <span className="opacity-70">See it live</span>
              <span className="ml-2">↓</span>
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for indie hackers who ship fast and want their users to feel
              the love.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="bg-card/50 border-primary/10 hover:border-primary/30 transition-colors"
              >
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo ───────────────────────────────── */}
      <section id="demo" className="py-24 border-t border-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Live Demo
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              See it in action
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              This is what your users see. Real page, real changelog, real
              voting.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Demo: changelog tab */}
            <div className="rounded-xl border border-primary/20 overflow-hidden neon-border">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-card/80 border-b border-primary/10">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">
                    yourproduct.shiptrack.dev / demo-saas
                  </span>
                </div>
              </div>
              {/* Demo product page content */}
              <div className="bg-background p-8 md:p-12">
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">NovaTask — Demo</h3>
                    <p className="text-muted-foreground text-sm">
                      AI-powered task manager for remote teams
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <LinkButton href="/demo-saas" size="sm" variant="outline">
                      Changelog
                    </LinkButton>
                    <LinkButton href="/demo-saas/board" size="sm" variant="outline">
                      Feature Board
                    </LinkButton>
                  </div>
                </div>

                {/* Changelog entries */}
                <div className="space-y-6">
                  {[
                    {
                      tag: "feature",
                      tagLabel: "Feature",
                      title: "AI task prioritization",
                      body: "NovaTask now automatically ranks your tasks by deadline, urgency, and your team's availability using our new AI model.",
                      date: "Mar 22, 2026",
                    },
                    {
                      tag: "improvement",
                      tagLabel: "Improvement",
                      title: "Dashboard load time reduced by 40%",
                      body: "We rewrote the dashboard query layer. Everything should feel snappier, especially on slower connections.",
                      date: "Mar 18, 2026",
                    },
                    {
                      tag: "fix",
                      tagLabel: "Fix",
                      title: "Slack notifications resynced after outage",
                      body: "All missed Slack notifications from Mar 15-17 have been resent. Apologies for the inconvenience.",
                      date: "Mar 17, 2026",
                    },
                  ].map((entry) => (
                    <div
                      key={entry.title}
                      className="border-l-2 border-primary/30 pl-5 py-1"
                    >
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-semibold text-base">{entry.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs border-primary/20 ${
                            entry.tag === "feature"
                              ? "text-blue-400"
                              : entry.tag === "fix"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {entry.tagLabel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {entry.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {entry.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <LinkButton href="/auth/signup" size="lg">
                Build your own <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────── */}
      <section id="pricing" className="py-24 border-t border-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Start free, scale when you&apos;re ready
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No credit card required. Cancel anytime. Your changelog stays
              public even on the free plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.highlight
                    ? "border-primary/40 neon-border bg-primary/5"
                    : "border-primary/10"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {tier.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {tier.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    href={tier.href}
                    className={`w-full mt-4 ${
                      tier.highlight ? "neon-glow" : ""
                    }`}
                  >
                    {tier.cta}
                  </LinkButton>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include a 14-day free trial on paid features. No surprises.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="py-24 border-t border-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to ship?
          </h2>
          <p className="text-muted-foreground text-xl mb-10 max-w-lg mx-auto">
            Set up in 5 minutes. No credit card. No infrastructure to manage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/auth/signup" size="lg" className="neon-glow">
              Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
            <LinkButton href="#demo" size="lg" variant="outline">
              See a Live Demo First
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-primary/10 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-semibold text-sm">ShipTrack</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ShipTrack. Built for builders
              who ship in public.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
