export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Others";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: number; // timestamp for ordering
}

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#FF6B6B",        // coral
  Transport: "#F59E0B",   // amber
  Shopping: "#8B5CF6",    // violet
  Bills: "#38BDF8",       // sky blue
  Entertainment: "#FB7185", // rose
  Others: "#94A3B8",      // slate
};

export const CATEGORY_BG: Record<Category, string> = {
  Food: "rgba(255, 107, 107, 0.15)",
  Transport: "rgba(245, 158, 11, 0.15)",
  Shopping: "rgba(139, 92, 246, 0.15)",
  Bills: "rgba(56, 189, 248, 0.15)",
  Entertainment: "rgba(251, 113, 133, 0.15)",
  Others: "rgba(148, 163, 184, 0.15)",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "📋",
  Entertainment: "🎬",
  Others: "📦",
};
