const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Auth: Signup
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password, phone, address } = req.body;
        
        // Simple input validation
        if (!firstName || !lastName || !email || !password || !phone || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Insert into Customer table
        await db.query(
            `INSERT INTO Customer (First_Name, Last_Name, Age, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, age, email, password, phone, address]
        );
        res.json({ success: true, message: 'Signup successful' });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Auth: Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Check in Admin table
        const [adminRows] = await db.query(
            `SELECT * FROM Admin WHERE Email = ? AND Password = ?`,
            [email, password]
        );

        if (adminRows.length > 0) {
            return res.json({
                success: true,
                role: 'admin',
                user: adminRows[0] // Contains Admin_ID
            });
        }

        // Step 2: Check in Customer table
        const [customerRows] = await db.query(
            `SELECT * FROM Customer WHERE Email = ? AND Password = ?`,
            [email, password]
        );

        if (customerRows.length > 0) {
            return res.json({
                success: true,
                role: 'customer',
                user: customerRows[0] // Contains Customer_ID
            });
        }

        // Step 3: Not found in both
        res.json({ success: false, message: 'Invalid credentials' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Customer APIs
app.get('/profile', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: 'Email required' });

        const [rows] = await db.query(`SELECT * FROM Customer WHERE Email = ?`, [email]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/profile', async (req, res) => {
    try {
        const { id, address, phone } = req.body; // 'id' here is Customer_ID from frontend
        if (!id) return res.status(400).json({ success: false, message: 'User ID required' });

        await db.query(`UPDATE Customer SET Address = ?, Phone = ? WHERE Customer_ID = ?`, [address, phone, id]);
        res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Product APIs
app.post('/product', async (req, res) => {
    try {
        const { customerId, productName, modelNumber, purchaseDate } = req.body;

        const insertProduct = await db.query(
            `INSERT INTO Product (Customer_ID, Product_Name, Model_Number, Purchase_Date) VALUES (?, ?, ?, ?)`,
            [customerId, productName, modelNumber, purchaseDate]
        );

        const productId = insertProduct[0].insertId;
        const startDate = new Date(purchaseDate);
        const endDate = new Date(purchaseDate);
        endDate.setFullYear(endDate.getFullYear() + 2); // 2 years warranty

        await db.query(
            `INSERT INTO Warranty (Product_ID, Warranty_Type, Start_Date, End_Date) VALUES (?, 'Standard', ?, ?)`,
            [productId, startDate, endDate]
        );

        res.json({ success: true, message: 'Product added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const { customerId } = req.query;
        if (!customerId) return res.status(400).json({ success: false, message: 'Customer ID required' });

        const [products] = await db.query(`
            SELECT Product.*, Warranty.Warranty_Type, Warranty.Start_Date, Warranty.End_Date
            FROM Product
            LEFT JOIN Warranty ON Product.Product_ID = Warranty.Product_ID
            WHERE Product.Customer_ID = ?
        `, [customerId]);

        // Update Warranty Status dynamically based on date
        const currentDate = new Date();
        products.forEach(p => {
            const end = new Date(p.End_Date);
            p.IsUnderWarranty = currentDate <= end;
        });

        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/all-products', async (req, res) => {
    try {
        const [products] = await db.query(`SELECT * FROM Product`);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Service Request APIs
app.post('/service-request', async (req, res) => {
    try {
        const { customerId, productId, issueDescription } = req.body;
        
        // 1. Check if Address is present
        const [customer] = await db.query(`SELECT Address FROM Customer WHERE Customer_ID = ?`, [customerId]);
        if (!customer[0].Address) {
            return res.status(400).json({ success: false, message: 'Please update your address in profile before raising a request.' });
        }

        // 2. Insert into ServiceRequest table
        const result = await db.query(
            `INSERT INTO ServiceRequest (Customer_ID, Product_ID, Issue_Description, Status, Request_Date) VALUES (?, ?, ?, 'Pending', CURDATE())`,
            [customerId, productId, issueDescription]
        );
        const requestId = result[0].insertId;

        // Warranty check
        const [warranty] = await db.query(`SELECT End_Date FROM Warranty WHERE Product_ID = ?`, [productId]);
        let isWarrantyActive = false;
        if (warranty.length > 0) {
            isWarrantyActive = new Date() <= new Date(warranty[0].End_Date);
        }
        let initialCost = isWarrantyActive ? 0.00 : null;

        // Automatically assign technician
        const [technicians] = await db.query(`SELECT Technician_ID FROM Technician LIMIT 1`);
        if (technicians.length > 0) {
            const techId = technicians[0].Technician_ID;
            // 3. Create ServiceRecord entry
            await db.query(
                `INSERT INTO ServiceRecord (Request_ID, Technician_ID, Service_Status, Service_Date, Cost) VALUES (?, ?, 'Assigned', CURDATE(), ?)`,
                [requestId, techId, initialCost]
            );
            // Updating ServiceRequest Status
            await db.query(`UPDATE ServiceRequest SET Status = 'Assigned' WHERE Request_ID = ?`, [requestId]);
        }

        res.json({ success: true, message: 'Service request raised successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/service-status', async (req, res) => {
    try {
        const { customerId } = req.query;
        let query = `
            SELECT SR.*, SRec.Service_ID as RecordId, SRec.Service_Status as TaskStatus, SRec.Cost, SRec.Technician_ID, T.Name as TechnicianName, P.Product_Name, W.End_Date, Pay.Payment_Status, F.Rating as Feedback_Rating
            FROM ServiceRequest SR
            LEFT JOIN ServiceRecord SRec ON SR.Request_ID = SRec.Request_ID
            LEFT JOIN Technician T ON SRec.Technician_ID = T.Technician_ID
            LEFT JOIN Product P ON SR.Product_ID = P.Product_ID
            LEFT JOIN Warranty W ON P.Product_ID = W.Product_ID
            LEFT JOIN Payment Pay ON SRec.Service_ID = Pay.Service_ID
            LEFT JOIN Feedback F ON SRec.Service_ID = F.Service_ID
        `;
        let params = [];
        if (customerId) {
            query += ` WHERE SR.Customer_ID = ?`;
            params.push(customerId);
        }

        const [requests] = await db.query(query, params);
        res.json({ success: true, requests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/payment', async (req, res) => {
    try {
        const { serviceId, amount, paymentMode } = req.body;
        await db.query(
            `INSERT INTO Payment (Service_ID, Amount, Payment_Mode, Payment_Status) VALUES (?, ?, ?, 'Completed')`,
            [serviceId, amount, paymentMode || 'Digital']
        );
        res.json({ success: true, message: 'Payment successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/feedback', async (req, res) => {
    try {
        const { serviceId, rating, comments } = req.body;
        await db.query(
            `INSERT INTO Feedback (Service_ID, Rating, Comments) VALUES (?, ?, ?)`,
            [serviceId, rating, comments]
        );
        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin endpoint to get all requests
app.get('/admin/requests', async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT SR.*, SRec.Service_ID as RecordId, SRec.Service_Status as TaskStatus, C.First_Name, C.Last_Name, C.Email
            FROM ServiceRequest SR
            LEFT JOIN ServiceRecord SRec ON SR.Request_ID = SRec.Request_ID
            LEFT JOIN Customer C ON SR.Customer_ID = C.Customer_ID
        `);
        res.json({ success: true, requests });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin update request
app.put('/admin/service-update', async (req, res) => {
    try {
        const { serviceId, status, cost, technician } = req.body;
        
        // 1. Update ServiceRecord
        await db.query(`
            UPDATE ServiceRecord 
            SET Service_Status = ?, Cost = ?, Technician_ID = (SELECT Technician_ID FROM Technician WHERE Name = ? OR Technician_ID = ? LIMIT 1)
            WHERE Service_ID = ?
        `, [status, cost, technician, technician, serviceId]);

        // 2. Sync corresponding ServiceRequest status
        const [record] = await db.query(`SELECT Request_ID FROM ServiceRecord WHERE Service_ID = ?`, [serviceId]);
        if (record.length > 0) {
            await db.query(`UPDATE ServiceRequest SET Status = ? WHERE Request_ID = ?`, [status, record[0].Request_ID]);
        }

        res.json({ success: true, message: 'Registry synchronized successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Authority sync failed' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
