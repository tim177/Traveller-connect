"use client";

import type React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Gift, Award, Camera, MapPin, Sparkles } from "lucide-react";
import { getUserCoins, purchaseWithCoins } from "@/lib/coin-service";
import { useState, useEffect } from "react";

interface CoinShopProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Define shop item types
interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function CoinShop({ userId, isOpen, onClose }: CoinShopProps) {
  const [balance, setBalance] = useState(0);

  // Update balance when shop opens or coins change
  useEffect(() => {
    if (isOpen) {
      const userData = getUserCoins(userId);
      setBalance(userData.balance);

      const handleCoinsUpdated = () => {
        const userData = getUserCoins(userId);
        setBalance(userData.balance);
      };

      window.addEventListener(
        "traveller_connect_coin_update",
        handleCoinsUpdated
      );
      return () =>
        window.removeEventListener(
          "traveller_connect_coin_update",
          handleCoinsUpdated
        );
    }
  }, [isOpen, userId]);

  // Shop items data
  const shopItems: ShopItem[] = [
    {
      id: "premium-1",
      title: "Ad-Free Experience",
      description: "Enjoy the app without any advertisements for 30 days",
      price: 200,
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      isBestSeller: true,
    },
    {
      id: "premium-2",
      title: "Priority Support",
      description: "Get faster responses to your travel queries",
      price: 150,
      icon: <Award className="h-5 w-5 text-teal-500" />,
    },
    {
      id: "premium-3",
      title: "Exclusive Itineraries",
      description: "Access to premium travel routes and hidden gems",
      price: 300,
      icon: <MapPin className="h-5 w-5 text-rose-500" />,
      isNew: true,
    },
    {
      id: "filter-1",
      title: "Vintage Filter Pack",
      description: "Classic filters to give your travel photos a timeless look",
      price: 100,
      icon: <Camera className="h-5 w-5 text-amber-500" />,
    },
  ];

  const handlePurchase = (item: ShopItem) => {
    purchaseWithCoins(userId, item.title, item.price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-3 pr-8">
          <SheetTitle className="flex items-center gap-2 text-teal-900">
            <Gift className="h-5 w-5" /> Coin Shop
          </SheetTitle>
          <SheetDescription>
            Spend your travel coins on exclusive items and features
          </SheetDescription>
        </SheetHeader>

        <div className="mt-2 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Coins className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Your Balance</p>
              <p className="text-xl font-bold text-teal-700">{balance} coins</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-14rem)] mt-6 px-4">
          <div className="grid gap-4">
            {shopItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                onPurchase={handlePurchase}
                canAfford={balance >= item.price}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface ShopItemCardProps {
  item: ShopItem;
  onPurchase: (item: ShopItem) => void;
  canAfford: boolean;
}

function ShopItemCard({ item, onPurchase, canAfford }: ShopItemCardProps) {
  return (
    <Card className="overflow-hidden border-teal-200 bg-white py-0">
      <CardHeader className="px-4 pt-4 pb-0 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              {item.icon}
            </div>
            <div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <div className="mt-1 flex flex-wrap gap-2">
                {item.isNew && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    New
                  </Badge>
                )}
                {item.isBestSeller && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                    Best Seller
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
            <Coins className="mr-1 h-3 w-3" />
            {item.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 py-0">
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end border-t px-4 !py-2">
        <Button
          className={
            canAfford ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300"
          }
          size="sm"
          disabled={!canAfford}
          onClick={() => onPurchase(item)}
        >
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
