const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHNud2xzMzAwMDAwZGIwaW5lZ21ycDY1cSIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDkzNzEwNzUsImV4cCI6MTc0OTQ1NzQ3NX0._GigWTC6fxAsM6XQD45nPt58O-55FYV6vTXQNwo64GM";
const API_BASE_URL = "http://localhost:3000";

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function testDailyRecipeEndpoints() {
  console.log("🧪 Testing Daily Recipe API Endpoints");
  console.log("=====================================\n");

  // Test 1: GET /api/daily-recipes
  console.log("📊 1. Testing GET /api/daily-recipes");
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-recipes?limit=10&offset=0`, {
      method: 'GET',
      headers: headers
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log(`✅ Success: Found ${data.recipes?.length || 0} daily recipes`);
      console.log(`📈 Total Count: ${data.totalCount || 0}`);
    } else {
      console.log(`❌ Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  console.log("\n" + "-".repeat(50) + "\n");

  // Test 2: POST /api/daily-recipes/generate
  console.log("🔄 2. Testing POST /api/daily-recipes/generate");
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-recipes/generate`, {
      method: 'POST',
      headers: headers
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log(`✅ Success: ${data.message || 'Daily recipes generated'}`);
    } else {
      console.log(`❌ Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  console.log("\n" + "-".repeat(50) + "\n");

  // Test 3: GET /api/daily-recipes (after generation)
  console.log("📊 3. Testing GET /api/daily-recipes (after generation)");
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-recipes?limit=10&offset=0`, {
      method: 'GET',
      headers: headers
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log(`✅ Success: Found ${data.recipes?.length || 0} daily recipes`);
      if (data.recipes && data.recipes.length > 0) {
        console.log("📝 Sample Recipe Structure:");
        console.log(JSON.stringify(data.recipes[0], null, 2));
      }
    } else {
      console.log(`❌ Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  console.log("\n" + "-".repeat(50) + "\n");

  // Test 4: GET /api/daily-recipes/category/{category}
  const categories = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  for (const category of categories) {
    console.log(`🍽️  4.${categories.indexOf(category) + 1} Testing GET /api/daily-recipes/category/${category}`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-recipes/category/${category}`, {
        method: 'GET',
        headers: headers
      });
      
      console.log(`Status: ${response.status}`);
      const data = await response.json();
      console.log("Response:", JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log(`✅ Success: Found ${data.recipes?.length || 0} ${category} recipes`);
      } else {
        console.log(`❌ Error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log("\n" + "-".repeat(30) + "\n");
  }

  console.log("🏁 Daily Recipe API Testing Complete!");
}

// Run the tests
testDailyRecipeEndpoints().catch(console.error); 