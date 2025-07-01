import * as AppleAuthentication from 'expo-apple-authentication';
// Commented out Google Sign-In for now - will enable when ready for Android
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { config } from './config';

const API_BASE_URL = config.API_BASE_URL;

// Commented out Google Sign-In configuration for now
// Configure Google Sign-In
// GoogleSignin.configure({
//   webClientId: config.GOOGLE_WEB_CLIENT_ID,
//   iosClientId: config.GOOGLE_IOS_CLIENT_ID,
//   offlineAccess: true,
// });

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    hasCompletedOnboarding: boolean;
  };
}

interface BackendAuthResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
  user: {
    id: string;
    email: string;
    hasCompletedOnboarding: boolean;
  };
}

// Keep this for internal consistency
interface AuthResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    onboarding_completed: boolean;
  };
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async initialize() {
    // Remove the aggressive token clearing - users should stay authenticated
    // Only clear tokens when explicitly requested (e.g., logout or manual reset)
    const tokens = await this.getStoredTokens();
    if (tokens) {
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      console.log('Auth service initialized with stored tokens');
    } else {
      console.log('Auth service initialized - no stored tokens found');
    }
  }

  async signInWithApple(): Promise<AuthTokens> {
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign In is only available on iOS');
      }

      // Check if Apple Sign In is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Sign In is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      console.log('Sending Apple Sign In request to backend...');

      // Send to your backend
      const response = await fetch(`${API_BASE_URL}/auth/apple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          email: credential.email,
          fullName: credential.fullName ? 
            `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() : 
            undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend auth error:', errorData);
        throw new Error(errorData.message || 'Apple sign-in failed');
      }

      const backendResponse: BackendAuthResponse = await response.json();
      
      console.log('Backend auth response:', {
        hasTokens: !!backendResponse.tokens,
        hasAccessToken: !!backendResponse.tokens?.accessToken,
        hasRefreshToken: !!backendResponse.tokens?.refreshToken,
        userEmail: backendResponse.user?.email,
        onboardingCompleted: backendResponse.user?.hasCompletedOnboarding
      });

      // Check if we have the required tokens
      if (!backendResponse.tokens?.accessToken) {
        throw new Error('No access token received from backend');
      }

      // Note: Some backends might not provide refresh tokens for certain auth methods
      // We'll handle this gracefully
      if (!backendResponse.tokens?.refreshToken) {
        console.warn('No refresh token received - user will need to re-authenticate when token expires');
      }

      // Map backend response to our internal format
      const authData: AuthResponse = {
        success: true,
        access_token: backendResponse.tokens.accessToken,
        refresh_token: backendResponse.tokens.refreshToken,
        user: {
          id: backendResponse.user.id,
          email: backendResponse.user.email,
          name: backendResponse.user.email, // Use email as name if no name provided
          onboarding_completed: backendResponse.user.hasCompletedOnboarding
        }
      };

      await this.storeTokens(authData);
      
      // Return in the expected format
      const tokens: AuthTokens = {
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.name,
          hasCompletedOnboarding: authData.user.onboarding_completed
        }
      };
      
      return tokens;
    } catch (error: any) {
      console.error('Apple Sign In error:', error);
      if (error.code === 'ERR_REQUEST_CANCELED') {
        throw new Error('Sign in was canceled');
      }
      throw new Error(error.message || 'Apple sign-in failed');
    }
  }

  // Commented out Google Sign-In for now - will enable when ready for Android
  // async signInWithGoogle(): Promise<AuthTokens> {
  //   try {
  //     // Check if device supports Google Play Services (Android)
  //     if (Platform.OS === 'android') {
  //       await GoogleSignin.hasPlayServices();
  //     }

  //     // Sign in with Google
  //     const userInfo = await GoogleSignin.signIn();

  //     if (!userInfo.idToken) {
  //       throw new Error('No ID token received from Google');
  //     }

  //     // Send to your backend
  //     const response = await fetch(`${API_BASE_URL}/auth/google`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         idToken: userInfo.idToken,
  //         accessToken: userInfo.serverAuthCode,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Google sign-in failed');
  //     }

  //     const authData: AuthResponse = await response.json();
  //     await this.storeTokens(authData);
      
  //     return authData;
  //   } catch (error: any) {
  //     console.error('Google Sign In error:', error);
      
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       throw new Error('Sign in was canceled');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       throw new Error('Sign in is already in progress');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       throw new Error('Google Play Services not available');
  //     }
      
  //     throw new Error(error.message || 'Google sign-in failed');
  //   }
  // }

  private async initStorage() {
    try {
      // Test if AsyncStorage is working
      await AsyncStorage.getItem('test_key');
    } catch (error) {
      console.warn('AsyncStorage initialization failed:', error);
      // Fallback to in-memory storage for development
      if (__DEV__) {
        console.log('Using fallback storage for development');
      }
    }
  }

  async storeTokens(authData: AuthResponse) {
    console.log('Storing tokens...', {
      hasAccessToken: !!authData.access_token,
      hasRefreshToken: !!authData.refresh_token,
      userEmail: authData.user?.email
    });
    
    const tokens: AuthTokens = {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      user: authData.user,
    };
    
    try {
      await this.initStorage();
      await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens));
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      
      console.log('Tokens stored successfully');
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw error;
    }
  }

  async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      await this.initStorage();
      const tokensJson = await AsyncStorage.getItem('auth_tokens');
      const tokens = tokensJson ? JSON.parse(tokensJson) : null;
      
      if (tokens) {
        console.log('Retrieved stored tokens:', {
          hasAccessToken: !!tokens.accessToken,
          hasRefreshToken: !!tokens.refreshToken,
          userEmail: tokens.user?.email
        });
      } else {
        console.log('No stored tokens found');
      }
      
      return tokens;
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      // In development, return null tokens
      if (__DEV__) {
        console.warn('Returning null tokens due to storage error in development mode');
        return null;
      }
      return null;
    }
  }

  async getAuthHeaders() {
    if (!this.accessToken) {
      const tokens = await this.getStoredTokens();
      if (tokens) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      } else {
        throw new Error('No access token available - please sign in again');
      }
    }

    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async refreshTokens(): Promise<AuthTokens> {
    if (!this.refreshToken) {
      // If no refresh token, force re-authentication
      await this.logout();
      throw new Error('No refresh token available - please sign in again');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken, // Use camelCase to match backend expectation
        }),
      });

      if (!response.ok) {
        // If refresh fails, clear tokens and throw error
        await this.logout();
        throw new Error('Token refresh failed - please sign in again');
      }

      const backendResponse: BackendAuthResponse = await response.json();
      
      // Map backend response to our internal format
      const authData: AuthResponse = {
        success: true,
        access_token: backendResponse.tokens.accessToken,
        refresh_token: backendResponse.tokens.refreshToken,
        user: {
          id: backendResponse.user.id,
          email: backendResponse.user.email,
          name: backendResponse.user.email, // Use email as name if no name provided
          onboarding_completed: backendResponse.user.hasCompletedOnboarding
        }
      };

      await this.storeTokens(authData);
      
      // Return in the expected format
      const tokens: AuthTokens = {
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.name,
          hasCompletedOnboarding: authData.user.onboarding_completed
        }
      };
      
      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.logout();
      throw new Error('Token refresh failed - please sign in again');
    }
  }

  async getCurrentUser(): Promise<AuthTokens['user'] | null> {
    const tokens = await this.getStoredTokens();
    return tokens?.user || null;
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getStoredTokens();
    return !!tokens?.accessToken;
  }

  async logout() {
    try {
      // Commented out Google Sign-In logout for now
      // Sign out from Google if signed in
      // if (Platform.OS === 'android' || Platform.OS === 'ios') {
      //   const isSignedIn = await GoogleSignin.isSignedIn();
      //   if (isSignedIn) {
      //     await GoogleSignin.signOut();
      //   }
      // }
    } catch (error) {
      console.error('Error signing out from Google:', error);
    }

    // Clear stored tokens
    await this.clearStoredTokens();
    this.accessToken = null;
    this.refreshToken = null;
  }

  async clearStoredTokens(): Promise<void> {
    try {
      await this.initStorage();
      await AsyncStorage.removeItem('auth_tokens');
    } catch (error) {
      console.error('Failed to clear stored tokens:', error);
      // In development, continue without error
      if (__DEV__) {
        console.warn('Could not clear tokens in development mode');
        return;
      }
    }
  }

  // Helper method to make authenticated API calls with automatic token refresh
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // If token expired, try to refresh and retry
      if (response.status === 401) {
        console.log('Token expired, attempting to refresh...');
        
        try {
          await this.refreshTokens();
          const newHeaders = await this.getAuthHeaders();
          
          console.log('Token refreshed, retrying request...');
          return fetch(url, {
            ...options,
            headers: {
              ...newHeaders,
              ...options.headers,
            },
          });
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Don't retry if refresh failed - user needs to sign in again
          throw new Error('Authentication expired - please sign in again');
        }
      }

      return response;
    } catch (error: any) {
      console.error('Authenticated fetch error:', error);
      
      // If it's an authentication error, provide clear user guidance
      if (error.message.includes('refresh token') || error.message.includes('sign in again')) {
        throw error;
      }
      
      throw new Error('Network request failed - please try again');
    }
  }

  // Method to force clear all authentication data (for testing/development)
  async clearAllAuthData() {
    console.log('🧹 Manually clearing all authentication data...');
    await this.clearStoredTokens();
    this.accessToken = null;
    this.refreshToken = null;
    console.log('✅ All authentication data cleared');
  }
}

export const authService = new AuthService(); 