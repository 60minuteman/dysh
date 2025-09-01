import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmailInput } from '../../components/EmailInput';
import { authService } from '../../lib/auth';
import { apiService } from '../../lib/api';

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      void videoRef.current?.playAsync();
    }
  }, []);

  useEffect(() => {
    // Initialize auth service and check if user is already authenticated
    const initializeAuth = async () => {
      await authService.initialize();
      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        const user = await authService.getCurrentUser();
        if (user?.hasCompletedOnboarding) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/testimonials');
        }
      }
    };

    initializeAuth();
  }, []);

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

  // Commented out Google Sign-In for now - will enable when ready for Android
  // const handleGoogleSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     console.log('Attempting Google Sign In...');

  //     const result = await authService.signInWithGoogle();

  //     if (result.user.onboarding_completed) {
  //       router.replace('/(tabs)');
  //     } else {
  //       router.push('/(auth)/testimonials');
  //     }
  //   } catch (error: any) {
  //     console.error('Google Sign In Error:', error);
  //     Alert.alert(
  //       'Sign In Error',
  //       error.message || 'Unable to sign in with Google. Please try again.'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleExplorePress = () => {
    //router.push('/(auth)/paywall');
    // router.push('/ingredients');
    router.push('/(tabs)/explore');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background Video with Gradient Overlay */}
      <Video
        ref={videoRef}
        source={require('../../assets/videos/vid.mp4')}
        style={[StyleSheet.absoluteFillObject, styles.video]}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.2)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(8, 8, 8, 0.78)',
          '#000000',
        ]}
        locations={[0, 0.2, 0.6, 0.9]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content Container */}
      <ScrollView 
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + -20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={styles.logo}
            resizeMode='contain'
          />
        </View>

        <View style={styles.bottomContent}>
          {/* Text Content */}
          {!keyboardVisible && (
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                World Class Meals,{'\n'}Home Ingredients
              </Text>
              <Text style={styles.subtitle}>
                Get recipes from around the world {'\n'} based on your stash.
              </Text>
            </View>
          )}

          {/* Email Input */}
          <EmailInput
            onSubmit={async (email) => {
              console.log('Email submitted:', email);
              setLoading(true);
              try {
                // Send OTP to the email
                await apiService.sendOTP(email);
                console.log('OTP sent successfully');
                // Navigate to OTP verification with email
                router.push({
                  pathname: '/(auth)/otp',
                  params: { email }
                });
              } catch (error: any) {
                console.error('Failed to send OTP:', error);
                Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
          />

          {/* Terms Text */}
          {!keyboardVisible && (
            <Text style={styles.termsText}>
              By continuing, you accept our{'\n'}
              <Text style={styles.termsLink}>Terms</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    transform: [{ translateY: -260 }], // Move video up more
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 140,
    height: 45,
  },
  bottomContent: {
    gap: 32,
    marginTop: 'auto',
    paddingBottom: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    marginBottom: -20,
  },

  termsText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    marginBottom: 10,
    marginTop: -10,
  },
  termsLink: {
    textDecorationLine: 'none',
  },
});
