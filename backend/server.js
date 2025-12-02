require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./dashboardRoutes");
const { router: authRoutes, auth } = require("./authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", auth, dashboardRoutes);

app.get("/", (_, res) => res.send("✅ Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("✅ Backend running on port", PORT));
