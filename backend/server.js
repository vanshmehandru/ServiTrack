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
        
        if (!firstName || !lastName || !email || !password || !phone || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        await db.query(
            `INSERT INTO Customer (First_Name, Last_Name, Age, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, age, email, password, phone, address]
        );
        res.json({ success: true, message: 'Account created successfully' });
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

        const [adminRows] = await db.query(
            `SELECT * FROM Admin WHERE Email = ? AND Password = ?`,
            [email, password]
        );

        if (adminRows.length > 0) {
            return res.json({
                success: true,
                role: 'admin',
                user: adminRows[0]
            });
        }

        const [customerRows] = await db.query(
            `SELECT * FROM Customer WHERE Email = ? AND Password = ?`,
            [email, password]
        );

        if (customerRows.length > 0) {
            return res.json({
                success: true,
                role: 'customer',
                user: customerRows[0]
            });
        }

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
        const { id, address, phone } = req.body;
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

        const currentDate = new Date();
        products.forEach(p => {
            const end = new Date(p.End_Date);
            p.IsUnderWarranty = currentDate <= end;
        });

        res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Service Request APIs
app.post('/service-request', async (req, res) => {
    try {
        const { customerId, productId, issueDescription } = req.body;
        
        const [customer] = await db.query(`SELECT Address FROM Customer WHERE Customer_ID = ?`, [customerId]);
        if (!customer[0].Address) {
            return res.status(400).json({ success: false, message: 'Please update your address in profile before raising a request.' });
        }

        const result = await db.query(
            `INSERT INTO ServiceRequest (Customer_ID, Product_ID, Issue_Description, Status, Request_Date) VALUES (?, ?, ?, 'Pending', CURDATE())`,
            [customerId, productId, issueDescription]
        );
        const requestId = result[0].insertId;

        const [warranty] = await db.query(`SELECT End_Date FROM Warranty WHERE Product_ID = ?`, [productId]);
        let isWarrantyActive = false;
        if (warranty.length > 0) {
            isWarrantyActive = new Date() <= new Date(warranty[0].End_Date);
        }
        let initialCost = isWarrantyActive ? 0.00 : null;

        const [technicians] = await db.query(`SELECT Technician_ID FROM Technician LIMIT 1`);
        if (technicians.length > 0) {
            const techId = technicians[0].Technician_ID;
            await db.query(
                `INSERT INTO ServiceRecord (Request_ID, Technician_ID, Service_Status, Service_Date, Cost) VALUES (?, ?, 'Assigned', CURDATE(), ?)`,
                [requestId, techId, initialCost]
            );
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
            SELECT SR.*, SRec.Service_ID as RecordId, SRec.Service_Status as TaskStatus, SRec.Cost, SRec.Technician_ID, T.Name as TechnicianName, P.Product_Name, P.Model_Number, W.End_Date, Pay.Payment_Status, F.Rating as Feedback_Rating
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
        res.json({ success: true, message: 'Feedback submitted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin update request
app.put('/admin/service-update', async (req, res) => {
    console.log('--- ADMIN UPDATE LOG ---');
    console.log('Payload:', req.body);
    try {
        const { serviceId, requestId, status, cost, technician } = req.body;
        
        let actualServiceId = serviceId;
        let actualRequestId = requestId;

        // If serviceId is missing, logic for multi-entry mapping
        if (!actualServiceId && actualRequestId) {
            console.log('Missing ServiceId. Fetching for Request:', actualRequestId);
            const [existingRecord] = await db.query(`SELECT Service_ID FROM ServiceRecord WHERE Request_ID = ?`, [actualRequestId]);
            if (existingRecord.length > 0) {
                actualServiceId = existingRecord[0].Service_ID;
                console.log('Found existing ServiceId:', actualServiceId);
            } else {
                console.log('No ServiceRecord found. Initializing new entry...');
                const [newRecord] = await db.query(
                    `INSERT INTO ServiceRecord (Request_ID, Service_Status, Service_Date, Cost, Technician_ID) VALUES (?, ?, CURDATE(), ?, NULL)`,
                    [actualRequestId, status || 'Pending', cost || 0.00]
                );
                // In mysql2/promise, result is the first element
                actualServiceId = newRecord.insertId;
                console.log('Created new ServiceRecord ID:', actualServiceId);
            }
        }

        if (!actualServiceId) {
            console.error('CRITICAL: Update failed due to missing identifiers');
            return res.status(400).json({ success: false, message: 'Service ID or Request ID required' });
        }

        // Handle Technician
        let techId = null;
        if (technician) {
            console.log('Assigning Technician:', technician);
            const [techs] = await db.query(`SELECT Technician_ID FROM Technician WHERE Name = ? OR Technician_ID = ? LIMIT 1`, [technician, technician]);
            if (techs.length > 0) {
                techId = techs[0].Technician_ID;
            } else {
                console.log('Technician not found. Creating new registry entry for:', technician);
                const [insertTech] = await db.query(`INSERT INTO Technician (Name) VALUES (?)`, [technician]);
                techId = insertTech.insertId;
            }
        }

        // Sync Status & Cost
        const [recordInfo] = await db.query(`
            SELECT W.End_Date, SR.Product_ID, SR.Request_ID
            FROM ServiceRecord SRec
            JOIN ServiceRequest SR ON SRec.Request_ID = SR.Request_ID
            JOIN Warranty W ON SR.Product_ID = W.Product_ID
            WHERE SRec.Service_ID = ?
        `, [actualServiceId]);

        let finalCost = cost;
        if (recordInfo.length > 0) {
            const isUnderWarranty = new Date() <= new Date(recordInfo[0].End_Date);
            console.log('Warranty Status:', isUnderWarranty ? 'ACTIVE' : 'EXPIRED');
            if (isUnderWarranty) finalCost = 0.00;
            if (!actualRequestId) actualRequestId = recordInfo[0].Request_ID;
        }

        console.log('Finalizing records. ID:', actualServiceId, 'Status:', status, 'Cost:', finalCost);
        await db.query(`
            UPDATE ServiceRecord 
            SET Service_Status = ?, Cost = ?, Technician_ID = ?
            WHERE Service_ID = ?
        `, [status, finalCost, techId, actualServiceId]);

        if (actualRequestId) {
            await db.query(`UPDATE ServiceRequest SET Status = ? WHERE Request_ID = ?`, [status, actualRequestId]);
        }

        console.log('System synchronization complete.');
        res.json({ success: true, message: 'System records updated' });
    } catch (err) {
        console.error('--- AUTHORITY SYNC ERROR ---');
        console.error(err);
        res.status(500).json({ success: false, message: 'Authority sync failed: Internal database error' });
    }
});

// Upgrade Warranty
app.put('/upgrade-warranty', async (req, res) => {
    try {
        const { productId, planType, durationYears } = req.body;
        if (!productId || !planType) return res.status(400).json({ success: false, message: 'Product ID and Plan Type required' });

        const [existing] = await db.query(`SELECT Start_Date FROM Warranty WHERE Product_ID = ?`, [productId]);
        if (existing.length === 0) return res.status(404).json({ success: false, message: 'Warranty record not found' });

        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + (durationYears || 1));

        await db.query(`
            UPDATE Warranty 
            SET Warranty_Type = ?, End_Date = ?
            WHERE Product_ID = ?
        `, [planType, endDate, productId]);

        res.json({ success: true, message: `Warranty upgraded to ${planType}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Upgrade failed' });
    }
});

// New Endpoint: Get All Technicians
app.get('/admin/technicians', async (req, res) => {
    try {
        const [technicians] = await db.query(`SELECT * FROM Technician`);
        res.json({ success: true, technicians });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
});


// Admin: Global Registry Views
app.get('/admin/all-products', async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT P.*, C.First_Name, C.Last_Name, W.Warranty_Type, W.Start_Date, W.End_Date
            FROM Product P
            LEFT JOIN Customer C ON P.Customer_ID = C.Customer_ID
            LEFT JOIN Warranty W ON P.Product_ID = W.Product_ID
        `);
        const currentDate = new Date();
        products.forEach(p => {
            const end = new Date(p.End_Date);
            p.IsUnderWarranty = p.End_Date ? (currentDate <= end) : false;
        });
        res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Registry fetch failed' });
    }
});

app.get('/admin/all-customers', async (req, res) => {
    try {
        const [customers] = await db.query(`
            SELECT C.*, COUNT(P.Product_ID) as Total_Products
            FROM Customer C
            LEFT JOIN Product P ON C.Customer_ID = P.Customer_ID
            GROUP BY C.Customer_ID
        `);
        res.json({ success: true, customers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Customer directory fetch failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
