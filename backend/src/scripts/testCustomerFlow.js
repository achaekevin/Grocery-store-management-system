import axios from 'axios';

const testCustomerAuthAndAPIs = async () => {
  try {
    console.log('Testing Customer Login (customer@test.com / Customer@123)...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'customer@test.com',
      password: 'Customer@123',
    });

    console.log('Login Response status:', loginRes.status);
    console.log('User Role:', loginRes.data?.data?.user?.role?.name || loginRes.data?.data?.user?.role);
    console.log('Token received:', Boolean(loginRes.data?.data?.tokens?.accessToken));

    const token = loginRes.data?.data?.tokens?.accessToken;

    console.log('\nTesting GET /api/v1/customer/dashboard...');
    const dashRes = await axios.get('http://localhost:5000/api/v1/customer/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Dashboard Data Success:', dashRes.data?.success);
    console.log('Loyalty Tier:', dashRes.data?.data?.loyalty?.tier);
    console.log('Loyalty Points:', dashRes.data?.data?.loyalty?.points);
    console.log('Branches Count:', dashRes.data?.data?.branches?.length);

    console.log('\nTesting GET /api/v1/customer/products...');
    const prodRes = await axios.get('http://localhost:5000/api/v1/customer/products');
    console.log('Products Count:', prodRes.data?.data?.length);
    console.log('Sample Product:', prodRes.data?.data?.[0]?.name, 'KSh', prodRes.data?.data?.[0]?.price);

    console.log('\nTesting GET /api/v1/customer/coupons...');
    const coupRes = await axios.get('http://localhost:5000/api/v1/customer/coupons');
    console.log('Coupons Count:', coupRes.data?.data?.length);

    console.log('\nTesting POST /api/v1/customer/orders...');
    const orderRes = await axios.post(
      'http://localhost:5000/api/v1/customer/orders',
      {
        items: [{ productId: 1, name: 'Fresh Whole Milk 1L', quantity: 2, price: 120 }],
        deliveryType: 'Delivery',
        branchName: 'Kisii Main Branch',
        deliveryAddress: 'Milimani Estate, Kisii',
        paymentMethod: 'M-Pesa',
        mpesaPhone: '0712345678',
        subtotal: 240,
        discount: 0,
        deliveryFee: 100,
        total: 340,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Order Placement Status:', orderRes.status);
    console.log('Order ID:', orderRes.data?.data?.id);
    console.log('Order Points Earned:', orderRes.data?.data?.pointsEarned);

    console.log('\nALL CUSTOMER BACKEND APIS WORKING PERFECTLY! ✅');
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
};

testCustomerAuthAndAPIs();
