const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in environment");
}
const SECRET = process.env.JWT_SECRET;

/**
 * ✅ PRE-HASHED PASSWORDS
 * Do NOT hash at runtime.
 */
const USERS = [
  {
    id: 1,
    email: "xeno@test.com",
    password: "$2a$12$2s67ItL.qTjOyTNLGBhWjeG6TMCLZtjv/eRe2.iGMU3oB8hqEP8Ka", // 1234
    tenantId: 1
  },
  {
    id: 2,
    email: "store2@xeno.com",
    password: "$2a$12$MdiZX2oVL.iC5fwMzjFv/OzQGFz.VXHBaoVlJT2tHQRv/mOlEwry6", // store2
    tenantId: 2
  },
  {
    id: 3,
    email: "store3@xeno.com",
    password: "$$2a$12$NpoDXkEHgocKvhvq1C3ClOmnS6VJl6X8zbgiOhxwh.7ax5wD4PKMu", // store3
    tenantId: 3
  }
];

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = USERS.find(u => u.email === email?.trim());
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      tenantId: user.tenantId,
      tenantName: `Tenant ${user.tenantId}`
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ AUTH MIDDLEWARE
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

module.exports = { router, auth };
