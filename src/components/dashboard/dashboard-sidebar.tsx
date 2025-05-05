"use client";

import { useUIStore } from "@/lib/zustand-store";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  Coins,
  Home,
  MessageSquareIcon,
  X,
} from "lucide-react";
import { Sheet, SheetContent } from "../ui/sheet";

export default function DashboardSidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useUIStore();

  const handleTabChange = (
    tab: "feed" | "blogs" | "escalations" | "itinerary"
  ) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  //close the sidebar when the screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const NavItems = () => (
    <div className="flex flex-col gap-2 p-2">
      <Button
        variant={activeTab === "feed" ? "default" : "ghost"}
        className={cn(
          "justify-start",
          activeTab === "feed"
            ? "bg-teal-600 hover:bg-teal-700 text-white"
            : "hover:bg-teal-100"
        )}
        onClick={() => handleTabChange("feed")}
      >
        <Home className="mr-2 h-4 w-4" />
        Travel Feed
      </Button>
      <Button
        variant={activeTab === "blogs" ? "default" : "ghost"}
        className={cn(
          "justify-start",
          activeTab === "blogs"
            ? "bg-teal-600 hover:bg-teal-700 text-white"
            : "hover:bg-teal-100"
        )}
        onClick={() => handleTabChange("blogs")}
      >
        <BookOpen className="mr-2 h-5 w-5" />
        Blogs & Stories
      </Button>
      <Button
        variant={activeTab === "itinerary" ? "default" : "ghost"}
        className={cn(
          "justify-start",
          activeTab === "itinerary"
            ? "bg-teal-600 hover:bg-teal-700 text-white"
            : "hover:bg-teal-100"
        )}
        onClick={() => handleTabChange("itinerary")}
      >
        <Calendar className="mr-2 h-5 w-5" />
        Itinerary
      </Button>
      <Button
        variant={activeTab === "escalations" ? "default" : "ghost"}
        className={cn(
          "justify-start",
          activeTab === "escalations"
            ? "bg-teal-600 hover:bg-teal-700 text-white"
            : "hover:bg-teal-100"
        )}
        onClick={() => handleTabChange("escalations")}
      >
        <MessageSquareIcon className="mr-2 h-5 w-5" />
        Escalations
      </Button>
    </div>
  );

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 border-r border-teal-200 bg-white p-0"
        >
          <div className="flex h-14 items-center justify-between border-b border-teal-200 px-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-teal-600" />
              <h2 className="font-semibold text-teal-800">Traveller Connect</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <NavItems />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 shrink-0 border-r border-teal-200 bg-white md:block">
        <div className="flex h-14 items-center border-b border-teal-200 px-4 ">
          <Coins className="mr-2 h-5 w-5 text-teal-600" />
          <h2 className="font-semibold text-teal-800">Traveller Connect</h2>
        </div>
        <NavItems />
      </div>
    </>
  );
}
