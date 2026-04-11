// models/customerModel.js
const db = require("../config/db");

const CustomerModel = {
  // Find customer by email
  async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM Customer WHERE Email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  },

  // Find customer by ID
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT Customer_ID, First_Name, Last_Name, Phone, Email, Created_At FROM Customer WHERE Customer_ID = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Create new customer
  async create({ firstName, lastName, phone, email, hashedPassword }) {
    const [result] = await db.execute(
      "INSERT INTO Customer (First_Name, Last_Name, Phone, Email, Password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, phone, email, hashedPassword]
    );
    return result.insertId;
  },

  // Get all customers (admin)
  async getAll() {
    const [rows] = await db.execute(
      "SELECT Customer_ID, First_Name, Last_Name, Phone, Email, Created_At FROM Customer ORDER BY Created_At DESC"
    );
    return rows;
  },
};

module.exports = CustomerModel;
