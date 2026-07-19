import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function activateUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'groceryos_db',
  });

  try {
    // Update all users to set is_active = true
    const [result] = await connection.execute(
      `UPDATE users SET is_active = 1 WHERE email IN (?, ?, ?, ?, ?)`,
      [
        'admin@groceryos.com',
        'manager@groceryos.com',
        'cashier@groceryos.com',
        'inventory@groceryos.com',
        'accountant@groceryos.com',
      ]
    );

    console.log(`✅ Activated ${result.affectedRows} users`);

    // Verify
    const [users] = await connection.execute(
      `SELECT email, first_name, last_name, is_active FROM users WHERE email IN (?, ?, ?, ?, ?)`,
      [
        'admin@groceryos.com',
        'manager@groceryos.com',
        'cashier@groceryos.com',
        'inventory@groceryos.com',
        'accountant@groceryos.com',
      ]
    );

    console.log('\nUser Status:');
    users.forEach((user) => {
      console.log(`  ${user.email}: is_active = ${user.is_active}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

activateUsers();
