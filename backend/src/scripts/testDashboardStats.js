import axios from 'axios';

const testDashboardStats = async () => {
  try {
    console.log('Logging in as Super Admin (admin@groceryos.com)...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@groceryos.com',
      password: 'Admin@123',
    });

    const token = loginRes.data?.data?.tokens?.accessToken;
    console.log('Login OK! Token received:', Boolean(token));

    console.log('\nTesting GET /api/v1/dashboard/stats...');
    const statsRes = await axios.get('http://localhost:5000/api/v1/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Dashboard Stats Status:', statsRes.status);
    console.log('Dashboard Stats Response:', statsRes.data);

    console.log('\nTesting GET /api/dashboard/stats (alias mount)...');
    const statsRes2 = await axios.get('http://localhost:5000/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Dashboard Stats Alias Status:', statsRes2.status);
    console.log('Dashboard Stats Alias Response:', statsRes2.data?.success);

    console.log('\nDASHBOARD STATS ENDPOINT IS FULLY WORKING! ✅');
  } catch (error) {
    console.error('Test Failed:', error.response?.status, error.response?.data || error.message);
  }
};

testDashboardStats();
