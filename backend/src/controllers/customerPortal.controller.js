import db from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';
import { Op } from 'sequelize';

/**
 * @desc    Get customer dashboard summary
 * @route   GET /api/v1/customer/dashboard
 * @access  Private (Customer)
 */
export const getCustomerDashboard = async (req, res) => {
  try {
    const user = req.user;
    const tenantId = user?.tenantId;

    // Fetch branches
    const branches = await db.Branch.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'code', 'phone', 'address', 'city'],
    });

    // Mock/Real loyalty data
    const loyalty = {
      points: user?.preferences?.loyaltyPoints || 2450,
      tier: user?.preferences?.membershipTier || 'Gold',
      pointsToNextTier: 550,
      nextTier: 'Platinum',
      availableRewards: [
        { id: 'rw_1', pointsRequired: 500, discountAmount: 50, title: 'KSh 50 Off Grocery Voucher' },
        { id: 'rw_2', pointsRequired: 1000, discountAmount: 120, title: 'KSh 120 Off Super Saver' },
        { id: 'rw_3', pointsRequired: 2000, discountAmount: 250, title: 'KSh 250 Off Premium Treat' },
      ],
    };

    // Active/Recent sample orders
    const recentOrders = [
      {
        id: 'ORD-10482',
        date: '2026-08-14T14:30:00Z',
        itemsCount: 4,
        total: 1250,
        status: 'Ready for Pickup',
        timeline: [
          { status: 'Order Placed', time: '14:30', completed: true },
          { status: 'Payment Confirmed', time: '14:32', completed: true },
          { status: 'Being Prepared', time: '14:45', completed: true },
          { status: 'Ready for Pickup', time: '15:10', current: true },
          { status: 'Completed', time: 'Pending', completed: false },
        ],
        branch: 'Kisii Main Branch',
        paymentMethod: 'M-Pesa',
      },
      {
        id: 'ORD-10451',
        date: '2026-08-10T11:15:00Z',
        itemsCount: 3,
        total: 820,
        status: 'Delivered',
        branch: 'Kisii Town Branch',
        paymentMethod: 'Card',
      },
    ];

    // Featured grocery categories
    const categories = [
      { id: 'all', name: 'All Groceries', icon: 'Sparkles', count: 48 },
      { id: 'produce', name: 'Fresh Produce', icon: 'Apple', count: 18 },
      { id: 'dairy', name: 'Dairy & Eggs', icon: 'Milk', count: 12 },
      { id: 'bakery', name: 'Bakery', icon: 'Croissant', count: 9 },
      { id: 'beverages', name: 'Beverages', icon: 'Coffee', count: 14 },
      { id: 'meat', name: 'Meat & Poultry', icon: 'Beef', count: 8 },
      { id: 'household', name: 'Household & Cleaning', icon: 'SprayCan', count: 15 },
    ];

    return ApiResponse.success(res, 'Customer dashboard data retrieved', {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
      loyalty,
      recentOrders,
      branches,
      categories,
    });
  } catch (error) {
    logger.error('Error fetching customer dashboard:', error);
    return ApiResponse.internal(res, 'Failed to fetch customer dashboard');
  }
};

/**
 * @desc    Get catalog products for online grocery store
 * @route   GET /api/v1/customer/products
 * @access  Public / Customer
 */
