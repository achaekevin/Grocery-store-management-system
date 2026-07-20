import * as reportService from '../services/report.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { exportSales, exportInventory, exportProducts } from '../helpers/excel.js';
import { generateSalesReport } from '../helpers/pdf.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Generate report based on type
export const generateReport = async (req, res) => {
  try {
    const { type, period, format = 'pdf', filters = {} } = req.body;
    const { businessId, id: userId } = req.user;

    let reportData;
    let reportName;

    // Generate report based on type
    switch (type) {
      case 'sales':
        reportData = await reportService.getSalesReport(businessId, { period, ...filters });
        reportName = 'Sales Report';
        break;
      case 'inventory':
        reportData = await reportService.getInventoryReport(businessId, { period, ...filters });
        reportName = 'Inventory Report';
        break;
      case 'financial':
        reportData = await reportService.getProfitLossReport(businessId, { period, ...filters });
        reportName = 'Financial Report';
        break;
      case 'customer':
        reportData = await reportService.getCustomerReport(businessId, { period, ...filters });
        reportName = 'Customer Report';
        break;
      case 'expense':
        reportData = await reportService.getExpenseReport(businessId, { period, ...filters });
        reportName = 'Expense Report';
        break;
      case 'product':
        reportData = await reportService.getProductPerformanceReport(businessId, { period, ...filters });
        reportName = 'Product Performance Report';
        break;
      default:
        return res.status(400).json(ApiResponse.error('Invalid report type'));
    }

    if (format === 'excel') {
      // Generate Excel file
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(reportName);

      // Add title
      worksheet.addRow([reportName]);
      worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
      worksheet.addRow([]);

      // Add data based on report type
      if (type === 'sales' && reportData.summary) {
        worksheet.addRow(['Summary']);
        worksheet.addRow(['Total Sales', reportData.summary.totalSales || 0]);
        worksheet.addRow(['Total Revenue', `$${reportData.summary.totalRevenue || 0}`]);
        worksheet.addRow(['Average Order Value', `$${reportData.summary.averageOrderValue || 0}`]);
      } else if (type === 'inventory' && reportData.summary) {
        worksheet.addRow(['Summary']);
        worksheet.addRow(['Total Items', reportData.summary.totalItems || 0]);
        worksheet.addRow(['Inventory Value', `$${reportData.summary.inventoryValue || 0}`]);
        worksheet.addRow(['Potential Revenue', `$${reportData.summary.potentialRevenue || 0}`]);
      } else if (type === 'financial') {
        worksheet.addRow(['Financial Summary']);
        worksheet.addRow(['Revenue', `$${reportData.revenue || 0}`]);
        worksheet.addRow(['Cost of Goods Sold', `$${reportData.cogs || 0}`]);
        worksheet.addRow(['Gross Profit', `$${reportData.grossProfit || 0}`]);
        worksheet.addRow(['Expenses', `$${reportData.expenses || 0}`]);
        worksheet.addRow(['Net Profit', `$${reportData.netProfit || 0}`]);
        worksheet.addRow(['Profit Margin', reportData.profitMargin || '0%']);
      } else {
        // Generic data display
        worksheet.addRow(['Data']);
        worksheet.addRow([JSON.stringify(reportData, null, 2)]);
      }

      // Style the worksheet
      worksheet.getRow(1).font = { bold: true, size: 16 };
      worksheet.columns.forEach(column => {
        column.width = 25;
      });

      // Send file
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${type}_report_${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Generate PDF file
      const fileName = `${type}_report_${Date.now()}.pdf`;
      
      // Create PDF
      const doc = new PDFDocument({ margin: 50 });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text(reportName, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // Add report data
      doc.fontSize(14).text('Report Data:', { underline: true });
      doc.moveDown();
      
      if (type === 'sales' && reportData.summary) {
        doc.fontSize(10);
        doc.text(`Total Sales: ${reportData.summary.totalSales || 0}`);
        doc.text(`Total Revenue: $${reportData.summary.totalRevenue || 0}`);
        doc.text(`Average Order Value: $${reportData.summary.averageOrderValue || 0}`);
      } else if (type === 'inventory' && reportData.summary) {
        doc.fontSize(10);
        doc.text(`Total Items: ${reportData.summary.totalItems || 0}`);
        doc.text(`Inventory Value: $${reportData.summary.inventoryValue || 0}`);
        doc.text(`Potential Revenue: $${reportData.summary.potentialRevenue || 0}`);
      } else if (type === 'financial') {
        doc.fontSize(10);
        doc.text(`Revenue: $${reportData.revenue || 0}`);
        doc.text(`Cost of Goods Sold: $${reportData.cogs || 0}`);
        doc.text(`Gross Profit: $${reportData.grossProfit || 0}`);
        doc.text(`Expenses: $${reportData.expenses || 0}`);
        doc.text(`Net Profit: $${reportData.netProfit || 0}`);
        doc.text(`Profit Margin: ${reportData.profitMargin || '0%'}`);
      } else {
        doc.fontSize(10).text(JSON.stringify(reportData, null, 2));
      }

      doc.end();
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json(ApiResponse.error('Failed to generate report', error.message));
  }
};

// Get saved reports
export const getSavedReports = async (req, res) => {
  try {
    const { businessId } = req.user;
    
    // For now, return empty array since we don't have a reports table
    // You can implement database storage later
    const savedReports = [];

    res.json(ApiResponse.success('Saved reports retrieved', savedReports));
  } catch (error) {
    console.error('Error fetching saved reports:', error);
    res.status(500).json(ApiResponse.error('Failed to fetch saved reports'));
  }
};

// Get report templates
export const getReportTemplates = async (req, res) => {
  try {
    const templates = [
      {
        id: 'sales_template',
        name: 'Sales Report Template',
        description: 'Detailed sales analysis with trends',
        type: 'sales'
      },
      {
        id: 'inventory_template',
        name: 'Inventory Report Template',
        description: 'Stock levels and movement tracking',
        type: 'inventory'
      },
      {
        id: 'financial_template',
        name: 'Financial Report Template',
        description: 'Revenue, expenses, and profit analysis',
        type: 'financial'
      },
      {
        id: 'customer_template',
        name: 'Customer Report Template',
        description: 'Customer behavior and purchase patterns',
        type: 'customer'
      }
    ];

    res.json(ApiResponse.success('Report templates retrieved', templates));
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json(ApiResponse.error('Failed to fetch templates'));
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const report = await reportService.getSalesReport(req.user.businessId, req.query);
    res.json(ApiResponse.success('Sales report retrieved', report));
  } catch (error) {
    throw error;
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const report = await reportService.getInventoryReport(req.user.businessId, req.query);
    res.json(ApiResponse.success('Inventory report retrieved', report));
  } catch (error) {
    throw error;
  }
};

export const getCustomerReport = async (req, res) => {
  try {
    const report = await reportService.getCustomerReport(req.user.businessId, req.query);
    res.json(ApiResponse.success('Customer report retrieved', report));
  } catch (error) {
    throw error;
  }
};

export const getProfitLossReport = async (req, res) => {
  try {
    const report = await reportService.getProfitLossReport(
      req.user.businessId,
      req.query
    );
    res.json(ApiResponse.success('Profit & Loss report retrieved', report));
  } catch (error) {
    throw error;
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { branchId } = req.query;
    const stats = await reportService.getDashboardStats(req.user.businessId, branchId);
    res.json(ApiResponse.success('Dashboard statistics retrieved', stats));
  } catch (error) {
    throw error;
  }
};

export const exportSalesExcel = async (req, res) => {
  try {
    // Get sales data (you'll need to implement this)
    const sales = []; // Fetch sales data
    const business = {}; // Fetch business data
    
    const filepath = await exportSales(sales, business, req.query);
    res.download(filepath);
  } catch (error) {
    throw error;
  }
};

export const exportInventoryExcel = async (req, res) => {
  try {
    const report = await reportService.getInventoryReport(req.user.businessId, req.query);
    const business = {}; // Fetch business data
    
    const filepath = await exportInventory(report.inventory, business);
    res.download(filepath);
  } catch (error) {
    throw error;
  }
};

// Download generated report
export const downloadReport = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'reports', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(ApiResponse.error('Report file not found'));
    }

    res.download(filePath);
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json(ApiResponse.error('Failed to download report'));
  }
};

export default {
  getSalesReport,
  getInventoryReport,
  getCustomerReport,
  getProfitLossReport,
  getDashboardStats,
  exportSalesExcel,
  exportInventoryExcel,
  generateReport,
  getSavedReports,
  getReportTemplates,
  downloadReport,
};
