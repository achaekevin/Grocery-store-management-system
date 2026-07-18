import api from './api';

const financialService = {
  // Get income summary
  getIncomeSummary: async (params) => {
    const response = await api.get('/financial/income', { params });
    return response.data;
  },

  // Get expenses summary
  getExpensesSummary: async (params) => {
    const response = await api.get('/financial/expenses', { params });
    return response.data;
  },

  // Get profit summary
  getProfitSummary: async (params) => {
    const response = await api.get('/financial/profit', { params });
    return response.data;
  },

  // Get cash flow
  getCashFlow: async (params) => {
    const response = await api.get('/financial/cash-flow', { params });
    return response.data;
  },

  // Get tax summary
  getTaxSummary: async (params) => {
    const response = await api.get('/financial/tax', { params });
    return response.data;
  },

  // Perform daily closing
  dailyClosing: async (data) => {
    const response = await api.post('/financial/daily-closing', data);
    return response.data;
  },

  // Perform monthly closing
  monthlyClosing: async (data) => {
    const response = await api.post('/financial/monthly-closing', data);
    return response.data;
  },
};

export default financialService;
