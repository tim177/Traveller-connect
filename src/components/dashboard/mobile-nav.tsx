"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/zustand-store";
import { BookOpen, Calendar, Home, MessageSquareIcon } from "lucide-react";

export default function MobileNav() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-teal-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-around">
        <NavButton
          icon={<Home className="h-6 w-6" />}
          label="Feed"
          isActive={activeTab === "feed"}
          onClick={() => setActiveTab("feed")}
        />
        <NavButton
          icon={<BookOpen className="h-6 w-6" />}
          label="Blogs"
          isActive={activeTab === "blogs"}
          onClick={() => setActiveTab("blogs")}
        />
        <NavButton
          icon={<MessageSquareIcon className="h-6 w-6" />}
          label="Support"
          isActive={activeTab === "escalations"}
          onClick={() => setActiveTab("escalations")}
        />
        <NavButton
          icon={<Calendar className="h-6 w-6" />}
          label="Itinerary"
          isActive={activeTab === "itinerary"}
          onClick={() => setActiveTab("itinerary")}
        />
      </div>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-3",
        isActive ? "text-teal-600" : "text-gray-500"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs"> {label}</span>
    </button>
  );
}
