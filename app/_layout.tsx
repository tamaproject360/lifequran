/**
 * LifeQuran Root Layout
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { useFonts } from '../src/hooks/useFonts';
import { LoadingScreen } from '../src/components';

function RootStack() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const { fontsLoaded } = useFonts();

  if (!fontsLoaded) {
    return (
      <ThemeProvider>
        <LoadingScreen message="Memuat LifeQuran..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
