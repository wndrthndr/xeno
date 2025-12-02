# 🚀 Shopify Multi-Tenant Data Ingestion & Insights Platform

> **Assignment:** Xeno FDE Internship 2025  
> **Author:** Vishal Nukala  
> **License:** MIT

---

## 🌟 Project Overview

This project is a **multi-tenant analytics platform** that simulates Shopify data ingestion and delivers actionable business insights through a centralized, production-style dashboard.

It is designed to reflect **enterprise SaaS architecture**, focusing heavily on:

- Tenant data isolation  
- Extensibility  
- Scalable ingestion design  
- Real-world engineering workflows  

---

## 🎯 Objectives

- Build a tenant-aware ingestion service for Shopify stores  
- Enforce strict data isolation per tenant  
- Compute business insights using SQL aggregations  
- Deliver insights via a production-style dashboard  
- Design with enterprise extensibility in mind  

---

## ✨ Key Features

| Feature Area | Description |
|--------------|-------------|
| Authentication | JWT-based login with tenantId embedded in token |
| Multi-Tenancy | Single database, tenant isolation via `tenant_id` scoped queries |
| Analytics | Total revenue, customers, orders, top buyers, time-series insights |
| Ingestion | Shopify API seeding + local simulated ingestion |
| Deployment | Cloud-ready backend + dashboard architecture |

---

## 📐 Architecture Diagram

```
            +------------------+
            | Shopify Dev Store|
            +------------------+
                     |
                     v
             +------------------+
             | Ingestion Layer  |
             +------------------+
                     |
                     v
              +----------------+
              |   Node.js API  |
              +----------------+
                     |
                     v
             +-------------------+
             |    MySQL Database |
             | (Shared Tenants)  |
             +-------------------+
                     |
                     v
             +-------------------+
             |  React Dashboard  |
             +-------------------+
```

---

## 🧱 System Components

| Component | Responsibility |
|-----------|----------------|
| Shopify Store | Source for customers & product realism |
| Ingestion Layer | Seeds & simulates large volume order data |
| API Layer | Serves tenant-aware metrics |
| Database | Stores multi-tenant order records |
| Dashboard | Displays KPIs and charts |

---

## 🛠️ Setup & Local Development

### ✅ Prerequisites

- Node.js
- npm
- MySQL

---

## 🔐 Environment Setup

Create a `.env` file inside your backend directory:

```env
SHOP=my-store-name.myshopify.com
TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxx
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mypassword
DB_NAME=shopify_analytics
JWT_SECRET=a-very-secret-key
```

---

## ⚙️ Backend Setup (API Server)

```bash
cd backend
npm install
node server.js
```

**Runs on:** http://localhost:5000

---

## 🎨 Frontend Setup (Dashboard)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Authentication & Security

### JWT Token Structure

```json
{
  "userId": 1,
  "tenantId": 3,
  "iat": 1678886400,
  "exp": 1678890000
}
```

---

### Security Model

- ✅ JWT validation middleware
- ✅ Tenant isolation enforced per request
- ✅ Token expiration enforced
- ✅ No unauthenticated API access
- ✅ SQL isolation using WHERE tenant_id = ?

---

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|--------|
| POST | `/auth/login` | User login |
| GET | `/api/metrics` | Summary KPIs |
| GET | `/api/orders` | All tenant orders |
| GET | `/api/orders-by-date` | Time-series order data |
| GET | `/api/top-customers` | Top revenue customers |
| GET | `/api/revenue-compare` | Week/Month growth |

---

## 🗄️ Database Schema

### Table: `orders`

| Field | Type | Description |
|------|------|-------------|
| id | INT | Primary Key |
| shopify_order_id | VARCHAR | Shopify order ID |
| customer_name | VARCHAR | Buyer |
| total_price | DECIMAL | Revenue |
| created_at | TIMESTAMP | Order time |
| tenant_id | INT | Tenant ownership |

---

### 🧱 Isolation Strategy

Every SQL query:
```sql
SELECT * FROM orders WHERE tenant_id = ?;
```

Tenant ID is extracted from JWT and injected into all queries.

---

## ⚠️ Assumptions & Known Limitations

### ✅ Assumptions

- One tenant = one Shopify store
- JWT-based authentication
- Single shared MySQL DB
- Local ingestion simulation

---

### ❌ Known Limitations (MVP)

- No Shopify webhooks
- No scheduling
- No background jobs
- No ORM (raw SQL)
- Demo users hardcoded
- No RBAC
- No audit logs
- No retries or rate limiting

---

## 🛣️ Production Roadmap

| Area | Future Enhancements |
|------|--------------------|
| Ingestion | Shopify webhooks |
| Scaling | Background workers + queues |
| Data | Prisma / Sequelize |
| Security | OAuth + RBAC |
| Observability | Logging + alerts |
| Infra | CI/CD + Docker |

---

## 💡 Demo Coverage

- Architecture walkthrough  
- Multi-tenancy isolation demo  
- KPIs and dashboard review  
- Engineering tradeoffs  
- Production roadmap  

---

## 🌐 Deployment Status

| Component | URL |
|-----------|-----|
| Backend | `ADD_DEPLOYED_BACKEND_URL` |
| Frontend | `ADD_DEPLOYED_FRONTEND_URL` |

---

## 👨‍💻 Author

**Vishal Nukala**  
Xeno FDE Internship 2025  

---

## 📜 License

MIT

---

If you found this helpful, feel free to ⭐ the repo!
