import express from 'express';
import * as customerPortalController from '../controllers/customerPortal.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public / Guest accessible customer endpoints
router.get('/products', customerPortalController.getCustomerProducts);
router.get('/coupons', customerPortalController.getCustomerCoupons);

// Authenticated Customer Endpoints
router.use(authenticate);

router.get('/dashboard', customerPortalController.getCustomerDashboard);
router.get('/orders', customerPortalController.getCustomerOrders);
router.post('/orders', customerPortalController.placeOrder);
router.get('/loyalty', customerPortalController.getCustomerLoyalty);
router.post('/reviews', customerPortalController.submitReview);

export default router;
