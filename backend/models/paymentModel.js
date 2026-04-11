// models/paymentModel.js
const db = require("../config/db");

const PaymentModel = {
  // Create payment record
  async create({ serviceId, amount, paymentMode }) {
    const [result] = await db.execute(
      `INSERT INTO Payment (Service_ID, Amount, Payment_Mode, Payment_Status)
       VALUES (?, ?, ?, 'Pending')`,
      [serviceId, amount, paymentMode]
    );
    return result.insertId;
  },

  // Find payment by service ID
  async findByServiceId(serviceId) {
    const [rows] = await db.execute(
      "SELECT * FROM Payment WHERE Service_ID = ? ORDER BY Created_At DESC",
      [serviceId]
    );
    return rows;
  },

  // Update payment status
  async updateStatus(paymentId, status) {
    const [result] = await db.execute(
      "UPDATE Payment SET Payment_Status = ? WHERE Payment_ID = ?",
      [status, paymentId]
    );
    return result.affectedRows;
  },

  // Get payment by ID
  async findById(paymentId) {
    const [rows] = await db.execute(
      "SELECT * FROM Payment WHERE Payment_ID = ?",
      [paymentId]
    );
    return rows[0] || null;
  },
};

module.exports = PaymentModel;
