// models/productModel.js
const db = require("../config/db");

const ProductModel = {
  // Register a new product
  async create({ productName, modelNumber, purchaseDate, customerId }) {
    const [result] = await db.execute(
      "INSERT INTO Product (Product_Name, Model_Number, Purchase_Date, Customer_ID) VALUES (?, ?, ?, ?)",
      [productName, modelNumber, purchaseDate, customerId]
    );
    return result.insertId;
  },

  // Get products by customer
  async findByCustomer(customerId) {
    const [rows] = await db.execute(
      `SELECT p.*, w.Warranty_ID, w.Warranty_Type, w.Start_Date, w.End_Date
       FROM Product p
       LEFT JOIN Warranty w ON p.Product_ID = w.Product_ID
       WHERE p.Customer_ID = ?
       ORDER BY p.Created_At DESC`,
      [customerId]
    );
    return rows;
  },

  // Find product by ID
  async findById(productId) {
    const [rows] = await db.execute(
      "SELECT * FROM Product WHERE Product_ID = ?",
      [productId]
    );
    return rows[0] || null;
  },

  // Add warranty for a product
  async addWarranty({ productId, warrantyType, startDate, endDate }) {
    const [result] = await db.execute(
      "INSERT INTO Warranty (Product_ID, Warranty_Type, Start_Date, End_Date) VALUES (?, ?, ?, ?)",
      [productId, warrantyType, startDate, endDate]
    );
    return result.insertId;
  },
};

module.exports = ProductModel;
