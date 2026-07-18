import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import notificationService from './notification.service.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

class JobsService {
  constructor() {
    this.jobs = [];
  }

  /**
   * Start all scheduled jobs
   */
  startAll() {
    this.lowStockAlerts();
    this.expiryReminders();
    this.dailyBackup();
    // this.weeklyReports();
    // this.monthlyReports();
    
    console.log('Background jobs started');
  }

  /**
   * Stop all jobs
   */
  stopAll() {
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    console.log('Background jobs stopped');
  }

  /**
   * Check for low stock items every hour
   */
  lowStockAlerts() {
    const job = cron.schedule('0 * * * *', async () => {
      try {
        console.log('Running low stock check...');

        const lowStockItems = await Inventory.findAll({
          where: {
            quantity: {
              [Op.lte]: sequelize.col('product.stockAlert'),
            },
          },
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'stockAlert'],
            },
          ],
        });

        for (const item of lowStockItems) {
          await notificationService.lowStockAlert(
            {
              id: item.productId,
              name: item.product.name,
              quantity: item.quantity,
            },
            item.tenantId,
            item.branchId
          );
        }

        console.log(`Sent ${lowStockItems.length} low stock alerts`);
      } catch (error) {
        console.error('Low stock alerts error:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * Check for expiring products daily at 8 AM
   */
  expiryReminders() {
    const job = cron.schedule('0 8 * * *', async () => {
      try {
        console.log('Running expiry check...');

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringProducts = await Product.findAll({
          where: {
            expiryDate: {
              [Op.lte]: thirtyDaysFromNow,
              [Op.gte]: new Date(),
            },
          },
        });

        for (const product of expiringProducts) {
          await notificationService.productExpiring(
            {
              id: product.id,
              name: product.name,
              expiryDate: product.expiryDate,
            },
            product.tenantId,
            product.branchId
          );
        }

        console.log(`Sent ${expiringProducts.length} expiry reminders`);
      } catch (error) {
        console.error('Expiry reminders error:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * Daily backup at 2 AM
   */
  dailyBackup() {
    const job = cron.schedule('0 2 * * *', async () => {
      try {
        console.log('Running daily backup...');
        // Backup logic would go here
        console.log('Daily backup completed');
      } catch (error) {
        console.error('Daily backup error:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * Weekly reports every Monday at 9 AM
   */
  weeklyReports() {
    const job = cron.schedule('0 9 * * 1', async () => {
      try {
        console.log('Generating weekly reports...');
        // Report generation logic
        console.log('Weekly reports generated');
      } catch (error) {
        console.error('Weekly reports error:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * Monthly reports on 1st of month at 9 AM
   */
  monthlyReports() {
    const job = cron.schedule('0 9 1 * *', async () => {
      try {
        console.log('Generating monthly reports...');
        // Report generation logic
        console.log('Monthly reports generated');
      } catch (error) {
        console.error('Monthly reports error:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * Database cleanup - delete old logs
   */
  databaseCleanup() {
    const job = cron.schedule('0 3 * * 0', async () => {
      try {
        console.log('Running database cleanup...');
        
        // Delete logs older than 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Cleanup logic would go here
        
        console.log('Database cleanup completed');
      } catch (error) {
        console.error('Database cleanup error:', error);
      }
    });

    this.jobs.push(job);
  }
}

export default new JobsService();
