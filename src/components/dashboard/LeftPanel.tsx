import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Expense, Category, CATEGORIES, CATEGORY_COLORS } from "@/types/expense";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseListItem } from "./ExpenseListItem";

interface LeftPanelProps {
  expenses: Expense[];
  newExpenseId?: string | null;
  updatedExpenseId?: string | null;
  deletingExpenseId?: string | null;
  onAdd: (data: Omit<Expense, "id" | "createdAt">) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  editingExpense?: Expense | null;
  onCancelEdit: () => void;
  formRef?: React.RefObject<HTMLDivElement>;
}

export function LeftPanel({
  expenses,
  newExpenseId,
  updatedExpenseId,
  deletingExpenseId,
  onAdd,
  onEdit,
  onDelete,
  editingExpense,
  onCancelEdit,
  formRef,
}: LeftPanelProps) {
  const [activeFilter, setActiveFilter] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExpenses = expenses.filter((exp) => {
    const matchesFilter = activeFilter === "All" || exp.category === activeFilter;
    const matchesSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "#0F1624",
      }}
    >
      {/* Form Section */}
      <div
        ref={formRef}
        className="flex-shrink-0 p-5"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(to bottom, #00D4AA, #0099FF)" }}
          />
          <h2 className="font-syne font-bold text-base" style={{ color: "#fff" }}>
            {editingExpense ? "Edit Expense" : "Add Expense"}
          </h2>
        </div>
        <div className="glass-card rounded-xl p-4">
          <ExpenseForm
            editingExpense={editingExpense}
            onSubmit={editingExpense ? (data) => onEdit({ ...editingExpense, ...data }) : onAdd}
            onCancel={onCancelEdit}
          />
        </div>
      </div>

      {/* List Section */}
      <div className="flex flex-col flex-1 overflow-hidden p-5 pt-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-5 rounded-full"
              style={{ background: "linear-gradient(to bottom, #00D4AA, #0099FF)" }}
            />
            <h2 className="font-syne font-bold text-base" style={{ color: "#fff" }}>
              Transactions
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-space"
              style={{
                background: "rgba(0, 212, 170, 0.1)",
                color: "#00D4AA",
                fontSize: "11px",
              }}
            >
              {filteredExpenses.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          />
          <input
            type="text"
            className="fintech-input font-space text-xs w-full"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2rem", height: "34px", fontSize: "12px" }}
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-3 py-1 rounded-full font-space text-xs font-medium transition-all duration-200 ${
              activeFilter === "All" ? "filter-chip-active" : ""
            }`}
            style={{
              background: activeFilter === "All" ? undefined : "rgba(255,255,255,0.05)",
              border: `1px solid ${activeFilter === "All" ? undefined : "rgba(255,255,255,0.08)"}`,
              color: activeFilter === "All" ? undefined : "rgba(255,255,255,0.5)",
              fontSize: "11px",
            }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full font-space font-medium transition-all duration-200 ${
                activeFilter === cat ? "filter-chip-active" : ""
              }`}
              style={{
                background:
                  activeFilter === cat
                    ? `rgba(${hexToRgb(CATEGORY_COLORS[cat])}, 0.15)`
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${
                  activeFilter === cat
                    ? CATEGORY_COLORS[cat] + "80"
                    : "rgba(255,255,255,0.08)"
                }`,
                color:
                  activeFilter === cat
                    ? CATEGORY_COLORS[cat]
                    : "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="flex-1 overflow-y-auto pr-0.5" style={{ minHeight: 0 }}>
          {filteredExpenses.length === 0 ? (
            <EmptyState
              hasExpenses={expenses.length > 0}
              isFiltered={activeFilter !== "All" || !!searchQuery}
            />
          ) : (
            <div>
              {filteredExpenses.map((expense, index) => (
                <ExpenseListItem
                  key={expense.id}
                  expense={expense}
                  index={index}
                  isNew={expense.id === newExpenseId}
                  isUpdated={expense.id === updatedExpenseId}
                  isDeleting={expense.id === deletingExpenseId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  hasExpenses,
  isFiltered,
}: {
  hasExpenses: boolean;
  isFiltered: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{
          background: "rgba(0, 212, 170, 0.08)",
          border: "1px solid rgba(0, 212, 170, 0.15)",
        }}
      >
        {isFiltered ? "🔍" : "📊"}
      </div>
      <div className="text-center">
        <p className="font-syne font-semibold text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {isFiltered ? "No matches found" : "No expenses yet"}
        </p>
        <p className="font-space text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {isFiltered
            ? "Try a different filter or search term"
            : "Add your first expense to get started"}
        </p>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0,0,0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
