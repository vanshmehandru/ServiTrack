// models/serviceCenterModel.js
const db = require("../config/db");

const ServiceCenterModel = {
  // Create a service center
  async create({ centerName, location, contact }) {
    const [result] = await db.execute(
      "INSERT INTO ServiceCenter (Center_Name, Location, Contact) VALUES (?, ?, ?)",
      [centerName, location, contact]
    );
    return result.insertId;
  },

  // Get all service centers
  async getAll() {
    const [rows] = await db.execute(
      `SELECT sc.*,
              COUNT(t.Technician_ID) AS Technician_Count
       FROM ServiceCenter sc
       LEFT JOIN Technician t ON sc.Center_ID = t.Center_ID
       GROUP BY sc.Center_ID
       ORDER BY sc.Created_At DESC`
    );
    return rows;
  },

  // Get service center by ID
  async findById(centerId) {
    const [rows] = await db.execute(
      "SELECT * FROM ServiceCenter WHERE Center_ID = ?",
      [centerId]
    );
    return rows[0] || null;
  },

  // Update service center
  async update(centerId, { centerName, location, contact }) {
    const [result] = await db.execute(
      "UPDATE ServiceCenter SET Center_Name = ?, Location = ?, Contact = ? WHERE Center_ID = ?",
      [centerName, location, contact, centerId]
    );
    return result.affectedRows;
  },

  // Delete service center
  async delete(centerId) {
    const [result] = await db.execute(
      "DELETE FROM ServiceCenter WHERE Center_ID = ?",
      [centerId]
    );
    return result.affectedRows;
  },
};

module.exports = ServiceCenterModel;
