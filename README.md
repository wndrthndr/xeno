project:
  name: "Shopify Multi-Tenant Data Ingestion & Insights Platform"
  assignment: "Xeno FDE Internship 2025"
  description: >
    A multi-tenant analytics platform that simulates Shopify data ingestion and
    business insights through a centralized dashboard. Designed to reflect
    enterprise SaaS architecture, tenant isolation, and real-world engineering
    workflows.

objectives:
  - Build a tenant-aware ingestion service for Shopify stores
  - Enforce strict data isolation per tenant
  - Compute business insights using SQL aggregations
  - Deliver insights via a production-style dashboard
  - Design system with enterprise extensibility in mind

key_features:
  authentication:
    - JWT-based login
    - Tenant embedded in token payload
    - API security via middleware
  multi_tenancy:
    - Single database, multi-tenant architecture
    - tenant_id scoped queries
    - Logical tenant isolation
  analytics:
    - Total customers, orders, and revenue
    - Orders by date
    - Top 5 customers
    - Revenue comparison across weeks
    - Monthly revenue breakdown
  ingestion:
    - Shopify API used for product and customer seeding
    - Local order generation for realistic scale simulation
  deployment:
    - Cloud-hosted backend
    - Cloud-deployed frontend

setup_instructions:
  backend:
    description: "API service for authentication and metrics"
    steps:
      - cd backend
      - npm install
      - node server.js
    default_port: 5000
    local_url: "http://localhost:5000"
  frontend:
    description: "Analytics dashboard"
    steps:
      - cd frontend
      - npm install
      - npm run dev
  environment_variables:
    - key: SHOP
      description: Shopify development store name
    - key: TOKEN
      description: Shopify Admin API access token

architecture:
  diagram: |
    Shopify Store
         |
         v
    Ingestion Layer
         |
         v
    Node.js API
         |
         v
       MySQL
         |
         v
    React Dashboard
  components:
    - name: Shopify Dev Store
      responsibility: Provides products and customers
    - name: Ingestion Layer
      responsibility: Seeds and simulates order data
    - name: API Layer
      responsibility: Exposes tenant-aware analytics endpoints
    - name: Database
      responsibility: Stores tenant-isolated order data
    - name: Dashboard
      responsibility: Displays metrics and analytics

authentication:
  token_type: JWT
  payload_structure:
    userId: "integer"
    tenantId: "integer"
  security_model:
    - Token validation middleware
    - Tenant-scoped queries

api_endpoints:
  authentication:
    - method: POST
      path: /auth/login
      purpose: Authenticate user and return token
  dashboards:
    - method: GET
      path: /api/metrics
      purpose: Returns summary KPIs
    - method: GET
      path: /api/orders
      purpose: Fetches tenant orders
    - method: GET
      path: /api/orders-by-date
      purpose: Returns time-series analytics
    - method: GET
      path: /api/top-customers
      purpose: Top customers by spend
    - method: GET
      path: /api/revenue-compare
      purpose: Revenue growth calculation

database:
  engine: MySQL
  schema:
    table: orders
    columns:
      - name: id
        type: integer
        description: Primary key
      - name: shopify_order_id
        type: string
        description: External reference
      - name: customer_name
        type: string
        description: Customer
      - name: total_price
        type: decimal
        description: Revenue
      - name: created_at
        type: timestamp
        description: Order timestamp
      - name: tenant_id
        type: integer
        description: Tenant scope identifier
  isolation:
    method: SQL scoping
    example: "SELECT * FROM orders WHERE tenant_id = ?"
    benefit:
      - Safe data isolation
      - Predictable scaling
      - Simple schema

assumptions:
  - One tenant maps to one Shopify store
  - Authentication uses JWT only
  - A single database is sufficient
  - Shopify used for data realism
  - Orders generated locally for scalability
  - No role-level permissions required

known_limitations:
  - Webhooks not implemented
  - No scheduler or periodic sync
  - ORM not used
  - Hardcoded demo users
  - No onboarding workflow
  - No retry handling
  - No audit logs
  - No role-based access

production_roadmap:
  ingestion:
    - Shopify webhooks
    - Event replay
    - Data validation
  scaling:
    - Queue-based ingestion
    - Background workers
    - Horizontal scaling
  data_layer:
    - ORM adoption
    - Migration framework
  security:
    - OAuth onboarding
    - Token rotation
    - RBAC
  observability:
    - Central logging
    - Metrics
    - Alerts

demo:
  includes:
    - Architecture walkthrough
    - Tenant isolation demo
    - Dashboard walkthrough
    - Engineering trade-offs
    - Future roadmap

deployment:
  backend_url: "ADD_DEPLOYED_BACKEND_URL"
  frontend_url: "ADD_DEPLOYED_FRONTEND_URL"

author:
  name: "Vishal Nukala"

license: "MIT"
