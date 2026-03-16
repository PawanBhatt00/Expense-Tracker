import { useState, useCallback } from "react";
import { Expense } from "@/types/expense";

const STORAGE_KEY = "fintech_expenses";

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // ignore storage errors
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => {
      const next = [expense, ...prev];
      saveExpenses(next);
      return next;
    });
  }, []);

  const updateExpense = useCallback((updated: Expense) => {
    setExpenses((prev) => {
      const next = prev.map((e) => (e.id === updated.id ? updated : e));
      saveExpenses(next);
      return next;
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveExpenses(next);
      return next;
    });
  }, []);

  return { expenses, addExpense, updateExpense, deleteExpense };
}
