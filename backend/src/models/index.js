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
  // Import all model initializer functions
  const BusinessInit = (await import('./Business.js')).default;
  const BranchInit = (await import('./Branch.js')).default;
  const RoleInit = (await import('./Role.js')).default;
  const PermissionInit = (await import('./Permission.js')).default;
  const RolePermissionInit = (await import('./RolePermission.js')).default;
  const UserInit = (await import('./User.js')).default;
  const CategoryInit = (await import('./Category.js')).default;
  const BrandInit = (await import('./Brand.js')).default;
  const UnitInit = (await import('./Unit.js')).default;
  const ProductInit = (await import('./Product.js')).default;
  const InventoryInit = (await import('./Inventory.js')).default;
  const InventoryMovementInit = (await import('./InventoryMovement.js')).default;
  const CustomerInit = (await import('./Customer.js')).default;
  const SupplierInit = (await import('./Supplier.js')).default;
  const SaleInit = (await import('./Sale.js')).default;
  const SaleItemInit = (await import('./SaleItem.js')).default;
  const PaymentInit = (await import('./Payment.js')).default;
  const PurchaseOrderInit = (await import('./PurchaseOrder.js')).default;
  const PurchaseItemInit = (await import('./PurchaseItem.js')).default;
  const ExpenseInit = (await import('./Expense.js')).default;
  const ExpenseCategoryInit = (await import('./ExpenseCategory.js')).default;
  const MpesaTransactionInit = (await import('./MpesaTransaction.js')).default;
  const LoyaltyTransactionInit = (await import('./LoyaltyTransaction.js')).default;
  const AuditLogInit = (await import('./AuditLog.js')).default;
  const NotificationInit = (await import('./Notification.js')).default;
  const SettingInit = (await import('./Setting.js')).default;

  // Initialize all models by calling their init functions
  db.Business = BusinessInit(sequelize);
  db.Branch = BranchInit(sequelize);
  db.Role = RoleInit(sequelize);
  db.Permission = PermissionInit(sequelize);
  db.RolePermission = RolePermissionInit(sequelize);
  db.User = UserInit(sequelize);
  db.Category = CategoryInit(sequelize);
  db.Brand = BrandInit(sequelize);
  db.Unit = UnitInit(sequelize);
  db.Product = ProductInit(sequelize);
  db.Inventory = InventoryInit(sequelize);
  db.InventoryMovement = InventoryMovementInit(sequelize);
  db.Customer = CustomerInit(sequelize);
  db.Supplier = SupplierInit(sequelize);
  db.Sale = SaleInit(sequelize);
  db.SaleItem = SaleItemInit(sequelize);
  db.Payment = PaymentInit(sequelize);
  db.PurchaseOrder = PurchaseOrderInit(sequelize);
  db.PurchaseItem = PurchaseItemInit(sequelize);
  db.Expense = ExpenseInit(sequelize);
  db.ExpenseCategory = ExpenseCategoryInit(sequelize);
  db.MpesaTransaction = MpesaTransactionInit(sequelize);
  db.LoyaltyTransaction = LoyaltyTransactionInit(sequelize);
  db.AuditLog = AuditLogInit(sequelize);
  db.Notification = NotificationInit(sequelize);
  db.Setting = SettingInit(sequelize);

  // Define associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
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
