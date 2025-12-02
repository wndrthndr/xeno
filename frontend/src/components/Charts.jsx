import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

import { useMemo, useState, useEffect } from "react";

// ----------------------
// GROUP HELPER
// ----------------------
function groupBy(data, keyFn) {
  return data.reduce((acc, cur) => {
    const key = keyFn(cur);
    if (!acc[key]) acc[key] = { d: key, revenue: 0, orders: 0 };
    acc[key].revenue += Number(cur.revenue || 0);
    acc[key].orders += Number(cur.orders || 0);
    return acc;
  }, {});
}

export function Charts({
  data,
  type = "orders",
  view = "daily",
  range = 30,
  start,
  end
}) {

  const [offset, setOffset] = useState(0);

  // ✅ Reset scroll when controls change
  useEffect(() => {
    setOffset(0);
  }, [view, start, end, type]);

  // ----------------------
  // DATE FILTER FIRST ✅
  // ----------------------
  const filtered = useMemo(() => {
    if (!data?.length) return [];

    const normalize = (date) => new Date(date).toISOString().slice(0, 10);

const s = start ? normalize(start) : null;
const e = end ? normalize(end) : null;

return data.filter(d => {
  const cur = normalize(d.d);
  if (s && cur < s) return false;
  if (e && cur > e) return false;
  return true;
});

  }, [data, start, end]);

  // ----------------------
  // PROCESS VIEW
  // ----------------------
  const processed = useMemo(() => {
    if (!filtered.length) return [];

    if (view === "monthly") {
      const g = groupBy(filtered, d =>
        new Date(d.d).toLocaleString("default", { month: "short", year: "numeric" })
      );
      return Object.values(g);
    }

    if (view === "yearly") {
      const g = groupBy(filtered, d =>
        new Date(d.d).getFullYear().toString()
      );
      return Object.values(g);
    }

    return filtered;
  }, [filtered, view]);

  // ----------------------
  // WINDOW SLICE
  // ----------------------
  const total = processed.length;

  const visible = useMemo(() => {
    const end = total - offset;
    const start = Math.max(0, end - range);
    return processed.slice(start, end);
  }, [processed, range, offset, total]);

  // ----------------------
  // NAVIGATION
  // ----------------------
  const canBack = offset + range < total;
  const canForward = offset > 0;

  const prev = () => canBack && setOffset(o => o + range);
  const next = () => canForward && setOffset(o => Math.max(0, o - range));

  // ----------------------
  // FORMATTERS
  // ----------------------
  const formatDate = (d) => {
    const date = new Date(d);
    return view === "daily"
      ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
      : d;
  };

  const formatMoney = v => `₹ ${Number(v).toLocaleString("en-IN")}`;

  // ----------------------
  // EMPTY FALLBACK ✅
  // ----------------------
  if (!visible.length) {
    return (
      <div className="graph-wrap">
        <div style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>
          No data available in selected date range
        </div>
      </div>
    );
  }

  return (
    <div className="graph-wrap">

      {/* TITLE */}
      <div className="chart-title">
        {type === "revenue" ? "Revenue Trend" : "Orders Trend"}
      </div>

      {/* ARROWS */}
      <button className="graph-arrow left" onClick={prev} disabled={!canBack}>‹</button>
      <button className="graph-arrow right" onClick={next} disabled={!canForward}>›</button>

      {/* RANGE */}
      <div className="range-label">
        {visible[0]?.d ? formatDate(visible[0].d) : ""} →
        {visible[visible.length - 1]?.d ? formatDate(visible[visible.length - 1].d) : ""}
      </div>

      <ResponsiveContainer width="100%" height={340}>

        {type === "revenue" ? (

          <LineChart data={visible}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 4" />

            <XAxis dataKey="d" tickFormatter={formatDate} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatMoney} axisLine={false} tickLine={false} />

            <Tooltip
              labelFormatter={formatDate}
              formatter={formatMoney}
              contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb" }}
            />

            <Line type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} dot={false} />
          </LineChart>

        ) : (

          <BarChart data={visible}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 4" />

            <XAxis dataKey="d" tickFormatter={formatDate} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />

            <Tooltip labelFormatter={formatDate} />

            <Bar dataKey="orders" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>

        )}

      </ResponsiveContainer>
    </div>
  );
}
