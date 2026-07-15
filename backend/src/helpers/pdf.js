import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate sales receipt PDF
 */
export const generateSaleReceipt = async (sale, business) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const uploadsDir = path.join(__dirname, '../../uploads/receipts');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `receipt-${sale.saleNumber}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text(business.name, { align: 'center' });
      doc.fontSize(10).text(business.address || '', { align: 'center' });
      doc.text(`Phone: ${business.phone}`, { align: 'center' });
      doc.text(`Email: ${business.email}`, { align: 'center' });
      doc.moveDown();

      // Receipt details
      doc.fontSize(16).text('SALES RECEIPT', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(10);
      doc.text(`Receipt No: ${sale.saleNumber}`);
      doc.text(`Date: ${new Date(sale.saleDate).toLocaleString()}`);
      doc.text(`Cashier: ${sale.cashier?.name || 'N/A'}`);
      
      if (sale.customer) {
        doc.text(`Customer: ${sale.customer.name}`);
        doc.text(`Phone: ${sale.customer.phone}`);
      }
      
      doc.moveDown();

      // Items table
      const tableTop = doc.y;
      const itemX = 50;
      const qtyX = 250;
      const priceX = 320;
      const totalX = 450;

      // Table headers
      doc.font('Helvetica-Bold');
      doc.text('Item', itemX, tableTop);
      doc.text('Qty', qtyX, tableTop);
      doc.text('Price', priceX, tableTop);
      doc.text('Total', totalX, tableTop);
      
      doc.moveTo(itemX, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // Table rows
      doc.font('Helvetica');
      sale.items?.forEach((item) => {
        const y = doc.y;
        doc.text(item.product?.name || 'Product', itemX, y, { width: 190 });
        doc.text(item.quantity.toString(), qtyX, y);
        doc.text(item.unitPrice.toFixed(2), priceX, y);
        doc.text(item.total.toFixed(2), totalX, y);
        doc.moveDown(0.5);
      });

      doc.moveDown();
      doc.moveTo(itemX, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // Totals
      const totalsX = 350;
      doc.text('Subtotal:', totalsX);
      doc.text(sale.subtotal.toFixed(2), totalX, doc.y - 12);

      if (sale.discount > 0) {
        doc.text('Discount:', totalsX);
        doc.text(`-${sale.discount.toFixed(2)}`, totalX, doc.y - 12);
      }

      if (sale.tax > 0) {
        doc.text('Tax:', totalsX);
        doc.text(sale.tax.toFixed(2), totalX, doc.y - 12);
      }

      doc.moveDown(0.5);
      doc.font('Helvetica-Bold');
      doc.fontSize(12);
      doc.text('TOTAL:', totalsX);
      doc.text(sale.total.toFixed(2), totalX, doc.y - 14);

      doc.font('Helvetica');
      doc.fontSize(10);
      doc.text('Amount Paid:', totalsX);
      doc.text(sale.amountPaid.toFixed(2), totalX, doc.y - 12);

      if (sale.changeAmount > 0) {
        doc.text('Change:', totalsX);
        doc.text(sale.changeAmount.toFixed(2), totalX, doc.y - 12);
      }

      // Payment methods
      if (sale.payments && sale.payments.length > 0) {
        doc.moveDown();
        doc.text('Payment Method(s):');
        sale.payments.forEach((payment) => {
          doc.text(`  ${payment.paymentMethod}: ${payment.amount.toFixed(2)}`);
        });
      }

      // Loyalty points
      if (sale.loyaltyPointsEarned > 0) {
        doc.moveDown();
        doc.text(`Loyalty Points Earned: ${sale.loyaltyPointsEarned}`);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).text('Thank you for your business!', { align: 'center' });
      doc.text('Please keep this receipt for your records', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate sales report PDF
 */
export const generateSalesReport = async (data, business, dateRange) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const uploadsDir = path.join(__dirname, '../../uploads/reports');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `sales-report-${Date.now()}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text(business.name, { align: 'center' });
      doc.fontSize(16).text('Sales Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10);
      doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Summary
      doc.fontSize(14).text('Summary', { underline: true });
      doc.moveDown();
      doc.fontSize(10);
      doc.text(`Total Sales: ${data.totalSales}`);
      doc.text(`Total Revenue: ${data.totalRevenue.toFixed(2)}`);
      doc.text(`Average Order Value: ${data.averageOrderValue.toFixed(2)}`);
      doc.moveDown();

      // Additional report content can be added here

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  generateSaleReceipt,
  generateSalesReport,
};
