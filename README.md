# ServiTrack — Warranty & Service Management System

ServiTrack is a minimalist, high-end platform designed for hardware teams to manage asset registration, warranty validation, and service claim fulfillment at scale. Built with a focus on modern design aesthetics and seamless end-to-end functionality.


## 💎 Core Architecture

The system is split into a robust **React + Vite** frontend and a **Node.js/Express** backend, utilizing a relational **MySQL** database for mission-critical data integrity.

### Frontend
- **Glassmorphism UI**: High-end minimalist design with smooth animations.
- **Role-based Dashboards**: Custom interfaces for Customers and Administrators.
- **Service Tracking**: Real-time progress visualization for hardware repairs.
- **Payment Settlement**: Integrated flow for out-of-warranty service costs.

### Backend
- **Express API**: Modular RESTful endpoints for all service operations.
- **Encrypted Synchronization**: Secure handling of customer and device metadata.
- **Automated Registry**: Smart warranty validation logic (e.g., 2-year standard coverage).
- **Relational Integrity**: foreign-key enforced database for multi-table consistency (Customer -> Product -> Warranty -> Service).

## 🚀 Quick Start

### 1. Database Configuration
1. Ensure **MySQL** is running on your local machine.
2. Create a `.env` file in the `/backend` directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=database_name
   PORT=5000
   ```
3. Initialize the database schema and seed data:
   ```bash
   cd backend
   node dbSetup.js
   ```

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛠 Feature Set

| Feature | Description |
| :--- | :--- |
| **Asset Registry** | Enroll hardware units with encrypted serial verification in seconds. |
| **Warranty Validation** | Automated validation against custom service terms and durations. |
| **Technician Dispatch** | Manual assignment and oversight of service centers and specialists. |
| **Payment Flow** | Seamless settlement of $0 (Warranty) or fixed-cost service records. |
| **Analytics** | Admin overview of fleet health, fulfillment rates, and customer feedback. |

## 🎨 Design Philosophy

ServiTrack follows a **Chronicle HQ Aesthetic**:
- **Typography**: Inter & Serif heading combinations for a premium editorial feel.
- **Palette**: Sleek blacks, vibrant brand highlights, and subtle glass-like backgrounds.
- **Micro-interactions**: Hover-triggered transitions and spring-based animations.

---
*© 2024 ServiTrack Technologies Inc. — Built for hardware excellence.*
