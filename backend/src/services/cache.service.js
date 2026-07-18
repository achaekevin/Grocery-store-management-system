import redisClient from '../config/redis.js';

class CacheService {
  constructor() {
    this.defaultTTL = 3600; // 1 hour
  }

  /**
   * Get cached data
   */
  async get(key) {
    try {
      if (!redisClient.isConnected) return null;
      return await redisClient.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cached data
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      if (!redisClient.isConnected) return false;
      return await redisClient.set(key, value, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete cached data
   */
  async del(key) {
    try {
      if (!redisClient.isConnected) return false;
      return await redisClient.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async delPattern(pattern) {
    try {
      if (!redisClient.isConnected) return false;
      return await redisClient.deletePattern(pattern);
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    try {
      if (!redisClient.isConnected) return false;
      const result = await redisClient.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Cache dashboard statistics
   */
  async cacheDashboardStats(tenantId, branchId, data) {
    const key = `dashboard:${tenantId}:${branchId || 'all'}`;
    return this.set(key, data, 300); // 5 minutes
  }

  async getDashboardStats(tenantId, branchId) {
    const key = `dashboard:${tenantId}:${branchId || 'all'}`;
    return this.get(key);
  }

  /**
   * Cache product data
   */
  async cacheProduct(productId, data) {
    const key = `product:${productId}`;
    return this.set(key, data, 1800); // 30 minutes
  }

  async getProduct(productId) {
    const key = `product:${productId}`;
    return this.get(key);
  }

  async invalidateProduct(productId) {
    const key = `product:${productId}`;
    return this.del(key);
  }

  /**
   * Cache business settings
   */
  async cacheBusinessSettings(tenantId, data) {
    const key = `settings:${tenantId}`;
    return this.set(key, data, 7200); // 2 hours
  }

  async getBusinessSettings(tenantId) {
    const key = `settings:${tenantId}`;
    return this.get(key);
  }

  async invalidateBusinessSettings(tenantId) {
    const key = `settings:${tenantId}`;
    return this.del(key);
  }

  /**
   * Cache user permissions
   */
  async cacheUserPermissions(userId, data) {
    const key = `permissions:${userId}`;
    return this.set(key, data, 3600); // 1 hour
  }

  async getUserPermissions(userId) {
    const key = `permissions:${userId}`;
    return this.get(key);
  }

  async invalidateUserPermissions(userId) {
    const key = `permissions:${userId}`;
    return this.del(key);
  }

  /**
   * Cache report summaries
   */
  async cacheReportSummary(reportType, tenantId, params, data) {
    const paramsKey = JSON.stringify(params);
    const key = `report:${reportType}:${tenantId}:${Buffer.from(paramsKey).toString('base64')}`;
    return this.set(key, data, 1800); // 30 minutes
  }

  async getReportSummary(reportType, tenantId, params) {
    const paramsKey = JSON.stringify(params);
    const key = `report:${reportType}:${tenantId}:${Buffer.from(paramsKey).toString('base64')}`;
    return this.get(key);
  }

  /**
   * Cache frequently accessed products
   */
  async cacheFrequentProducts(tenantId, branchId, data) {
    const key = `frequent:products:${tenantId}:${branchId}`;
    return this.set(key, data, 600); // 10 minutes
  }

  async getFrequentProducts(tenantId, branchId) {
    const key = `frequent:products:${tenantId}:${branchId}`;
    return this.get(key);
  }

  /**
   * Invalidate all cache for tenant
   */
  async invalidateTenant(tenantId) {
    await this.delPattern(`*:${tenantId}:*`);
    await this.delPattern(`*:${tenantId}`);
  }

  /**
   * Invalidate all cache for branch
   */
  async invalidateBranch(tenantId, branchId) {
    await this.delPattern(`*:${tenantId}:${branchId}*`);
  }
}

export default new CacheService();
