# 🛡️ Warranty and Service Claim Management System

A complete RESTful backend built with **Node.js (Express.js)** and **MySQL** for managing product warranties, service requests, technicians, and payments.

---

## 📁 Folder Structure

```
warranty-system/
├── config/
│   └── db.js                     # MySQL connection pool
├── controllers/
│   ├── authController.js         # Customer signup / login
│   ├── adminAuthController.js    # Admin login
│   ├── adminController.js        # Admin operations
│   ├── productController.js      # Product registration
│   ├── serviceRequestController.js
│   ├── feedbackController.js
│   └── serviceCenterController.js
├── middleware/
│   └── auth.js                   # JWT verifyToken / verifyAdmin
├── models/
│   ├── customerModel.js
│   ├── productModel.js
│   ├── serviceRequestModel.js
│   ├── serviceRecordModel.js
│   ├── paymentModel.js
│   ├── feedbackModel.js
│   ├── adminModel.js
│   ├── serviceCenterModel.js
│   └── technicianModel.js
├── routes/
│   ├── customerRoutes.js
│   └── adminRoutes.js
├── schema.sql                    # Full DB schema + seed admin
├── server.js                     # Entry point
├── .env                          # Environment variables
├── .env.example
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=warranty_system
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Create the database
```bash
mysql -u root -p < schema.sql
```
This creates all tables and seeds a default admin account.

### 4. Start the server
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

---

## 🔐 Default Admin Credentials
| Field    | Value               |
|----------|---------------------|
| Email    | admin@warranty.com  |
| Password | password            |

> ⚠️ Change this password immediately in production.

---

## 🌐 API Reference

All protected routes require the `Authorization: Bearer <token>` header.

---

### 👤 Customer Endpoints

#### `POST /signup` — Register customer
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "password": "secret123"
}
```
**Response:**
```json
{
  "success": true,
  "data": { "customerId": 1, "token": "<jwt>" }
}
```

---

#### `POST /login` — Customer login
```json
{ "email": "john@example.com", "password": "secret123" }
```

---

#### `POST /product` 🔒 — Register a product
```json
{
  "productName": "Samsung TV",
  "modelNumber": "UA55AU7700",
  "purchaseDate": "2024-01-15",
  "warrantyType": "Comprehensive",
  "warrantyStartDate": "2024-01-15",
  "warrantyEndDate": "2026-01-15"
}
```

---

#### `GET /product` 🔒 — Get my products
Returns all products with warranty info for the logged-in customer.

---

#### `POST /service-request` 🔒 — Raise service request
```json
{
  "productId": 1,
  "issueDescription": "Screen flickering intermittently",
  "requestDate": "2025-03-10"
}
```

---

#### `GET /service-status/:id` 🔒 — Check service status
Returns full details: request info, technician assigned, service record, cost.

---

#### `GET /my-requests` 🔒 — All my service requests

---

#### `POST /feedback` 🔒 — Submit feedback (after completion)
```json
{
  "serviceId": 1,
  "rating": 5,
  "comments": "Excellent and quick service!"
}
```

---

#### `GET /feedback/:serviceId` 🔒 — Get feedback for a service

---

### 🔧 Admin Endpoints

All admin routes require admin JWT token.

#### `POST /admin/login`
```json
{ "email": "admin@warranty.com", "password": "password" }
```

---

#### `GET /admin/customers` 🔒 — View all customers

#### `GET /admin/requests` 🔒 — View all service requests (with technician, product, customer info)

---

#### `PUT /admin/assign-technician` 🔒 — Assign technician to a request
```json
{
  "requestId": 1,
  "technicianId": 2,
  "serviceDate": "2025-03-12",
  "cost": 0
}
```
- Creates a `ServiceRecord` (or updates existing)
- Sets `ServiceRequest.Status` → `"In Progress"`

---

#### `PUT /admin/update-status` 🔒 — Update service status
```json
{
  "serviceId": 1,
  "serviceStatus": "Completed",
  "cost": 1500.00
}
```
- When `serviceStatus = "Completed"` and `cost > 0`, auto-creates a `Payment` record

---

#### `POST /admin/service-record` 🔒 — Manually add a service record
```json
{
  "requestId": 1,
  "technicianId": 2,
  "serviceDate": "2025-03-12",
  "cost": 500.00
}
```

---

#### `POST /admin/payment` 🔒 — Create payment record
```json
{
  "serviceId": 1,
  "amount": 1500.00,
  "paymentMode": "UPI"
}
```
Valid payment modes: `Cash`, `Card`, `UPI`, `Online`

---

#### `PUT /admin/payment-status` 🔒 — Update payment status
```json
{ "paymentId": 1, "status": "Paid" }
```
Valid statuses: `Pending`, `Paid`, `Failed`

---

#### `GET /admin/feedback` 🔒 — View all feedback with customer and technician info

---

#### Service Centers
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/admin/service-center` | Create center |
| `GET` | `/admin/service-centers` | List all centers |
| `PUT` | `/admin/service-center/:id` | Update center |
| `DELETE` | `/admin/service-center/:id` | Delete center |

**Body for create/update:**
```json
{ "centerName": "Downtown Service Hub", "location": "Chennai, TN", "contact": "044-12345678" }
```

---

#### Technicians
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/admin/technician` | Add technician |
| `GET` | `/admin/technicians` | List all technicians |
| `PUT` | `/admin/technician/:id` | Update technician |
| `DELETE` | `/admin/technician/:id` | Delete technician |

**Body for create/update:**
```json
{ "name": "Ravi Kumar", "skill": "Electronics, AC Repair", "centerId": 1 }
```

---

## 🔄 Service Workflow

```
Customer registers product
        ↓
Customer raises ServiceRequest  (Status: Pending)
        ↓
Admin assigns Technician        → ServiceRecord created (Status: Assigned)
                                   ServiceRequest → In Progress
        ↓
Technician works on it          → Admin updates status → In Progress
        ↓
Service Completed               → ServiceRecord → Completed
                                   ServiceRequest → Completed
        ↓
If cost > 0                     → Payment record auto-created
        ↓
Customer submits Feedback       (only after Completed)
```

---

## 🛡️ Error Responses

All errors follow this format:
```json
{ "success": false, "message": "Descriptive error message" }
```

| HTTP Code | Meaning |
|-----------|---------|
| `400` | Bad Request — missing/invalid fields |
| `401` | Unauthorized — missing/invalid token |
| `403` | Forbidden — insufficient privileges |
| `404` | Not Found |
| `409` | Conflict — duplicate resource |
| `500` | Internal Server Error |
