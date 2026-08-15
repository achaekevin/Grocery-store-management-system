import sequelize from '../config/sequelize.js';

const checkRolePermissions = async () => {
  const [rows] = await sequelize.query(`
    SELECT r.name AS role_name, p.name AS permission_name 
    FROM roles r
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE p.name LIKE '%supplier%' OR p.name LIKE '%customer%' OR p.name LIKE '%user%'
    ORDER BY r.name, p.name
  `);
  console.log('Role Permissions for Suppliers/Customers/Users:', rows);
  process.exit(0);
};

checkRolePermissions();
