import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { OTPInput, OTPInputRef } from '../../components/OTPInput';
import { apiService } from '../../lib/api';
import { authService } from '../../lib/auth';

export default function OTP() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const otpInputRef = useRef<OTPInputRef>(null);

  // Get email from route params
  useEffect(() => {
    if (params.email && typeof params.email === 'string') {
      setEmail(params.email);
    }
  }, [params.email]);

  // Listen for keyboard show/hide events
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleOtpComplete = (otpString: string) => {
    // Auto-verify when OTP is complete
    handleVerify();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please go back and try again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Verifying OTP:', otpString, 'for email:', email);
      
      // Verify OTP with the API
      const response = await apiService.verifyOTP(email, otpString);
      
      console.log('OTP verification response:', JSON.stringify(response, null, 2));
      
      if (response.userExists) {
        // Existing user - log them in and navigate to main app
        console.log('Existing user - logging in');
        console.log('Response token:', response.token);
        console.log('Response tokens:', response.tokens);
        console.log('Response keys:', Object.keys(response));
        
        if (response.tokens?.accessToken) {
          // Store token in auth service
          console.log('User tokens received, storing tokens...');
          
          // Create proper auth data structure with full user data
          const authData = {
            success: true,
            access_token: response.tokens.accessToken,
            refresh_token: response.tokens.refreshToken,
            user: {
              id: response.user?.id || 'existing_user',
              email: response.user?.email || email,
              name: response.user?.fullName || response.user?.firstName || email,
              onboarding_completed: response.user?.hasCompletedOnboarding || false
            }
          };
          
          await authService.storeTokens(authData);
          console.log('Tokens stored successfully for existing user');
        } else if (response.token) {
          // Fallback for old API response format
          console.log('Using fallback token format...');
          const authData = {
            success: true,
            access_token: response.token,
            refresh_token: response.token,
            user: {
              id: 'existing_user',
              email: email,
              name: email,
              onboarding_completed: true
            }
          };
          
          await authService.storeTokens(authData);
          console.log('Tokens stored successfully for existing user (fallback)');
        } else {
          console.log('No tokens received for existing user - this might be an API issue');
        }
        router.replace('/(tabs)');
      } else {
        // New user - navigate to name input with email and tempToken
        console.log('New user - navigating to name input');
        router.push({
          pathname: '/(auth)/name',
          params: { 
            email,
            tempToken: response.tempToken || ''
          }
        });
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please go back and try again.');
      return;
    }

    try {
      await apiService.sendOTP(email);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your email');
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header currentScreen={2} totalScreens={4} />
        
        <Text style={styles.title}>Enter one-time pin</Text>
        
        <View style={styles.content}>
          <Text style={styles.instructions}>A pin has been sent to your email address:</Text>
          <Text style={styles.emailDisplay}>{email}</Text>

          {/* OTP Input */}
          <OTPInput
            ref={otpInputRef}
            value={otp}
            onChange={setOtp}
            onComplete={handleOtpComplete}
            disabled={loading}
            error={error}
          />
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Button
            label={loading ? 'Verifying...' : 'Continue'}
            onPress={handleVerify}
            disabled={!isOtpComplete || loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  } as ViewStyle,
  title: {
    fontSize: 32,
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: -10,
  } as TextStyle,
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  } as ViewStyle,
  instructions: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Satoshi-Regular',
    textAlign: 'left',
    marginBottom: 8,
  } as TextStyle,
  emailDisplay: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Satoshi-Medium',
    textAlign: 'left',
    marginTop: -8,
    marginBottom: 20,
  } as TextStyle,
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
  } as ViewStyle,
});
