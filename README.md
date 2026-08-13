# Multi-Branch Grocery Store Management System

## System Overview

The Multi-Branch Grocery Store Management System is a SaaS platform designed for grocery retail operations. It provides centralized management for inventory, Point of Sale (POS) operations, branch networks, suppliers, customer loyalty, and financial reporting across multiple store locations.

## Frontend Technology Stack

- Programming Language: TypeScript / JavaScript
- Core Framework: React 18
- Build Tool: Vite
- State Management: Redux Toolkit and TanStack Query
- Routing: React Router DOM
- Styling and Animation: Tailwind CSS and Framer Motion
- Form Validation: React Hook Form and Zod
- Data Visualization: Recharts
- Real-Time Communication: Socket.io Client
- HTTP Client: Axios
- UI Icons: Lucide React

## Backend Technology Stack

- Programming Language: JavaScript (Node.js)
- Web Framework: Express.js
- Database and ORM: MySQL 8.0+ with Sequelize ORM
- Caching and Sessions: Redis
- Security and Auth: JSON Web Tokens (JWT), BcryptJS, Helmet, and Rate Limiting
- Real-Time Server: Socket.io
- Data Validation: Joi and Express Validator
- Document Generation: PDFKit and ExcelJS
- File Handling: Multer
- Logging: Winston with daily file rotation
- Payment and Notifications: M-Pesa API integration and Nodemailer

## Features Implemented in the System

- Multi-Tenant and Multi-Branch Management: Isolated business data per tenant, branch-level settings, and centralized multi-store administration.
- Authentication and Role-Based Access Control: Secure login with JWT, two-factor authentication (2FA), session management, and granular roles for Super Admin, Branch Manager, Cashier, Inventory Clerk, and Accountant.
- Point of Sale (POS): Fast checkout interface supporting barcode scanning, cart calculations, invoice generation, and payment processing via cash, card, or M-Pesa.
- Inventory Control: Real-time stock tracking, expiration and batch tracking, low-stock alert thresholds, and inter-branch inventory transfers.
- Product Catalog: Product categorization, unit management, variant handling, dynamic pricing rules, and promotional campaign configuration.
- Purchasing and Suppliers: Supplier directory, purchase request approval workflows, automated purchase order creation, and stock intake verification.
- Customer Relations and Loyalty: Customer profile tracking, store credit management, and point-based loyalty rewards.
- Financial Operations: Operational expense logging, transaction audit trails, revenue analytics, and account reconciliations.
- Analytics and Reporting: Real-time dashboard performance metrics, interactive visual charts, audit logging, and exportable reports in PDF and Excel formats.

## Project Structure

```
Grocery-store-management-system/
├── backend/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── helpers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── analytics/
│   │   │   ├── audit/
│   │   │   ├── auth/
│   │   │   ├── branches/
│   │   │   ├── customers/
│   │   │   ├── dashboard/
│   │   │   ├── expenses/
│   │   │   ├── inventory/
│   │   │   ├── pos/
│   │   │   ├── products/
│   │   │   ├── reports/
│   │   │   ├── sales/
│   │   │   ├── settings/
│   │   │   └── suppliers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```
