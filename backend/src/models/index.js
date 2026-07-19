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
  const ActivityInit = (await import('./Activity.js')).default;
  const AnalyticsDataInit = (await import('./AnalyticsData.js')).default;
  const AuditLogInit = (await import('./AuditLog.js')).default;
  const BranchInit = (await import('./Branch.js')).default;
  const BrandInit = (await import('./Brand.js')).default;
  const BusinessInit = (await import('./Business.js')).default;
  const CategoryInit = (await import('./Category.js')).default;
  const CustomerInit = (await import('./Customer.js')).default;
  const CustomerLoyaltyInit = (await import('./CustomerLoyalty.js')).default;
  const ExpenseInit = (await import('./Expense.js')).default;
  const ExpenseCategoryInit = (await import('./ExpenseCategory.js')).default;
  const HeldTransactionInit = (await import('./HeldTransaction.js')).default;
  const InsightInit = (await import('./Insight.js')).default;
  const InventoryInit = (await import('./Inventory.js')).default;
  const InventoryMovementInit = (await import('./InventoryMovement.js')).default;
  const InventoryTransactionInit = (await import('./InventoryTransaction.js')).default;
  const LoyaltyProgramInit = (await import('./LoyaltyProgram.js')).default;
  const LoyaltyTransactionInit = (await import('./LoyaltyTransaction.js')).default;
  const MpesaTransactionInit = (await import('./MpesaTransaction.js')).default;
  const NotificationInit = (await import('./Notification.js')).default;
  const OrderInit = (await import('./Order.js')).default;
  const PaymentInit = (await import('./Payment.js')).default;
  const PermissionInit = (await import('./Permission.js')).default;
  const ProductInit = (await import('./Product.js')).default;
  const ProductEnhancedInit = (await import('./ProductEnhanced.js')).default;
  const ProductVariantInit = (await import('./ProductVariant.js')).default;
  const PromotionInit = (await import('./Promotion.js')).default;
  const PurchaseItemInit = (await import('./PurchaseItem.js')).default;
  const PurchaseOrderInit = (await import('./PurchaseOrder.js')).default;
  const PurchaseRequestInit = (await import('./PurchaseRequest.js')).default;
  const ReviewInit = (await import('./Review.js')).default;
  const RoleInit = (await import('./Role.js')).default;
  const RolePermissionInit = (await import('./RolePermission.js')).default;
  const SaleInit = (await import('./Sale.js')).default;
  const SaleItemInit = (await import('./SaleItem.js')).default;
  const SearchHistoryInit = (await import('./SearchHistory.js')).default;
  const SettingInit = (await import('./Setting.js')).default;
  const StockTransferInit = (await import('./StockTransfer.js')).default;
  const SupplierInit = (await import('./Supplier.js')).default;
  const SystemSettingInit = (await import('./SystemSetting.js')).default;
  const UnitInit = (await import('./Unit.js')).default;
  const UserInit = (await import('./User.js')).default;
  const UserPreferenceInit = (await import('./UserPreference.js')).default;
  const WidgetLayoutInit = (await import('./WidgetLayout.js')).default;

  // Initialize all models
  try {
    db.Activity = ActivityInit;
    db.AnalyticsData = AnalyticsDataInit;
    db.AuditLog = AuditLogInit;
    db.Branch = BranchInit;
    db.Brand = BrandInit;
    db.Business = BusinessInit;
    db.Category = CategoryInit;
    db.Customer = CustomerInit;
    db.CustomerLoyalty = CustomerLoyaltyInit;
    db.Expense = ExpenseInit;
    db.ExpenseCategory = ExpenseCategoryInit;
    db.HeldTransaction = HeldTransactionInit;
    db.Insight = InsightInit;
    db.Inventory = InventoryInit;
    db.InventoryMovement = InventoryMovementInit;
    db.InventoryTransaction = InventoryTransactionInit;
    db.LoyaltyProgram = LoyaltyProgramInit;
    db.LoyaltyTransaction = LoyaltyTransactionInit;
    db.MpesaTransaction = MpesaTransactionInit;
    db.Notification = NotificationInit;
    db.Order = OrderInit;
    db.Payment = PaymentInit;
    db.Permission = PermissionInit;
    db.Product = ProductInit;
    db.ProductEnhanced = ProductEnhancedInit;
    db.ProductVariant = ProductVariantInit;
    db.Promotion = PromotionInit;
    db.PurchaseItem = PurchaseItemInit;
    db.PurchaseOrder = PurchaseOrderInit;
    db.PurchaseRequest = PurchaseRequestInit;
    db.Review = ReviewInit;
    db.Role = RoleInit;
    db.RolePermission = RolePermissionInit;
    db.Sale = SaleInit;
    db.SaleItem = SaleItemInit;
    db.SearchHistory = SearchHistoryInit;
    db.Setting = SettingInit;
    db.StockTransfer = StockTransferInit;
    db.Supplier = SupplierInit;
    db.SystemSetting = SystemSettingInit;
    db.Unit = UnitInit;
    db.User = UserInit;
    db.UserPreference = UserPreferenceInit;
    db.WidgetLayout = WidgetLayoutInit;
  } catch (error) {
    logger.error(`Model initialization error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    throw error;
  }

  // Define associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
      logger.info(`Associating ${modelName}, Branch is: ${typeof db.Branch}, has init: ${typeof db.Branch?.init}`);
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
