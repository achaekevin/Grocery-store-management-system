import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Export products to Excel
 */
export const exportProducts = async (products, business) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Set column headers
    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Barcode', key: 'barcode', width: 15 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Brand', key: 'brand', width: 20 },
      { header: 'Cost Price', key: 'costPrice', width: 12 },
      { header: 'Selling Price', key: 'sellingPrice', width: 12 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Reorder Level', key: 'reorderLevel', width: 12 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    products.forEach((product) => {
      worksheet.addRow({
        sku: product.sku || '',
        barcode: product.barcode || '',
        name: product.name,
        category: product.category?.name || '',
        brand: product.brand?.name || '',
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        quantity: product.inventory?.[0]?.quantity || 0,
        reorderLevel: product.reorderLevel,
        status: product.status,
      });
    });

    // Create file
    const uploadsDir = path.join(__dirname, '../../uploads/exports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `products-${Date.now()}.xlsx`;
    const filepath = path.join(uploadsDir, filename);

    await workbook.xlsx.writeFile(filepath);

    return filepath;
  } catch (error) {
    throw new Error(`Excel export failed: ${error.message}`);
  }
};

/**
 * Export sales to Excel
 */
export const exportSales = async (sales, business, dateRange) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    // Set column headers
    worksheet.columns = [
      { header: 'Sale Number', key: 'saleNumber', width: 20 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Customer', key: 'customer', width: 25 },
      { header: 'Cashier', key: 'cashier', width: 20 },
      { header: 'Subtotal', key: 'subtotal', width: 12 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Discount', key: 'discount', width: 10 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    sales.forEach((sale) => {
      worksheet.addRow({
        saleNumber: sale.saleNumber,
        date: new Date(sale.saleDate).toLocaleString(),
        customer: sale.customer?.name || 'Walk-in',
        cashier: sale.cashier?.name || '',
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.total,
        paymentMethod: sale.payments?.[0]?.paymentMethod || '',
        status: sale.status,
      });
    });

    // Add summary row
    worksheet.addRow({});
    const summaryRow = worksheet.addRow({
      saleNumber: 'TOTAL',
      total: { formula: `SUM(H2:H${worksheet.rowCount - 1})` },
    });
    summaryRow.font = { bold: true };

    // Create file
    const uploadsDir = path.join(__dirname, '../../uploads/exports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `sales-${Date.now()}.xlsx`;
    const filepath = path.join(uploadsDir, filename);

    await workbook.xlsx.writeFile(filepath);

    return filepath;
  } catch (error) {
    throw new Error(`Excel export failed: ${error.message}`);
  }
};

/**
 * Export inventory to Excel
 */
export const exportInventory = async (inventory, business) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    // Set column headers
    worksheet.columns = [
      { header: 'Product', key: 'product', width: 30 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Branch', key: 'branch', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Reorder Level', key: 'reorderLevel', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Last Restocked', key: 'lastRestocked', width: 20 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    inventory.forEach((item) => {
      const isLowStock = item.quantity <= item.reorderLevel;
      const row = worksheet.addRow({
        product: item.product?.name || '',
        sku: item.product?.sku || '',
        branch: item.branch?.name || '',
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        status: isLowStock ? 'Low Stock' : 'OK',
        lastRestocked: item.lastRestockedAt
          ? new Date(item.lastRestockedAt).toLocaleDateString()
          : 'Never',
      });

      // Highlight low stock rows
      if (isLowStock) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC7CE' },
        };
      }
    });

    // Create file
    const uploadsDir = path.join(__dirname, '../../uploads/exports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `inventory-${Date.now()}.xlsx`;
    const filepath = path.join(uploadsDir, filename);

    await workbook.xlsx.writeFile(filepath);

    return filepath;
  } catch (error) {
    throw new Error(`Excel export failed: ${error.message}`);
  }
};

export default {
  exportProducts,
  exportSales,
  exportInventory,
};
