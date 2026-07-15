import axios from 'axios';
import config from '../config/index.js';
import logger from '../config/logger.js';

/**
 * Generate M-Pesa access token
 */
export const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(
      `${config.mpesa.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    logger.error('M-Pesa access token generation failed:', error);
    throw new Error('Failed to generate M-Pesa access token');
  }
};

/**
 * Generate timestamp for M-Pesa (YYYYMMDDHHmmss)
 */
export const generateTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Generate password for M-Pesa
 */
export const generatePassword = (timestamp) => {
  const data = `${config.mpesa.shortCode}${config.mpesa.passkey}${timestamp}`;
  return Buffer.from(data).toString('base64');
};

/**
 * Format phone number to M-Pesa format (254XXXXXXXXX)
 */
export const formatPhoneNumber = (phone) => {
  // Remove spaces, dashes, and plus signs
  let formatted = phone.replace(/[\s\-+]/g, '');
  
  // If starts with 0, replace with 254
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  }
  
  // If doesn't start with 254, add it
  if (!formatted.startsWith('254')) {
    formatted = '254' + formatted;
  }
  
  return formatted;
};

/**
 * Initiate STK Push (Lipa Na M-Pesa Online)
 */
export const stkPush = async (phoneNumber, amount, accountReference, transactionDesc) => {
  try {
    const accessToken = await generateAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    const response = await axios.post(
      `${config.mpesa.baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: config.mpesa.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formatPhoneNumber(phoneNumber),
        PartyB: config.mpesa.shortCode,
        PhoneNumber: formatPhoneNumber(phoneNumber),
        CallBackURL: config.mpesa.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('M-Pesa STK Push failed:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
};

/**
 * Query STK Push transaction status
 */
export const stkPushQuery = async (checkoutRequestId) => {
  try {
    const accessToken = await generateAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    const response = await axios.post(
      `${config.mpesa.baseUrl}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: config.mpesa.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('M-Pesa query failed:', error.response?.data || error.message);
    throw new Error('Failed to query M-Pesa transaction');
  }
};

/**
 * Validate M-Pesa callback
 */
export const validateCallback = (callbackData) => {
  try {
    const { Body } = callbackData;
    const { stkCallback } = Body;
    
    if (!stkCallback) {
      return { valid: false, error: 'Invalid callback data' };
    }

    return {
      valid: true,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
      callbackMetadata: stkCallback.CallbackMetadata,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Extract callback metadata
 */
export const extractCallbackMetadata = (callbackMetadata) => {
  if (!callbackMetadata || !callbackMetadata.Item) {
    return {};
  }

  const metadata = {};
  callbackMetadata.Item.forEach((item) => {
    metadata[item.Name] = item.Value;
  });

  return {
    amount: metadata.Amount,
    mpesaReceiptNumber: metadata.MpesaReceiptNumber,
    transactionDate: metadata.TransactionDate,
    phoneNumber: metadata.PhoneNumber,
  };
};

export default {
  generateAccessToken,
  generateTimestamp,
  generatePassword,
  formatPhoneNumber,
  stkPush,
  stkPushQuery,
  validateCallback,
  extractCallbackMetadata,
};
