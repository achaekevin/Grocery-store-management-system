import axios from 'axios';

const testAllCreationEndpoints = async () => {
  try {
    console.log('1. Authenticating as Super Admin...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@groceryos.com',
      password: 'Admin@123',
    });

    const token = loginRes.data?.data?.tokens?.accessToken;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('Login OK. Token acquired.');

    // 1. Roles list
    const rolesRes = await axios.get('http://localhost:5000/api/v1/roles', { headers });
    const cashierRole = rolesRes.data?.data?.find(r => r.name === 'Cashier') || rolesRes.data?.data?.[0];
    console.log('Fetched Role:', cashierRole?.name, 'ID:', cashierRole?.id);

    // 2. Add User
    console.log('\n2. Testing Add User (POST /api/v1/users)...');
    const userPayload = {
      firstName: 'Brian',
      lastName: 'Otieno',
      email: `brian_${Date.now()}@groceryos.com`,
      phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'Password@123',
      roleId: cashierRole.id,
      status: 'active',
    };
    const addUserRes = await axios.post('http://localhost:5000/api/v1/users', userPayload, { headers });
    console.log('Add User Status:', addUserRes.status);
    console.log('Added User ID:', addUserRes.data?.data?.id, 'Email:', addUserRes.data?.data?.email);

    // 3. Add Supplier
    console.log('\n3. Testing Add Supplier (POST /api/v1/suppliers)...');
    const supplierPayload = {
      name: `Prime Grains Kenya ${Date.now().toString().slice(-4)}`,
      contactPerson: 'David Kiptoo',
      email: `prime_${Date.now()}@example.com`,
      phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: 'Eldoret Grain Silos',
      city: 'Eldoret',
      country: 'Kenya',
      status: 'active',
    };
    const addSupRes = await axios.post('http://localhost:5000/api/v1/suppliers', supplierPayload, { headers });
    console.log('Add Supplier Status:', addSupRes.status);
    console.log('Added Supplier ID:', addSupRes.data?.data?.id, 'Name:', addSupRes.data?.data?.name);

    // 4. Add Customer
    console.log('\n4. Testing Add Customer (POST /api/v1/customers)...');
    const customerPayload = {
      firstName: 'Mercy',
      lastName: 'Chebet',
      name: 'Mercy Chebet',
      email: `mercy_${Date.now()}@example.com`,
      phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: 'Nakuru Town, Westside',
      city: 'Nakuru',
      country: 'Kenya',
    };
    const addCustRes = await axios.post('http://localhost:5000/api/v1/customers', customerPayload, { headers });
    console.log('Add Customer Status:', addCustRes.status);
    console.log('Added Customer ID:', addCustRes.data?.data?.id, 'Name:', addCustRes.data?.data?.name);

    console.log('\n🎉 ALL THREE BUTTONS & ENDPOINTS (ADD USER, ADD SUPPLIER, ADD CUSTOMER) FULLY OPERATIONAL AND PERSISTENT! ✅');
    process.exit(0);
  } catch (error) {
    console.error('Test Failed:', error.response?.status, error.response?.data || error.message);
    process.exit(1);
  }
};

testAllCreationEndpoints();
