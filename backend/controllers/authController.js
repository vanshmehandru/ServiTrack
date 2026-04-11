// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const CustomerModel = require("../models/customerModel");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: firstName, lastName, phone, email, password",
      });
    }

    // Check if email already exists
    const existing = await CustomerModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert customer
    const customerId = await CustomerModel.create({
      firstName, lastName, phone, email, hashedPassword,
    });

    const token = generateToken({ id: customerId, email, role: "customer" });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: { customerId, firstName, lastName, email, token },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const customer = await CustomerModel.findByEmail(email);
    if (!customer) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, customer.Password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken({
      id: customer.Customer_ID,
      email: customer.Email,
      role: "customer",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        customerId: customer.Customer_ID,
        firstName: customer.First_Name,
        lastName:  customer.Last_Name,
        email:     customer.Email,
        token,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { signup, login };
