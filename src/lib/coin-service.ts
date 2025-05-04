import { toast } from "sonner";
import { CoinTransaction } from "./types";

const COINS_STORAGE_KEY = "traveller_connect_coins";
const MAX_COINS = 1000;

interface UserCoins {
  userId: string;
  balance: number;
  transactions: CoinTransaction[];
}

//Load coin data from localstorage
export function getUserCoins(userId: string): UserCoins {
  if (typeof window === "undefined") {
    return { userId, balance: 0, transactions: [] };
  }

  const storedData = localStorage.getItem(COINS_STORAGE_KEY);
  if (storedData) {
    try {
      const allCoinsData = JSON.parse(storedData) as Record<string, UserCoins>;
      if (allCoinsData[userId]) {
        return allCoinsData[userId];
      }
    } catch (error) {
      console.log("Failed to load the parsed coins data: ", error);
    }
  }

  return { userId, balance: 0, transactions: [] };
}

//Save coin data to local storage
export function saveUserCoins(data: UserCoins): void {
  if (typeof window === "undefined") return;

  const storedData = localStorage.getItem(COINS_STORAGE_KEY);
  let allCoinsData: Record<string, UserCoins> = {};

  if (storedData) {
    try {
      allCoinsData = JSON.parse(storedData);
    } catch (error) {
      console.log("Failed to parse stored coin data: ", error);
    }
  }

  allCoinsData[data.userId] = data;
  localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(allCoinsData));

  //Dispatch a custom event for custom updates
  window.dispatchEvent(
    new CustomEvent("traveller_connect_coin_update", {
      detail: { userId: data.userId },
    })
  );
}

//add transaction and update balance
export function addCoinTransaction(
  userId: string,
  transaction: CoinTransaction
): UserCoins {
  const userData = getUserCoins(userId);

  //calculate new balance
  let newBalance = userData.balance + transaction.amount;

  if (transaction.amount > 0 && newBalance > MAX_COINS) {
    transaction.amount = MAX_COINS - userData.balance;
    newBalance = MAX_COINS;
    toast.info("You've reached the maximum coin balance!");
  }

  //Ensure the balance doesn't go below 0
  if (newBalance < 0) {
    toast.error("Not enough coins for this purchase");
    return userData;
  }

  const newData = {
    userId,
    balance: newBalance,
    transactions: [transaction, ...userData.transactions],
  };

  saveUserCoins(newData);
  return newData;
}

//Purchase the items with coins
export function purchaseWithCoins(
  userId: string,
  itemName: string,
  price: number
): boolean {
  const userData = getUserCoins(userId);

  if (userData.balance < price) {
    toast.error(`Not enough coins to purchase ${itemName}`);
    return false;
  }

  const transaction: CoinTransaction = {
    id: `purchase-${Date.now()}`,
    userId,
    amount: -price,
    description: `Purchased ${itemName}`,
    timestamp: new Date().toISOString(),
  };

  addCoinTransaction(userId, transaction);
  toast.success(`Successfully purchsed ${itemName}`);

  return true;
}

// Award coins to user
export function awardCoins(
  userId: string,
  amount: number,
  reason: string
): void {
  const transaction: CoinTransaction = {
    id: `award-${Date.now()}`,
    userId,
    amount,
    description: reason,
    timestamp: new Date().toISOString(),
  };

  addCoinTransaction(userId, transaction);

  toast.success(`You earned ${amount} coins!🎉`);
}
