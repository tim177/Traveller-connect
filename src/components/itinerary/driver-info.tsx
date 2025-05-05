"use client";
import { DriverInfo } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { MapPin, MessageSquare, Phone, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface DriverInfoCardProps {
  driverInfo: DriverInfo;
  className?: string;
}

export default function DriverInfoCard({
  driverInfo,
  className,
}: DriverInfoCardProps) {
  return (
    <Card
      className={cn(
        "border-teal-200 bg-white/90 overflow-hidden shadow-sm",
        className
      )}
    >
      <CardHeader className="bg-teal-600 pb-2 pt-3 text-white">
        <CardTitle className="flex items-center text-base font-medium">
          <MapPin className="mr-2 h-4 w-4" />
          Today&apos;s Driver
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden">
            <Image
              src={
                driverInfo.photoUrl || "./placeholder.svg?height=120&width=120"
              }
              alt={driverInfo.name}
              fill
              className="object-cover"
              sizes="120px"
            />
          </div>

          <div className="flex-1 p-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold">{driverInfo.name}</h3>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({driverInfo.rating})
                </span>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Vehicle: </span>
                {driverInfo.carModel}
              </p>
              <p>
                <span className="font-medium">License Plate: </span>
                {driverInfo.carNumber}
              </p>
              <p>
                <span className="font-medium">Languages: </span>
                {driverInfo.languages.join(", ")}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" className="gap-1 bg-teal-600 hover:bg-teal-700">
                <Phone className="h-3 w-3" />
                Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <MessageSquare className="h-3 w-3" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
