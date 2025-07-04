import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'splash',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

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

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: 'appl_FSycrwLmErAVzwiVhonzRtghGNm' });
    }
    // else if (Platform.OS === 'android') {
    //    Purchases.configure({apiKey: 'goog_ZzqYZzqYZzqYZzqYZzqYZzqY'});

    //   // OR: if building for Amazon, be sure to follow the installation instructions then:
    //   //  Purchases.configure({ apiKey: 'amzn_ZzqYZzqYZzqYZzqYZzqYZzqY', useAmazon: true });
    // }
  }, []);

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#F9F9F9',
            },
          }}
        >
          <Stack.Screen name='index' />
          <Stack.Screen name='splash' />
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(tabs)' />
        </Stack>
        <StatusBar
          translucent={true}
          backgroundColor='transparent'
          style='dark'
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
