import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          // headerShown: false,
          contentStyle: {
            backgroundColor: '#F9F9F9',
          },
        }}
      />
      <StatusBar
        translucent={true}
        backgroundColor='transparent'
        style='dark'
      />
    </ThemeProvider>
  );
}
