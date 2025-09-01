import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { Input } from '../../components/Input';
import { apiService } from '../../lib/api';
import { authService } from '../../lib/auth';

export default function Name() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [error, setError] = useState('');

  // Get email and tempToken from route params
  useEffect(() => {
    if (params.email && typeof params.email === 'string') {
      setEmail(params.email);
    }
    if (params.tempToken && typeof params.tempToken === 'string') {
      setTempToken(params.tempToken);
    }
  }, [params.email, params.tempToken]);

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

  const handleContinue = async () => {
    setError('');
    if (!nickname.trim()) {
      setError('Nickname is required');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Email not found. Please go back and try again.');
      return;
    }
    if (!tempToken) {
      Alert.alert('Error', 'Authentication token not found. Please go back and try again.');
      return;
    }

    setLoading(true);
    try {
      // For now, just pass nickname as firstName, lastName blank
      const response = await apiService.createAccount(email, nickname.trim(), '', tempToken);
      
      console.log('Create account response:', JSON.stringify(response, null, 2));
      
      if (response.tokens?.accessToken) {
        // Store tokens in auth service
        console.log('Account created successfully, storing tokens...');
        
        // Map the response to the format expected by authService.storeTokens
        const authData = {
          success: true,
          access_token: response.tokens.accessToken,
          refresh_token: response.tokens.refreshToken,
          user: {
            id: response.user.id,
            email: response.user.email,
            name: response.user.fullName,
            onboarding_completed: response.user.hasCompletedOnboarding
          }
        };
        
        await authService.storeTokens(authData);
        console.log('Tokens stored successfully');
      }
      router.push('/(auth)/dietary-preferences');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = nickname.trim().length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header currentScreen={3} totalScreens={4} />
        
        <Text style={styles.title}>Whats your{'\n'}nickname?</Text>
        
        <View style={styles.content}>
          {/* Nickname Input */}
          <Input
            placeholder="Sabalicious"
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            error={error}
            inputStyle={styles.input}
            placeholderTextColor="#D4D4D4"
          />
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
          <Button
            label={loading ? 'Saving...' : 'Continue'}
            onPress={handleContinue}
            disabled={!isFormValid || loading}
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
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    marginTop: 16,
  } as ViewStyle,
  input: {
    fontSize: 24,
    fontFamily: 'Satoshi-Medium',
    color: '#000000',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 0,
  } as TextStyle,
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
  } as ViewStyle,

});
