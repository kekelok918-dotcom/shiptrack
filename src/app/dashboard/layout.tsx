import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { Sparkles, LayoutDashboard, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ShipTrack</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session?.user?.email ?? "Account"}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-card/50 p-4 hidden md:block">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>My Products</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
