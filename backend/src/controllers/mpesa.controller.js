import * as mpesaHelper from '../helpers/mpesa.js';
import db from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Initiate STK Push
 */
export const stkPush = async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    // Create M-Pesa transaction record
    const mpesaTransaction = await db.MpesaTransaction.create({
      businessId: req.user.businessId,
      branchId: req.user.branchId,
      transactionType: 'STK_PUSH',
      phoneNumber: mpesaHelper.formatPhoneNumber(phoneNumber),
      amount,
      accountReference,
      transactionDesc: transactionDesc || 'Payment',
      status: 'pending',
    });

    // Initiate STK Push
    const response = await mpesaHelper.stkPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc || 'Payment'
    );

    // Update transaction with M-Pesa response
    await mpesaTransaction.update({
      merchantRequestId: response.MerchantRequestID,
      checkoutRequestId: response.CheckoutRequestID,
      resultCode: response.ResponseCode,
      resultDesc: response.ResponseDescription,
    });

    logger.info(`STK Push initiated: ${response.CheckoutRequestID}`);
    res.json(
      ApiResponse.success('STK Push initiated successfully', {
        checkoutRequestId: response.CheckoutRequestID,
        merchantRequestId: response.MerchantRequestID,
        transactionId: mpesaTransaction.id,
      })
    );
  } catch (error) {
    logger.error('STK Push failed:', error);
    throw error;
  }
};

/**
 * Query STK Push status
 */
export const stkPushQuery = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const transaction = await db.MpesaTransaction.findOne({
      where: { checkoutRequestId },
    });

    if (!transaction) {
      throw ApiError.notFound('Transaction not found');
    }

    // Query M-Pesa
    const response = await mpesaHelper.stkPushQuery(checkoutRequestId);

    // Update transaction
    await transaction.update({
      resultCode: response.ResultCode,
      resultDesc: response.ResultDesc,
      status: response.ResultCode === '0' ? 'success' : 'failed',
    });

    res.json(
      ApiResponse.success('Transaction status retrieved', {
        transaction,
        mpesaResponse: response,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * M-Pesa callback handler
 */
export const callback = async (req, res) => {
  try {
    logger.info('M-Pesa callback received:', JSON.stringify(req.body));

    const validation = mpesaHelper.validateCallback(req.body);

    if (!validation.valid) {
      logger.error('Invalid M-Pesa callback:', validation.error);
      return res.json({ ResultCode: 1, ResultDesc: 'Invalid callback' });
    }

    const { checkoutRequestId, merchantRequestId, resultCode, resultDesc, callbackMetadata } =
      validation;

    // Find transaction
    const transaction = await db.MpesaTransaction.findOne({
      where: { checkoutRequestId },
    });

    if (!transaction) {
      logger.error(`Transaction not found: ${checkoutRequestId}`);
      return res.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    // Extract metadata
    const metadata = mpesaHelper.extractCallbackMetadata(callbackMetadata);

    // Update transaction
    await transaction.update({
      resultCode: resultCode.toString(),
      resultDesc,
      status: resultCode === 0 ? 'success' : 'failed',
      mpesaReceiptNumber: metadata.mpesaReceiptNumber,
      callbackData: JSON.stringify(req.body),
    });

    // If successful, update associated payment/sale
    if (resultCode === 0 && metadata.mpesaReceiptNumber) {
      // Find and update payment record
      const payment = await db.Payment.findOne({
        where: {
          phoneNumber: transaction.phoneNumber,
          amount: transaction.amount,
          status: 'pending',
        },
      });

      if (payment) {
        await payment.update({
          mpesaReceiptNumber: metadata.mpesaReceiptNumber,
          status: 'completed',
        });

        logger.info(`Payment updated: ${payment.id}`);
      }

      // Emit Socket.io event
      const io = req.app?.get('io');
      if (io) {
        io.to(`business:${transaction.businessId}`).emit('mpesa-success', {
          transactionId: transaction.id,
          amount: transaction.amount,
          receiptNumber: metadata.mpesaReceiptNumber,
        });
      }
    }

    logger.info(`M-Pesa callback processed: ${checkoutRequestId}`);
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    logger.error('M-Pesa callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Internal Error' });
  }
};

/**
 * Get M-Pesa transactions
 */
export const getTransactions = async (req, res) => {
  try {
    const { branchId, status, dateFrom, dateTo } = req.query;
    const { limit, offset } = req.pagination;

    const where = { businessId: req.user.businessId };

    if (branchId) where.branchId = branchId;
    if (status) where.status = status;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[db.Sequelize.Op.gte] = dateFrom;
      if (dateTo) where.createdAt[db.Sequelize.Op.lte] = dateTo;
    }

    const { count, rows } = await db.MpesaTransaction.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const { page } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('M-Pesa transactions retrieved', rows, {
        currentPage: page,
        perPage: limit,
        totalItems: count,
        totalPages,
      })
    );
  } catch (error) {
    throw error;
  }
};

export default {
  stkPush,
  stkPushQuery,
  callback,
  getTransactions,
};
