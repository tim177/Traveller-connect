import type React from "react";
import {
  Bed,
  Bus,
  Calendar,
  CreditCard,
  HelpCircle,
  Plane,
} from "lucide-react";

// Get icon based on category
export function getCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case "booking":
      return <Calendar className="h-5 w-5 text-teal-600" />;
    case "accommodation":
      return <Bed className="h-5 w-5 text-teal-600" />;
    case "transportation":
      return <Plane className="h-5 w-5 text-teal-600" />;
    case "itinerary":
      return <Bus className="h-5 w-5 text-teal-600" />;
    case "refund":
      return <CreditCard className="h-5 w-5 text-teal-600" />;
    default:
      return <HelpCircle className="h-5 w-5 text-teal-600" />;
  }
}

// Get human-readable category label
export function getCategoryLabel(category: string): string {
  switch (category) {
    case "booking":
      return "Booking Issue";
    case "accommodation":
      return "Accommodation";
    case "transportation":
      return "Transportation";
    case "itinerary":
      return "Itinerary Change";
    case "refund":
      return "Refund Request";
    default:
      return "Other";
  }
}

// Get status color class
export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}
