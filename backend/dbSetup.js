const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

async function createDatabaseAndTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        const dbName = process.env.DB_NAME || 'warranty_db';
        
        // DROP DATABASE is necessary for a clean migration given the significant structural changes
        await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
        await connection.query(`CREATE DATABASE \`${dbName}\``);
        console.log(`Database '${dbName}' recreated.`);

        await connection.query(`USE \`${dbName}\``);

        const createCustomerTable = `
            CREATE TABLE Customer (
                Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
                First_Name VARCHAR(50),
                Last_Name VARCHAR(50),
                Phone VARCHAR(15),
                Email VARCHAR(100) UNIQUE,
                Password VARCHAR(100),
                Age INT,
                Address VARCHAR(255)
            );
        `;

        const createProductTable = `
            CREATE TABLE Product (
                Product_ID INT PRIMARY KEY AUTO_INCREMENT,
                Product_Name VARCHAR(100),
                Model_Number VARCHAR(50),
                Purchase_Date DATE,
                Customer_ID INT,
                FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
            );
        `;

        const createWarrantyTable = `
            CREATE TABLE Warranty (
                Warranty_ID INT PRIMARY KEY AUTO_INCREMENT,
                Product_ID INT,
                Warranty_Type VARCHAR(50),
                Start_Date DATE,
                End_Date DATE,
                FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
            );
        `;

        const createServiceRequestTable = `
            CREATE TABLE ServiceRequest (
                Request_ID INT PRIMARY KEY AUTO_INCREMENT,
                Customer_ID INT,
                Product_ID INT,
                Request_Date DATE,
                Issue_Description VARCHAR(255),
                Status VARCHAR(50),
                FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
                FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
            );
        `;

        const createServiceCenterTable = `
            CREATE TABLE ServiceCenter (
                Center_ID INT PRIMARY KEY AUTO_INCREMENT,
                Center_Name VARCHAR(100),
                Location VARCHAR(100),
                Contact VARCHAR(15)
            );
        `;

        const createTechnicianTable = `
            CREATE TABLE Technician (
                Technician_ID INT PRIMARY KEY AUTO_INCREMENT,
                Name VARCHAR(100),
                Skill VARCHAR(100),
                Center_ID INT,
                FOREIGN KEY (Center_ID) REFERENCES ServiceCenter(Center_ID)
            );
        `;

        const createServiceRecordTable = `
            CREATE TABLE ServiceRecord (
                Service_ID INT PRIMARY KEY AUTO_INCREMENT,
                Request_ID INT,
                Technician_ID INT,
                Service_Date DATE,
                Service_Status VARCHAR(50),
                Cost DECIMAL(10,2),
                FOREIGN KEY (Request_ID) REFERENCES ServiceRequest(Request_ID),
                FOREIGN KEY (Technician_ID) REFERENCES Technician(Technician_ID)
            );
        `;

        const createPaymentTable = `
            CREATE TABLE Payment (
                Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
                Service_ID INT,
                Amount DECIMAL(10,2),
                Payment_Mode VARCHAR(50),
                Payment_Status VARCHAR(50),
                FOREIGN KEY (Service_ID) REFERENCES ServiceRecord(Service_ID)
            );
        `;

        const createFeedbackTable = `
            CREATE TABLE Feedback (
                Feedback_ID INT PRIMARY KEY AUTO_INCREMENT,
                Service_ID INT,
                Rating INT CHECK (Rating BETWEEN 1 AND 5),
                Comments VARCHAR(255),
                FOREIGN KEY (Service_ID) REFERENCES ServiceRecord(Service_ID)
            );
        `;

        const createAdminTable = `
            CREATE TABLE Admin (
                Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
                Name VARCHAR(100),
                Role VARCHAR(50),
                Contact VARCHAR(100),
                Email VARCHAR(100) UNIQUE,
                Password VARCHAR(100)
            );
        `;

        // Execution in dependency order
        await connection.query(createCustomerTable);
        await connection.query(createProductTable);
        await connection.query(createWarrantyTable);
        await connection.query(createServiceRequestTable);
        await connection.query(createServiceCenterTable);
        await connection.query(createTechnicianTable);
        await connection.query(createServiceRecordTable);
        await connection.query(createPaymentTable);
        await connection.query(createFeedbackTable);
        await connection.query(createAdminTable);

        console.log('All tables created successfully.');

        // Insert Default Admin
        await connection.query(`
            INSERT INTO Admin (Name, Role, Contact, Email, Password) 
            VALUES ('System Controller', 'SuperAdmin', '999-000-1111', 'admin@warranty.com', 'admin123')
        `);

        // Insert Basic Service Center & Technician for auto-assignment logic
        await connection.query(`
            INSERT INTO ServiceCenter (Center_Name, Location, Contact)
            VALUES ('Central Hub', 'Enterprise Zone A', '555-0101')
        `);

        await connection.query(`
            INSERT INTO Technician (Name, Skill, Center_ID)
            VALUES ('Expert John', 'General Repairs', 1)
        `);

        console.log('Seed data initialized.');
        
        await connection.end();
    } catch (err) {
        console.error('Migration Error:', err);
    }
}

createDatabaseAndTables();
