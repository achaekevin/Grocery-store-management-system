import api from './api';

const stockTransferService = {
  // Create Transfer Request
  createTransfer: async (data) => {
    const response = await api.post('/stock-transfers', data);
    return response.data;
  },

  // Get All Transfers
  getTransfers: async (params) => {
    const response = await api.get('/stock-transfers', { params });
    return response.data;
  },

  // Get Transfer by ID
  getTransferById: async (id) => {
    const response = await api.get(`/stock-transfers/${id}`);
    return response.data;
  },

  // Approve Transfer
  approveTransfer: async (id) => {
    const response = await api.put(`/stock-transfers/${id}/approve`);
    return response.data;
  },

  // Ship Transfer
  shipTransfer: async (id) => {
    const response = await api.put(`/stock-transfers/${id}/ship`);
    return response.data;
  },

  // Receive Transfer
  receiveTransfer: async (id, data) => {
    const response = await api.put(`/stock-transfers/${id}/receive`, data);
    return response.data;
  },

  // Cancel Transfer
  cancelTransfer: async (id, data) => {
    const response = await api.put(`/stock-transfers/${id}/cancel`, data);
    return response.data;
  },

  // Get Pending Transfers
  getPendingTransfers: async (branchId) => {
    const response = await api.get('/stock-transfers', {
      params: { branchId, status: 'pending' },
    });
    return response.data;
  },

  // Get In Transit Transfers
  getInTransitTransfers: async (branchId) => {
    const response = await api.get('/stock-transfers', {
      params: { branchId, status: 'in_transit' },
    });
    return response.data;
  },
};

export default stockTransferService;
