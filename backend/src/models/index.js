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
  const Business = (await import('./Business.js')).default(sequelize);
  const Branch = (await import('./Branch.js')).default(sequelize);
  const Role = (await import('./Role.js')).default(sequelize);
  const Permission = (await import('./Permission.js')).default(sequelize);
  const RolePermission = (await import('./RolePermission.js')).default(sequelize);
  const User = (await import('./User.js')).default(sequelize);
  const Category = (await import('./Category.js')).default(sequelize);
  const Brand = (await import('./Brand.js')).default(sequelize);
  const Unit = (await import('./Unit.js')).default(sequelize);
  const Product = (await import('./Product.js')).default(sequelize);
  const Inventory = (await import('./Inventory.js')).default(sequelize);
  const InventoryMovement = (await import('./InventoryMovement.js')).default(sequelize);
  const Customer = (await import('./Customer.js')).default(sequelize);
  const Supplier = (await import('./Supplier.js')).default(sequelize);
  const Sale = (await import('./Sale.js')).default(sequelize);
  const SaleItem = (await import('./SaleItem.js')).default(sequelize);
  const Payment = (await import('./Payment.js')).default(sequelize);
  const PurchaseOrder = (await import('./PurchaseOrder.js')).default(sequelize);
  const PurchaseItem = (await import('./PurchaseItem.js')).default(sequelize);
  const Expense = (await import('./Expense.js')).default(sequelize);
  const ExpenseCategory = (await import('./ExpenseCategory.js')).default(sequelize);
  const MpesaTransaction = (await import('./MpesaTransaction.js')).default(sequelize);
  const LoyaltyTransaction = (await import('./LoyaltyTransaction.js')).default(sequelize);
  const AuditLog = (await import('./AuditLog.js')).default(sequelize);
  const Notification = (await import('./Notification.js')).default(sequelize);
  const Setting = (await import('./Setting.js')).default(sequelize);

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
