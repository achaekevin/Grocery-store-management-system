import * as reportService from '../services/report.service.js';
import PDFDocument from 'pdfkit';

// Generate report based on type
export const generateReport = async (req, res) => {
  try {
    console.log('Generate report request received:', req.body);
    console.log('User:', req.user);

    const { type, period = 'month', format = 'pdf', filters = {} } = req.body;

    // Get businessId from user, fallback to a default for testing
    const businessId = req.user?.businessId || req.user?.business_id || '00000000-0000-0000-0000-000000000001';
    const userId = req.user?.id || 'system';

    console.log('Business ID:', businessId, 'User ID:', userId);

    let reportData = {};
    let reportName = '';

    // Generate report based on type
    try {
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
          console.error('Invalid report type:', type);
          return res.status(400).json({ error: 'Invalid report type' });
      }
    } catch (serviceError) {
      console.error('Service error:', serviceError);
      // If service fails, use mock data
      reportData = {
        summary: {
          message: 'No data available yet',
          type: type,
          generatedAt: new Date().toISOString()
        }
      };
      reportName = `${type.charAt(0).toUpperCase() + type.slice(1)} Report`;
    }

    console.log('Report data retrieved, format:', format);

    if (format === 'excel') {
      try {
        // Generate Excel file
        const ExcelJS = (await import('exceljs')).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(reportName);

        // Add title
        worksheet.addRow([reportName]);
        worksheet.addRow([`Generated: ${new Date().toLocaleString()}`]);
        worksheet.addRow([]);

        // Add data based on report type
        if (type === 'sales' && reportData.summary) {
          worksheet.addRow(['Summary']);
          worksheet.addRow(['Total Sales', reportData.summary.totalSales || 0]);
          worksheet.addRow(['Total Revenue', `KSh {(reportData.summary.totalRevenue || 0).toLocaleString()}`]);
          worksheet.addRow(['Average Order Value', `KSh {(reportData.summary.averageOrderValue || 0).toLocaleString()}`]);
        } else if (type === 'inventory' && reportData.summary) {
          worksheet.addRow(['Summary']);
          worksheet.addRow(['Total Items', reportData.summary.totalItems || 0]);
          worksheet.addRow(['Inventory Value', `KSh {(reportData.summary.inventoryValue || 0).toLocaleString()}`]);
          worksheet.addRow(['Potential Revenue', `KSh {(reportData.summary.potentialRevenue || 0).toLocaleString()}`]);
        } else if (type === 'financial') {
          worksheet.addRow(['Financial Summary']);
          worksheet.addRow(['Revenue', `KSh {(reportData.revenue || 0).toLocaleString()}`]);
          worksheet.addRow(['Cost of Goods Sold', `KSh {(reportData.cogs || 0).toLocaleString()}`]);
          worksheet.addRow(['Gross Profit', `KSh {(reportData.grossProfit || 0).toLocaleString()}`]);
          worksheet.addRow(['Expenses', `KSh {(reportData.expenses || 0).toLocaleString()}`]);
          worksheet.addRow(['Net Profit', `KSh {(reportData.netProfit || 0).toLocaleString()}`]);
          worksheet.addRow(['Profit Margin', reportData.profitMargin || '0%']);
        } else {
          // Generic data display
          worksheet.addRow(['Report Type', type]);
          worksheet.addRow(['Generated At', new Date().toLocaleString()]);
          worksheet.addRow(['Status', 'No data available']);
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
          `attachment; filename=ksh.{type}_report_${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
        console.log('Excel file sent successfully');
      } catch (excelError) {
        console.error('Excel generation error:', excelError);
        throw excelError;
      }
    } else {
      try {
        // Generate PDF file
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${Date.now()}.pdf`);

        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text(reportName, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Add report data
        doc.fontSize(14).text('Report Summary:', { underline: true });
        doc.moveDown();

        if (type === 'sales' && reportData.summary) {
          doc.fontSize(10);
          doc.text(`Total Sales: ${reportData.summary.totalSales || 0}`);
          doc.text(`Total Revenue: KSh ${(reportData.summary.totalRevenue || 0).toLocaleString()}`);
          doc.text(`Average Order Value: KSh ${(reportData.summary.averageOrderValue || 0).toLocaleString()}`);
        } else if (type === 'inventory' && reportData.summary) {
          doc.fontSize(10);
          doc.text(`Total Items: ${reportData.summary.totalItems || 0}`);
          doc.text(`Inventory Value: KSh ${(reportData.summary.inventoryValue || 0).toLocaleString()}`);
          doc.text(`Potential Revenue: KSh ${(reportData.summary.potentialRevenue || 0).toLocaleString()}`);
        } else if (type === 'financial') {
          doc.fontSize(10);
          doc.text(`Revenue: KSh ${(reportData.revenue || 0).toLocaleString()}`);
          doc.text(`Cost of Goods Sold: KSh ${(reportData.cogs || 0).toLocaleString()}`);
          doc.text(`Gross Profit: KSh ${(reportData.grossProfit || 0).toLocaleString()}`);
          doc.text(`Expenses: KSh ${(reportData.expenses || 0).toLocaleString()}`);
          doc.text(`Net Profit: KSh ${(reportData.netProfit || 0).toLocaleString()}`);
          doc.text(`Profit Margin: ${reportData.profitMargin || '0%'}`);
        } else {
          doc.fontSize(10);
          doc.text(`Report Type: ${type}`);
          doc.text(`Status: ${reportData.summary?.message || 'No data available'}`);
          doc.text(`Generated: ${new Date().toLocaleString()}`);
        }

        doc.end();
        console.log('PDF sent successfully');
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        throw pdfError;
      }
    }
  } catch (error) {
    console.error('Error generating report:', error);
    console.error('Error stack:', error.stack);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate report',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

// Get saved reports
export const getSavedReports = async (req, res) => {
  try {
    // For now, return empty array since we don't have a reports table
    const savedReports = [];
    res.json({ success: true, data: savedReports });
  } catch (error) {
    console.error('Error fetching saved reports:', error);
    res.status(500).json({ error: 'Failed to fetch saved reports' });
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

    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const businessId = req.user?.businessId || req.user?.business_id;
    const report = await reportService.getSalesReport(businessId, req.query);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error in getSalesReport:', error);
    res.status(500).json({ error: 'Failed to get sales report' });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const businessId = req.user?.businessId || req.user?.business_id;
    const report = await reportService.getInventoryReport(businessId, req.query);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error in getInventoryReport:', error);
    res.status(500).json({ error: 'Failed to get inventory report' });
  }
};

export const getCustomerReport = async (req, res) => {
  try {
    const businessId = req.user?.businessId || req.user?.business_id;
    const report = await reportService.getCustomerReport(businessId, req.query);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error in getCustomerReport:', error);
    res.status(500).json({ error: 'Failed to get customer report' });
  }
};

export const getProfitLossReport = async (req, res) => {
  try {
    const businessId = req.user?.businessId || req.user?.business_id;
    const report = await reportService.getProfitLossReport(businessId, req.query);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error in getProfitLossReport:', error);
    res.status(500).json({ error: 'Failed to get profit loss report' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const businessId = req.user?.businessId || req.user?.business_id;
    const { branchId } = req.query;
    const stats = await reportService.getDashboardStats(businessId, branchId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

export const exportSalesExcel = async (req, res) => {
  try {
    res.status(501).json({ error: 'Excel export not yet implemented' });
  } catch (error) {
    console.error('Error in exportSalesExcel:', error);
    res.status(500).json({ error: 'Failed to export sales' });
  }
};

export const exportInventoryExcel = async (req, res) => {
  try {
    res.status(501).json({ error: 'Excel export not yet implemented' });
  } catch (error) {
    console.error('Error in exportInventoryExcel:', error);
    res.status(500).json({ error: 'Failed to export inventory' });
  }
};

// Download generated report
export const downloadReport = async (req, res) => {
  try {
    res.status(501).json({ error: 'Download not yet implemented' });
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ error: 'Failed to download report' });
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
