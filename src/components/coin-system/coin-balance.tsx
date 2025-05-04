"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, ChevronRight, Gift } from "lucide-react";
import { getUserCoins } from "@/lib/coin-service";

interface CoinBalanceProps {
  userId: string;
  className?: string;
  onViewHistory?: () => void;
  onOpenShop?: () => void;
}

export default function CoinBalance({
  userId,
  className,
  onViewHistory,
  onOpenShop,
}: CoinBalanceProps) {
  const [balance, setBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load and update balance
  useEffect(() => {
    const updateBalance = () => {
      const userData = getUserCoins(userId);
      setBalance(userData.balance);
    };

    updateBalance();

    // Listen for coin updates
    const handleCoinsUpdated = () => {
      const newBalance = getUserCoins(userId).balance;
      if (newBalance !== balance) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      setBalance(newBalance);
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
  }, [userId, balance]);

  return (
    <Card
      className={`flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white transition-transform ${
            isAnimating ? "animate-bounce" : ""
          }`}
        >
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-teal-900">Travel Coins</h3>
          <p className="text-2xl font-bold text-teal-800">{balance}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-teal-700 hover:text-teal-900 hover:bg-teal-200/50 border-teal-300"
          onClick={onOpenShop}
        >
          <Gift className="mr-1 h-4 w-4" />
          Shop
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-teal-700 hover:text-teal-900 hover:bg-teal-200/50"
          onClick={onViewHistory}
        >
          History
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
