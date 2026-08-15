import axios from 'axios';

const testAllLogins = async () => {
  const accounts = [
    { email: 'admin@groceryos.com', pass: 'Admin@123', name: 'Super Admin' },
    { email: 'customer@test.com', pass: 'Customer@123', name: 'Customer' },
    { email: 'manager@groceryos.com', pass: 'Manager@123', name: 'Branch Manager' },
    { email: 'cashier@groceryos.com', pass: 'Cashier@123', name: 'Cashier' },
  ];

  for (const acc of accounts) {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: acc.email,
        password: acc.pass,
      });
      console.log(`✅ [${acc.name}] Login OK:`, res.data?.data?.user?.email, 'Role:', res.data?.data?.role?.name || res.data?.data?.user?.role?.name);
    } catch (err) {
      console.log(`❌ [${acc.name}] Login Failed:`, err.response?.data?.message || err.message);
    }
  }
};

testAllLogins();
