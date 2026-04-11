// controllers/adminAuthController.js
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");

// POST /admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await AdminModel.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.Password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin.Admin_ID, email: admin.Email, role: "admin", adminRole: admin.Role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        adminId: admin.Admin_ID,
        name:    admin.Name,
        role:    admin.Role,
        email:   admin.Email,
        token,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { adminLogin };