export const getCustomerProducts = async (req, res) => {
  try {
    const { category, search, branchId, sort } = req.query;

    const catalog = [
      {
        id: 1,
        name: 'Fresh Whole Milk 1L',
        brand: 'Brookside',
        category: 'Dairy & Eggs',
        price: 120,
        originalPrice: 135,
        rating: 4.8,
        reviewsCount: 42,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        unit: '1L Pouch',
        inStock: true,
        stockCount: 45,
        tags: ['Fresh', 'Popular', 'Best Seller'],
        description: 'Pure, pasteurized farm-fresh whole cow milk with full cream goodness. Great for tea, coffee, cereal, and baking.',
        branchStock: {
          'Kisii Main Branch': 45,
          'Kisii Town Branch': 28,
          'Nyamira Branch': 12,
        },
      },
      {
        id: 2,
        name: 'Premium White Sliced Bread 800g',
        brand: 'Broadways',
        category: 'Bakery',
        price: 85,
        originalPrice: 90,
        rating: 4.6,
        reviewsCount: 38,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        unit: '800g Loaf',
        inStock: true,
        stockCount: 30,
        tags: ['Fresh Daily', 'Breakfast'],
        description: 'Soft, oven-fresh enriched white bread sliced to perfection for everyday family breakfast and sandwiches.',
        branchStock: {
          'Kisii Main Branch': 30,
          'Kisii Town Branch': 15,
          'Nyamira Branch': 8,
        },
      },
      {
        id: 3,
        name: 'Farm Fresh Brown Eggs (Tray of 30)',
        brand: 'Rift Valley Poultry',
        category: 'Dairy & Eggs',
        price: 480,
        originalPrice: 520,
        rating: 4.9,
        reviewsCount: 56,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
        unit: 'Tray (30 pcs)',
        inStock: true,
        stockCount: 20,
        tags: ['Organic', 'High Protein'],
        description: 'Grade-A farm fresh brown eggs with rich golden yolks. Carefully inspected and safely packaged in biodegradable trays.',
        branchStock: {
          'Kisii Main Branch': 20,
          'Kisii Town Branch': 14,
          'Nyamira Branch': 6,
        },
      },
      {
        id: 4,
        name: 'Organic Red Ripe Tomatoes (1kg)',
        brand: 'Highland Farms',
        category: 'Fresh Produce',
        price: 110,
        originalPrice: 130,
        rating: 4.7,
        reviewsCount: 29,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        unit: '1 kg pack',
        inStock: true,
        stockCount: 55,
        tags: ['Fresh Produce', 'Organic'],
        description: 'Locally grown plump red tomatoes harvested ripe from local farms, bursting with sweet garden-fresh flavor.',
        branchStock: {
          'Kisii Main Branch': 55,
          'Kisii Town Branch': 32,
          'Nyamira Branch': 18,
        },
      },
      {
        id: 5,
        name: 'Pure Mountain Arabica Coffee 250g',
        brand: 'Kenya Gold',
        category: 'Beverages',
        price: 380,
        originalPrice: 420,
        rating: 5.0,
        reviewsCount: 64,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
        unit: '250g Jar',
        inStock: true,
        stockCount: 25,
        tags: ['Specialty', 'Single Origin'],
        description: 'Medium-dark roasted 100% Arabica highland coffee with notes of blackcurrant, citrus blossom, and rich cocoa.',
        branchStock: {
          'Kisii Main Branch': 25,
          'Kisii Town Branch': 18,
          'Nyamira Branch': 9,
        },
      },
      {
        id: 6,
        name: 'Fortified Pure Cane Sugar 2kg',
        brand: 'Kabras',
        category: 'Groceries',
        price: 260,
        originalPrice: 280,
        rating: 4.5,
        reviewsCount: 31,
        image: 'https://images.unsplash.com/photo-1622484216278-f71f649bf55d?w=600&auto=format&fit=crop&q=80',
        unit: '2 kg Bag',
        inStock: true,
        stockCount: 65,
        tags: ['Kitchen Essential'],
        description: 'Sweet, fine granulated white cane sugar fortified with Vitamin A for the healthiest daily culinary use.',
        branchStock: {
          'Kisii Main Branch': 65,
          'Kisii Town Branch': 40,
          'Nyamira Branch': 25,
        },
      },
      {
        id: 7,
        name: 'Sweet Bananas (Bunch of 8-10)',
        brand: 'Kisii Green',
        category: 'Fresh Produce',
        price: 90,
        originalPrice: 100,
        rating: 4.9,
        reviewsCount: 45,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
        unit: '1 Bunch',
        inStock: true,
        stockCount: 40,
        tags: ['Naturally Sweet', 'Rich in Potassium'],
        description: 'Golden ripe sweet bananas grown organically in the volcanic soils of Kisii hills.',
        branchStock: {
          'Kisii Main Branch': 40,
          'Kisii Town Branch': 25,
          'Nyamira Branch': 15,
        },
      },
      {
        id: 8,
        name: 'Pure Sunflower Cooking Oil 2L',
        brand: 'Rina',
        category: 'Groceries',
        price: 540,
        originalPrice: 590,
        rating: 4.8,
        reviewsCount: 51,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        unit: '2L Bottle',
        inStock: true,
        stockCount: 32,
        tags: ['Heart Healthy', 'Cholesterol Free'],
        description: 'Triple-refined pure sunflower oil rich in Vitamin E, ideal for deep frying, sautéing, and dressings.',
        branchStock: {
          'Kisii Main Branch': 32,
          'Kisii Town Branch': 20,
          'Nyamira Branch': 10,
        },
      },
    ];

    let filtered = catalog;
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    return ApiResponse.success(res, 'Customer products catalog retrieved', filtered);
  } catch (error) {
    logger.error('Error fetching customer products:', error);
    return ApiResponse.internal(res, 'Failed to fetch products');
  }
};

