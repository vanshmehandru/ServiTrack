// models/serviceRequestModel.js
const db = require("../config/db");

const ServiceRequestModel = {
  // Create a new service request
  async create({ customerId, productId, requestDate, issueDescription }) {
    const [result] = await db.execute(
      `INSERT INTO ServiceRequest (Customer_ID, Product_ID, Request_Date, Issue_Description, Status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [customerId, productId, requestDate, issueDescription]
    );
    return result.insertId;
  },

  // Get service request by ID with full details
  async findById(requestId) {
    const [rows] = await db.execute(
      `SELECT sr.*,
              CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
              c.Email, c.Phone,
              p.Product_Name, p.Model_Number,
              rec.Service_ID, rec.Technician_ID, rec.Service_Date,
              rec.Service_Status, rec.Cost,
              t.Name AS Technician_Name
       FROM ServiceRequest sr
       JOIN Customer c  ON sr.Customer_ID = c.Customer_ID
       JOIN Product p   ON sr.Product_ID  = p.Product_ID
       LEFT JOIN ServiceRecord rec ON sr.Request_ID = rec.Request_ID
       LEFT JOIN Technician t ON rec.Technician_ID = t.Technician_ID
       WHERE sr.Request_ID = ?`,
      [requestId]
    );
    return rows[0] || null;
  },

  // Get all service requests for a customer
  async findByCustomer(customerId) {
    const [rows] = await db.execute(
      `SELECT sr.*,
              p.Product_Name, p.Model_Number,
              rec.Service_ID, rec.Service_Status, rec.Cost,
              t.Name AS Technician_Name
       FROM ServiceRequest sr
       JOIN Product p ON sr.Product_ID = p.Product_ID
       LEFT JOIN ServiceRecord rec ON sr.Request_ID = rec.Request_ID
       LEFT JOIN Technician t ON rec.Technician_ID = t.Technician_ID
       WHERE sr.Customer_ID = ?
       ORDER BY sr.Created_At DESC`,
      [customerId]
    );
    return rows;
  },

  // Get all service requests (admin)
  async getAll() {
    const [rows] = await db.execute(
      `SELECT sr.*,
              CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
              c.Email, c.Phone,
              p.Product_Name, p.Model_Number,
              rec.Service_ID, rec.Technician_ID,
              rec.Service_Status AS Record_Status, rec.Cost,
              t.Name AS Technician_Name
       FROM ServiceRequest sr
       JOIN Customer c  ON sr.Customer_ID = c.Customer_ID
       JOIN Product p   ON sr.Product_ID  = p.Product_ID
       LEFT JOIN ServiceRecord rec ON sr.Request_ID = rec.Request_ID
       LEFT JOIN Technician t ON rec.Technician_ID = t.Technician_ID
       ORDER BY sr.Created_At DESC`
    );
    return rows;
  },

  // Update request status
  async updateStatus(requestId, status) {
    const [result] = await db.execute(
      "UPDATE ServiceRequest SET Status = ? WHERE Request_ID = ?",
      [status, requestId]
    );
    return result.affectedRows;
  },
};

module.exports = ServiceRequestModel;
