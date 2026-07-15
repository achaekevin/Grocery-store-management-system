import * as reportService from '../services/report.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { exportSales, exportInventory, exportProducts } from '../helpers/excel.js';
import { generateSalesReport } from '../helpers/pdf.js';

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

export default {
  getSalesReport,
  getInventoryReport,
  getCustomerReport,
  getProfitLossReport,
  getDashboardStats,
  exportSalesExcel,
  exportInventoryExcel,
};
