"use client";
import { getItinerary } from "@/lib/itinerary-service";
import { Itinerary, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertCircle,
  Bed,
  Calendar,
  Car,
  Clock,
  Coffee,
  Download,
  MapPin,
  Utensils,
} from "lucide-react";
import DriverInfoCard from "./driver-info";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

interface ItineraryViewProps {
  currentUser: User;
}

export default function ItineraryView({ currentUser }: ItineraryViewProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("day1");

  useEffect(() => {
    const loadedItinerary = getItinerary(currentUser.id);
    setItinerary(loadedItinerary);

    //set active day to today
    if (loadedItinerary) {
      const today = new Date();
      const startDate = new Date(loadedItinerary.startDate);
      const daysDiff = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff > 0 && daysDiff < loadedItinerary.days.length) {
        setActiveDay(`day${daysDiff + 1}`);
      }
    }

    setIsLoading(false);
  }, [currentUser.id]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="rounded-lg border border-dashed border-teal-300 bg-white/50 p-8 text-center">
        <p className="text-muted-foreground">
          No itinerary found for your account.
        </p>
      </div>
    );
  }

  const activeDayData = itinerary.days.find((day) => day.id === activeDay);
  const today = new Date();
  const tripStartDate = new Date(itinerary.startDate);
  const tripEndDate = new Date(itinerary.endDate);
  const isTripActive = today >= tripStartDate && today <= tripEndDate;
  const isTripUpcoming = today < tripStartDate;
  const isTripCompleted = today > tripEndDate;

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-teal-800">
              {itinerary.title}
            </h2>
            {isTripActive && (
              <Badge className="bg-green-100 text-green-800">Active Trip</Badge>
            )}
            {isTripUpcoming && (
              <Badge className="bg-blue-100 text-blue-800">Upcoming Trip</Badge>
            )}
            {isTripCompleted && (
              <Badge className="bg-gray-100 text-gray-800">
                Completed Trip
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(itinerary.startDate).toLocaleDateString()} -
            {new Date(itinerary.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Trip Status Alert */}
      {isTripActive && (
        <Card className="mb-6 border-green-200 bg-green-50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">
              Your trip is currently active! Check today&apos;s itinerary and
              driver details below.
            </p>
          </CardContent>
        </Card>
      )}

      {isTripUpcoming && (
        <Card className="mb-6 border-blue-200 bg-blue-50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              Your trip starts in{" "}
              {Math.ceil(
                (tripStartDate.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days! Review your itinerary and download your travel documents.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6 border-teal-200 bg-white/90 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trip Overview</CardTitle>
          <CardDescription>
            Your complete travel package details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-teal-600" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">
                  {itinerary.destination}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-teal-600" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {itinerary.days.length} days, {itinerary.days.length - 1}
                  nights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bed className="mt-0.5 h-5 w-5 text-teal-600" />
              <div>
                <p className="font-medium">Accommodation</p>
                <p className="text-sm text-muted-foreground">
                  {itinerary.hotel.name}, {itinerary.hotel.location}
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 font-medium">Inclusions</h4>
                <ul className="space-y-1 text-sm">
                  {itinerary.inclusions.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Exclusions</h4>
                <ul className="space-y-1 text-sm">
                  {itinerary.exclusions.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-teal-700"
              >
                <Download className="h-4 w-4" />
                Hotel Voucher
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-teal-700"
              >
                <Download className="h-4 w-4" />
                Flight Tickets
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-teal-700"
              >
                <Download className="h-4 w-4" />
                Complete Itinerary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's driver info - only show if trip is active */}
      {isTripActive && itinerary.driverInfo && (
        <DriverInfoCard driverInfo={itinerary.driverInfo} className="mb-6" />
      )}

      {/* Day wise itinerary */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-teal-800">
          Day-wise Itinerary
        </h3>

        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="mb-4 w-full overflow-x-auto">
            {itinerary.days.map((day) => (
              <TabsTrigger key={day.id} value={day.id} className="min-w-[80px]">
                Day {day.id.replace("day", "")}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeDayData && (
            <TabsContent value={activeDayData.id} className="mt-0">
              <Card className="border-teal-200 bg-white/90 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {activeDayData.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-teal-50 text-teal-700"
                    >
                      {new Date(activeDayData.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{activeDayData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeDayData.activities.map((activity, index) => (
                      <div key={index} className="relative pl-6">
                        {/* Timeline connector */}
                        {index < activeDayData.activities.length - 1 && (
                          <div className="absolute left-[9px] top-6 h-[calc(100%-24px)] w-0.5 bg-teal-200"></div>
                        )}

                        <div className="relative">
                          {/* Time indicator */}
                          <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                            <Clock className="h-3 w-3" />
                          </div>

                          <div className="mb-1 flex items-center gap-2">
                            <p className="font-medium">{activity.time}</p>
                            {activity.type === "meal" && (
                              <Utensils className="h-4 w-4 text-amber-500" />
                            )}
                            {activity.type === "sightseeing" && (
                              <MapPin className="h-4 w-4 text-teal-500" />
                            )}
                            {activity.type === "leisure" && (
                              <Coffee className="h-4 w-4 text-blue-500" />
                            )}
                            {activity.type === "transport" && (
                              <Car className="h-4 w-4 text-gray-500" />
                            )}
                          </div>

                          <div className="rounded-md bg-teal-50 p-3">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                            {activity.location && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-teal-700">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
