import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0284c7", "#22c55e", "#9333ea", "#f97316", "#ef4444", "#64748b", "#eab308"];

export function PieChartComponent({ orders }) {

  // 1. Group revenue by month
  const monthlyRevenue = orders.reduce((acc, cur) => {
    const month = new Date(cur.d).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    acc[month] = (acc[month] || 0) + Number(cur.revenue || 0);
    return acc;
  }, {});

  // 2. Convert into pie chart format
  const data = Object.entries(monthlyRevenue).map(([key, val]) => ({
    name: key,
    value: val
  }));

  // 3. Format INR
  const formatCurrency = val =>
    `₹ ${val.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

  return (
    <div className="card">
      <strong>Monthly Revenue Distribution</strong>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={95}
            label={({ name }) => name}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(v) => formatCurrency(v)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
