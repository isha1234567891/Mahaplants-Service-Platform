// Test signup endpoint directly
const testSignup = async () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPass123!',
    phone: '1234567890'
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Signup successful:', data);
    } else {
      console.log('❌ Signup failed:', data);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

testSignup();