// models/adminModel.js
const db = require("../config/db");

const AdminModel = {
  // Find admin by email
  async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM Admin WHERE Email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  },

  // Find admin by ID
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT Admin_ID, Name, Role, Contact, Email FROM Admin WHERE Admin_ID = ?",
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = AdminModel;
