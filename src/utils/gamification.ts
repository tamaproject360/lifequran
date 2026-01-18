/**
 * LifeQuran Gamification Utilities
 * 
 * Helper functions untuk sistem gamifikasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { DatabaseOperations } from '../database';

export interface XPReward {
  amount: number;
  source: string;
  description: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number; // 0-1
}

/**
 * Calculate XP reward for reading pages
 */
export const calculateReadingXP = (pages: number): number => {
  return pages * 10; // 10 XP per page
};

/**
 * Calculate XP reward for listening to murottal
 */
export const calculateAudioXP = (surahsCompleted: number): number => {
  return surahsCompleted * 5; // 5 XP per surah
};

/**
 * Calculate XP reward for completing a Juz
 */
export const calculateJuzXP = (): number => {
  return 500; // 500 XP per Juz
};

/**
 * Get level information with progress
 */
export const getLevelInfo = async (): Promise<LevelInfo> => {
  const stats = await DatabaseOperations.getUserStats();
  
  if (!stats) {
    return {
      level: 1,
      name: 'Pemula',
      icon: '🌱',
      currentXP: 0,
      nextLevelXP: 500,
      progress: 0,
    };
  }

  const level = stats.level;
  const currentXP = stats.totalXP;
  const nextLevelXP = DatabaseOperations.getXPForNextLevel(level);
  const levelName = DatabaseOperations.getLevelName(level);
  const levelIcon = DatabaseOperations.getLevelIcon(level);

  // Calculate progress to next level
  const previousLevelXP = level === 1 ? 0 : DatabaseOperations.getXPForNextLevel(level - 1);
  const xpInCurrentLevel = currentXP - previousLevelXP;
  const xpNeededForNextLevel = nextLevelXP - previousLevelXP;
  const progress = level === 6 ? 1 : xpInCurrentLevel / xpNeededForNextLevel;

  return {
    level,
    name: levelName,
    icon: levelIcon,
    currentXP,
    nextLevelXP,
    progress: Math.min(progress, 1),
  };
};

/**
 * Award XP for an activity and check for level up
 */
export const awardXP = async (
  amount: number,
  source: string,
  description?: string
): Promise<{ leveledUp: boolean; newLevel?: number; newXP: number }> => {
  const result = await DatabaseOperations.addXP(amount, source, description);
  
  if (!result) {
    return { leveledUp: false, newXP: 0 };
  }

  return {
    leveledUp: result.leveledUp,
    newLevel: result.leveledUp ? result.newLevel : undefined,
    newXP: result.newXP,
  };
};

/**
 * Process reading activity and award appropriate XP
 */
export const processReadingActivity = async (pagesRead: number): Promise<XPReward[]> => {
  const rewards: XPReward[] = [];

  // Award XP for pages read
  const readingXP = calculateReadingXP(pagesRead);
  await awardXP(readingXP, 'reading', `Membaca ${pagesRead} halaman`);
  rewards.push({
    amount: readingXP,
    source: 'reading',
    description: `Membaca ${pagesRead} halaman`,
  });

  // Update streak
  const newStreak = await DatabaseOperations.updateStreak();
  
  // Check if streak milestone reached (7, 14, 21, etc.)
  if (newStreak && newStreak % 7 === 0) {
    rewards.push({
      amount: 100,
      source: 'streak_bonus',
      description: `${newStreak} hari streak!`,
    });
  }

  // Update daily challenge progress
  const challengeCompleted = await DatabaseOperations.updateChallengeProgress(pagesRead);
  if (challengeCompleted) {
    const challenge = await DatabaseOperations.getTodayChallenge();
    if (challenge) {
      rewards.push({
        amount: challenge.xp_reward,
        source: 'daily_challenge',
        description: challenge.title,
      });
    }
  }

  // Check for badge unlocks
  const unlockedBadges = await DatabaseOperations.checkAndUnlockBadges();
  for (const badge of unlockedBadges) {
    if (badge.xpReward > 0) {
      rewards.push({
        amount: badge.xpReward,
        source: 'badge_unlock',
        description: badge.name,
      });
    }
  }

  return rewards;
};

/**
 * Get streak status with freeze information
 */
export const getStreakStatus = async () => {
  const stats = await DatabaseOperations.getUserStats();
  
  if (!stats) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      freezeAvailable: true,
      nextMilestone: 7,
    };
  }

  const nextMilestone = Math.ceil((stats.currentStreak + 1) / 7) * 7;

  return {
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    freezeAvailable: true, // TODO: Implement freeze logic
    nextMilestone,
  };
};

/**
 * Get gamification summary for dashboard
 */
export const getGamificationSummary = async () => {
  const levelInfo = await getLevelInfo();
  const streakStatus = await getStreakStatus();
  const todayChallenge = await DatabaseOperations.getTodayChallenge();
  const recentBadges = await DatabaseOperations.getUnlockedBadges();

  return {
    level: levelInfo,
    streak: streakStatus,
    dailyChallenge: todayChallenge,
    recentBadges: recentBadges.slice(0, 3), // Last 3 badges
  };
};

/**
 * Format XP number with animation-friendly format
 */
export const formatXP = (xp: number): string => {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};

/**
 * Get motivational message based on streak
 */
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Mulai streak hari ini! 🌱';
  if (streak === 1) return 'Langkah pertama yang hebat! 🎯';
  if (streak < 7) return `${streak} hari berturut-turut! Terus semangat! 🔥`;
  if (streak < 30) return `Luar biasa! ${streak} hari istiqomah! 🌟`;
  if (streak < 100) return `Masya Allah! ${streak} hari konsisten! 🌙`;
  return `Subhanallah! ${streak} hari streak! Anda luar biasa! 👑`;
};

/**
 * Get level up message
 */
export const getLevelUpMessage = (level: number, levelName: string): string => {
  const messages = [
    `Selamat! Anda naik ke level ${level}: ${levelName}! 🎉`,
    `Masya Allah! Level ${level} tercapai! 🌟`,
    `Luar biasa! Anda sekarang ${levelName}! 💫`,
    `Subhanallah! Naik ke level ${level}! 🎊`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
