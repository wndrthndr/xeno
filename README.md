# Shopify Multi-Tenant Data Ingestion & Insights Platform
**Xeno FDE Internship Assignment – 2025**

A production-style multi-tenant analytics platform that simulates how enterprise retailers onboard, ingest Shopify data, and derive business insights from a centralized dashboard.

---

## Executive Summary

This project demonstrates a real-world SaaS design where multiple Shopify stores (tenants) share a single backend system with **strict data isolation** and **tenant-scoped analytics**.  
Data ingestion is simulated using Shopify APIs for realism, while analytics are computed using SQL aggregations to model enterprise dashboards.

The system is intentionally simple in infrastructure but complete in engineering discipline: auth, isolation, analytics, deployment, documentation, and extensibility.

---

## Project Highlights

- ✅ Multi-tenant architecture with strict isolation
- ✅ JWT authentication with tenant scoping
- ✅ KPI dashboards (revenue, customers, orders)
- ✅ Trend charts with date filtering
- ✅ Top-customer ranking
- ✅ Growth analytics
- ✅ Shopify-based data seeding
- ✅ Cloud deployed
- ✅ Production-ready extensibility design

---

## Objective

To simulate how an enterprise data platform:
1. Onboards merchants (tenants)
2. Ingests Shopify data
3. Stores commerce-grade records
4. Computes analytics
5. Visualizes business performance

---

## Architecture

### High-Level Flow

### Component Breakdown

**1) Shopify Dev Store**  
Used to create products and customers via Shopify API.

**2) Ingestion / Seeder**  
Creates Shopify entities and locally generates realistic order history to simulate enterprise-scale data.

**3) Backend API (Node.js + Express)**  
Tenant-aware REST APIs that compute metrics dynamically using SQL.

**4) MySQL Database**  
Single database shared across tenants with isolation enforced by `tenant_id`.

**5) React Dashboard**  
Interactive UI for analytics, charts, and computed business KPIs.

---

## Engineering Decisions

**SQL-First Analytics**  
Metrics are computed in queries instead of stored aggregates for transparency and correctness.

**Tenant Isolation at Query Level**  
All queries include:
```sql
WHERE tenant_id = ?
