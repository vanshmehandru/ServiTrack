// server.js
require("dotenv").config();
const express = require("express");

const customerRoutes = require("./routes/customerRoutes");
const adminRoutes    = require("./routes/adminRoutes");

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Warranty & Service Management API 🛡️",
    endpoints: {
      health: "/health",
      auth: ["/signup", "/login"],
      admin: "/admin/*"
    }
  });
});

app.use("/", customerRoutes);      // /signup, /login, /product, /service-request …
app.use("/admin", adminRoutes);    // /admin/login, /admin/customers …

// ─── Health Check ─────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.status(200).json({ success: true, message: "Warranty Service API is running 🚀" })
);

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    hint: "Check the API documentation or visit '/' for available endpoints."
  });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
