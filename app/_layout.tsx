/**
 * LifeQuran Root Layout
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { useFonts } from '../src/hooks/useFonts';
import { LoadingScreen } from '../src/components';
import { initDatabase, seedSurahs, DatabaseOperations } from '../src/database';

function RootStack() {
  const { isDark } = useTheme();
  
  useEffect(() => {
    // Initialize database and seed data
    const setupDatabase = async () => {
      try {
        console.log('🔄 Starting database setup...');
        const db = await initDatabase();
        console.log('✅ Database initialized');
        
        await seedSurahs();
        console.log('✅ Surahs seeded');
        
        // Initialize badges
        await DatabaseOperations.initializeBadges();
        console.log('✅ Badges initialized');
        
        // Generate daily challenge if not exists
        await DatabaseOperations.generateDailyChallenge();
        console.log('✅ Daily challenge generated');
        
        console.log('✅ Database setup complete');
      } catch (error) {
        console.error('❌ Error setting up database:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
    };
    
    setupDatabase();
  }, []);
  
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
