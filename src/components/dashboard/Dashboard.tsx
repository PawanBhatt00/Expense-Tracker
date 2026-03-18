import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Expense } from "@/types/expense";
import { useExpenses } from "@/hooks/use-expenses";
import { APP_AUTHOR, THEME } from "@/config";
import { TopNav } from "./TopNav";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { ExpenseFormHandle } from "./ExpenseForm";

function generateId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function Dashboard() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newExpenseId, setNewExpenseId] = useState<string | null>(null);
  const [updatedExpenseId, setUpdatedExpenseId] = useState<string | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const expenseFormRef = useRef<ExpenseFormHandle | null>(null);

  const handleAdd = useCallback(
    (data: Omit<Expense, "id" | "createdAt">) => {
      const id = generateId();
      const expense: Expense = {
        ...data,
        id,
        createdAt: Date.now(),
      };
      addExpense(expense);
      setNewExpenseId(id);
      setTimeout(() => setNewExpenseId(null), 1000);
      toast.success("Expense added", {
        description: `${data.title} — $${data.amount.toFixed(2)}`,
      });
    },
    [addExpense]
  );

  const handleEdit = useCallback(
    (expense: Expense) => {
      if (editingExpense && expense.id === editingExpense.id) {
        // Saving edit from form
        updateExpense(expense);
        setUpdatedExpenseId(expense.id);
        setTimeout(() => setUpdatedExpenseId(null), 800);
        setEditingExpense(null);
        toast.success("Expense updated", {
          description: `${expense.title} — $${expense.amount.toFixed(2)}`,
        });
      } else {
        // Select expense to edit
        setEditingExpense(expense);
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    },
    [editingExpense, updateExpense]
  );

  const handleDelete = useCallback(
    (expense: Expense) => {
      setDeletingExpenseId(expense.id);
      setTimeout(() => {
        deleteExpense(expense.id);
        setDeletingExpenseId(null);
        toast("Expense deleted", {
          description: expense.title,
        });
      }, 300);
    },
    [deleteExpense]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingExpense(null);
    expenseFormRef.current?.reset();
  }, []);

  const handleAddClick = () => {
    setEditingExpense(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    expenseFormRef.current?.submit(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.primary}1a 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-200px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.accent}1a 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top Nav */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <TopNav onAddClick={handleAddClick} />
      </div>

      {/* Main two-panel layout */}
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 65px)",
          paddingBottom: "40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Panel - 40% */}
        <div
          style={{
            width: "40%",
            minWidth: "320px",
            flexShrink: 0,
            overflowY: "auto",
            borderRight: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <LeftPanel
            expenses={expenses}
            newExpenseId={newExpenseId}
            updatedExpenseId={updatedExpenseId}
            deletingExpenseId={deletingExpenseId}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
            formRef={formRef as React.RefObject<HTMLDivElement>}
            expenseFormRef={expenseFormRef}
          />
        </div>

        {/* Right Panel - 60% */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <RightPanel expenses={expenses} />
        </div>
      </div>

      {/* Footer / Branding */}
      <footer
        className="text-xs text-center py-2"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "rgba(15, 22, 36, 0.7)",
          color: "rgba(255, 255, 255, 0.5)",
          zIndex: 20,
        }}
      >
        Designed by {"Pawan"}
      </footer>
    </div>
  );
}
