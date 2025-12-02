require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./dashboardRoutes");
const { router: authRoutes, auth } = require("./authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// PUBLIC
app.use("/auth", authRoutes);

// PROTECTED
app.use("/api", auth, dashboardRoutes);

// HEALTH
app.get("/", (_, res) => res.send("✅ Backend running"));
app.get("/seed", async (req, res) => {
  await require("./seed")();
  res.send("DONE");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("✅ Backend running on port", PORT);
});

