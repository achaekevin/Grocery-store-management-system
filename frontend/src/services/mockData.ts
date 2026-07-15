// Mock data for development (matches the existing data structure)
import {
  Branch,
  Product,
  Customer,
  Supplier,
  PurchaseOrder,
  MpesaTransaction,
  Expense,
  AuditLog,
  Notification,
  Sale,
  StockMovement,
  DailySales,
  MonthlySales,
  TopProduct,
  CategoryPerformance,
  StockTransfer,
  DamagedGood,
  CashFlow,
  IncomeSource,
  User,
  Role,
} from '@types/index';

export const BRANCHES: Branch[] = [
  { id: 1, name: 'Main Branch – Westlands', short: 'Main Branch', city: 'Nairobi', phone: '+254700111000', address: 'Westlands Shopping Centre, Nairobi', revenue: 2450000, expenses: 890000, products: 1234, employees: 24, status: 'active', manager: 'Mary Wanjiku' },
  { id: 2, name: 'CBD Branch', short: 'CBD Branch', city: 'Nairobi', phone: '+254700222000', address: 'Tom Mboya Street, Nairobi CBD', revenue: 1870000, expenses: 650000, products: 987, employees: 18, status: 'active', manager: 'James Mwangi' },
  { id: 3, name: 'Mombasa Road Branch', short: 'Mombasa Rd', city: 'Nairobi', phone: '+254700333000', address: 'Enterprise Road, Industrial Area, Nairobi', revenue: 1340000, expenses: 510000, products: 876, employees: 15, status: 'active', manager: 'Sarah Njoroge' },
  { id: 4, name: 'Kisumu Branch', short: 'Kisumu', city: 'Kisumu', phone: '+254700444000', address: 'Oginga Odinga Street, Kisumu', revenue: 980000, expenses: 340000, products: 654, employees: 12, status: 'active', manager: 'Peter Kamau' },
];

export const CATEGORIES = ['Dairy', 'Bakery', 'Beverages', 'Fresh Produce', 'Snacks', 'Meat & Fish', 'Household', 'Personal Care', 'Frozen Foods', 'Pantry'];
export const BRANDS = ['Brookside', 'Bidco', 'Unga', 'Supa Loaf', 'Coca-Cola', 'Pepsi', 'Keringet', 'Kenchic', 'Farmers Choice', 'Ariel', 'Omo', 'Pringles', 'Delmonte', 'Vaseline', 'Daima', 'Mumias', 'Own Brand'];
export const UNITS = ['Piece', 'kg', 'g', 'Litre', 'ml', 'Pack', 'Box', 'Dozen', 'Tray', 'Bag', 'Bundle', 'Carton'];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Fresh Whole Milk 1L', sku: 'MLK-001', barcode: '6001234567890', category: 'Dairy', brand: 'Brookside', unit: 'Litre', cost: 65, price: 85, qty: 234, expiry: '2025-08-15', reorder: 50, image: '🥛', taxable: true },
  { id: 2, name: 'White Sliced Bread', sku: 'BRD-001', barcode: '6001234567891', category: 'Bakery', brand: 'Supa Loaf', unit: 'Loaf', cost: 48, price: 65, qty: 87, expiry: '2025-07-25', reorder: 30, image: '🍞', taxable: false },
  { id: 3, name: 'Coca-Cola 500ml', sku: 'BVG-001', barcode: '6001234567892', category: 'Beverages', brand: 'Coca-Cola', unit: 'Bottle', cost: 55, price: 80, qty: 312, expiry: '2026-03-10', reorder: 100, image: '🥤', taxable: true },
  { id: 4, name: 'Tomatoes 1kg', sku: 'FP-001', barcode: '6001234567893', category: 'Fresh Produce', brand: 'Farm Fresh', unit: 'kg', cost: 40, price: 65, qty: 12, expiry: '2025-07-22', reorder: 20, image: '🍅', taxable: false },
  { id: 5, name: 'Crisps 100g', sku: 'SNK-001', barcode: '6001234567894', category: 'Snacks', brand: 'Pringles', unit: 'Pack', cost: 90, price: 130, qty: 145, expiry: '2026-01-15', reorder: 40, image: '🍟', taxable: true },
  { id: 6, name: 'Chicken Breast 500g', sku: 'MT-001', barcode: '6001234567895', category: 'Meat & Fish', brand: 'Farmers Choice', unit: 'Pack', cost: 280, price: 380, qty: 34, expiry: '2025-07-23', reorder: 20, image: '🍗', taxable: false },
  { id: 7, name: 'Detergent Powder 1kg', sku: 'HH-001', barcode: '6001234567896', category: 'Household', brand: 'Ariel', unit: 'Pack', cost: 310, price: 420, qty: 67, expiry: '2027-05-01', reorder: 25, image: '🧴', taxable: true },
  { id: 8, name: 'Strawberry Yoghurt 400ml', sku: 'MLK-002', barcode: '6001234567897', category: 'Dairy', brand: 'Brookside', unit: 'Cup', cost: 75, price: 100, qty: 89, expiry: '2025-07-28', reorder: 30, image: '🫙', taxable: true },
  { id: 9, name: 'Eggs (Tray 30)', sku: 'EG-001', barcode: '6001234567898', category: 'Dairy', brand: 'Kenchic', unit: 'Tray', cost: 410, price: 540, qty: 28, expiry: '2025-08-01', reorder: 15, image: '🥚', taxable: false },
  { id: 10, name: 'Mineral Water 500ml', sku: 'BVG-002', barcode: '6001234567899', category: 'Beverages', brand: 'Keringet', unit: 'Bottle', cost: 28, price: 45, qty: 456, expiry: '2027-01-01', reorder: 100, image: '💧', taxable: false },
  { id: 11, name: 'Sugar 1kg', sku: 'PNT-001', barcode: '6001234567900', category: 'Pantry', brand: 'Mumias', unit: 'Pack', cost: 130, price: 165, qty: 189, expiry: '2027-06-01', reorder: 50, image: '🍚', taxable: false },
  { id: 12, name: 'Cooking Oil 1L', sku: 'PNT-002', barcode: '6001234567901', category: 'Pantry', brand: 'Bidco', unit: 'Bottle', cost: 210, price: 280, qty: 78, expiry: '2026-09-01', reorder: 30, image: '🫙', taxable: true },
];

