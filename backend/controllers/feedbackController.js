// controllers/feedbackController.js
const FeedbackModel      = require("../models/feedbackModel");
const ServiceRecordModel = require("../models/serviceRecordModel");
const ServiceRequestModel = require("../models/serviceRequestModel");

// POST /feedback
const submitFeedback = async (req, res) => {
  try {
    const { serviceId, rating, comments } = req.body;

    if (!serviceId || !rating) {
      return res.status(400).json({ success: false, message: "serviceId and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Verify service record exists and is completed
    const serviceRecord = await ServiceRecordModel.findById(serviceId);
    if (!serviceRecord) {
      return res.status(404).json({ success: false, message: "Service record not found" });
    }
    if (serviceRecord.Service_Status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Feedback can only be submitted for completed services",
      });
    }

    // Verify the service request belongs to this customer
    const serviceRequest = await ServiceRequestModel.findById(serviceRecord.Request_ID);
    if (!serviceRequest || serviceRequest.Customer_ID !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Check for duplicate feedback
    const existing = await FeedbackModel.findByServiceId(serviceId);
    if (existing) {
      return res.status(409).json({ success: false, message: "Feedback already submitted for this service" });
    }

    const feedbackId = await FeedbackModel.create({ serviceId, rating, comments });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: { feedbackId },
    });
  } catch (err) {
    console.error("Submit feedback error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /feedback/:serviceId
const getFeedback = async (req, res) => {
  try {
    const feedback = await FeedbackModel.findByServiceId(req.params.serviceId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "No feedback found" });
    }
    return res.status(200).json({ success: true, data: feedback });
  } catch (err) {
    console.error("Get feedback error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { submitFeedback, getFeedback };
