export default function TopCustomers({ rows }) {

  return (
    <div className="card leader-card">
      <strong>Top Customers</strong>

      <ul className="leaderboard">
        {rows.map((c, i) => (
          <li key={i} className="leader-row">

            <div className="leader-left">
              <span className="rank">#{i + 1}</span>
              <span className="name">{c.customer_name || "Guest"}</span>
            </div>

            <div className="leader-right">
              ₹ {Number(c.spend || 0).toLocaleString()}
            </div>

          </li>
        ))}
      </ul>

    </div>
  );
}
