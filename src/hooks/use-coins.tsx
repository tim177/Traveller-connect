"use client";

import { useState, useEffect } from "react";
import { getUserCoins, addCoinTransaction } from "@/lib/coin-service";
import type { CoinTransaction } from "@/lib/types";

export function useCoins(userId: string) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load coin data
  useEffect(() => {
    const loadData = () => {
      const userData = getUserCoins(userId);
      setBalance(userData.balance);
      setTransactions(userData.transactions);
      setIsLoaded(true);
    };

    loadData();

    // Listen for coin updates
    const handleCoinUpdate = () => {
      loadData();
    };

    window.addEventListener("traveller_connect_coin_update", handleCoinUpdate);
    return () =>
      window.removeEventListener(
        "traveller_connect_coin_update",
        handleCoinUpdate
      );
  }, [userId]);

  // Add a transaction
  const addTransaction = (transaction: CoinTransaction) => {
    addCoinTransaction(userId, transaction);
    const userData = getUserCoins(userId);
    setBalance(userData.balance);
    setTransactions(userData.transactions);
  };

  return {
    balance,
    transactions,
    addTransaction,
    isLoaded,
    refreshBalance: () => {
      const userData = getUserCoins(userId);
      setBalance(userData.balance);
      setTransactions(userData.transactions);
    },
  };
}
