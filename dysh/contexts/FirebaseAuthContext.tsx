import { createContext, useContext, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../lib/supabase';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type User = {
  id: string;
  email: string;
  name: string | null;
  photo: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [_, response, promptAsync] = Google.useAuthRequest({
    clientId: '522917989786-u5si98hdtjnslv4hfmi65e8k5ikumji5.apps.googleusercontent.com',
    iosClientId: '522917989786-u5si98hdtjnslv4hfmi65e8k5ikumji5.apps.googleusercontent.com',
    androidClientId: '522917989786-u5si98hdtjnslv4hfmi65e8k5ikumji5.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: 'dysh',
      path: 'auth'
    })
  });

  useEffect(() => {
    console.log('Auth Response:', response);
    if (response?.type === 'success' && response.authentication) {
      console.log('Authentication successful:', response.authentication);
      fetchUserInfo(response.authentication.accessToken);
    } else if (response?.type === 'error') {
      console.error('Auth Error:', response.error);
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      console.log('Fetching user info with token:', token.substring(0, 10) + '...');
      
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch user info:', response.status, response.statusText);
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      console.log('User info received:', { 
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        // Omit photo URL from logs for privacy
      });
      
      const user: User = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        photo: userInfo.picture,
      };
      
      setUser(user);
      setLoading(false);

      console.log('Updating Supabase profile...');
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.name || '',
        email: user.email,
        avatar_url: user.photo || '',
        subscription_status: 'free'
      });

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Fetch user info error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google Sign In...');
      setLoading(true);
      
      const result = await promptAsync();
      console.log('Sign In Result:', result);
      
      if (result.type !== 'success') {
        console.log('Sign In not successful:', result.type);
        setLoading(false);
        throw new Error('Google Sign In was cancelled or failed');
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      setUser(null);
      // You might want to clear any stored tokens here
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 