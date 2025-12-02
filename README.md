
### Data Flow

1. Shopify store provides customer and product context  
2. Backend seeds & processes orders into MySQL  
3. Each order is tagged with tenant  
4. APIs compute metrics dynamically  
5. Dashboard consumes tenant-specific insights

---

## 🔐 Authentication Model

Users login using demo credentials mapped to tenants.

JWT:
```json
{
  "userId": 1,
  "tenantId": 1
}
