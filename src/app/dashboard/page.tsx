"use client";
import TravelFeed from "@/components/travel-feed/travel-feed";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/zustand-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { activeTab } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-teal-50 to-teal-100 p-4 ">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-teal-200 bg-white/80 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold text-teal-800">Traveller Connect</h1>
        <Button
          variant="ghost"
          className="text-teal-700"
          size="sm"
          onClick={logout}
        >
          Logout
        </Button>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 overflow-auto pb-20 md:pb-6">
          <div
            className={cn(
              "container mx-auto max-w-md px-4 py-6",
              activeTab !== "feed" && "hidden"
            )}
          >
            {activeTab === "feed" && <TravelFeed currentUser={user} />}
          </div>
        </main>
      </div>
    </div>
  );
}
