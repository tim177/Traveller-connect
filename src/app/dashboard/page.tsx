"use client";
import BlogsView from "@/components/blogs/blogs-view";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";
import EscalationSystem from "@/components/escalation/escalation-system";
import ItineraryView from "@/components/itinerary/itinerary-view";
import TravelFeed from "@/components/travel-feed/travel-feed";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/zustand-store";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { activeTab, toogleSidebar } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-teal-50 to-teal-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-teal-200 bg-white/90 px-4 py-3 backdrop-blur shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toogleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toogle menu</span>
          </Button>
          <h1 className="text-xl font-bold text-teal-800">Traveller Connect</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-teal-700"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto pb-20 md:pb-6">
          <div
            className={cn(
              "container mx-auto max-w-md px-4 py-6",
              activeTab !== "feed" && "hidden"
            )}
          >
            {activeTab === "feed" && <TravelFeed currentUser={user} />}
          </div>

          <div
            className={cn(
              "container mx-auto max-w-md px-4 py-6",
              activeTab !== "escalations" && "hidden"
            )}
          >
            {activeTab === "escalations" && (
              <EscalationSystem currentUser={user} />
            )}
          </div>

          <div
            className={cn(
              "container mx-auto max-w-md px-4 py-6",
              activeTab !== "itinerary" && "hidden"
            )}
          >
            {activeTab === "itinerary" && <ItineraryView currentUser={user} />}
          </div>

          <div
            className={cn(
              "container mx-auto max-w-md px-4 py-6",
              activeTab !== "blogs" && "hidden"
            )}
          >
            {activeTab === "blogs" && <BlogsView />}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
