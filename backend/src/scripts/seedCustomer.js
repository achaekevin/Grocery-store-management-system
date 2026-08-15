import db from '../models/index.js';
import logger from '../config/logger.js';

const seedCustomerUser = async () => {
  try {
    logger.info('Initializing models and checking connection...');
    await db.testConnection();
    await db.initModels();

    // 1. Find a business to associate with
    let business = await db.Business.findOne();
    if (!business) {
      business = await db.Business.create({
        name: 'Demo Grocery Store',
        slug: 'demo-grocery-store',
        email: 'demo@groceryos.com',
        phone: '+254712345678',
        address: 'Nairobi Central, Kenya',
        city: 'Nairobi',
        country: 'Kenya',
        isActive: true,
      });
      logger.info('Created default business');
    }

    // 2. Ensure Customer Role exists
    let customerRole = await db.Role.findOne({ where: { slug: 'customer' } });
    if (!customerRole) {
      customerRole = await db.Role.create({
        name: 'Customer',
        slug: 'customer',
        description: 'Store Customer - E-commerce and loyalty portal access',
        isSystem: true,
        tenantId: business.id,
      });
      logger.info('Created Customer role');
    }

    // 3. Find or create default branches
    let mainBranch = await db.Branch.findOne({ where: { name: 'Kisii Main Branch' } });
    if (!mainBranch) {
      mainBranch = await db.Branch.create({
        tenantId: business.id,
        name: 'Kisii Main Branch',
        code: 'BR-KISII-01',
        phone: '+254701234567',
        email: 'kisii-main@groceryos.com',
        address: 'Hospital Road, Kisii CBD',
        city: 'Kisii',
        isActive: true,
      });
    }

    // 4. Create or update User in User model for authentication (pass plaintext password to let hook hash)
    let user = await db.User.findOne({ where: { email: 'customer@test.com' } });
    if (!user) {
      user = await db.User.create({
        tenantId: business.id,
        roleId: customerRole.id,
        firstName: 'Kevin',
        lastName: 'Omondi',
        email: 'customer@test.com',
        phone: '+254712345678',
        password: 'Customer@123',
        isActive: true,
        preferences: {
          preferredBranch: mainBranch.id,
          notifications: true,
          membershipTier: 'Gold',
          loyaltyPoints: 2450,
          savedAddresses: [
            { id: 'addr_1', type: 'Home', address: 'Milimani Estate, House #14, Kisii', isDefault: true },
            { id: 'addr_2', type: 'Work', address: 'Kisii Business Complex, Floor 2', isDefault: false },
          ],
        },
      });
      logger.info('Created Customer user (customer@test.com)');
    } else {
      user.password = 'Customer@123';
      user.roleId = customerRole.id;
      user.firstName = 'Kevin';
      user.lastName = 'Omondi';
      user.isActive = true;
      await user.save();
      logger.info('Updated Customer user with fresh password');
    }

    logger.info('✅ Customer user successfully seeded with credentials customer@test.com / Customer@123');
    process.exit(0);
  } catch (error) {
    logger.error('Customer seeding error:', error);
    process.exit(1);
  }
};

seedCustomerUser();
