// controllers/productController.js
const ProductModel = require("../models/productModel");

// POST /product  — Register a product
const registerProduct = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productName, modelNumber, purchaseDate, warrantyType, warrantyStartDate, warrantyEndDate } =
      req.body;

    if (!productName || !modelNumber || !purchaseDate) {
      return res.status(400).json({
        success: false,
        message: "productName, modelNumber, and purchaseDate are required",
      });
    }

    // Create product
    const productId = await ProductModel.create({
      productName,
      modelNumber,
      purchaseDate,
      customerId,
    });

    // Optionally add warranty
    let warrantyId = null;
    if (warrantyType && warrantyStartDate && warrantyEndDate) {
      warrantyId = await ProductModel.addWarranty({
        productId,
        warrantyType,
        startDate: warrantyStartDate,
        endDate:   warrantyEndDate,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product registered successfully",
      data: { productId, warrantyId },
    });
  } catch (err) {
    console.error("Register product error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /product  — Get customer's products
const getMyProducts = async (req, res) => {
  try {
    const products = await ProductModel.findByCustomer(req.user.id);
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { registerProduct, getMyProducts };
