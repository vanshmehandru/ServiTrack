// routes/customerRoutes.js
const express = require("express");
const router  = express.Router();

const { signup, login }                            = require("../controllers/authController");
const { registerProduct, getMyProducts }           = require("../controllers/productController");
const { raiseServiceRequest, getServiceStatus, getMyRequests } =
  require("../controllers/serviceRequestController");
const { submitFeedback, getFeedback }              = require("../controllers/feedbackController");
const { verifyToken }                              = require("../middleware/auth");

// ─── Auth ─────────────────────────────────────────────────
// @route  POST /signup
// @desc   Register a new customer
router.post("/signup", signup);
router.get("/signup", (_req, res) => res.status(405).json({ success: false, message: "Use POST to signup", hint: "Check documentation for required body fields" }));

// @route  POST /login
// @desc   Customer login
router.post("/login", login);
router.get("/login", (_req, res) => res.status(405).json({ success: false, message: "Use POST to login", hint: "Check documentation for required body fields" }));

// ─── Products (protected) ─────────────────────────────────
// @route  POST /product
// @desc   Register a product
router.post("/product", verifyToken, registerProduct);

// @route  GET /product
// @desc   Get logged-in customer's products
router.get("/product", verifyToken, getMyProducts);

// ─── Service Requests (protected) ────────────────────────
// @route  POST /service-request
// @desc   Raise a service request
router.post("/service-request", verifyToken, raiseServiceRequest);

// @route  GET /service-status/:id
// @desc   Check status of a specific service request
router.get("/service-status/:id", verifyToken, getServiceStatus);

// @route  GET /my-requests
// @desc   Get all of the customer's service requests
router.get("/my-requests", verifyToken, getMyRequests);

// ─── Feedback (protected) ─────────────────────────────────
// @route  POST /feedback
// @desc   Submit feedback for a completed service
router.post("/feedback", verifyToken, submitFeedback);

// @route  GET /feedback/:serviceId
// @desc   Get feedback for a service
router.get("/feedback/:serviceId", verifyToken, getFeedback);

module.exports = router;
