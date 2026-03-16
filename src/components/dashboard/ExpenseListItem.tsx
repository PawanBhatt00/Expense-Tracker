import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Expense, CATEGORY_COLORS, CATEGORY_BG, CATEGORY_ICONS } from "@/types/expense";

interface ExpenseListItemProps {
  expense: Expense;
  index: number;
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleting?: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseListItem({
  expense,
  index,
  isNew = false,
  isUpdated = false,
  isDeleting = false,
  onEdit,
  onDelete,
}: ExpenseListItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Apply animation class
  useEffect(() => {
    if (isUpdated && itemRef.current) {
      itemRef.current.classList.add("animate-highlight");
      const timer = setTimeout(() => {
        itemRef.current?.classList.remove("animate-highlight");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isUpdated]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(expense);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const color = CATEGORY_COLORS[expense.category];
  const bg = CATEGORY_BG[expense.category];
  const icon = CATEGORY_ICONS[expense.category];

  const animDelay = Math.min(index * 50, 400);

  return (
    <div
      ref={itemRef}
      className={`expense-row relative rounded-xl transition-all duration-200 ${
        isNew ? "animate-slide-in" : "animate-stagger-in"
      } ${isDeleting ? "animate-slide-out" : ""}`}
      style={{
        animationDelay: isNew ? "0ms" : `${animDelay}ms`,
        opacity: 0,
        animationFillMode: "forwards",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        marginBottom: "6px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.055)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
        setShowDeleteConfirm(false);
      }}
    >
      {showDeleteConfirm ? (
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <span className="font-space text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            Delete "{expense.title}"?
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCancelDelete}
              className="btn-press px-3 py-1 rounded-md font-space text-xs transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="btn-press px-3 py-1 rounded-md font-space text-xs transition-all"
              style={{
                background: "rgba(255,107,107,0.2)",
                color: "#FF6B6B",
                border: "1px solid rgba(255,107,107,0.3)",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Category Icon Badge */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: bg, border: `1px solid ${color}30` }}
          >
            {icon}
          </div>

          {/* Title + Category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="font-space text-sm font-medium truncate"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {expense.title}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-space flex-shrink-0"
                style={{
                  background: bg,
                  color: color,
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {expense.category}
              </span>
            </div>
            <span
              className="font-space text-xs"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {format(parseISO(expense.date), "MMM d, yyyy")}
            </span>
          </div>

          {/* Amount */}
          <span
            className="font-mono-custom text-sm font-medium flex-shrink-0"
            style={{ color: "#00D4AA" }}
          >
            ${expense.amount.toFixed(2)}
          </span>

          {/* Action Icons */}
          <div className="action-icons flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(expense)}
              className="btn-press w-7 h-7 rounded-md flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 212, 170, 0.15)";
                e.currentTarget.style.color = "#00D4AA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="btn-press w-7 h-7 rounded-md flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 107, 0.15)";
                e.currentTarget.style.color = "#FF6B6B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
