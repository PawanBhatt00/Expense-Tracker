import { format } from "date-fns";
import { Plus, TrendingUp } from "lucide-react";
import { APP_NAME, THEME } from "@/config";

interface TopNavProps {
  onAddClick: () => void;
}

export function TopNav({ onAddClick }: TopNavProps) {
  const currentMonth = format(new Date(), "MMMM yyyy");

  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{
        background: THEME.overlay,
        borderBottom: `1px solid ${THEME.border}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accent} 100%)`,
          }}
        >
          <TrendingUp size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span
          className="font-syne font-bold text-xl tracking-tight"
          style={{ color: THEME.text }}
        >
          {APP_NAME}
        </span>
      </div>

      {/* Center - Current Month */}
      <div
        className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "#00D4AA" }}
        />
        <span className="font-space text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          {currentMonth}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onAddClick}
        className="btn-press flex items-center gap-2 px-4 py-2 rounded-lg font-space font-medium text-sm transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #00D4AA 0%, #00B896 100%)",
          color: "#0F1624",
          boxShadow: "0 4px 15px rgba(0, 212, 170, 0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 212, 170, 0.4)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 212, 170, 0.25)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>Add Expense</span>
      </button>
    </header>
  );
}
