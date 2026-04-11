// routes/adminRoutes.js
const express = require("express");
const router  = express.Router();

const { adminLogin }               = require("../controllers/adminAuthController");
const {
  getAllCustomers,
  getAllRequests,
  assignTechnician,
  updateServiceStatus,
  addServiceRecord,
  createPayment,
  updatePaymentStatus,
  getAllFeedback,
}                                  = require("../controllers/adminController");
const {
  createServiceCenter,
  getAllServiceCenters,
  updateServiceCenter,
  deleteServiceCenter,
  createTechnician,
  getAllTechnicians,
  updateTechnician,
  deleteTechnician,
}                                  = require("../controllers/serviceCenterController");
const { verifyAdmin }              = require("../middleware/auth");

// ─── Admin Auth ───────────────────────────────────────────
// @route  POST /admin/login
router.post("/login", adminLogin);

// ─── Customers ────────────────────────────────────────────
// @route  GET /admin/customers
router.get("/customers", verifyAdmin, getAllCustomers);

// ─── Service Requests ─────────────────────────────────────
// @route  GET /admin/requests
router.get("/requests", verifyAdmin, getAllRequests);

// ─── Assign Technician ────────────────────────────────────
// @route  PUT /admin/assign-technician
router.put("/assign-technician", verifyAdmin, assignTechnician);

// ─── Update Service Status ────────────────────────────────
// @route  PUT /admin/update-status
router.put("/update-status", verifyAdmin, updateServiceStatus);

// ─── Service Records ──────────────────────────────────────
// @route  POST /admin/service-record
router.post("/service-record", verifyAdmin, addServiceRecord);

// ─── Payments ─────────────────────────────────────────────
// @route  POST /admin/payment
router.post("/payment", verifyAdmin, createPayment);

// @route  PUT /admin/payment-status
router.put("/payment-status", verifyAdmin, updatePaymentStatus);

// ─── Feedback ─────────────────────────────────────────────
// @route  GET /admin/feedback
router.get("/feedback", verifyAdmin, getAllFeedback);

// ─── Service Centers ──────────────────────────────────────
// @route  POST   /admin/service-center
// @route  GET    /admin/service-centers
// @route  PUT    /admin/service-center/:id
// @route  DELETE /admin/service-center/:id
router.post("/service-center",       verifyAdmin, createServiceCenter);
router.get("/service-centers",       verifyAdmin, getAllServiceCenters);
router.put("/service-center/:id",    verifyAdmin, updateServiceCenter);
router.delete("/service-center/:id", verifyAdmin, deleteServiceCenter);

// ─── Technicians ──────────────────────────────────────────
// @route  POST   /admin/technician
// @route  GET    /admin/technicians
// @route  PUT    /admin/technician/:id
// @route  DELETE /admin/technician/:id
router.post("/technician",       verifyAdmin, createTechnician);
router.get("/technicians",       verifyAdmin, getAllTechnicians);
router.put("/technician/:id",    verifyAdmin, updateTechnician);
router.delete("/technician/:id", verifyAdmin, deleteTechnician);

module.exports = router;
