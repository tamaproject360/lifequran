/**
 * Gamification Store
 * 
 * State management untuk sistem gamifikasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { create } from 'zustand';
import { DatabaseOperations } from '../database';
import { getLevelInfo, getStreakStatus, getGamificationSummary } from '../utils/gamification';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  xpReward: number;
}

interface DailyChallenge {
  id: number;
  date: string;
  title: string;
  description: string;
  challengeType: string;
  targetValue: number;
  currentProgress: number;
  xpReward: number;
  completed: boolean;
}

interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  freezeAvailable: boolean;
  nextMilestone: number;
}

interface GamificationState {
  levelInfo: LevelInfo | null;
  streakInfo: StreakInfo | null;
  dailyChallenge: DailyChallenge | null;
  badges: Badge[];
  recentBadges: Badge[];
  isLoading: boolean;
  
  // Actions
  loadGamificationData: () => Promise<void>;
  refreshLevelInfo: () => Promise<void>;
  refreshStreakInfo: () => Promise<void>;
  refreshDailyChallenge: () => Promise<void>;
  loadBadges: () => Promise<void>;
  
  // Modals
  showLevelUpModal: boolean;
  showBadgeUnlockModal: boolean;
  newlyUnlockedBadge: Badge | null;
  setShowLevelUpModal: (show: boolean) => void;
  setShowBadgeUnlockModal: (show: boolean, badge?: Badge) => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  levelInfo: null,
  streakInfo: null,
  dailyChallenge: null,
  badges: [],
  recentBadges: [],
  isLoading: false,
  showLevelUpModal: false,
  showBadgeUnlockModal: false,
  newlyUnlockedBadge: null,

  loadGamificationData: async () => {
    set({ isLoading: true });
    try {
      const summary = await getGamificationSummary();
      
      set({
        levelInfo: summary.level,
        streakInfo: summary.streak,
        dailyChallenge: summary.dailyChallenge ? {
          id: summary.dailyChallenge.id,
          date: summary.dailyChallenge.date,
          title: summary.dailyChallenge.title,
          description: summary.dailyChallenge.description,
          challengeType: summary.dailyChallenge.challenge_type,
          targetValue: summary.dailyChallenge.target_value,
          currentProgress: summary.dailyChallenge.current_progress,
          xpReward: summary.dailyChallenge.xp_reward,
          completed: summary.dailyChallenge.completed === 1,
        } : null,
        recentBadges: summary.recentBadges.map((b: any) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          category: b.category,
          unlocked: b.unlocked === 1,
          xpReward: b.xp_reward,
        })),
      });
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshLevelInfo: async () => {
    try {
      const levelInfo = await getLevelInfo();
      set({ levelInfo });
    } catch (error) {
      console.error('Error refreshing level info:', error);
    }
  },

  refreshStreakInfo: async () => {
    try {
      const streakInfo = await getStreakStatus();
      set({ streakInfo });
    } catch (error) {
      console.error('Error refreshing streak info:', error);
    }
  },

  refreshDailyChallenge: async () => {
    try {
      const challenge = await DatabaseOperations.getTodayChallenge();
      if (challenge) {
        set({
          dailyChallenge: {
            id: challenge.id,
            date: challenge.date,
            title: challenge.title,
            description: challenge.description,
            challengeType: challenge.challenge_type,
            targetValue: challenge.target_value,
            currentProgress: challenge.current_progress,
            xpReward: challenge.xp_reward,
            completed: challenge.completed === 1,
          },
        });
      }
    } catch (error) {
      console.error('Error refreshing daily challenge:', error);
    }
  },

  loadBadges: async () => {
    try {
      const allBadges = await DatabaseOperations.getAllBadges();
      set({
        badges: allBadges.map((b: any) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          category: b.category,
          unlocked: b.unlocked === 1,
          xpReward: b.xp_reward,
        })),
      });
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  },

  setShowLevelUpModal: (show: boolean) => {
    set({ showLevelUpModal: show });
  },

  setShowBadgeUnlockModal: (show: boolean, badge?: Badge) => {
    set({
      showBadgeUnlockModal: show,
      newlyUnlockedBadge: badge || null,
    });
  },
}));
