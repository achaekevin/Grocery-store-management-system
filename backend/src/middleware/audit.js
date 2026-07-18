import { logActivity } from '../controllers/audit.controller.js';

/**
 * Middleware to log activities
 */
export const auditLog = (activityType, entityType) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      // Log activity after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const activityData = {
          tenantId: req.user?.tenantId,
          userId: req.user?.id,
          activityType,
          entityType,
          entityId: data?.data?.id || req.params?.id,
          description: generateDescription(activityType, entityType, req),
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          metadata: {
            method: req.method,
            path: req.path,
            params: req.params,
            query: req.query,
          },
        };

        logActivity(activityData).catch(err => {
          console.error('Audit log error:', err);
        });
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Generate activity description
 */
const generateDescription = (activityType, entityType, req) => {
  const actions = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    login: 'logged in',
    logout: 'logged out',
    view: 'viewed',
    export: 'exported',
    import: 'imported',
  };

  const action = actions[activityType] || activityType;
  const entity = entityType || 'resource';
  const userName = req.user?.name || req.user?.email || 'User';

  return `${userName} ${action} ${entity}`;
};

/**
 * Log authentication activities
 */
export const logAuth = async (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (res.statusCode === 200 && data?.success) {
      const activityType = req.path.includes('login') ? 'login' : 
                          req.path.includes('logout') ? 'logout' : 
                          req.path.includes('register') ? 'register' : 'auth';

      const activityData = {
        tenantId: req.user?.tenantId || data?.data?.user?.tenantId,
        userId: req.user?.id || data?.data?.user?.id,
        activityType,
        entityType: 'user',
        entityId: req.user?.id || data?.data?.user?.id,
        description: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} successful`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      };

      logActivity(activityData).catch(err => {
        console.error('Auth log error:', err);
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

export default {
  auditLog,
  logAuth,
};
