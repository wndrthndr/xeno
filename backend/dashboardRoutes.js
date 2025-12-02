const express = require("express");
const db = require("./db");

const router = express.Router();

router.get("/whoami", (req, res) => {
  res.json(req.user);
});

// METRICS
router.get("/metrics", async (req, res) => {
  const result = await db.query(`
    SELECT 
      COUNT(DISTINCT customer_name) AS customers,
      COUNT(*) AS orders,
      COALESCE(SUM(total_price),0) AS revenue
    FROM orders
    WHERE tenant_id = $1
  `, [req.user.tenantId]);

  res.json(result.rows[0]);
});

// ORDERS BY DATE
router.get("/orders-by-date", async (req, res) => {
  const { start, end } = req.query;

  const result = await db.query(`
    SELECT 
      created_at::date AS d,
      COUNT(*) AS orders,
      SUM(total_price) AS revenue
    FROM orders
    WHERE tenant_id = $1
    AND created_at BETWEEN $2 AND $3
    GROUP BY d
    ORDER BY d ASC
  `, [req.user.tenantId, start, end]);

  res.json(result.rows);
});

// ORDERS LIST
router.get("/orders", async (req, res) => {
  const result = await db.query(`
    SELECT *
    FROM orders
    WHERE tenant_id = $1
    ORDER BY created_at DESC
  `, [req.user.tenantId]);

  res.json(result.rows);
});

// TOP CUSTOMERS
router.get("/top-customers", async (req, res) => {
  const result = await db.query(`
    SELECT customer_name, SUM(total_price) AS spend
    FROM orders
    WHERE tenant_id = $1
    GROUP BY customer_name
    ORDER BY spend DESC
    LIMIT 5
  `, [req.user.tenantId]);

  res.json(result.rows);
});

// REVENUE COMPARE
router.get("/revenue-compare", async (req, res) => {

  const last7 = await db.query(`
    SELECT COALESCE(SUM(total_price),0) AS revenue
    FROM orders
    WHERE tenant_id = $1
    AND created_at >= NOW() - INTERVAL '7 days'
  `, [req.user.tenantId]);

  const prev7 = await db.query(`
    SELECT COALESCE(SUM(total_price),0) AS revenue
    FROM orders
    WHERE tenant_id = $1
    AND created_at BETWEEN 
      NOW() - INTERVAL '14 days'
    AND NOW() - INTERVAL '7 days'
  `, [req.user.tenantId]);

  const cur = Number(last7.rows[0].revenue || 0);
  const prev = Number(prev7.rows[0].revenue || 0);
  const growth = prev === 0 ? 100 : (((cur - prev) / prev) * 100).toFixed(2);

  res.json({ last7: cur, previous7: prev, growth: Number(growth) });
});

module.exports = router;
