# GroceryOS - Multi-Branch SaaS Grocery Store Management System

A modern, production-ready React TypeScript frontend for managing multi-branch grocery store operations.

## 🚀 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Utility-first CSS
- **Redux Toolkit** - State Management
- **React Query** - Server State Management
- **React Router DOM** - Routing
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Recharts** - Data Visualization
- **Framer Motion** - Animations
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   └── common/         # Common components (Sidebar, Navbar, StatCard)
├── layouts/            # Layout components
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   └── POSLayout.tsx
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard
│   ├── products/      # Product management
│   ├── pos/           # Point of Sale
│   └── ...            # Other feature pages
├── features/           # Feature-specific components
├── hooks/              # Custom React hooks
├── store/              # Redux store and slices
├── services/           # API services
├── routes/             # Routing configuration
├── contexts/           # React contexts
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🎯 Features Implemented

### ✅ Authentication
- [x] Login page with validation
- [x] Register business page
- [x] Forgot password flow
- [x] JWT token management
- [x] Protected routes

### ✅ Dashboard
- [x] KPI stat cards (Sales, Revenue, Products, etc.)
- [x] Daily sales chart (Area chart)
- [x] Monthly revenue vs expenses (Bar chart)
- [x] Top selling products (Horizontal bar chart)
- [x] Category performance (Pie chart)
- [x] Recent activities feed

### ✅ Products Management
- [x] Product listing with search and filters
- [x] Category and brand filters
- [x] Stock status badges
- [x] Product details modal
- [x] Bulk selection
- [x] Low stock indicators
- [x] Responsive table

### ✅ Point of Sale (POS)
- [x] Product grid with categories
- [x] Shopping cart management
- [x] Quantity controls
- [x] Real-time calculations
- [x] Multiple payment methods
- [x] Low stock warnings
- [x] Cart persistence

### ✅ UI/UX Features
- [x] Dark mode support
- [x] Responsive design (mobile, tablet, desktop)
- [x] Toast notifications
- [x] Loading states
- [x] Empty states
- [x] Smooth animations
- [x] Accessible components

### 📋 Pages Structure

#### Implemented Pages:
1. **Authentication**
   - Login
   - Register Business
   - Forgot Password

2. **Dashboard**
   - Main dashboard with charts and stats

3. **Products**
   - Full CRUD interface
   - Advanced filtering
   - Stock management

4. **Point of Sale**
   - Product selection
   - Cart management
   - Checkout flow

5. **Placeholders** (Ready for implementation)
   - Customers
   - Suppliers
   - Branches
   - Settings

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation Steps

1. **Clone and navigate to frontend directory**
   ```bash
   cd "Grocery store management system/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Create environment file**
   ```bash
   copy .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔑 Demo Login Credentials

```
Email: john@groceryos.co.ke
Password: (any password - mock auth)
```

**Available Roles:**
- Super Admin (john@groceryos.co.ke)
- Branch Manager (mary@groceryos.co.ke)
- Cashier (peter@groceryos.co.ke)
- Inventory Clerk (grace@groceryos.co.ke)

## 📦 Build for Production

```bash
npm run build
# or
yarn build
```

Output will be in the `dist/` folder.

## 🎨 Theming

The app supports both light and dark modes with a customizable accent color system.

### Color Variables
Colors are defined using CSS custom properties in `src/index.css`:
- Background colors
- Text colors
- Border colors
- Semantic colors (success, warning, danger, info)

### Theme Toggle
Users can toggle between light and dark mode using the button in the navbar.

## 🔐 Role-Based Access Control

The application implements role-based UI restrictions:

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full access to all modules and branches |
| **Branch Manager** | Manage assigned branch operations |
| **Cashier** | POS transactions and sales history |
| **Inventory Clerk** | Product and stock management |
| **Accountant** | Finance and reports |

## 📱 Responsive Design

The UI is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Mock Data

Currently using mock data from `src/services/mockData.ts` for development. Replace with real API calls in `src/services/api.ts`.

## 🔌 API Integration

The application is ready for backend integration:

1. Update `VITE_API_BASE_URL` in `.env`
2. Implement API endpoints in `src/services/`
3. Replace mock data with React Query hooks

Example API service structure is in place at `src/services/api.ts`.

## 📊 Charts & Visualizations

Using Recharts for all data visualizations:
- Area charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Line charts for time series

## ⚡ Performance Optimizations

- Code splitting with React.lazy()
- Image optimization
- Debounced search inputs
- Memoized calculations
- Virtualized lists (for large datasets)

## 🔒 Security Features

- JWT token authentication
- Protected routes
- XSS prevention
- CSRF protection ready
- Secure HTTP-only cookies support

## 📝 Code Quality

- TypeScript for type safety
- ESLint configuration
- Consistent code formatting
- Modular component architecture
- Custom hooks for reusability

## 🚧 Remaining Features to Implement

### High Priority
- [ ] Complete Inventory Management
- [ ] Sales History & Reports
- [ ] Customer Management
- [ ] Supplier Management
- [ ] Branch Management
- [ ] User & Role Management
- [ ] Audit Logs

### Medium Priority
- [ ] M-Pesa Integration
- [ ] Barcode Scanner
- [ ] Receipt Printing
- [ ] Email Notifications
- [ ] Export functionality (PDF, Excel, CSV)
- [ ] Advanced Reports & Analytics

### Low Priority
- [ ] Two-Factor Authentication
- [ ] Password Reset via Email
- [ ] Email Verification
- [ ] Loyalty Program
- [ ] Purchase Orders
- [ ] Expense Management
- [ ] Financial Reports

## 📚 Documentation

- [Component Documentation](./docs/components.md) - Coming soon
- [State Management Guide](./docs/state-management.md) - Coming soon
- [API Integration Guide](./docs/api-integration.md) - Coming soon

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

MIT License - Built for Kenyan multi-branch grocery retail.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Email: support@groceryos.co.ke

## 🎯 Roadmap

### Phase 1 (Current) ✅
- Core authentication
- Dashboard with charts
- Product management
- POS interface
- Theme system

### Phase 2 (Next)
- Complete all CRUD operations
- Inventory management
- Sales reports
- Customer management

### Phase 3 (Future)
- M-Pesa integration
- Advanced analytics
- Mobile app
- API documentation

---

**Built with ❤️ for Kenyan Grocery Retailers**
