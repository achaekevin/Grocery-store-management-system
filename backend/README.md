# GroceryOS Backend - Multi-Branch SaaS Grocery Store Management System

Enterprise-grade RESTful API backend built with Node.js, Express, MySQL, and Sequelize ORM.

## 🏗️ Architecture

### Clean Architecture Layers

```
├── Presentation Layer (Routes, Controllers, Middleware)
├── Business Logic Layer (Services)
├── Data Access Layer (Repositories)
└── Database Layer (Models, Migrations)
```

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Caching**: Redis
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Excel Generation**: ExcelJS
- **Email**: Nodemailer
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Task Scheduling**: node-cron

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   ├── database.js        # Sequelize config
│   ├── index.js           # App config
│   ├── logger.js          # Winston logger
│   └── redis.js           # Redis client
├── controllers/            # Request handlers
├── services/               # Business logic
├── repositories/           # Data access layer
├── models/                 # Sequelize models
├── middleware/             # Custom middleware
│   ├── auth.js            # Authentication
│   ├── rbac.js            # Role-based access
│   ├── errorHandler.js    # Global error handling
│   └── validate.js        # Request validation
├── routes/                 # API routes
├── validators/             # Joi schemas
├── sockets/                # Socket.io handlers
├── events/                 # Event emitters
├── helpers/                # Helper functions
│   ├── jwt.js             # JWT utilities
│   ├── bcrypt.js          # Password hashing
│   ├── email.js           # Email service
│   └── mpesa.js           # M-Pesa integration
├── jobs/                   # Cron jobs
├── uploads/                # File storage
├── utils/                  # Utility classes
│   ├── ApiResponse.js     # Response formatter
│   ├── ApiError.js        # Error class
│   └── pagination.js      # Pagination helper
├── docs/                   # Swagger documentation
├── database/               # Database files
│   ├── migrations/        # Schema migrations
│   └── seeders/           # Seed data
├── tests/                  # Test files
├── app.js                  # Express app
└── server.js               # Entry point
```

## 🔑 Key Features

### Multi-Tenant SaaS
- Complete business isolation
- Branch management per business
- Role-based access control (RBAC)
- Secure cross-tenant data protection

### Authentication & Authorization
- JWT access & refresh tokens
- Password hashing with bcrypt
- Email verification
- Two-factor authentication (2FA)
- Password reset flow
- Session management with Redis

### Role-Based Access Control
- **Super Admin**: Full system access
- **Branch Manager**: Branch-level management
- **Cashier**: POS operations
- **Inventory Clerk**: Stock management
- **Accountant**: Financial access

### Product Management
- CRUD operations
- SKU & barcode support
- Category & brand organization
- Stock tracking
- Expiry date management
- Image upload
- Advanced search & filtering

### Inventory Management
- Stock in/out operations
- Inter-branch transfers
- Inventory adjustments
- Damaged goods tracking
- Expiry alerts
- Low stock notifications
- Movement history

### Point of Sale (POS)
- Sale creation
- Multiple payment methods (Cash, M-Pesa, Card, Bank)
- Hold/Resume sales
- Sale cancellation
- Refunds
- Receipt generation
- Automatic inventory deduction

### Customer Management
- Customer profiles
- Purchase history
- Loyalty points system
- Credit sales tracking
- Customer balances
- Membership tiers (Bronze, Silver, Gold, Platinum)

### Supplier Management
- Supplier profiles
- Purchase orders
- Outstanding balances
- Payment tracking
- Order history

### Financial Management
- Sales reports
- Expense tracking
- Profit & Loss statements
- Cash flow reports
- Tax calculations
- Revenue analytics

### M-Pesa Integration
- STK Push payments
- Payment callbacks
- Transaction status queries
- Transaction logs
- Automatic payment reconciliation

### Reports & Analytics
- Daily/Weekly/Monthly sales
- Top products
- Top customers
- Branch performance
- Inventory valuation
- Financial reports
- Export to PDF/Excel/CSV

### Real-time Features (Socket.io)
- Live sale notifications
- Low stock alerts
- Payment confirmations
- Product expiry warnings
- System notifications

### Background Jobs (Cron)
- Daily expiry checks
- Low stock notifications
- Automated reports
- Database backups
- Data cleanup

## 🔒 Security Features

- Helmet.js security headers
- CORS protection
- Rate limiting
- XSS protection
- SQL injection prevention (Sequelize)
- Input validation (Joi)
- Secure password hashing
- JWT token authentication
- Refresh token rotation
- HTTP-only cookies
- IP logging
- Audit trails

## 📊 Database Schema

### Core Tables
- businesses
- branches
- users
- roles
- permissions
- role_permissions

### Products & Inventory
- categories
- brands
- units
- products
- inventory
- inventory_movements

### Sales & Payments
- sales
- sale_items
- payments
- refunds

### Customers & Loyalty
- customers
- loyalty_transactions
- loyalty_tiers

### Suppliers & Purchases
- suppliers
- purchase_orders
- purchase_items

### Financial
- expenses
- expense_categories
- taxes

### System
- audit_logs
- notifications
- settings
- mpesa_transactions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Redis (optional but recommended)

### Installation

1. **Clone and navigate**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create database**
   ```bash
   mysql -u root -p
   CREATE DATABASE groceryos_db;
   ```

5. **Run migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed database (optional)**
   ```bash
   npm run db:seed
   ```

7. **Start server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

Server runs on `http://localhost:5000`

