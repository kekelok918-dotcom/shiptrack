import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  MessageSquare,
  History,
  Sparkles,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ShipTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <LinkButton href="/auth/signin">Get Started</LinkButton>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Now in Public Beta
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
            Keep your users in the loop with{" "}
            <span className="text-primary">beautiful changelogs</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ShipTrack makes it easy to publish changelogs, collect feature
            requests, and let your users vote on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/auth/signin" size="lg">
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
            <LinkButton href="/demo" size="lg" variant="outline">
                View Demo
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-lg">
              Built for modern product teams who care about transparency
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <History className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Changelog Feed</CardTitle>
                <CardDescription>
                  Publish updates with rich markdown support. Tag entries as
                  features, fixes, or improvements.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Feature Board</CardTitle>
                <CardDescription>
                  Let users submit and upvote feature ideas. See what your
                  audience wants most.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Embed Widget</CardTitle>
                <CardDescription>
                  Drop a single script tag on your site to display the latest
                  updates and top features.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create your product</h3>
              <p className="text-muted-foreground">
                Set up your product in seconds with a name, slug, and subdomain.
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Post your updates</h3>
              <p className="text-muted-foreground">
                Write changelog entries and manage feature requests from your
                dashboard.
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Share with the world</h3>
              <p className="text-muted-foreground">
                Your public page and embed widget keep users informed
                automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Build trust with transparent communication
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Reduce support burden</strong>
                    <span className="text-muted-foreground">
                      Users who see your changelog have fewer questions.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Prioritize with data</strong>
                    <span className="text-muted-foreground">
                      Let users vote so you build what matters most.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Easy to embed</strong>
                    <span className="text-muted-foreground">
                      One script tag works on any website.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="font-semibold">Top Voted Features</span>
              </div>
              <div className="space-y-3">
                {["Dark mode support", "API access", "Mobile app"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <span className="text-sm">{item}</span>
                      <Badge variant="secondary">{48 - i * 12} votes</Badge>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to keep users informed?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start free, no credit card required.
          </p>
          <LinkButton href="/auth/signin" size="lg">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">ShipTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ShipTrack. Built for builders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
