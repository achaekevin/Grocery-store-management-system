import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from '../config/sequelize.js';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
};

// Import models dynamically
const initModels = async () => {
  const Business = (await import('./Business.js')).default;
  const Branch = (await import('./Branch.js')).default;
  const Role = (await import('./Role.js')).default;
  const Permission = (await import('./Permission.js')).default;
  const RolePermission = (await import('./RolePermission.js')).default;
  const User = (await import('./User.js')).default;
  const Category = (await import('./Category.js')).default;
  const Brand = (await import('./Brand.js')).default;
  const Unit = (await import('./Unit.js')).default;
  const Product = (await import('./Product.js')).default;
  const Inventory = (await import('./Inventory.js')).default;
  const InventoryMovement = (await import('./InventoryMovement.js')).default;
  const Customer = (await import('./Customer.js')).default;
  const Supplier = (await import('./Supplier.js')).default;
  const Sale = (await import('./Sale.js')).default;
  const SaleItem = (await import('./SaleItem.js')).default;
  const Payment = (await import('./Payment.js')).default;
  const PurchaseOrder = (await import('./PurchaseOrder.js')).default;
  const PurchaseItem = (await import('./PurchaseItem.js')).default;
  const Expense = (await import('./Expense.js')).default;
  const ExpenseCategory = (await import('./ExpenseCategory.js')).default;
  const MpesaTransaction = (await import('./MpesaTransaction.js')).default;
  const LoyaltyTransaction = (await import('./LoyaltyTransaction.js')).default;
  const AuditLog = (await import('./AuditLog.js')).default;
  const Notification = (await import('./Notification.js')).default;
  const Setting = (await import('./Setting.js')).default;

  // Add models to db object
  db.Business = Business;
  db.Branch = Branch;
  db.Role = Role;
  db.Permission = Permission;
  db.RolePermission = RolePermission;
  db.User = User;
  db.Category = Category;
  db.Brand = Brand;
  db.Unit = Unit;
  db.Product = Product;
  db.Inventory = Inventory;
  db.InventoryMovement = InventoryMovement;
  db.Customer = Customer;
  db.Supplier = Supplier;
  db.Sale = Sale;
  db.SaleItem = SaleItem;
  db.Payment = Payment;
  db.PurchaseOrder = PurchaseOrder;
  db.PurchaseItem = PurchaseItem;
  db.Expense = Expense;
  db.ExpenseCategory = ExpenseCategory;
  db.MpesaTransaction = MpesaTransaction;
  db.LoyaltyTransaction = LoyaltyTransaction;
  db.AuditLog = AuditLog;
  db.Notification = Notification;
  db.Setting = Setting;

  // Define associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  logger.info('All models initialized with associations');
};

const db = {
  sequelize,
  Sequelize,
  testConnection,
  initModels,
};

export default db;
