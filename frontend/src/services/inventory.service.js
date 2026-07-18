import api from './api';

const inventoryService = {
  // Stock In
  stockIn: async (data) => {
    const response = await api.post('/inventory/stock-in', data);
    return response.data;
  },

  // Stock Out
  stockOut: async (data) => {
    const response = await api.post('/inventory/stock-out', data);
    return response.data;
  },

  // Adjust Inventory
  adjustInventory: async (data) => {
    const response = await api.post('/inventory/adjust', data);
    return response.data;
  },

  // Record Damaged Stock
  recordDamage: async (data) => {
    const response = await api.post('/inventory/damage', data);
    return response.data;
  },

  // Record Expired Stock
  recordExpired: async (data) => {
    const response = await api.post('/inventory/expired', data);
    return response.data;
  },

  // Get Inventory History
  getHistory: async (params) => {
    const response = await api.get('/inventory/history', { params });
    return response.data;
  },

  // Get Low Stock Items
  getLowStock: async (params) => {
    const response = await api.get('/inventory/low-stock', { params });
    return response.data;
  },

  // Get Inventory by Branch
  getByBranch: async (branchId) => {
    const response = await api.get('/inventory', { params: { branchId } });
    return response.data;
  },

  // Get Inventory by Product
  getByProduct: async (productId) => {
    const response = await api.get('/inventory', { params: { productId } });
    return response.data;
  },
};

export default inventoryService;
