const express = require("express");
const axios = require("axios");
const db = require("./db");
router.use("/tenants/:id", tenantCheck);

const router = express.Router();

/**
 * Health check
 */
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "xeno-backend" });
});

/**
 * Metrics
 */
router.get("/tenants/:id/metrics", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(DISTINCT customer_name) customers,
        COUNT(*) orders,
        COALESCE(SUM(total_price),0) revenue
      FROM orders
      WHERE tenant_id = ?
    `, [req.params.id]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Orders by Date Range
 */
router.get("/tenants/:id/orders-by-date", async (req, res) => {
  try {
    const { start, end } = req.query;

    const [rows] = await db.query(`
      SELECT 
        DATE(created_at) d,
        COUNT(*) orders,
        SUM(total_price) revenue
      FROM orders
      WHERE tenant_id = ?
      AND created_at BETWEEN ? AND ?
      GROUP BY d
      ORDER BY d ASC
    `, [req.params.id, start, end]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Orders list
 */
router.get("/tenants/:id/orders", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE tenant_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Orders error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Top customers
 */
router.get("/tenants/:id/top-customers", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT customer_name, SUM(total_price) spend
      FROM orders
      WHERE tenant_id = ?
      GROUP BY customer_name
      ORDER BY spend DESC
      LIMIT 5
    `, [req.params.id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Revenue comparison
 */
router.get("/tenants/:id/revenue-compare", async (req, res) => {
  try {
    const id = req.params.id;

    const [[last7]] = await db.query(`
      SELECT COALESCE(SUM(total_price),0) revenue
      FROM orders
      WHERE tenant_id = ?
      AND created_at >= CURDATE() - INTERVAL 7 DAY
    `, [id]);

    const [[prev7]] = await db.query(`
      SELECT COALESCE(SUM(total_price),0) revenue
      FROM orders
      WHERE tenant_id = ?
      AND created_at BETWEEN CURDATE() - INTERVAL 14 DAY
                          AND CURDATE() - INTERVAL 7 DAY
    `, [id]);

    const current = last7.revenue;
    const previous = prev7.revenue;

    const growth = previous === 0 ? 100 : (((current - previous) / previous) * 100).toFixed(2);

    res.json({
      last7: current,
      previous7: previous,
      growth: Number(growth)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
