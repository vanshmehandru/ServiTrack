// models/technicianModel.js
const db = require("../config/db");

const TechnicianModel = {
  // Add technician
  async create({ name, skill, centerId }) {
    const [result] = await db.execute(
      "INSERT INTO Technician (Name, Skill, Center_ID) VALUES (?, ?, ?)",
      [name, skill, centerId]
    );
    return result.insertId;
  },

  // Get all technicians
  async getAll() {
    const [rows] = await db.execute(
      `SELECT t.*, sc.Center_Name, sc.Location
       FROM Technician t
       JOIN ServiceCenter sc ON t.Center_ID = sc.Center_ID
       ORDER BY t.Created_At DESC`
    );
    return rows;
  },

  // Get technician by ID
  async findById(technicianId) {
    const [rows] = await db.execute(
      `SELECT t.*, sc.Center_Name, sc.Location
       FROM Technician t
       JOIN ServiceCenter sc ON t.Center_ID = sc.Center_ID
       WHERE t.Technician_ID = ?`,
      [technicianId]
    );
    return rows[0] || null;
  },

  // Get technicians by center
  async findByCenter(centerId) {
    const [rows] = await db.execute(
      "SELECT * FROM Technician WHERE Center_ID = ? ORDER BY Name",
      [centerId]
    );
    return rows;
  },

  // Update technician
  async update(technicianId, { name, skill, centerId }) {
    const [result] = await db.execute(
      "UPDATE Technician SET Name = ?, Skill = ?, Center_ID = ? WHERE Technician_ID = ?",
      [name, skill, centerId, technicianId]
    );
    return result.affectedRows;
  },

  // Delete technician
  async delete(technicianId) {
    const [result] = await db.execute(
      "DELETE FROM Technician WHERE Technician_ID = ?",
      [technicianId]
    );
    return result.affectedRows;
  },
};

module.exports = TechnicianModel;
