import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories
const directories = ['products', 'users', 'receipts', 'expenses', 'businesses'];
directories.forEach((dir) => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'others';
    
    if (file.fieldname === 'productImage') {
      folder = 'products';
    } else if (file.fieldname === 'avatar' || file.fieldname === 'userImage') {
      folder = 'users';
    } else if (file.fieldname === 'receipt') {
      folder = 'receipts';
    } else if (file.fieldname === 'expenseReceipt') {
      folder = 'expenses';
    } else if (file.fieldname === 'businessLogo') {
      folder = 'businesses';
    }
    
    cb(null, path.join(uploadsDir, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter
 */
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  
  // Allowed document types
  const documentTypes = /pdf|doc|docx|xls|xlsx/;
  
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;

  // Check if image
  if (
    file.fieldname.includes('Image') ||
    file.fieldname.includes('avatar') ||
    file.fieldname.includes('Logo')
  ) {
    if (imageTypes.test(ext) && mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(ApiError.badRequest('Only image files are allowed'), false);
  }

  // Check if document (receipts, etc.)
  if (file.fieldname.includes('receipt') || file.fieldname.includes('document')) {
    if (imageTypes.test(ext) || documentTypes.test(ext)) {
      return cb(null, true);
    }
    return cb(
      ApiError.badRequest('Only image or document files are allowed'),
      false
    );
  }

  cb(null, true);
};

/**
 * Multer upload instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Upload single image
 */
export const uploadSingle = (fieldName) => upload.single(fieldName);

/**
 * Upload multiple images
 */
export const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

/**
 * Upload mixed fields
 */
export const uploadFields = (fields) => upload.fields(fields);

export default upload;
