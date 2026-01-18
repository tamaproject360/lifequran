import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../types';

interface AppState {
  theme: ThemeMode;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setTheme: (theme: ThemeMode) => void;
  setLoading: (loading: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'auto',
      isLoading: false,
      hasCompletedOnboarding: false,
      setTheme: (theme) => set({ theme }),
      setLoading: (isLoading) => set({ isLoading }),
      setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
    }),
    {
      name: 'lifequran-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
