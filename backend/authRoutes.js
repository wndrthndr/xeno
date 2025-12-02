const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in environment");
}
const SECRET = String(process.env.JWT_SECRET);

const USERS = [
  { id: 1, email: "xeno@test.com", password: bcrypt.hashSync("1234", 10), tenantId: 1 },
  { id: 2, email: "store2@xeno.com", password: bcrypt.hashSync("store2", 10), tenantId: 2 },
  { id: 3, email: "store3@xeno.com", password: bcrypt.hashSync("store3", 10), tenantId: 3 },
];

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

    res.json({ token, tenantId: user.tenantId, tenantName: `Tenant ${user.tenantId}` });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

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