/**
 * @desc    Place online grocery order
 * @route   POST /api/v1/customer/orders
 * @access  Private (Customer)
 */
export const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    const { items, deliveryType, branchName, deliveryAddress, paymentMethod, mpesaPhone, subtotal, discount, deliveryFee, total, pointsRedeemed } = req.body;

    if (!items || items.length === 0) {
      throw ApiError.badRequest('Cart items are required');
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const pointsEarned = Math.floor(total * 0.05); // 5% points back

    const order = {
      id: orderId,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      customerPhone: user.phone || mpesaPhone,
      items,
      deliveryType: deliveryType || 'Delivery',
      branchName: branchName || 'Kisii Main Branch',
      deliveryAddress: deliveryAddress || 'Milimani Estate, Kisii',
      paymentMethod: paymentMethod || 'M-Pesa',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending COD' : 'Paid & Confirmed',
      orderStatus: 'Confirmed',
      subtotal,
      discount,
      deliveryFee,
      total,
      pointsEarned,
      pointsRedeemed: pointsRedeemed || 0,
      createdAt: new Date().toISOString(),
      trackingTimeline: [
        { title: 'Order Placed', description: 'We received your order', time: 'Just now', completed: true },
        { title: 'Payment Confirmed', description: `Verified via ${paymentMethod}`, time: 'Just now', completed: true },
        { title: 'Store Packaging', description: 'Grocery clerk is packing your fresh items', time: 'In progress', current: true },
        { title: deliveryType === 'Pickup' ? 'Ready for Pickup' : 'Out for Delivery', description: deliveryType === 'Pickup' ? 'Available at customer desk' : 'Rider assigned', time: 'Estimated 35 mins', completed: false },
        { title: 'Completed', description: 'Delivered safely to you', time: 'Pending', completed: false },
      ],
    };

    logger.info(`Customer order placed successfully: ${orderId} by ${user.email}`);

    return ApiResponse.created(res, 'Order placed successfully', order);
  } catch (error) {
    logger.error('Error placing customer order:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return ApiResponse.internal(res, 'Failed to place order');
  }
};

/**
 * @desc    Get customer orders history
 * @route   GET /api/v1/customer/orders
 * @access  Private (Customer)
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = [
      {
        id: 'ORD-10482',
        createdAt: '2026-08-14T14:30:00Z',
        items: [
          { name: 'Fresh Whole Milk 1L', quantity: 2, price: 120 },
          { name: 'Premium White Sliced Bread 800g', quantity: 1, price: 85 },
          { name: 'Pure Cane Sugar 2kg', quantity: 1, price: 260 },
        ],
        total: 585,
        status: 'Ready for Pickup',
        deliveryType: 'Store Pickup',
        branchName: 'Kisii Main Branch',
        paymentMethod: 'M-Pesa',
        mpesaReceipt: 'QHK78921KL',
      },
      {
        id: 'ORD-10451',
        createdAt: '2026-08-10T11:15:00Z',
        items: [
          { name: 'Farm Fresh Brown Eggs (Tray 30)', quantity: 1, price: 480 },
          { name: 'Pure Mountain Coffee 250g', quantity: 1, price: 380 },
        ],
        total: 860,
        status: 'Delivered',
        deliveryType: 'Home Delivery',
        branchName: 'Kisii Town Branch',
        paymentMethod: 'Card',
      },
      {
        id: 'ORD-10398',
        createdAt: '2026-08-01T09:20:00Z',
        items: [
          { name: 'Pure Sunflower Cooking Oil 2L', quantity: 2, price: 540 },
          { name: 'Organic Red Tomatoes 1kg', quantity: 2, price: 110 },
        ],
        total: 1300,
        status: 'Delivered',
        deliveryType: 'Home Delivery',
        branchName: 'Kisii Main Branch',
        paymentMethod: 'M-Pesa',
      },
    ];

    return ApiResponse.success(res, 'Customer orders retrieved', orders);
  } catch (error) {
    logger.error('Error fetching customer orders:', error);
    return ApiResponse.internal(res, 'Failed to fetch orders');
  }
};

/**
 * @desc    Get loyalty details & rewards catalog
 * @route   GET /api/v1/customer/loyalty
 * @access  Private (Customer)
 */
