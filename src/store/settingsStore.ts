/**
 * LifeQuran Settings Store
 * 
 * State management untuk pengaturan aplikasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReadingSettings {
  arabicFontSize: number;
  translationFontSize: number;
  arabicFontFamily: 'uthmani' | 'naskh' | 'kufi';
  showTranslation: boolean;
  showTajwid: boolean;
  showTafsir: boolean;
  lineSpacing: number;
}

export interface AppSettings {
  dailyTarget: number; // pages per day
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm format
  autoNightMode: boolean;
  nightModeStartTime: string;
  nightModeEndTime: string;
  keepScreenOn: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
}

interface SettingsState {
  reading: ReadingSettings;
  app: AppSettings;
  updateReadingSettings: (settings: Partial<ReadingSettings>) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  resetToDefaults: () => void;
}

const defaultReadingSettings: ReadingSettings = {
  arabicFontSize: 28,
  translationFontSize: 16,
  arabicFontFamily: 'uthmani',
  showTranslation: true,
  showTajwid: false,
  showTafsir: false,
  lineSpacing: 1.5,
};

const defaultAppSettings: AppSettings = {
  dailyTarget: 5,
  reminderEnabled: true,
  reminderTime: '20:00',
  autoNightMode: true,
  nightModeStartTime: '18:00',
  nightModeEndTime: '06:00',
  keepScreenOn: true,
  hapticFeedback: true,
  soundEffects: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      reading: defaultReadingSettings,
      app: defaultAppSettings,
      
      updateReadingSettings: (settings) =>
        set((state) => ({
          reading: { ...state.reading, ...settings },
        })),
      
      updateAppSettings: (settings) =>
        set((state) => ({
          app: { ...state.app, ...settings },
        })),
      
      resetToDefaults: () =>
        set({
          reading: defaultReadingSettings,
          app: defaultAppSettings,
        }),
    }),
    {
      name: 'lifequran-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
