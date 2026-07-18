import api from './api';

const purchaseOrderService = {
  // Create Purchase Order
  createPurchaseOrder: async (data) => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },

  // Get All Purchase Orders
  getPurchaseOrders: async (params) => {
    const response = await api.get('/purchase-orders', { params });
    return response.data;
  },

  // Get Purchase Order by ID
  getPurchaseOrderById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },

  // Approve Purchase Order
  approvePurchaseOrder: async (id) => {
    const response = await api.put(`/purchase-orders/${id}/approve`);
    return response.data;
  },

  // Reject Purchase Order
  rejectPurchaseOrder: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}/reject`, data);
    return response.data;
  },

  // Send to Supplier
  sendToSupplier: async (id) => {
    const response = await api.put(`/purchase-orders/${id}/send`);
    return response.data;
  },

  // Receive Goods
  receiveGoods: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}/receive`, data);
    return response.data;
  },

  // Update Payment Status
  updatePaymentStatus: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}/payment`, data);
    return response.data;
  },

  // Cancel Purchase Order
  cancelPurchaseOrder: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}/cancel`, data);
    return response.data;
  },

  // Get Pending Purchase Orders
  getPendingOrders: async (branchId) => {
    const response = await api.get('/purchase-orders', {
      params: { branchId, status: 'pending' },
    });
    return response.data;
  },

  // Get Purchase Orders by Supplier
  getOrdersBySupplier: async (supplierId) => {
    const response = await api.get('/purchase-orders', {
      params: { supplierId },
    });
    return response.data;
  },

  // Get Purchase Orders by Date Range
  getOrdersByDateRange: async (startDate, endDate) => {
    const response = await api.get('/purchase-orders', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default purchaseOrderService;
