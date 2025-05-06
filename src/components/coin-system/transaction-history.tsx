"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp, Coins } from "lucide-react";
import { getUserCoins } from "@/lib/coin-service";
import { cn } from "@/lib/utils";
import type { CoinTransaction } from "@/lib/types";

interface TransactionHistoryProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionHistory({
  userId,
  isOpen,
  onClose,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);

  // Load transactions when the component opens
  useEffect(() => {
    if (isOpen) {
      const userData = getUserCoins(userId);
      setTransactions(userData.transactions);

      const handleCoinsUpdated = () => {
        const userData = getUserCoins(userId);
        setTransactions(userData.transactions);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-3 pr-8">
          <SheetTitle className="text-teal-900">
            Coin Transaction History
          </SheetTitle>
          <SheetDescription>
            View your coin earning and spending history
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-12rem)] mt-6 pr-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                <Coins className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No transactions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start posting to earn coins!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function TransactionItem({ transaction }: { transaction: CoinTransaction }) {
  const isPositive = transaction.amount > 0;

  return (
    <div className="flex items-center justify-between rounded-lg border border-teal-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            isPositive
              ? "bg-teal-100 text-teal-700"
              : "bg-amber-100 text-amber-700"
          )}
        >
          {isPositive ? (
            <ArrowUp className="h-5 w-5" />
          ) : (
            <ArrowDown className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500">
            {format(new Date(transaction.timestamp), "MMM d, yyyy • h:mm a")}
          </p>
        </div>
      </div>
      <p
        className={cn(
          "font-bold",
          isPositive ? "text-teal-600" : "text-amber-600"
        )}
      >
        {isPositive ? "+" : ""}
        {transaction.amount}
      </p>
    </div>
  );
}
