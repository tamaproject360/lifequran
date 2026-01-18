import { create } from 'zustand';
import { ThemeMode } from '../types';

interface AppState {
  theme: ThemeMode;
  isLoading: boolean;
  setTheme: (theme: ThemeMode) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'auto',
  isLoading: false,
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
}));
