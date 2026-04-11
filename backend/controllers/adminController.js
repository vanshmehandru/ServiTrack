// controllers/adminController.js
const CustomerModel      = require("../models/customerModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const ServiceRecordModel  = require("../models/serviceRecordModel");
const TechnicianModel     = require("../models/technicianModel");
const ServiceCenterModel  = require("../models/serviceCenterModel");
const PaymentModel        = require("../models/paymentModel");
const FeedbackModel       = require("../models/feedbackModel");

// ─── Customers ────────────────────────────────────────────

// GET /admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.getAll();
    return res.status(200).json({ success: true, data: customers });
  } catch (err) {
    console.error("Get all customers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Service Requests ─────────────────────────────────────

// GET /admin/requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequestModel.getAll();
    return res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("Get all requests error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Assign Technician ────────────────────────────────────

// PUT /admin/assign-technician
const assignTechnician = async (req, res) => {
  try {
    const { requestId, technicianId, serviceDate, cost } = req.body;

    if (!requestId || !technicianId) {
      return res.status(400).json({
        success: false,
        message: "requestId and technicianId are required",
      });
    }

    // Verify request exists
    const request = await ServiceRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    // Verify technician exists
    const technician = await TechnicianModel.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }

    const svcDate = serviceDate || new Date().toISOString().split("T")[0];

    // Check if a service record already exists for this request
    const existing = await ServiceRecordModel.findByRequestId(requestId);
    let serviceId;

    if (existing) {
      // Re-assign technician on existing record
      await ServiceRecordModel.updateTechnician(existing.Service_ID, technicianId);
      serviceId = existing.Service_ID;
    } else {
      // Create new service record
      serviceId = await ServiceRecordModel.create({
        requestId,
        technicianId,
        serviceDate: svcDate,
        cost: cost || 0,
      });
    }

    // Update service request status to "In Progress"
    await ServiceRequestModel.updateStatus(requestId, "In Progress");

    return res.status(200).json({
      success: true,
      message: "Technician assigned successfully",
      data: { serviceId, technicianId, requestId },
    });
  } catch (err) {
    console.error("Assign technician error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Update Service Status ────────────────────────────────

// PUT /admin/update-status
const updateServiceStatus = async (req, res) => {
  try {
    const { serviceId, serviceStatus, cost, requestStatus } = req.body;

    if (!serviceId || !serviceStatus) {
      return res.status(400).json({
        success: false,
        message: "serviceId and serviceStatus are required",
      });
    }

    const validStatuses = ["Assigned", "In Progress", "Completed"];
    if (!validStatuses.includes(serviceStatus)) {
      return res.status(400).json({
        success: false,
        message: `serviceStatus must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const serviceRecord = await ServiceRecordModel.findById(serviceId);
    if (!serviceRecord) {
      return res.status(404).json({ success: false, message: "Service record not found" });
    }

    // Update the service record
    await ServiceRecordModel.updateStatus({ serviceId, serviceStatus, cost });

    // Sync parent request status if provided
    if (requestStatus) {
      await ServiceRequestModel.updateStatus(serviceRecord.Request_ID, requestStatus);
    } else if (serviceStatus === "Completed") {
      await ServiceRequestModel.updateStatus(serviceRecord.Request_ID, "Completed");
    }

    // Auto-create payment record if cost > 0 and service completed
    let paymentId = null;
    const finalCost = cost !== undefined ? cost : serviceRecord.Cost;
    if (serviceStatus === "Completed" && parseFloat(finalCost) > 0) {
      const existingPayments = await PaymentModel.findByServiceId(serviceId);
      if (existingPayments.length === 0) {
        paymentId = await PaymentModel.create({
          serviceId,
          amount: finalCost,
          paymentMode: "Pending",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Service status updated successfully",
      data: { serviceId, serviceStatus, paymentId },
    });
  } catch (err) {
    console.error("Update service status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Service Record ───────────────────────────────────────

// POST /admin/service-record
const addServiceRecord = async (req, res) => {
  try {
    const { requestId, technicianId, serviceDate, cost } = req.body;

    if (!requestId || !technicianId || !serviceDate) {
      return res.status(400).json({
        success: false,
        message: "requestId, technicianId, and serviceDate are required",
      });
    }

    const request = await ServiceRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    const technician = await TechnicianModel.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }

    const serviceId = await ServiceRecordModel.create({
      requestId,
      technicianId,
      serviceDate,
      cost: cost || 0,
    });

    await ServiceRequestModel.updateStatus(requestId, "In Progress");

    return res.status(201).json({
      success: true,
      message: "Service record created successfully",
      data: { serviceId },
    });
  } catch (err) {
    console.error("Add service record error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Payments ─────────────────────────────────────────────

// POST /admin/payment
const createPayment = async (req, res) => {
  try {
    const { serviceId, amount, paymentMode } = req.body;

    if (!serviceId || !amount || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: "serviceId, amount, and paymentMode are required",
      });
    }

    const validModes = ["Cash", "Card", "UPI", "Online"];
    if (!validModes.includes(paymentMode)) {
      return res.status(400).json({
        success: false,
        message: `paymentMode must be one of: ${validModes.join(", ")}`,
      });
    }

    const paymentId = await PaymentModel.create({ serviceId, amount, paymentMode });

    return res.status(201).json({
      success: true,
      message: "Payment record created",
      data: { paymentId },
    });
  } catch (err) {
    console.error("Create payment error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /admin/payment-status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    if (!paymentId || !status) {
      return res.status(400).json({ success: false, message: "paymentId and status are required" });
    }
    const validStatuses = ["Pending", "Paid", "Failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(", ")}` });
    }
    const affected = await PaymentModel.updateStatus(paymentId, status);
    if (!affected) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.status(200).json({ success: true, message: "Payment status updated" });
  } catch (err) {
    console.error("Update payment status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Feedback ─────────────────────────────────────────────

// GET /admin/feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await FeedbackModel.getAll();
    return res.status(200).json({ success: true, data: feedback });
  } catch (err) {
    console.error("Get all feedback error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllCustomers,
  getAllRequests,
  assignTechnician,
  updateServiceStatus,
  addServiceRecord,
  createPayment,
  updatePaymentStatus,
  getAllFeedback,
};
