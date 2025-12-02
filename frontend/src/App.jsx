import { useEffect, useState } from "react";
import api from "./api";
import Login from "./components/Login";
import { Charts } from "./components/Charts";
import TopCustomers from "./components/TopCustomers";
import { PieChartComponent } from "./components/PieChart";

export default function App() {

  const [authed, setAuthed] = useState(false);
  const [tenant, setTenant] = useState(null);

  const [metrics, setMetrics] = useState({});
  const [chart, setChart] = useState([]);
  const [top, setTop] = useState([]);
  const [compare, setCompare] = useState({});
  const [start, setStart] = useState("2024-01-01");
  const [end, setEnd] = useState("2025-12-31");

  const [chartType, setChartType] = useState("orders");
  const [view, setView] = useState("daily");

  // ✅ FORCE LOGOUT ON LOAD (debug-safe)
  useEffect(() => {
  const token = localStorage.getItem("token");
  const tenant = localStorage.getItem("tenantId");

  if (token && tenant) {
    setAuthed(true);
    setTenant(tenant);
  }
}, []);


  // ✅ Fetch data only when authenticated
  useEffect(() => {
    if (authed && tenant) fetchAll();
  }, [authed, tenant, start, end]);

  const fetchAll = async () => {
    try {
      const [m, d, t, c] = await Promise.all([
        api.get("/api/metrics"),
        api.get(`/api/orders-by-date?start=${start}&end=${end}`),
        api.get("/api/top-customers"),
        api.get("/api/revenue-compare")
      ]);

      setMetrics(m.data);
      setChart(d.data);
      setTop(t.data);
      setCompare(c.data);

    } catch (err) {
      console.error("Fetch failed:", err.response?.data || err.message);
      setMetrics({});
      setChart([]);
      setTop([]);
      setCompare({});
    }
  };

  // ✅ SHOW LOGIN IF NOT AUTHED
  if (!authed || !tenant) {
    return (
      <Login
        onAuth={(token, tenantId) => {
          localStorage.setItem("token", token);
          localStorage.setItem("tenantId", tenantId);
          setTenant(tenantId);
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dash-head tenant-head">
        <div className="head-left">
          <h1 className="brand-title">Xeno Analytics</h1>
          <p className="brand-sub">Customer Intelligence Dashboard</p>
        </div>

        <div className="head-right">
          <div className="tenant-badge">
            Workspace
            <span>Tenant #{tenant}</span>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section className="stats">
        <Stat title="Revenue" value={`₹ ${(metrics.revenue || 0).toLocaleString()}`} trend={compare.growth} kind="revenue" />
        <Stat title="Growth" value={`${compare.growth || 0}%`} trend={compare.growth} kind="growth" />
        <Stat title="Orders" value={metrics.orders || 0} kind="orders" />
        <Stat title="Customers" value={metrics.customers || 0} kind="customers" />
      </section>

      {/* Charts */}
      <section className="orders-section">
        <div className="charts-panel">

          <div className="charts-toolbar">

            <div className="chart-toggle">
              <button className={chartType === "orders" ? "active" : ""} onClick={() => setChartType("orders")}>Orders</button>
              <button className={chartType === "revenue" ? "active" : ""} onClick={() => setChartType("revenue")}>Revenue</button>
            </div>

            <div className="toolbar-right">

              <div className="date-inline">
                <input type="date" value={start} onChange={e => setStart(e.target.value)} />
                <span>–</span>
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
              </div>

              <button className="reset-btn" onClick={() => {
                setStart("2024-01-01");
                setEnd("2025-12-31");
              }}>⟳</button>

              <div className="view-toggle">
                <button className={view === "daily" ? "active" : ""} onClick={() => setView("daily")}>Daily</button>
                <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>Monthly</button>
                <button className={view === "yearly" ? "active" : ""} onClick={() => setView("yearly")}>Yearly</button>
              </div>

            </div>
          </div>

          {chart.length === 0 && <div className="empty-state">No data available</div>}

          {chart.length > 0 && (
            <Charts data={chart} type={chartType} view={view} start={start} end={end} range={30} />
          )}

        </div>
      </section>

      {/* Bottom Grid */}
      <section className="grid-two">
        <TopCustomers rows={top} />
        <PieChartComponent orders={chart} />
      </section>

    </div>
  );
}

// KPI box
function Stat({ title, value, trend, kind }) {
  return (
    <div className={`stat-card stat-${kind}`}>
      <div className="stat-top">
        <small>{title}</small>
        {trend !== undefined && (
          <span className={`trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h2>{value}</h2>
      <div className="stat-foot">Live metric</div>
    </div>
  );
}
