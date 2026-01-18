/**
 * LifeQuran Onboarding Layout
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="dailyTarget" />
      <Stack.Screen name="reminder" />
      <Stack.Screen name="tutorial" />
    </Stack>
  );
}
