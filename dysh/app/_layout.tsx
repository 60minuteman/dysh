import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'splash',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    'Satoshi-Black': require('../assets/fonts/Satoshi-Black.otf'),
    'Satoshi-BlackItalic': require('../assets/fonts/Satoshi-BlackItalic.otf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-BoldItalic': require('../assets/fonts/Satoshi-BoldItalic.otf'),
    'Satoshi-Italic': require('../assets/fonts/Satoshi-Italic.otf'),
    'Satoshi-Light': require('../assets/fonts/Satoshi-Light.otf'),
    'Satoshi-LightItalic': require('../assets/fonts/Satoshi-LightItalic.otf'),
    'Satoshi-Medium': require('../assets/fonts/Satoshi-Medium.otf'),
    'Satoshi-MediumItalic': require('../assets/fonts/Satoshi-MediumItalic.otf'),
    'Satoshi-Regular': require('../assets/fonts/Satoshi-Regular.otf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Force light mode
    if (colorScheme === 'dark') {
      require('react-native').Appearance.setColorScheme('light');
    }
  }, [colorScheme]);

  // Check for updates on app start (only in production builds)
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!__DEV__ && Updates.isEnabled) {
        try {
          console.log('🔄 Checking for updates...');
          const update = await Updates.checkForUpdateAsync();
          
          if (update.isAvailable) {
            console.log('📦 Update available, downloading...');
            await Updates.fetchUpdateAsync();
            console.log('✅ Update downloaded, reloading app...');
            await Updates.reloadAsync();
          } else {
            console.log('✅ App is up to date');
          }
        } catch (error) {
          console.error('❌ Error checking for updates:', error);
        }
      }
    };

    checkForUpdates();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: '#F9F9F9'
        }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="dark" backgroundColor="#F9F9F9" />
    </ThemeProvider>
  );
}
