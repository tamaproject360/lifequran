/**
 * LifeQuran Store - Zustand State Management
 * 
 * Global state management untuk user data dan gamifikasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { create } from 'zustand';
import { DatabaseOperations, UserStats } from '../database';

interface UserState {
  // User Stats
  stats: UserStats | null;
  isLoading: boolean;
  
  // Actions
  loadStats: () => Promise<void>;
  updateStats: (stats: Partial<UserStats>) => Promise<void>;
  
  // Streak Management
  incrementStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  
  // XP & Level Management
  addXP: (amount: number) => Promise<void>;
  levelUp: () => Promise<void>;
  
  // Reading Progress
  markPageRead: () => Promise<void>;
  addReadingTime: (minutes: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  stats: null,
  isLoading: true,

  loadStats: async () => {
    try {
      set({ isLoading: true });
      const stats = await DatabaseOperations.getUserStats();
      set({ stats, isLoading: false });
    } catch (error) {
      console.error('Error loading stats:', error);
      set({ isLoading: false });
    }
  },

  updateStats: async (updates: Partial<UserStats>) => {
    try {
      await DatabaseOperations.updateUserStats(updates);
      const stats = await DatabaseOperations.getUserStats();
      set({ stats });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  },

  incrementStreak: async () => {
    const { stats } = get();
    if (!stats) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActive = stats.lastActiveDate?.split('T')[0];
    
    // Check if last active was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = stats.currentStreak;
    
    if (lastActive === yesterdayStr) {
      // Continue streak
      newStreak += 1;
    } else if (lastActive !== today) {
      // Start new streak
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, stats.longestStreak);

    await get().updateStats({
      currentStreak: newStreak,
      longestStreak,
      lastActiveDate: new Date().toISOString(),
    });
  },

  resetStreak: async () => {
    await get().updateStats({ currentStreak: 0 });
  },

  addXP: async (amount: number) => {
    const { stats } = get();
    if (!stats) return;

    const newXP = stats.totalXP + amount;
    const xpForNextLevel = stats.level * 1000;

    if (newXP >= xpForNextLevel) {
      // Level up!
      await get().levelUp();
    } else {
      await get().updateStats({ totalXP: newXP });
    }
  },

  levelUp: async () => {
    const { stats } = get();
    if (!stats) return;

    const newLevel = stats.level + 1;
    const remainingXP = stats.totalXP - (stats.level * 1000);

    await get().updateStats({
      level: newLevel,
      totalXP: remainingXP,
    });
  },

  markPageRead: async () => {
    const { stats } = get();
    if (!stats) return;

    const newPages = stats.totalPagesRead + 1;
    const xpGained = 50; // 50 XP per page

    await get().updateStats({ totalPagesRead: newPages });
    await get().addXP(xpGained);
    await get().incrementStreak();
  },

  addReadingTime: async (minutes: number) => {
    const { stats } = get();
    if (!stats) return;

    const newMinutes = stats.totalMinutes + minutes;
    await get().updateStats({ totalMinutes: newMinutes });
  },
}));

// Reading Progress Store
interface ReadingState {
  currentSurahId: number | null;
  currentAyahId: number | null;
  
  setCurrentReading: (surahId: number, ayahId: number) => void;
  clearCurrentReading: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  currentSurahId: null,
  currentAyahId: null,

  setCurrentReading: (surahId: number, ayahId: number) => {
    set({ currentSurahId: surahId, currentAyahId: ayahId });
  },

  clearCurrentReading: () => {
    set({ currentSurahId: null, currentAyahId: null });
  },
}));

// Bookmark Store
interface BookmarkState {
  bookmarks: number[]; // Array of ayah IDs
  
  addBookmark: (ayahId: number) => void;
  removeBookmark: (ayahId: number) => void;
  isBookmarked: (ayahId: number) => boolean;
  loadBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],

  addBookmark: async (ayahId: number) => {
    try {
      // Add to database (you'll need to pass surahId as well)
      // await DatabaseOperations.addBookmark(surahId, ayahId);
      set((state) => ({ bookmarks: [...state.bookmarks, ayahId] }));
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  removeBookmark: async (ayahId: number) => {
    try {
      // Remove from database
      // await DatabaseOperations.removeBookmark(id);
      set((state) => ({ 
        bookmarks: state.bookmarks.filter(id => id !== ayahId) 
      }));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  isBookmarked: (ayahId: number) => {
    return get().bookmarks.includes(ayahId);
  },

  loadBookmarks: async () => {
    try {
      const bookmarks = await DatabaseOperations.getBookmarks();
      set({ bookmarks: bookmarks.map(b => b.ayahId) });
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  },
}));
