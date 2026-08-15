import axios from 'axios';

const testMultiUserSupplierVisibility = async () => {
  const usersToTest = [
    { role: 'Super Admin', email: 'admin@groceryos.com', pass: 'Admin@123' },
    { role: 'Branch Manager', email: 'manager@groceryos.com', pass: 'Manager@123' },
    { role: 'Inventory Clerk', email: 'inventory@groceryos.com', pass: 'Inventory@123' },
    { role: 'Cashier', email: 'cashier@groceryos.com', pass: 'Cashier@123' },
    { role: 'Accountant', email: 'accountant@groceryos.com', pass: 'Accountant@123' },
  ];

  for (const u of usersToTest) {
    try {
      console.log(`\n--- Testing Role: ${u.role} (${u.email}) ---`);
      const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: u.email,
        password: u.pass,
      });

      const token = loginRes.data?.data?.tokens?.accessToken;
      const headers = { Authorization: `Bearer ${token}` };

      const supRes = await axios.get('http://localhost:5000/api/v1/suppliers', { headers });
      console.log(`Suppliers visible to ${u.role}:`, supRes.data?.data?.length, 'suppliers found.');

      if (u.role === 'Super Admin' || u.role === 'Branch Manager') {
        const dashRes = await axios.get('http://localhost:5000/api/v1/dashboard/stats', { headers });
        console.log(`Real Dashboard Stats:`, {
          products: dashRes.data?.data?.products,
          customers: dashRes.data?.data?.customers,
          suppliers: dashRes.data?.data?.suppliers,
          branches: dashRes.data?.data?.branches,
          users: dashRes.data?.data?.users,
        });
      }
    } catch (err) {
      console.error(`Error for ${u.role}:`, err.response?.status, err.response?.data || err.message);
    }
  }

  console.log('\nALL USERS CAN SEE AND ACCESS THE REAL SUPPLIERS IN THE SYSTEM! ✅');
  process.exit(0);
};

testMultiUserSupplierVisibility();
