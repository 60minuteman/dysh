import { StyleSheet, Text, View, Image, Alert, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SocialButton } from '../../components/SocialButton';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { authService } from '../../lib/auth';

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

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

  const handleAppleSignIn = async () => {
    try {
      setAppleLoading(true);
      console.log('Attempting Apple Sign In...');
      
      const result = await authService.signInWithApple();
      
      if (result.user.hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.push('/(auth)/testimonials');
      }
    } catch (error: any) {
      console.error('Apple Sign In Error:', error);
      
      // Don't show alert if user canceled
      if (!error.message.includes('canceled')) {
        Alert.alert(
          'Sign In Error',
          error.message || 'Unable to sign in with Apple. Please try again.'
        );
      }
    } finally {
      setAppleLoading(false);
    }
  };

  const handleExplorePress = () => {
    //router.push('/(auth)/paywall');
    router.push('/ingredients');

  };

  return (
    <View style={styles.container}>
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
        colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.92)', '#FFFFFF']}
        locations={[0, 0.2, 0.6, 0.9]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content Container */}
      <View style={[styles.contentContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomContent}>
          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>World Class Meals,{'\n'}Home Ingredients</Text>
            <Text style={styles.subtitle}>Get recipes from around the world based on your stash.</Text>
          </View>

          {/* Auth Buttons */}
          <View style={styles.buttonContainer}>
            {Platform.OS === 'ios' && (
              <SocialButton
                variant="apple"
                onPress={handleAppleSignIn}
                loading={appleLoading}
              />
            )}
            {/* Commented out Google Sign-In for now - will enable when ready for Android */}
            {/* <SocialButton
              variant="google"
              onPress={handleGoogleSignIn}
              loading={loading}
            /> */}
            {__DEV__ && (
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={handleExplorePress}
              >
                <Text style={styles.exploreButtonText}>Explore Recipes</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Terms Text */}
          <Text style={styles.termsText}>
            By continuing, you accept our{' '}
            <Text style={styles.termsLink}>Terms</Text> & <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
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
    flex: 1,
    padding: 20,
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
    marginTop: 'auto',
    gap: 32,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#00000',
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    marginBottom: -20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: -20,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 64,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Satoshi-Medium',
  },
  termsText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    marginBottom: -10,
    marginTop: 20,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
