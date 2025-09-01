import { Image, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const navigateToOnboarding = async () => {
      try {
        // Simulate some loading time (you can replace this with actual resource loading)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Navigate to onboarding
        router.replace('/(auth)/onboarding');
      } catch (e) {
        console.warn(e);
      }
    };

    navigateToOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require('../assets/images/Splash.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
