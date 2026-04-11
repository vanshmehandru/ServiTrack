// models/serviceRecordModel.js
const db = require("../config/db");

const ServiceRecordModel = {
  // Create a service record (assign technician)
  async create({ requestId, technicianId, serviceDate, cost }) {
    const [result] = await db.execute(
      `INSERT INTO ServiceRecord (Request_ID, Technician_ID, Service_Date, Service_Status, Cost)
       VALUES (?, ?, ?, 'Assigned', ?)`,
      [requestId, technicianId, serviceDate, cost || 0]
    );
    return result.insertId;
  },

  // Get service record by request ID
  async findByRequestId(requestId) {
    const [rows] = await db.execute(
      `SELECT sr.*, t.Name AS Technician_Name, t.Skill,
              sc.Center_Name, sc.Location
       FROM ServiceRecord sr
       JOIN Technician t     ON sr.Technician_ID = t.Technician_ID
       JOIN ServiceCenter sc ON t.Center_ID = sc.Center_ID
       WHERE sr.Request_ID = ?`,
      [requestId]
    );
    return rows[0] || null;
  },

  // Get service record by ID
  async findById(serviceId) {
    const [rows] = await db.execute(
      "SELECT * FROM ServiceRecord WHERE Service_ID = ?",
      [serviceId]
    );
    return rows[0] || null;
  },

  // Update service record status and cost
  async updateStatus({ serviceId, serviceStatus, cost }) {
    const updates = [];
    const params = [];
    if (serviceStatus) { updates.push("Service_Status = ?"); params.push(serviceStatus); }
    if (cost !== undefined) { updates.push("Cost = ?"); params.push(cost); }
    if (updates.length === 0) return 0;
    params.push(serviceId);
    const [result] = await db.execute(
      `UPDATE ServiceRecord SET ${updates.join(", ")} WHERE Service_ID = ?`,
      params
    );
    return result.affectedRows;
  },

  // Update technician assignment
  async updateTechnician(serviceId, technicianId) {
    const [result] = await db.execute(
      "UPDATE ServiceRecord SET Technician_ID = ?, Service_Status = 'Assigned' WHERE Service_ID = ?",
      [technicianId, serviceId]
    );
    return result.affectedRows;
  },
};

module.exports = ServiceRecordModel;
