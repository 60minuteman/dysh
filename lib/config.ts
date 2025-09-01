// Configuration for the app
const isDevelopment = __DEV__;

// Log the current environment
console.log(`🔧 Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
console.log(`🔧 API Base URL: ${isDevelopment ? 'https://b7df649914bb.ngrok-free.app' : 'https://dysh-backend-2oo3.onrender.com'}`);

export const config = {
  // Environment
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: !isDevelopment,
  
  // Backend API Configuration
  API_BASE_URL: isDevelopment 
    ? 'https://b7df649914bb.ngrok-free.app' // Development (ngrok)
    : 'https://dysh-backend-2oo3.onrender.com', // Production
  
  // Google Sign-In Configuration
  // Get these from Google Cloud Console
  GOOGLE_WEB_CLIENT_ID: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
  GOOGLE_IOS_CLIENT_ID: 'YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com',
  
  // Apple Sign-In Configuration
  APPLE_CLIENT_ID: 'com.dysh.app', // Your app bundle identifier
  
  // RevenueCat Configuration
  REVENUECAT_API_KEY_IOS: 'YOUR_REVENUECAT_IOS_API_KEY',
  REVENUECAT_API_KEY_ANDROID: 'YOUR_REVENUECAT_ANDROID_API_KEY',
  
  // RevenueCat Entitlements
  ENTITLEMENTS: {
    PREMIUM: 'premium',
    PRO: 'pro'
  }
}; 