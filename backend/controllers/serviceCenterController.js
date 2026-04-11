// controllers/serviceCenterController.js
const ServiceCenterModel = require("../models/serviceCenterModel");
const TechnicianModel    = require("../models/technicianModel");

// ─── Service Centers ──────────────────────────────────────

// POST /admin/service-center
const createServiceCenter = async (req, res) => {
  try {
    const { centerName, location, contact } = req.body;
    if (!centerName || !location || !contact) {
      return res.status(400).json({
        success: false,
        message: "centerName, location, and contact are required",
      });
    }
    const centerId = await ServiceCenterModel.create({ centerName, location, contact });
    return res.status(201).json({
      success: true,
      message: "Service center created",
      data: { centerId },
    });
  } catch (err) {
    console.error("Create service center error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /admin/service-centers
const getAllServiceCenters = async (req, res) => {
  try {
    const centers = await ServiceCenterModel.getAll();
    return res.status(200).json({ success: true, data: centers });
  } catch (err) {
    console.error("Get service centers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /admin/service-center/:id
const updateServiceCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { centerName, location, contact } = req.body;
    if (!centerName || !location || !contact) {
      return res.status(400).json({
        success: false,
        message: "centerName, location, and contact are required",
      });
    }
    const affected = await ServiceCenterModel.update(id, { centerName, location, contact });
    if (!affected) {
      return res.status(404).json({ success: false, message: "Service center not found" });
    }
    return res.status(200).json({ success: true, message: "Service center updated" });
  } catch (err) {
    console.error("Update service center error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /admin/service-center/:id
const deleteServiceCenter = async (req, res) => {
  try {
    const affected = await ServiceCenterModel.delete(req.params.id);
    if (!affected) {
      return res.status(404).json({ success: false, message: "Service center not found" });
    }
    return res.status(200).json({ success: true, message: "Service center deleted" });
  } catch (err) {
    console.error("Delete service center error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Technicians ──────────────────────────────────────────

// POST /admin/technician
const createTechnician = async (req, res) => {
  try {
    const { name, skill, centerId } = req.body;
    if (!name || !skill || !centerId) {
      return res.status(400).json({
        success: false,
        message: "name, skill, and centerId are required",
      });
    }
    const center = await ServiceCenterModel.findById(centerId);
    if (!center) {
      return res.status(404).json({ success: false, message: "Service center not found" });
    }
    const technicianId = await TechnicianModel.create({ name, skill, centerId });
    return res.status(201).json({
      success: true,
      message: "Technician created",
      data: { technicianId },
    });
  } catch (err) {
    console.error("Create technician error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /admin/technicians
const getAllTechnicians = async (req, res) => {
  try {
    const technicians = await TechnicianModel.getAll();
    return res.status(200).json({ success: true, data: technicians });
  } catch (err) {
    console.error("Get technicians error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /admin/technician/:id
const updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, skill, centerId } = req.body;
    if (!name || !skill || !centerId) {
      return res.status(400).json({
        success: false,
        message: "name, skill, and centerId are required",
      });
    }
    const affected = await TechnicianModel.update(id, { name, skill, centerId });
    if (!affected) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }
    return res.status(200).json({ success: true, message: "Technician updated" });
  } catch (err) {
    console.error("Update technician error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /admin/technician/:id
const deleteTechnician = async (req, res) => {
  try {
    const affected = await TechnicianModel.delete(req.params.id);
    if (!affected) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }
    return res.status(200).json({ success: true, message: "Technician deleted" });
  } catch (err) {
    console.error("Delete technician error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createServiceCenter,
  getAllServiceCenters,
  updateServiceCenter,
  deleteServiceCenter,
  createTechnician,
  getAllTechnicians,
  updateTechnician,
  deleteTechnician,
};
