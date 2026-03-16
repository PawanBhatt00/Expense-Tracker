import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import {
  Expense,
  Category,
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from "@/types/expense";

interface ExpenseFormProps {
  editingExpense?: Expense | null;
  onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void;
  onCancel?: () => void;
  onFocus?: () => void;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

const defaultCategory: Category = "Food";

export function ExpenseForm({
  editingExpense,
  onSubmit,
  onCancel,
  onFocus,
}: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setErrors({});
    }
  }, [editingExpense]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.trim().length < 2) newErrors.title = "Too short (min 2 chars)";
    const num = parseFloat(amount);
    if (!amount) newErrors.amount = "Amount is required";
    else if (isNaN(num) || num <= 0) newErrors.amount = "Enter a valid positive amount";
    if (!category) newErrors.category = "Select a category";
    if (!date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category,
      date,
    });
    if (!editingExpense) {
      // Reset after add
      setTitle("");
      setAmount("");
      setCategory(defaultCategory);
      setDate(format(new Date(), "yyyy-MM-dd"));
      setErrors({});
    }
  };

  const isEditing = !!editingExpense;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label
          className="font-space text-xs font-medium uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Expense Title
        </label>
        <input
          type="text"
          className="fintech-input font-space text-sm"
          placeholder="e.g. Grocery run, Netflix..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={onFocus}
          style={{ fontSize: "14px", height: "40px" }}
        />
        {errors.title && (
          <span className="font-space text-xs" style={{ color: "#FF6B6B" }}>
            {errors.title}
          </span>
        )}
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-1.5">
        <label
          className="font-space text-xs font-medium uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Amount ($)
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-custom text-sm"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="fintech-input font-mono-custom text-sm"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={onFocus}
            style={{ paddingLeft: "1.75rem", fontSize: "14px", height: "40px" }}
          />
        </div>
        {errors.amount && (
          <span className="font-space text-xs" style={{ color: "#FF6B6B" }}>
            {errors.amount}
          </span>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label
          className="font-space text-xs font-medium uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 text-center"
              style={{
                background:
                  category === cat
                    ? `rgba(${hexToRgb(CATEGORY_COLORS[cat])}, 0.2)`
                    : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${
                  category === cat
                    ? CATEGORY_COLORS[cat]
                    : "rgba(255, 255, 255, 0.08)"
                }`,
                transform: category === cat ? "scale(1.02)" : "scale(1)",
              }}
            >
              <span style={{ fontSize: "16px" }}>{CATEGORY_ICONS[cat]}</span>
              <span
                className="font-space text-xs font-medium leading-none"
                style={{
                  color: category === cat ? CATEGORY_COLORS[cat] : "rgba(255,255,255,0.55)",
                  fontSize: "10px",
                }}
              >
                {cat}
              </span>
            </button>
          ))}
        </div>
        {errors.category && (
          <span className="font-space text-xs" style={{ color: "#FF6B6B" }}>
            {errors.category}
          </span>
        )}
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label
          className="font-space text-xs font-medium uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Date
        </label>
        <input
          type="date"
          className="fintech-input font-space text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onFocus={onFocus}
          style={{
            fontSize: "14px",
            height: "40px",
            colorScheme: "dark",
          }}
        />
        {errors.date && (
          <span className="font-space text-xs" style={{ color: "#FF6B6B" }}>
            {errors.date}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-press flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-space text-sm font-medium transition-all duration-200 flex-1"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <X size={14} />
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-press flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-space text-sm font-semibold transition-all duration-200"
          style={{
            background: isEditing
              ? "linear-gradient(135deg, #00D4AA 0%, #00B896 100%)"
              : "linear-gradient(135deg, #00D4AA 0%, #00B896 100%)",
            color: "#0F1624",
            flex: 1,
            boxShadow: "0 4px 12px rgba(0, 212, 170, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 212, 170, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 212, 170, 0.2)";
          }}
        >
          <Check size={15} strokeWidth={2.5} />
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0,0,0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
