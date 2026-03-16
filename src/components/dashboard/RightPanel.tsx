import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from "date-fns";
import { DollarSign, TrendingUp, Hash, Award } from "lucide-react";
import { Expense, CATEGORY_COLORS, CATEGORY_ICONS, Category } from "@/types/expense";
import { THEME } from "@/config";

interface RightPanelProps {
  expenses: Expense[];
}

export function RightPanel({ expenses }: RightPanelProps) {
  // Compute analytics
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;

    // By category
    const byCategory: Record<string, number> = {};
    expenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    const highestCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    // Pie data
    const pieData = Object.entries(byCategory)
      .map(([cat, val]) => ({
        name: cat,
        value: parseFloat(val.toFixed(2)),
        color: CATEGORY_COLORS[cat as Category],
        icon: CATEGORY_ICONS[cat as Category],
        pct: total > 0 ? (val / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Daily trend - last 14 days
    const today = startOfDay(new Date());
    const twoWeeksAgo = subDays(today, 13);
    const days = eachDayOfInterval({ start: twoWeeksAgo, end: today });
    const dailyData = days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayTotal = expenses
        .filter((e) => e.date === dayStr)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        day: format(day, "MMM d"),
        amount: parseFloat(dayTotal.toFixed(2)),
        shortDay: format(day, "d"),
      };
    });

    return { total, count, highestCategory, pieData, dailyData, byCategory };
  }, [expenses]);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: THEME.background }}
    >
      <div className="p-5 flex flex-col gap-5">
        {/* Section title */}
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(to bottom, #00D4AA, #0099FF)" }}
          />
          <h2 className="font-syne font-bold text-base" style={{ color: "#fff" }}>
            Analytics
          </h2>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<DollarSign size={14} />}
            label="Total Spent"
            value={`$${stats.total.toFixed(2)}`}
            isMono
            accent={THEME.primary}
          />
          <StatCard
            icon={<Hash size={14} />}
            label="Transactions"
            value={String(stats.count)}
            accent="#38BDF8"
          />
          <StatCard
            icon={<Award size={14} />}
            label="Top Category"
            value={stats.highestCategory ? stats.highestCategory[0] : "—"}
            sub={
              stats.highestCategory
                ? `$${stats.highestCategory[1].toFixed(2)}`
                : ""
            }
            accent={
              stats.highestCategory
                ? CATEGORY_COLORS[stats.highestCategory[0] as Category]
                : "#94A3B8"
            }
          />
        </div>

        {/* Donut Chart */}
        {stats.pieData.length > 0 ? (
          <div className="glass-card rounded-xl p-4">
            <h3
              className="font-syne font-semibold text-sm mb-4"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Spending by Category
            </h3>
            <div className="flex items-center gap-4">
              <div style={{ width: 140, height: 140, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={600}
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomPieTooltip />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {stats.pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span
                      className="font-space text-xs truncate flex-1"
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}
                    >
                      {item.icon} {item.name}
                    </span>
                    <span
                      className="font-mono-custom text-xs flex-shrink-0"
                      style={{ color: item.color, fontSize: "11px" }}
                    >
                      {item.pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ChartEmptyState title="Spending by Category" />
        )}

        {/* Bar Chart - Daily Trend */}
        <div className="glass-card rounded-xl p-4">
          <h3
            className="font-syne font-semibold text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            14-Day Spending Trend
          </h3>
          {stats.dailyData.some((d) => d.amount > 0) ? (
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.dailyData}
                  margin={{ top: 0, right: 0, left: 16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="shortDay"
                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontFamily: "Space Grotesk" }}
                    axisLine={false}
                    tickLine={false}
                    interval={1}
                  />
                  <YAxis
                    width={60}
                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontFamily: "Space Grotesk" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="amount"
                    fill={THEME.primary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                    animationDuration={600}
                  >
                    {stats.dailyData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.amount > 0 ? THEME.primary : "rgba(255,255,255,0.05)"}
                        fillOpacity={entry.amount > 0 ? 1 : 0.3}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              className="flex items-center justify-center py-10 font-space text-xs"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              No spending data in the last 14 days
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        {stats.pieData.length > 0 && (
          <div className="glass-card rounded-xl p-4">
            <h3
              className="font-syne font-semibold text-sm mb-4"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Category Breakdown
            </h3>
            <div className="flex flex-col gap-3">
              {stats.pieData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "13px" }}>{item.icon}</span>
                      <span
                        className="font-space text-xs font-medium"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono-custom text-xs"
                        style={{ color: item.color, fontSize: "11px" }}
                      >
                        ${item.value.toFixed(2)}
                      </span>
                      <span
                        className="font-space text-xs"
                        style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}
                      >
                        {item.pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)", height: "5px" }}
                  >
                    <div
                      className="h-full rounded-full progress-bar-fill"
                      style={{
                        width: `${item.pct}%`,
                        background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  isMono,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  isMono?: boolean;
  accent: string;
}) {
  return (
    <div
      className="glass-card rounded-xl p-3 flex flex-col gap-2"
      style={{ minHeight: "80px" }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: accent }}>{icon}</span>
        <span
          className="font-space text-xs"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
        >
          {label}
        </span>
      </div>
      <div>
        <div
          className={`font-bold leading-none ${isMono ? "font-mono-custom" : "font-syne"}`}
          style={{ color: accent, fontSize: "16px" }}
        >
          {value}
        </div>
        {sub && (
          <div
            className="font-space text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartEmptyState({ title }: { title: string }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <h3
        className="font-syne font-semibold text-sm mb-4"
        style={{ color: "rgba(255,255,255,0.8)" }}
      >
        {title}
      </h3>
      <div
        className="flex flex-col items-center justify-center py-8 gap-2"
      >
        <span style={{ fontSize: "24px", opacity: 0.4 }}>📈</span>
        <p
          className="font-space text-xs text-center"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Add expenses to see analytics
        </p>
      </div>
    </div>
  );
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-lg font-space text-xs"
      style={{
        background: "rgba(15, 22, 36, 0.95)",
        border: `1px solid ${THEME.border}`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: data.color, fontWeight: 600 }}>
        {data.icon} {data.name}
      </div>
      <div style={{ color: "#fff", fontFamily: "JetBrains Mono, monospace" }}>
        ${data.value.toFixed(2)}
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)" }}>
        {data.pct.toFixed(1)}% of total
      </div>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg font-space text-xs"
      style={{
        background: "rgba(15, 22, 36, 0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.6)" }}>{payload[0]?.payload?.day}</div>
      <div style={{ color: THEME.primary, fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
        ${payload[0]?.value?.toFixed(2)}
      </div>
    </div>
  );
}
