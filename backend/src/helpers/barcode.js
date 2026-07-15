import bwipjs from 'bwip-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate barcode image
 */
export const generateBarcode = async (data, options = {}) => {
  try {
    const {
      type = 'code128',
      width = 2,
      height = 50,
      includetext = true,
      textxalign = 'center',
      format = 'png',
    } = options;

    const buffer = await bwipjs.toBuffer({
      bcid: type,
      text: data,
      scale: width,
      height: height,
      includetext: includetext,
      textxalign: textxalign,
    });

    return buffer;
  } catch (error) {
    throw new Error(`Barcode generation failed: ${error.message}`);
  }
};

/**
 * Generate and save barcode to file
 */
export const generateBarcodeFile = async (data, filename, options = {}) => {
  try {
    const buffer = await generateBarcode(data, options);
    
    const uploadsDir = path.join(__dirname, '../../uploads/barcodes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    return filepath;
  } catch (error) {
    throw new Error(`Barcode file generation failed: ${error.message}`);
  }
};

/**
 * Generate barcode base64
 */
export const generateBarcodeBase64 = async (data, options = {}) => {
  try {
    const buffer = await generateBarcode(data, options);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (error) {
    throw new Error(`Barcode base64 generation failed: ${error.message}`);
  }
};

/**
 * Generate EAN-13 barcode
 */
export const generateEAN13 = async (data, options = {}) => {
  return generateBarcode(data, { ...options, type: 'ean13' });
};

/**
 * Generate EAN-8 barcode
 */
export const generateEAN8 = async (data, options = {}) => {
  return generateBarcode(data, { ...options, type: 'ean8' });
};

/**
 * Generate UPC-A barcode
 */
export const generateUPCA = async (data, options = {}) => {
  return generateBarcode(data, { ...options, type: 'upca' });
};

/**
 * Generate Code 128 barcode (most common)
 */
export const generateCode128 = async (data, options = {}) => {
  return generateBarcode(data, { ...options, type: 'code128' });
};

/**
 * Validate barcode data
 */
export const validateBarcodeData = (data, type = 'code128') => {
  if (!data || typeof data !== 'string') {
    return { valid: false, error: 'Barcode data must be a non-empty string' };
  }

  // Validate based on type
  switch (type) {
    case 'ean13':
      if (!/^\d{12,13}$/.test(data)) {
        return { valid: false, error: 'EAN-13 must be 12-13 digits' };
      }
      break;
    case 'ean8':
      if (!/^\d{7,8}$/.test(data)) {
        return { valid: false, error: 'EAN-8 must be 7-8 digits' };
      }
      break;
    case 'upca':
      if (!/^\d{11,12}$/.test(data)) {
        return { valid: false, error: 'UPC-A must be 11-12 digits' };
      }
      break;
    default:
      // Code 128 can handle most characters
      if (data.length > 80) {
        return { valid: false, error: 'Barcode data too long (max 80 characters)' };
      }
  }

  return { valid: true };
};

export default {
  generateBarcode,
  generateBarcodeFile,
  generateBarcodeBase64,
  generateEAN13,
  generateEAN8,
  generateUPCA,
  generateCode128,
  validateBarcodeData,
};
