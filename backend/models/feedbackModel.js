// models/feedbackModel.js
const db = require("../config/db");

const FeedbackModel = {
  // Submit feedback
  async create({ serviceId, rating, comments }) {
    const [result] = await db.execute(
      "INSERT INTO Feedback (Service_ID, Rating, Comments) VALUES (?, ?, ?)",
      [serviceId, rating, comments || null]
    );
    return result.insertId;
  },

  // Check if feedback already submitted
  async findByServiceId(serviceId) {
    const [rows] = await db.execute(
      "SELECT * FROM Feedback WHERE Service_ID = ?",
      [serviceId]
    );
    return rows[0] || null;
  },

  // Get all feedback (admin)
  async getAll() {
    const [rows] = await db.execute(
      `SELECT f.*,
              sr.Service_Date, sr.Cost,
              CONCAT(c.First_Name, ' ', c.Last_Name) AS Customer_Name,
              p.Product_Name, t.Name AS Technician_Name
       FROM Feedback f
       JOIN ServiceRecord sr  ON f.Service_ID = sr.Service_ID
       JOIN ServiceRequest req ON sr.Request_ID = req.Request_ID
       JOIN Customer c  ON req.Customer_ID = c.Customer_ID
       JOIN Product p   ON req.Product_ID  = p.Product_ID
       JOIN Technician t ON sr.Technician_ID = t.Technician_ID
       ORDER BY f.Created_At DESC`
    );
    return rows;
  },
};

module.exports = FeedbackModel;