export const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Alice Wanjiku', phone: '+254722123456', email: 'alice@email.com', points: 2450, tier: 'Gold', purchases: 156, total: 284500, since: '2022-03-15', balance: 0 },
  { id: 2, name: 'Brian Otieno', phone: '+254733234567', email: 'brian@email.com', points: 890, tier: 'Silver', purchases: 78, total: 98700, since: '2023-01-20', balance: 1500 },
  { id: 3, name: 'Catherine Muthoni', phone: '+254712345678', email: 'cathy@email.com', points: 4200, tier: 'Platinum', purchases: 234, total: 567800, since: '2021-08-10', balance: 0 },
  { id: 4, name: 'Daniel Kipchoge', phone: '+254700456789', email: 'dan@email.com', points: 120, tier: 'Bronze', purchases: 23, total: 18900, since: '2024-02-05', balance: 500 },
];

export const SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Brookside Dairy Ltd', contact: 'James Mwangi', phone: '+254700111222', email: 'orders@brookside.co.ke', products: 45, outstanding: 234500, lastOrder: '2025-07-18', status: 'active', terms: 'Net 30', address: 'Ruiru, Kiambu County' },
  { id: 2, name: 'East African Breweries', contact: 'Sarah Njoroge', phone: '+254711333444', email: 'trade@eabl.com', products: 23, outstanding: 0, lastOrder: '2025-07-15', status: 'active', terms: 'COD', address: 'Ruaraka, Nairobi' },
  { id: 3, name: 'Bidco Africa Ltd', contact: 'Peter Kamau', phone: '+254722555666', email: 'orders@bidco.co.ke', products: 67, outstanding: 89000, lastOrder: '2025-07-20', status: 'active', terms: 'Net 14', address: 'Thika Road, Nairobi' },
];

export const USERS: User[] = [
  { id: 1, name: 'John Kariuki', email: 'john@groceryos.co.ke', role: 'Super Admin', branch: 'All Branches', status: 'active', lastLogin: '2025-07-21 09:34', phone: '+254700000001' },
  { id: 2, name: 'Mary Wanjiku', email: 'mary@groceryos.co.ke', role: 'Branch Manager', branch: 'Main Branch', status: 'active', lastLogin: '2025-07-21 08:12', phone: '+254700000002' },
  { id: 3, name: 'Peter Otieno', email: 'peter@groceryos.co.ke', role: 'Cashier', branch: 'CBD Branch', status: 'active', lastLogin: '2025-07-21 10:00', phone: '+254700000003' },
  { id: 4, name: 'Grace Muthoni', email: 'grace@groceryos.co.ke', role: 'Inventory Clerk', branch: 'Main Branch', status: 'active', lastLogin: '2025-07-20 15:45', phone: '+254700000004' },
];

export const ROLES: Role[] = [
  { name: 'Super Admin', desc: 'Full access to all modules and branches', color: 'var(--accent)' },
  { name: 'Branch Manager', desc: 'Manage assigned branch operations', color: 'var(--success)' },
  { name: 'Cashier', desc: 'POS transactions and daily sales', color: 'var(--info)' },
  { name: 'Inventory Clerk', desc: 'Product and stock management', color: 'var(--warning)' },
  { name: 'Accountant', desc: 'Financial reports and expense tracking', color: 'var(--purple)' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'danger', title: 'Low Stock Alert', body: 'Tomatoes 1kg — only 12 units left (reorder level: 20)', time: '5 min ago', read: false },
  { id: 2, type: 'warning', title: 'Expiry Alert', body: 'Chicken Breast 500g expires in 2 days (23 Jul 2025)', time: '1 hr ago', read: false },
  { id: 3, type: 'success', title: 'M-Pesa Payment Received', body: 'STK Push KSh 4,500 confirmed — Ref: QH7R2J1K9Y', time: '2 hrs ago', read: true },
];

// ... Add more mock data arrays as needed
