import { z } from 'zod';

// ============ AUTH SCHEMAS ============

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export const registerBusinessSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============ PRODUCT SCHEMAS ============

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(3, 'SKU is required'),
  barcode: z.string().min(8, 'Valid barcode is required'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  unit: z.string().min(1, 'Unit is required'),
  cost: z.number().min(0, 'Cost must be positive'),
  price: z.number().min(0, 'Price must be positive'),
  qty: z.number().int().min(0, 'Quantity must be positive'),
  expiry: z.string().min(1, 'Expiry date is required'),
  reorder: z.number().int().min(1, 'Reorder level is required'),
  taxable: z.boolean(),
}).refine((data) => data.price >= data.cost, {
  message: 'Price must be greater than or equal to cost',
  path: ['price'],
});

// ============ CUSTOMER SCHEMAS ============

export const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  tier: z.enum(['Bronze', 'Silver', 'Gold', 'Platinum']),
});

// ============ SUPPLIER SCHEMAS ============

export const supplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  contact: z.string().min(2, 'Contact person is required'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  terms: z.string().min(1, 'Payment terms are required'),
});

// ============ BRANCH SCHEMAS ============

export const branchSchema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
  address: z.string().min(5, 'Address is required'),
  manager: z.string().min(2, 'Manager name is required'),
});

// ============ EXPENSE SCHEMAS ============

export const expenseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  branch: z.string().min(1, 'Branch is required'),
  desc: z.string().min(3, 'Description is required'),
  amount: z.number().min(1, 'Amount must be positive'),
  receipt: z.boolean(),
});

// ============ USER SCHEMAS ============

export const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
  role: z.enum(['Super Admin', 'Branch Manager', 'Cashier', 'Inventory Clerk', 'Accountant']),
  branch: z.string().min(1, 'Branch is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

// ============ SETTINGS SCHEMAS ============

export const businessSettingsSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
  address: z.string().min(5, 'Address is required'),
  taxId: z.string().min(5, 'Tax ID is required'),
  currency: z.string().default('KSh'),
});

export const taxSettingsSchema = z.object({
  enableVAT: z.boolean(),
  vatRate: z.number().min(0).max(100),
  enableWithholding: z.boolean(),
  withholdingRate: z.number().min(0).max(100),
});

// ============ HELPER FUNCTIONS ============

export const isKenyanPhone = (phone: string): boolean => {
  return /^\+254\d{9}$/.test(phone);
};

export const formatKenyanPhone = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('254') && digits.length === 12) {
    return `+${digits}`;
  } else if (digits.startsWith('0') && digits.length === 10) {
    return `+254${digits.slice(1)}`;
  } else if (digits.length === 9) {
    return `+254${digits}`;
  }
  
  return phone;
};
