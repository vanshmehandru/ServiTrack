-- ============================================================
-- Warranty and Service Claim Management System - Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS warranty_system;
USE warranty_system;

-- Customer Table
CREATE TABLE IF NOT EXISTS Customer (
    Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name  VARCHAR(100) NOT NULL,
    Last_Name   VARCHAR(100) NOT NULL,
    Phone       VARCHAR(20)  NOT NULL,
    Email       VARCHAR(150) NOT NULL UNIQUE,
    Password    VARCHAR(255) NOT NULL,
    Created_At  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Table
CREATE TABLE IF NOT EXISTS Product (
    Product_ID    INT AUTO_INCREMENT PRIMARY KEY,
    Product_Name  VARCHAR(150) NOT NULL,
    Model_Number  VARCHAR(100) NOT NULL,
    Purchase_Date DATE         NOT NULL,
    Customer_ID   INT          NOT NULL,
    Created_At    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE
);

-- Warranty Table
CREATE TABLE IF NOT EXISTS Warranty (
    Warranty_ID   INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID    INT          NOT NULL,
    Warranty_Type VARCHAR(100) NOT NULL,
    Start_Date    DATE         NOT NULL,
    End_Date      DATE         NOT NULL,
    Created_At    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- ServiceCenter Table
CREATE TABLE IF NOT EXISTS ServiceCenter (
    Center_ID   INT AUTO_INCREMENT PRIMARY KEY,
    Center_Name VARCHAR(150) NOT NULL,
    Location    VARCHAR(255) NOT NULL,
    Contact     VARCHAR(50)  NOT NULL,
    Created_At  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technician Table
CREATE TABLE IF NOT EXISTS Technician (
    Technician_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name          VARCHAR(150) NOT NULL,
    Skill         VARCHAR(255) NOT NULL,
    Center_ID     INT          NOT NULL,
    Created_At    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Center_ID) REFERENCES ServiceCenter(Center_ID) ON DELETE CASCADE
);

-- ServiceRequest Table
CREATE TABLE IF NOT EXISTS ServiceRequest (
    Request_ID        INT AUTO_INCREMENT PRIMARY KEY,
    Customer_ID       INT          NOT NULL,
    Product_ID        INT          NOT NULL,
    Request_Date      DATE         NOT NULL,
    Issue_Description TEXT         NOT NULL,
    Status            ENUM('Pending','In Progress','Completed','Cancelled') DEFAULT 'Pending',
    Created_At        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID)  REFERENCES Product(Product_ID)  ON DELETE CASCADE
);

-- ServiceRecord Table
CREATE TABLE IF NOT EXISTS ServiceRecord (
    Service_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Request_ID     INT          NOT NULL,
    Technician_ID  INT          NOT NULL,
    Service_Date   DATE         NOT NULL,
    Service_Status ENUM('Assigned','In Progress','Completed') DEFAULT 'Assigned',
    Cost           DECIMAL(10,2) DEFAULT 0.00,
    Created_At     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Request_ID)    REFERENCES ServiceRequest(Request_ID) ON DELETE CASCADE,
    FOREIGN KEY (Technician_ID) REFERENCES Technician(Technician_ID) ON DELETE CASCADE
);

-- Payment Table
CREATE TABLE IF NOT EXISTS Payment (
    Payment_ID     INT AUTO_INCREMENT PRIMARY KEY,
    Service_ID     INT          NOT NULL,
    Amount         DECIMAL(10,2) NOT NULL,
    Payment_Mode   ENUM('Cash','Card','UPI','Online') NOT NULL,
    Payment_Status ENUM('Pending','Paid','Failed') DEFAULT 'Pending',
    Created_At     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Service_ID) REFERENCES ServiceRecord(Service_ID) ON DELETE CASCADE
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS Feedback (
    Feedback_ID INT AUTO_INCREMENT PRIMARY KEY,
    Service_ID  INT  NOT NULL,
    Rating      TINYINT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comments    TEXT,
    Created_At  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Service_ID) REFERENCES ServiceRecord(Service_ID) ON DELETE CASCADE
);

-- Admin Table
CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID  INT AUTO_INCREMENT PRIMARY KEY,
    Name      VARCHAR(150) NOT NULL,
    Role      VARCHAR(100) NOT NULL,
    Contact   VARCHAR(50)  NOT NULL,
    Email     VARCHAR(150) NOT NULL UNIQUE,
    Password  VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed: Default Admin (password: admin123)
-- ============================================================
INSERT IGNORE INTO Admin (Name, Role, Contact, Email, Password)
VALUES (
    'Super Admin',
    'Administrator',
    '9000000000',
    'admin@warranty.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);
