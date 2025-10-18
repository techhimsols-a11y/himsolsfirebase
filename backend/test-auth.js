const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for cookies
});

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  mobile: '+91-9876543210'
};

const adminUser = {
  email: 'admin@ecoroots.com',
  password: 'admin123'
};

async function testAuth() {
  console.log('🧪 Testing JWT Authentication System\n');

  try {
    // Test 1: Register new user
    console.log('1. Testing User Registration...');
    const registerResponse = await API.post('/auth/register', testUser);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.data.user.id);
    console.log('Role:', registerResponse.data.data.user.role);
    console.log('Cookies set:', registerResponse.headers['set-cookie'] ? 'Yes' : 'No');
    console.log('');

    // Test 2: Login with regular user
    console.log('2. Testing User Login...');
    const loginResponse = await API.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('User role:', loginResponse.data.data.user.role);
    console.log('Cookies set:', loginResponse.headers['set-cookie'] ? 'Yes' : 'No');
    console.log('');

    // Test 3: Get user profile (authenticated)
    console.log('3. Testing Get Profile (Authenticated)...');
    const profileResponse = await API.get('/auth/profile');
    console.log('✅ Profile retrieved successfully');
    console.log('User name:', profileResponse.data.data.user.name);
    console.log('User email:', profileResponse.data.data.user.email);
    console.log('');

    // Test 4: Admin login
    console.log('4. Testing Admin Login...');
    const adminLoginResponse = await API.post('/auth/admin/login', adminUser);
    console.log('✅ Admin login successful:', adminLoginResponse.data.message);
    console.log('Admin role:', adminLoginResponse.data.data.user.role);
    console.log('');

    // Test 5: Access admin dashboard
    console.log('5. Testing Admin Dashboard Access...');
    const dashboardResponse = await API.get('/admin/dashboard');
    console.log('✅ Admin dashboard accessed successfully');
    console.log('Total users:', dashboardResponse.data.data.stats.totalUsers);
    console.log('Total orders:', dashboardResponse.data.data.stats.totalOrders);
    console.log('Total trees:', dashboardResponse.data.data.stats.totalTrees);
    console.log('');

    // Test 6: Test refresh token
    console.log('6. Testing Token Refresh...');
    const refreshResponse = await API.post('/auth/refresh');
    console.log('✅ Token refresh successful:', refreshResponse.data.message);
    console.log('New cookies set:', refreshResponse.headers['set-cookie'] ? 'Yes' : 'No');
    console.log('');

    // Test 7: Logout
    console.log('7. Testing Logout...');
    const logoutResponse = await API.post('/auth/logout');
    console.log('✅ Logout successful:', logoutResponse.data.message);
    console.log('');

    // Test 8: Try to access protected route after logout
    console.log('8. Testing Protected Route After Logout...');
    try {
      await API.get('/auth/profile');
      console.log('❌ Should have failed - profile accessible after logout');
    } catch (error) {
      console.log('✅ Correctly blocked - profile not accessible after logout');
      console.log('Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 9: Test invalid login
    console.log('9. Testing Invalid Login...');
    try {
      await API.post('/auth/login', {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed - invalid credentials accepted');
    } catch (error) {
      console.log('✅ Correctly rejected invalid credentials');
      console.log('Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 10: Test admin access with regular user
    console.log('10. Testing Admin Access with Regular User...');
    // First login as regular user
    await API.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    try {
      await API.get('/admin/dashboard');
      console.log('❌ Should have failed - regular user accessed admin dashboard');
    } catch (error) {
      console.log('✅ Correctly blocked - regular user cannot access admin dashboard');
      console.log('Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 All authentication tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAuth(); 