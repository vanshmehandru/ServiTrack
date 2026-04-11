// controllers/serviceRequestController.js
const ServiceRequestModel = require("../models/serviceRequestModel");
const ProductModel         = require("../models/productModel");

// POST /service-request
const raiseServiceRequest = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId, issueDescription, requestDate } = req.body;

    if (!productId || !issueDescription) {
      return res.status(400).json({
        success: false,
        message: "productId and issueDescription are required",
      });
    }

    // Verify product belongs to customer
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.Customer_ID !== customerId) {
      return res.status(403).json({ success: false, message: "Product does not belong to you" });
    }

    const reqDate = requestDate || new Date().toISOString().split("T")[0];

    const requestId = await ServiceRequestModel.create({
      customerId,
      productId,
      requestDate: reqDate,
      issueDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Service request raised successfully",
      data: { requestId },
    });
  } catch (err) {
    console.error("Raise service request error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /service-status/:id
const getServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const request = await ServiceRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    // Customers can only view their own requests
    if (req.user.role === "customer" && request.Customer_ID !== customerId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (err) {
    console.error("Get service status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /my-requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequestModel.findByCustomer(req.user.id);
    return res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("Get my requests error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { raiseServiceRequest, getServiceStatus, getMyRequests };
