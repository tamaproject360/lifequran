/**
 * LifeQuran Theme Context
 * Provides theme management across the app
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme, type Theme, type ThemeMode } from './index';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode | 'auto';
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@lifequran:theme_mode';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode | 'auto'>('auto');

  // Determine actual theme based on mode
  const actualTheme: ThemeMode = 
    themeMode === 'auto' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themeMode;

  const theme = createTheme(actualTheme);
  const isDark = actualTheme === 'dark';

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved) {
          setThemeModeState(saved as ThemeMode | 'auto');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setThemeMode = useCallback(async (mode: ThemeMode | 'auto') => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDark,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
