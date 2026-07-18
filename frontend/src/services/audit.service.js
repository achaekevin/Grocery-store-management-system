import api from './api';

const auditService = {
  // Get all activities
  getActivities: async (params) => {
    const response = await api.get('/audit', { params });
    return response.data;
  },

  // Get activity by ID
  getActivityById: async (id) => {
    const response = await api.get(`/audit/${id}`);
    return response.data;
  },

  // Get activities by user
  getActivitiesByUser: async (userId, params) => {
    const response = await api.get(`/audit/user/${userId}`, { params });
    return response.data;
  },

  // Get activities by entity
  getActivitiesByEntity: async (entityType, entityId) => {
    const response = await api.get(`/audit/entity/${entityType}/${entityId}`);
    return response.data;
  },

  // Get activity statistics
  getActivityStats: async (params) => {
    const response = await api.get('/audit/stats', { params });
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 20) => {
    const response = await api.get('/audit', { params: { limit } });
    return response.data;
  },
};

export default auditService;
