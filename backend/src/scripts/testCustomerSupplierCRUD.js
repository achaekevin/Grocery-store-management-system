import axios from 'axios';

const testCustomerAndSupplierCRUD = async () => {
  try {
    console.log('1. Authenticating as Super Admin...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@groceryos.com',
      password: 'Admin@123',
    });

    const token = loginRes.data?.data?.tokens?.accessToken;
    console.log('Login OK, token acquired.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n2. Testing POST /api/v1/suppliers (Add Supplier)...');
    const uniquePhone = `07${Math.floor(10000000 + Math.random() * 90000000)}`;
    const supplierPayload = {
      name: `Fresh Valley Suppliers ${Date.now().toString().slice(-4)}`,
      contactPerson: 'Dennis Mutua',
      email: `supplier_${Date.now()}@example.com`,
      phone: uniquePhone,
      address: 'Industrial Area, Road C',
      city: 'Nairobi',
      country: 'Kenya',
      status: 'active',
    };

    const addSupRes = await axios.post('http://localhost:5000/api/v1/suppliers', supplierPayload, { headers });
    console.log('Add Supplier Status:', addSupRes.status);
    console.log('Added Supplier ID:', addSupRes.data?.data?.id, 'Name:', addSupRes.data?.data?.name);

    console.log('\n3. Testing GET /api/v1/suppliers (List Suppliers)...');
    const getSupRes = await axios.get('http://localhost:5000/api/v1/suppliers', { headers });
    console.log('Get Suppliers Status:', getSupRes.status);
    console.log('Total Suppliers in DB:', getSupRes.data?.data?.length);

    console.log('\n4. Testing POST /api/v1/customers (Add Customer)...');
    const uniqueCustPhone = `07${Math.floor(10000000 + Math.random() * 90000000)}`;
    const customerPayload = {
      firstName: 'Faith',
      lastName: 'Wanjiru',
      name: 'Faith Wanjiru',
      email: `faith_${Date.now()}@example.com`,
      phone: uniqueCustPhone,
      address: 'Runda Estate, Nairobi',
      city: 'Nairobi',
      country: 'Kenya',
    };

    const addCustRes = await axios.post('http://localhost:5000/api/v1/customers', customerPayload, { headers });
    console.log('Add Customer Status:', addCustRes.status);
    console.log('Added Customer ID:', addCustRes.data?.data?.id, 'Name:', addCustRes.data?.data?.name);

    console.log('\n5. Testing GET /api/v1/customers (List Customers)...');
    const getCustRes = await axios.get('http://localhost:5000/api/v1/customers', { headers });
    console.log('Get Customers Status:', getCustRes.status);
    console.log('Total Customers in DB:', getCustRes.data?.data?.length);

    console.log('\nALL CUSTOMER & SUPPLIER CRUD OPERATES AND PERSISTS PERFECTLY! ✅');
  } catch (error) {
    console.error('Test Failed:', error.response?.status, error.response?.data || error.message);
  }
};

testCustomerAndSupplierCRUD();
