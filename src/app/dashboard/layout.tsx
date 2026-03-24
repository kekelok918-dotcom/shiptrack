import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/10 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">ShipTrack</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {session.email}
            </span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
