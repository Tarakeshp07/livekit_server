const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/users';

// Test data
const testUser = {
    username: 'test_user_' + Date.now(),
    password: 'testpassword123',
    role: 'user',
    age: 25,
    healthConditions: ['diabetes', 'hypertension'],
    sleepData: 8,
    institutionName: 'Test University',
    email: `test_${Date.now()}@example.com`
};

async function testAPI() {
    console.log('🚀 Starting API Tests...\n');

    try {
        // Test 1: Create User
        console.log('1. Testing CREATE user...');
        const createResponse = await axios.post(BASE_URL, testUser);
        console.log('✅ User created successfully');
        console.log('User ID:', createResponse.data.data._id);
        const userId = createResponse.data.data._id;
        console.log('');

        // Test 2: Get User by ID
        console.log('2. Testing GET user by ID...');
        const getResponse = await axios.get(`${BASE_URL}/${userId}`);
        console.log('✅ User retrieved successfully');
        console.log('Username:', getResponse.data.data.username);
        console.log('');

        // Test 3: Update User
        console.log('3. Testing UPDATE user...');
        const updateData = {
            age: 26,
            sleepData: 9,
            healthConditions: ['diabetes']
        };
        const updateResponse = await axios.put(`${BASE_URL}/${userId}`, updateData);
        console.log('✅ User updated successfully');
        console.log('Updated age:', updateResponse.data.data.age);
        console.log('');

        // Test 4: Get All Users
        console.log('4. Testing GET all users...');
        const getAllResponse = await axios.get(BASE_URL);
        console.log('✅ Users retrieved successfully');
        console.log('Total users:', getAllResponse.data.pagination.totalUsers);
        console.log('');

        // Test 5: Search Users
        console.log('5. Testing SEARCH users...');
        const searchResponse = await axios.get(`${BASE_URL}/search?q=test`);
        console.log('✅ Search completed successfully');
        console.log('Search results:', searchResponse.data.pagination.totalUsers);
        console.log('');

        // Test 6: Get User Statistics
        console.log('6. Testing GET user statistics...');
        const statsResponse = await axios.get(`${BASE_URL}/stats`);
        console.log('✅ Statistics retrieved successfully');
        console.log('Total users:', statsResponse.data.data.totalUsers);
        console.log('Admin users:', statsResponse.data.data.adminUsers);
        console.log('Average age:', statsResponse.data.data.averageAge);
        console.log('');

        // Test 7: Delete User
        console.log('7. Testing DELETE user...');
        const deleteResponse = await axios.delete(`${BASE_URL}/${userId}`);
        console.log('✅ User deleted successfully');
        console.log('Deleted user:', deleteResponse.data.data.username);
        console.log('');

        console.log('🎉 All tests passed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status === 404) {
            console.log('Make sure the server is running on http://localhost:3000');
        }
    }
}

// Run tests
testAPI();
