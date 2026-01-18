// Global TypeScript types

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  createdAt: Date;
}

export interface Reading {
  id: string;
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  juzNumber: number;
  page: number;
  timestamp: Date;
  duration: number; // in seconds
}

export interface Bookmark {
  id: string;
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  xpReward: number;
  date: Date;
  completed: boolean;
}

export interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  surahNumber: number;
  text: string;
  translation: string;
  tafsir?: string;
  audio?: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export type NavigationParamList = {
  Home: undefined;
  AlQuran: undefined;
  Progress: undefined;
  Gamification: undefined;
  Profile: undefined;
  Reading: {
    surahNumber: number;
    ayahNumber?: number;
  };
};
