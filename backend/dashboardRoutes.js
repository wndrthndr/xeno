const express = require("express");
const db = require("./db");

const router = express.Router();

// WHO AM I
router.get("/whoami", (req, res) => {
  res.json(req.user);
});

// METRICS
router.get("/metrics", async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      COUNT(DISTINCT customer_name) customers,
      COUNT(*) orders,
      COALESCE(SUM(total_price),0) revenue
    FROM orders
    WHERE tenant_id = $1
  `, [req.user.tenantId]);

  res.json(rows[0]);
});

// ORDERS BY DATE
router.get("/orders-by-date", async (req, res) => {
  const { start, end } = req.query;

  const [rows] = await db.query(`
    SELECT 
      DATE(created_at) d,
      COUNT(*) orders,
      SUM(total_price) revenue
    FROM orders
    WHERE tenant_id = $1
    AND created_at BETWEEN ? AND ?
    GROUP BY d
    ORDER BY d ASC
  `, [req.user.tenantId, start, end]);

  res.json(rows);
});

// ORDERS LIST
router.get("/orders", async (req, res) => {
  const [rows] = await db.query(`
    SELECT * FROM orders
    WHERE tenant_id = $1
    ORDER BY created_at DESC
  `, [req.user.tenantId]);

  res.json(rows);
});

// TOP CUSTOMERS
router.get("/top-customers", async (req, res) => {
  const [rows] = await db.query(`
    SELECT customer_name, SUM(total_price) spend
    FROM orders
    WHERE tenant_id = $1
    GROUP BY customer_name
    ORDER BY spend DESC
    LIMIT 5
  `, [req.user.tenantId]);

  res.json(rows);
});

// REVENUE COMPARE
router.get("/revenue-compare", async (req, res) => {

  const [[last7]] = await db.query(`
    SELECT COALESCE(SUM(total_price),0) revenue
    FROM orders
    WHERE tenant_id = $1
      AND created_at >= CURDATE() - INTERVAL 7 DAY
  `, [req.user.tenantId]);

  const [[prev7]] = await db.query(`
    SELECT COALESCE(SUM(total_price),0) revenue
    FROM orders
    WHERE tenant_id = $1
      AND created_at BETWEEN CURDATE() - INTERVAL 14 DAY
                          AND CURDATE() - INTERVAL 7 DAY
  `, [req.user.tenantId]);

  const cur = last7.revenue;
  const prev = prev7.revenue;

  const growth = prev === 0 ? 100 : (((cur - prev) / prev) * 100).toFixed(2);

  res.json({ last7: cur, previous7: prev, growth: Number(growth) });
});

module.exports = router;
