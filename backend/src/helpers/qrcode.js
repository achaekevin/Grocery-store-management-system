import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate QR code buffer
 */
export const generateQRCode = async (data, options = {}) => {
  try {
    const {
      width = 300,
      margin = 1,
      color = {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel = 'M',
    } = options;

    const buffer = await QRCode.toBuffer(data, {
      width,
      margin,
      color,
      errorCorrectionLevel,
    });

    return buffer;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

/**
 * Generate and save QR code to file
 */
export const generateQRCodeFile = async (data, filename, options = {}) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads/qrcodes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    await QRCode.toFile(filepath, data, options);

    return filepath;
  } catch (error) {
    throw new Error(`QR code file generation failed: ${error.message}`);
  }
};

/**
 * Generate QR code as base64
 */
export const generateQRCodeBase64 = async (data, options = {}) => {
  try {
    const dataUrl = await QRCode.toDataURL(data, options);
    return dataUrl;
  } catch (error) {
    throw new Error(`QR code base64 generation failed: ${error.message}`);
  }
};

/**
 * Generate QR code for product
 */
export const generateProductQRCode = async (product) => {
  const productData = JSON.stringify({
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    price: product.sellingPrice,
  });

  return generateQRCode(productData);
};

/**
 * Generate QR code for M-Pesa payment
 */
export const generateMpesaQRCode = async (paymentData) => {
  const mpesaData = JSON.stringify({
    businessNumber: paymentData.businessNumber,
    accountNumber: paymentData.accountNumber,
    amount: paymentData.amount,
  });

  return generateQRCode(mpesaData);
};

/**
 * Generate QR code for customer loyalty
 */
export const generateCustomerQRCode = async (customer) => {
  const customerData = JSON.stringify({
    id: customer.id,
    phone: customer.phone,
    loyaltyPoints: customer.loyaltyPoints,
  });

  return generateQRCode(customerData);
};

export default {
  generateQRCode,
  generateQRCodeFile,
  generateQRCodeBase64,
  generateProductQRCode,
  generateMpesaQRCode,
  generateCustomerQRCode,
};
