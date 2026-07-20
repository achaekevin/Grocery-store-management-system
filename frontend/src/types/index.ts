// ============ CORE TYPES ============

export type UserRole = 'Super Admin' | 'Branch Manager' | 'Cashier' | 'Inventory Clerk' | 'Accountant';

export type OrderStatus = 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
export type SaleStatus = 'Completed' | 'Voided' | 'Refunded';
export type TransactionStatus = 'Success' | 'Pending' | 'Failed';
export type PaymentMethod = 'Cash' | 'M-Pesa' | 'Card' | 'Bank Transfer';
export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
export type StockMovementType = 'Stock In' | 'Stock Out' | 'Sale' | 'Adjustment' | 'Transfer In' | 'Transfer Out' | 'Damaged' | 'Expired';
export type TransferStatus = 'Completed' | 'In Transit' | 'Pending';
export type DamagedStatus = 'Written Off' | 'Pending' | 'Claimed';
export type NotificationType = 'success' | 'danger' | 'warning' | 'info';
export type ExpenseCategory = 'Rent' | 'Utilities' | 'Staff' | 'Transport' | 'Maintenance' | 'Marketing';

// ============ USER & AUTH ============

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: {
    id: string;
    name: string;
    slug: string;
  };
  business: {
    id: string;
    name: string;
  };
  is_active: boolean;
  phone?: string;
  avatar?: string;
  tenant_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterBusinessData {
  businessName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// ============ BRANCH ============

export interface Branch {
  id: number;
  name: string;
  short: string;
  city: string;
  phone: string;
  address: string;
  revenue: number;
  expenses: number;
  products: number;
  employees: number;
  status: 'active' | 'inactive';
  manager: string;
}

// ============ PRODUCT ============

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  unit: string;
  cost: number;
  price: number;
  qty: number;
  expiry: string;
  reorder: number;
  image: string;
  taxable: boolean;
}

export interface ProductFormData {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  unit: string;
  cost: number;
  price: number;
  qty: number;
  expiry: string;
  reorder: number;
  taxable: boolean;
  image?: File | string;
}

// ============ CUSTOMER ============

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: CustomerTier;
  purchases: number;
  total: number;
  since: string;
  balance: number;
}

// ============ SUPPLIER ============

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  products: number;
  outstanding: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  terms: string;
  address: string;
}

// ============ PURCHASE ORDERS ============

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  amount: number;
  status: OrderStatus;
  date: string;
  branch: string;
  received: boolean;
}

export interface PurchaseOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface CreatePurchaseOrder {
  supplierId: number;
  branchId: number;
  items: PurchaseOrderItem[];
  notes?: string;
}

// ============ SALES ============

export interface Sale {
  id: string;
  date: string;
  time: string;
  cashier: string;
  branch: string;
  items: number;
  amount: number;
  payment: PaymentMethod;
  status: SaleStatus;
  customer: string;
}

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface CartItem extends Product {
  cartQty: number;
  discount: number;
  subtotal: number;
}

// ============ INVENTORY ============

export interface StockMovement {
  id: number;
  type: StockMovementType;
  product: string;
  qty: number;
  date: string;
  ref: string;
  branch: string;
  by: string;
}

export interface StockAdjustment {
  productId: number;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface StockTransfer {
  id: string;
  from: string;
  to: string;
  product: string;
  qty: number;
  date: string;
  status: TransferStatus;
  by: string;
}

export interface DamagedGood {
  id: number;
  product: string;
  qty: number;
  value: number;
  date: string;
  branch: string;
  reason: string;
  status: DamagedStatus;
}

// ============ MPESA ============

export interface MpesaTransaction {
  id: string;
  ref: string;
  phone: string;
  amount: number;
  status: TransactionStatus;
  time: string;
  type: string;
  sale: string;
}

// ============ EXPENSES ============

export interface Expense {
  id: number;
  date: string;
  category: ExpenseCategory;
  branch: string;
  desc: string;
  amount: number;
  approved: boolean;
  approvedBy: string | null;
  receipt: boolean;
}

// ============ REPORTS ============

export interface DailySales {
  day: string;
  sales: number;
  orders: number;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  expenses: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface CategoryPerformance {
  name: string;
  value: number;
}

export interface CashFlow {
  month: string;
  inflow: number;
  outflow: number;
}

export interface IncomeSource {
  source: string;
  amount: number;
  pct: number;
}

// ============ NOTIFICATIONS ============

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// ============ AUDIT LOGS ============

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
}

// ============ ROLES & PERMISSIONS ============

export interface Role {
  name: string;
  desc: string;
  color: string;
}

export interface Permission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

// ============ SETTINGS ============

export interface BusinessSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  taxId: string;
  currency: string;
}

export interface TaxSettings {
  enableVAT: boolean;
  vatRate: number;
  enableWithholding: boolean;
  withholdingRate: number;
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  accentColor: string;
}

// ============ DASHBOARD ============

export interface DashboardStats {
  todaySales: number;
  monthlyRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  expiredProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalBranches: number;
}

// ============ FILTERS ============

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  outOfStock?: boolean;
}

export interface SalesFilter extends DateRangeFilter {
  branch?: string;
  cashier?: string;
  paymentMethod?: PaymentMethod;
  status?: SaleStatus;
}

export interface ReportFilter extends DateRangeFilter {
  branch?: string;
  category?: string;
  product?: string;
}

// ============ API RESPONSE ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ FORM VALIDATION ============

export interface ValidationError {
  field: string;
  message: string;
}
