require("dotenv").config();
const axios = require("axios");
const db = require("./db");

// delay helper
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// random date generator (last N months)
function randomPastDate(months = 4) {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - months);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
}

async function main() {
  const { faker } = await import("@faker-js/faker");

  const SHOP = process.env.SHOP;
  const TOKEN = process.env.TOKEN;
  const TENANTS = [1, 2, 3];


  const headers = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json"
  };

  const BASE_URL = `https://${SHOP}.myshopify.com/admin/api/2023-04`;

  console.log("🏬 Connecting Shopify...");

  // CREATE PRODUCT (Shopify)
  async function createProduct() {
    const product = {
      product: {
        title: faker.commerce.productName(),
        body_html: faker.commerce.productDescription(),
        variants: [
          { price: faker.commerce.price(300, 3000) }
        ]
      }
    };

    const res = await axios.post(`${BASE_URL}/products.json`, product, { headers });
    return res.data.product;
  }

  // CREATE CUSTOMER (Shopify)
  async function createCustomer() {
    const customer = {
      customer: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email()
      }
    };

    const res = await axios.post(`${BASE_URL}/customers.json`, customer, { headers });
    return res.data.customer;
  }

  // LOCAL ORDER INSERT (NO RATE-LIMIT)
  async function insertLocalOrder(name, price, date, tenantId) {
    await db.query(`
      INSERT INTO orders
        (shopify_order_id, customer_name, total_price, created_at, tenant_id)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      faker.string.uuid(),
      name,
      price,
      date,
      tenantId
    ]);
  }
  

  // SEED LOOP
  const PRODUCTS = 8;      // Shopify-safe
  const CUSTOMERS = 12;    // Shopify-safe
  const ORDERS = 200;      // Local DB unlimited

  console.log("🚀 Seeding Shopify PRODUCTS + CUSTOMERS");

  let localCustomerNames = [];

  // 1️⃣ Create products
  for (let i = 0; i < PRODUCTS; i++) {
    await createProduct();
    console.log(`✅ Product ${i + 1}`);
    await wait(2500);
  }

  // 2️⃣ Create customers (also collect names)
  for (let i = 0; i < CUSTOMERS; i++) {
    const customer = await createCustomer();
    localCustomerNames.push(`${customer.first_name} ${customer.last_name}`);
    console.log(`✅ Customer ${i + 1}`);
    await wait(2500);
  }

  // 3️⃣ Create LOCAL realistic orders
  console.log("🌱 Generating realistic orders in DB...");

  for (let i = 0; i < ORDERS; i++) {
    const name = faker.helpers.arrayElement(localCustomerNames);
    const price = faker.commerce.price(400, 5000);
    const date = randomPastDate(4);

    for (const tenantId of TENANTS) {

      const volume = tenantId === 1 ? 300 :
                     tenantId === 2 ? 120 :
                     50;
    
      for (let i = 0; i < volume; i++) {
        await insertLocalOrder(name, price, date, tenantId);
      }
    }
    
    if (i % 20 === 0) console.log(`📦 Orders seeded: ${i}`);
  }

  console.log("🎉 Seeding Completed");
  process.exit();
}

main().catch(err => {
  console.error("❌ Error:", err.response?.data || err.message);
});
