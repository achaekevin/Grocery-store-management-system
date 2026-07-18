import api from './api';

const purchaseRequestService = {
  // Create Purchase Request
  createPurchaseRequest: async (data) => {
    const response = await api.post('/purchase-requests', data);
    return response.data;
  },

  // Get All Purchase Requests
  getPurchaseRequests: async (params) => {
    const response = await api.get('/purchase-requests', { params });
    return response.data;
  },

  // Get Purchase Request by ID
  getPurchaseRequestById: async (id) => {
    const response = await api.get(`/purchase-requests/${id}`);
    return response.data;
  },

  // Update Purchase Request
  updatePurchaseRequest: async (id, data) => {
    const response = await api.put(`/purchase-requests/${id}`, data);
    return response.data;
  },

  // Approve Purchase Request
  approvePurchaseRequest: async (id) => {
    const response = await api.put(`/purchase-requests/${id}/approve`);
    return response.data;
  },

  // Reject Purchase Request
  rejectPurchaseRequest: async (id, data) => {
    const response = await api.put(`/purchase-requests/${id}/reject`, data);
    return response.data;
  },

  // Cancel Purchase Request
  cancelPurchaseRequest: async (id, data) => {
    const response = await api.put(`/purchase-requests/${id}/cancel`, data);
    return response.data;
  },

  // Get Pending Requests
  getPendingRequests: async (branchId) => {
    const response = await api.get('/purchase-requests', {
      params: { branchId, status: 'pending' },
    });
    return response.data;
  },

  // Get Approved Requests
  getApprovedRequests: async (branchId) => {
    const response = await api.get('/purchase-requests', {
      params: { branchId, status: 'approved' },
    });
    return response.data;
  },

  // Get High Priority Requests
  getHighPriorityRequests: async (branchId) => {
    const response = await api.get('/purchase-requests', {
      params: { branchId, priority: 'high' },
    });
    return response.data;
  },
};

export default purchaseRequestService;