## 📚 API Documentation

Swagger documentation available at:
```
http://localhost:5000/api-docs
```

### API Base URL
```
http://localhost:5000/api/v1
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

## 🔐 Authentication

### Register Business
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "businessName": "Acme Groceries",
  "email": "admin@acme.com",
  "password": "SecurePass123!",
  "phone": "+254700000000"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@acme.com",
  "password": "SecurePass123!"
}
```

Response includes:
- `accessToken`: Short-lived JWT
- `refreshToken`: Long-lived token for renewal

### Protected Routes
Include JWT in Authorization header:
```http
Authorization: Bearer <access_token>
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Database Commands

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Run seeders
npm run db:seed

# Undo seeders
npm run db:seed:undo

# Reset database (drop, migrate, seed)
npm run db:reset
```

## 🔄 API Endpoints Overview

### Authentication
- `POST /auth/register` - Register business
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email
- `POST /auth/2fa/enable` - Enable 2FA
- `POST /auth/2fa/verify` - Verify 2FA code

### Products
- `GET /products` - List products (paginated, filtered)
- `GET /products/:id` - Get product details
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/bulk` - Bulk import
- `GET /products/low-stock` - Low stock alerts
- `GET /products/expired` - Expired products

### Inventory
- `POST /inventory/stock-in` - Add stock
- `POST /inventory/stock-out` - Remove stock
- `POST /inventory/adjust` - Adjust inventory
- `POST /inventory/transfer` - Transfer between branches
- `GET /inventory/movements` - Movement history
- `GET /inventory/damaged` - Damaged goods
- `POST /inventory/damaged` - Report damaged goods

### POS (Point of Sale)
- `POST /pos/sale` - Create sale
- `POST /pos/hold` - Hold sale
- `GET /pos/held-sales` - Get held sales
- `POST /pos/resume/:id` - Resume sale
- `POST /pos/cancel/:id` - Cancel sale
- `POST /pos/refund/:id` - Process refund
- `GET /pos/receipt/:id` - Generate receipt

### Customers
- `GET /customers` - List customers
- `GET /customers/:id` - Get customer
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer
- `GET /customers/:id/purchases` - Purchase history
- `POST /customers/:id/loyalty` - Add loyalty points

### Suppliers
- `GET /suppliers` - List suppliers
- `GET /suppliers/:id` - Get supplier
- `POST /suppliers` - Create supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Purchase Orders
- `GET /purchases` - List purchase orders
- `POST /purchases` - Create purchase order
- `PUT /purchases/:id` - Update purchase order
- `POST /purchases/:id/approve` - Approve PO
- `POST /purchases/:id/receive` - Receive goods
- `POST /purchases/:id/cancel` - Cancel PO

### Branches
- `GET /branches` - List branches
- `POST /branches` - Create branch
- `PUT /branches/:id` - Update branch
- `DELETE /branches/:id` - Delete branch
- `GET /branches/:id/stats` - Branch statistics

### Reports
- `GET /reports/sales` - Sales reports
- `GET /reports/inventory` - Inventory reports
- `GET /reports/financial` - Financial reports
- `GET /reports/customers` - Customer reports
- `POST /reports/export` - Export report (PDF/Excel)

### M-Pesa
- `POST /mpesa/stk-push` - Initiate payment
- `POST /mpesa/callback` - Payment callback
- `GET /mpesa/status/:id` - Check status
- `GET /mpesa/transactions` - Transaction history

### Users & Roles
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /roles` - List roles
- `POST /roles` - Create role
- `PUT /roles/:id/permissions` - Update permissions

### Settings
- `GET /settings` - Get settings
- `PUT /settings` - Update settings
- `GET /settings/tax` - Tax settings
- `PUT /settings/tax` - Update tax settings

## 🔐 Environment Variables

See `.env.example` for all available configuration options.

Critical variables:
- `JWT_SECRET` - JWT signing secret (CHANGE IN PRODUCTION!)
- `DB_PASSWORD` - Database password
- `REDIS_PASSWORD` - Redis password
- `SMTP_USER` & `SMTP_PASSWORD` - Email credentials
- `MPESA_*` - M-Pesa API credentials

## 📊 Performance Optimization

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Connection pooling
- Response compression
- Rate limiting
- Lazy loading
- Pagination
- Query result caching

## 🐛 Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

Logs location:
- `logs/app-YYYY-MM-DD.log` - Application logs
- `logs/error-YYYY-MM-DD.log` - Error logs

## 🚀 Deployment

### Production Checklist
- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Configure production database
- [ ] Set up Redis in production
- [ ] Configure email service
- [ ] Set up M-Pesa production credentials
- [ ] Enable error monitoring (Sentry)
- [ ] Set up automated backups
- [ ] Configure firewall rules
- [ ] Set up CDN for static assets
- [ ] Enable rate limiting
- [ ] Review security headers
- [ ] Set up monitoring (PM2, NewRelic)
- [ ] Configure load balancer

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name groceryos-api
pm2 save
pm2 startup
```

## 📄 License

MIT License - Built for commercial use

## 👥 Support

For issues and questions:
- Documentation: `/docs`
- API Docs: `/api-docs`
- Email: support@groceryos.co.ke

---

**Built with ❤️ for Kenyan Grocery Retailers**