export const getCustomerLoyalty = async (req, res) => {
  try {
    const user = req.user;
    const loyaltyData = {
      pointsBalance: user?.preferences?.loyaltyPoints || 2450,
      tier: user?.preferences?.membershipTier || 'Gold',
      tierColor: '#f59e0b',
      pointsToNextTier: 550,
      nextTier: 'Platinum',
      progressPercent: 81,
      totalEarnedLifetime: 6800,
      totalRedeemedLifetime: 4350,
      rewards: [
        {
          id: 'rw_1',
          title: 'KSh 50 Discount Voucher',
          pointsCost: 500,
          discountValue: 50,
          code: 'LOYALTY-50',
          description: 'Applicable on any fresh grocery purchase over KSh 300.',
        },
        {
          id: 'rw_2',
          title: 'KSh 120 Super Saver Voucher',
          pointsCost: 1000,
          discountValue: 120,
          code: 'LOYALTY-120',
          description: 'Valid across all departments with no minimum spend.',
        },
        {
          id: 'rw_3',
          title: 'KSh 250 VIP Reward Voucher',
          pointsCost: 2000,
          discountValue: 250,
          code: 'LOYALTY-250',
          description: 'Premium member voucher + free delivery code.',
        },
      ],
      ledger: [
        { date: '2026-08-14', description: 'Points earned from Order #ORD-10482', points: '+60', type: 'earn' },
        { date: '2026-08-10', description: 'Points earned from Order #ORD-10451', points: '+45', type: 'earn' },
        { date: '2026-08-01', description: 'Redeemed for KSh 120 Discount Voucher', points: '-1000', type: 'redeem' },
        { date: '2026-07-28', description: 'Points earned from Order #ORD-10398', points: '+65', type: 'earn' },
      ],
    };

    return ApiResponse.success(res, 'Loyalty program data retrieved', loyaltyData);
  } catch (error) {
    logger.error('Error fetching loyalty program data:', error);
    return ApiResponse.internal(res, 'Failed to fetch loyalty data');
  }
};

/**
 * @desc    Get active coupons and promo deals
 * @route   GET /api/v1/customer/coupons
 * @access  Public / Customer
 */
export const getCustomerCoupons = async (req, res) => {
  try {
    const coupons = [
      {
        code: 'GROCERY20',
        title: 'Weekend Grocery Blowout',
        discountPercent: 20,
        maxDiscount: 500,
        minSpend: 1000,
        validUntil: '2026-08-20',
        description: 'Get 20% OFF your entire grocery basket this weekend across all branches.',
      },
      {
        code: 'WELCOME10',
        title: 'New Customer Welcome Gift',
        discountPercent: 10,
        maxDiscount: 250,
        minSpend: 500,
        validUntil: '2026-12-31',
        description: 'Enjoy 10% OFF your grocery shopping with instant delivery.',
      },
      {
        code: 'FREESHIP',
        title: 'Free Fresh Delivery',
        discountAmount: 150,
        minSpend: 1500,
        validUntil: '2026-09-30',
        description: 'Free home delivery to your doorstep on orders over KSh 1,500.',
      },
    ];

    return ApiResponse.success(res, 'Customer coupons retrieved', coupons);
  } catch (error) {
    logger.error('Error fetching coupons:', error);
    return ApiResponse.internal(res, 'Failed to fetch coupons');
  }
};

/**
 * @desc    Submit review for a grocery product
 * @route   POST /api/v1/customer/reviews
 * @access  Private (Customer)
 */
export const submitReview = async (req, res) => {
  try {
    const user = req.user;
    const { productId, rating, comment } = req.body;

    const review = {
      id: `rev_${Date.now()}`,
      productId,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    logger.info(`Customer review submitted for product ${productId} by ${user.email}`);

    return ApiResponse.created(res, 'Thank you! Your review has been published.', review);
  } catch (error) {
    logger.error('Error submitting review:', error);
    return ApiResponse.internal(res, 'Failed to submit review');
  }
};
