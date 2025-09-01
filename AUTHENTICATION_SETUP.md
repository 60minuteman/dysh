# Authentication Setup Guide

## Overview
This guide will help you configure Apple and Google Sign-In for your Dysh app.

## 1. Google Sign-In Setup

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

### Step 2: Create OAuth Client IDs
Create **3 separate** OAuth client IDs:

#### Web Client ID (for backend verification)
- Application type: **Web application**
- Name: `Dysh Web Client`
- Copy the **Client ID** - this goes in `config.ts` as `GOOGLE_WEB_CLIENT_ID`

#### iOS Client ID
- Application type: **iOS**
- Name: `Dysh iOS`
- Bundle ID: `com.dysh.app`
- Copy the **Client ID** - this goes in `config.ts` as `GOOGLE_IOS_CLIENT_ID`

#### Android Client ID (if supporting Android)
- Application type: **Android**
- Name: `Dysh Android`
- Package name: `com.dysh.app`
- SHA-1 certificate fingerprint: (get from your keystore)

### Step 3: Update Configuration
Update `lib/config.ts`:
```typescript
export const config = {
  API_BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-api.com/api',
  
  // Replace with your actual Google Client IDs
  GOOGLE_WEB_CLIENT_ID: 'your-web-client-id.apps.googleusercontent.com',
  GOOGLE_IOS_CLIENT_ID: 'your-ios-client-id.apps.googleusercontent.com',
  
  APPLE_CLIENT_ID: 'com.dysh.app',
};
```

## 2. Apple Sign-In Setup

### Step 1: Apple Developer Account
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple Developer account

### Step 2: App ID Configuration
1. Go to "Certificates, Identifiers & Profiles"
2. Select "Identifiers" → "App IDs"
3. Find your app ID (`com.dysh.app`) or create new one
4. Enable "Sign In with Apple" capability
5. Save the configuration

### Step 3: Xcode Configuration (for iOS builds)
1. Open your project in Xcode
2. Select your target
3. Go to "Signing & Capabilities"
4. Add "Sign In with Apple" capability

### Step 4: Backend Configuration (if needed)
If your backend needs to verify Apple tokens server-side:
1. Create a Service ID in Apple Developer Portal
2. Create a private key for Sign in with Apple
3. Configure your backend with these credentials

## 3. Backend Configuration

### Update your NestJS backend config:
```typescript
// In your .env file
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

APPLE_CLIENT_ID=com.dysh.app
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----"
```

## 4. Testing

### iOS Testing
1. Build and run on iOS device or simulator
2. Test Apple Sign-In (only works on device for production)
3. Test Google Sign-In

### Android Testing
1. Build and run on Android device or emulator
2. Test Google Sign-In
3. Apple Sign-In is not available on Android

## 5. Production Deployment

### iOS App Store
1. Ensure Apple Sign-In is properly configured
2. Test on physical device
3. Submit for App Store review

### Google Play Store
1. Upload your release APK to Google Play Console
2. Get the SHA-1 fingerprint from Play Console
3. Add this fingerprint to your Google Cloud Console OAuth client

## 6. Troubleshooting

### Common Issues

#### Google Sign-In Issues
- **"Developer Error"**: Check that your SHA-1 fingerprint is correct
- **"Network Error"**: Verify your Google Client IDs are correct
- **"Sign in cancelled"**: User cancelled the flow (normal behavior)

#### Apple Sign-In Issues
- **"Not available"**: Apple Sign-In only works on iOS 13+ and physical devices for production
- **"Invalid client"**: Check your bundle identifier matches Apple Developer Portal

#### Backend Issues
- **Token verification fails**: Ensure your backend has correct Google/Apple credentials
- **CORS errors**: Configure CORS properly for your mobile app

### Debug Steps
1. Check console logs for detailed error messages
2. Verify all configuration values are correct
3. Test on physical devices, not just simulators
4. Ensure your backend is running and accessible

## 7. Security Notes

- Never commit your Google Client Secret or Apple Private Key to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys and certificates
- Implement proper token validation on your backend

## 8. Next Steps

After authentication is working:
1. Test the complete onboarding flow
2. Implement proper error handling
3. Add loading states and user feedback
4. Test token refresh functionality
5. Implement logout functionality 