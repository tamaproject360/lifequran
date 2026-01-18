/**
 * LifeQuran Statistics Manager
 * 
 * Mengelola tracking dan kalkulasi statistik pembacaan
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { getDatabase } from './database';

export interface ReadingHistory {
  id: string;
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  juzNumber: number;
  page: number;
  timestamp: string;
  duration: number;
}

export interface DailyStats {
  date: string;
  pagesRead: number;
  minutesSpent: number;
  ayahsRead: number;
  isActive: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalPages: number;
  totalMinutes: number;
  activeDays: number;
  dailyStats: DailyStats[];
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalPages: number;
  totalMinutes: number;
  activeDays: number;
  averagePerDay: number;
  longestStreak: number;
  completedSurahs: number;
}

export interface ProgressStats {
  totalPagesRead: number;
  totalMinutesSpent: number;
  totalDaysActive: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
  completionPercentage: number;
  totalAyahsRead: number;
  completedSurahs: number[];
}

/**
 * Track reading activity
 */
export const trackReading = async (
  userId: string,
  surahNumber: number,
  ayahNumber: number,
  juzNumber: number,
  page: number,
  duration: number = 0
): Promise<void> => {
  const db = getDatabase();
  const id = `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.runAsync(
    `INSERT INTO readings (id, user_id, surah_number, ayah_number, juz_number, page, duration)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, surahNumber, ayahNumber, juzNumber, page, duration]
  );
};

/**
 * Get reading history for a user
 */
export const getReadingHistory = async (
  userId: string,
  limit: number = 50
): Promise<ReadingHistory[]> => {
  const db = getDatabase();
  
  const result = await db.getAllAsync<ReadingHistory>(
    `SELECT * FROM readings 
     WHERE user_id = ? 
     ORDER BY timestamp DESC 
     LIMIT ?`,
    [userId, limit]
  );
  
  return result;
};

/**
 * Get daily statistics
 */
export const getDailyStats = async (
  userId: string,
  date: string
): Promise<DailyStats> => {
  const db = getDatabase();
  
  const result = await db.getFirstAsync<{
    pages: number;
    minutes: number;
    ayahs: number;
  }>(
    `SELECT 
       COUNT(DISTINCT page) as pages,
       SUM(duration) as minutes,
       COUNT(*) as ayahs
     FROM readings 
     WHERE user_id = ? AND DATE(timestamp) = ?`,
    [userId, date]
  );
  
  return {
    date,
    pagesRead: result?.pages || 0,
    minutesSpent: Math.round((result?.minutes || 0) / 60),
    ayahsRead: result?.ayahs || 0,
    isActive: (result?.pages || 0) > 0,
  };
};

/**
 * Get weekly statistics
 */
export const getWeeklyStats = async (
  userId: string,
  weekStart: string
): Promise<WeeklyStats> => {
  const db = getDatabase();
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const result = await db.getFirstAsync<{
    pages: number;
    minutes: number;
    days: number;
  }>(
    `SELECT 
       COUNT(DISTINCT page) as pages,
       SUM(duration) as minutes,
       COUNT(DISTINCT DATE(timestamp)) as days
     FROM readings 
     WHERE user_id = ? 
       AND DATE(timestamp) BETWEEN ? AND ?`,
    [userId, weekStart, weekEnd.toISOString().split('T')[0]]
  );
  
  // Get daily breakdown
  const dailyStats: DailyStats[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyStats.push(await getDailyStats(userId, dateStr));
  }
  
  return {
    weekStart,
    weekEnd: weekEnd.toISOString().split('T')[0],
    totalPages: result?.pages || 0,
    totalMinutes: Math.round((result?.minutes || 0) / 60),
    activeDays: result?.days || 0,
    dailyStats,
  };
};

/**
 * Get monthly report
 */
export const getMonthlyReport = async (
  userId: string,
  month: number,
  year: number
): Promise<MonthlyReport> => {
  const db = getDatabase();
  
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  
  const result = await db.getFirstAsync<{
    pages: number;
    minutes: number;
    days: number;
  }>(
    `SELECT 
       COUNT(DISTINCT page) as pages,
       SUM(duration) as minutes,
       COUNT(DISTINCT DATE(timestamp)) as days
     FROM readings 
     WHERE user_id = ? 
       AND strftime('%Y-%m', timestamp) = ?`,
    [userId, monthStr]
  );
  
  const totalPages = result?.pages || 0;
  const activeDays = result?.days || 0;
  const averagePerDay = activeDays > 0 ? totalPages / activeDays : 0;
  
  // Calculate longest streak in month
  const longestStreak = await calculateLongestStreakInPeriod(
    userId,
    `${monthStr}-01`,
    `${monthStr}-31`
  );
  
  // Get completed surahs
  const completedSurahs = await db.getAllAsync<{ surah_number: number }>(
    `SELECT DISTINCT surah_number 
     FROM readings 
     WHERE user_id = ? 
       AND strftime('%Y-%m', timestamp) = ?`,
    [userId, monthStr]
  );
  
  return {
    month: monthStr,
    year,
    totalPages,
    totalMinutes: Math.round((result?.minutes || 0) / 60),
    activeDays,
    averagePerDay: Math.round(averagePerDay * 10) / 10,
    longestStreak,
    completedSurahs: completedSurahs.length,
  };
};

/**
 * Get overall progress statistics
 */
export const getProgressStats = async (userId: string): Promise<ProgressStats> => {
  const db = getDatabase();
  
  const result = await db.getFirstAsync<{
    pages: number;
    minutes: number;
    days: number;
    ayahs: number;
  }>(
    `SELECT 
       COUNT(DISTINCT page) as pages,
       SUM(duration) as minutes,
       COUNT(DISTINCT DATE(timestamp)) as days,
       COUNT(*) as ayahs
     FROM readings 
     WHERE user_id = ?`,
    [userId]
  );
  
  const totalPages = result?.pages || 0;
  const activeDays = result?.days || 0;
  const averagePerDay = activeDays > 0 ? totalPages / activeDays : 0;
  
  // Calculate streaks
  const currentStreak = await calculateCurrentStreak(userId);
  const longestStreak = await calculateLongestStreak(userId);
  
  // Get completed surahs
  const completedSurahs = await db.getAllAsync<{ surah_number: number }>(
    `SELECT DISTINCT surah_number FROM readings WHERE user_id = ?`,
    [userId]
  );
  
  return {
    totalPagesRead: totalPages,
    totalMinutesSpent: Math.round((result?.minutes || 0) / 60),
    totalDaysActive: activeDays,
    currentStreak,
    longestStreak,
    averagePerDay: Math.round(averagePerDay * 10) / 10,
    completionPercentage: Math.round((totalPages / 604) * 100),
    totalAyahsRead: result?.ayahs || 0,
    completedSurahs: completedSurahs.map(s => s.surah_number),
  };
};

/**
 * Calculate current streak
 */
const calculateCurrentStreak = async (userId: string): Promise<number> => {
  const db = getDatabase();
  
  const dates = await db.getAllAsync<{ date: string }>(
    `SELECT DISTINCT DATE(timestamp) as date 
     FROM readings 
     WHERE user_id = ? 
     ORDER BY date DESC`,
    [userId]
  );
  
  if (dates.length === 0) return 0;
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let currentDate = new Date(today);
  
  for (const { date } of dates) {
    const readDate = new Date(date);
    const diffDays = Math.floor(
      (currentDate.getTime() - readDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === streak) {
      streak++;
      currentDate = readDate;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Calculate longest streak
 */
const calculateLongestStreak = async (userId: string): Promise<number> => {
  const db = getDatabase();
  
  const dates = await db.getAllAsync<{ date: string }>(
    `SELECT DISTINCT DATE(timestamp) as date 
     FROM readings 
     WHERE user_id = ? 
     ORDER BY date ASC`,
    [userId]
  );
  
  if (dates.length === 0) return 0;
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1].date);
    const currDate = new Date(dates[i].date);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
};

/**
 * Calculate longest streak in a specific period
 */
const calculateLongestStreakInPeriod = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<number> => {
  const db = getDatabase();
  
  const dates = await db.getAllAsync<{ date: string }>(
    `SELECT DISTINCT DATE(timestamp) as date 
     FROM readings 
     WHERE user_id = ? 
       AND DATE(timestamp) BETWEEN ? AND ?
     ORDER BY date ASC`,
    [userId, startDate, endDate]
  );
  
  if (dates.length === 0) return 0;
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1].date);
    const currDate = new Date(dates[i].date);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
};

/**
 * Calculate estimated khatam date
 */
export const calculateKhatamPrediction = async (
  userId: string
): Promise<{ estimatedDate: string; daysRemaining: number } | null> => {
  const stats = await getProgressStats(userId);
  
  if (stats.averagePerDay === 0) return null;
  
  const pagesRemaining = 604 - stats.totalPagesRead;
  const daysRemaining = Math.ceil(pagesRemaining / stats.averagePerDay);
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);
  
  return {
    estimatedDate: estimatedDate.toISOString().split('T')[0],
    daysRemaining,
  };
};

/**
 * Get heatmap data for calendar visualization
 */
export const getHeatmapData = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<{ date: string; count: number; intensity: number }[]> => {
  const db = getDatabase();
  
  const result = await db.getAllAsync<{ date: string; count: number }>(
    `SELECT 
       DATE(timestamp) as date,
       COUNT(DISTINCT page) as count
     FROM readings 
     WHERE user_id = ? 
       AND DATE(timestamp) BETWEEN ? AND ?
     GROUP BY DATE(timestamp)
     ORDER BY date ASC`,
    [userId, startDate, endDate]
  );
  
  // Calculate intensity (0-4 scale)
  const maxCount = Math.max(...result.map(r => r.count), 1);
  
  return result.map(r => ({
    date: r.date,
    count: r.count,
    intensity: Math.min(Math.floor((r.count / maxCount) * 4), 4),
  }));
};
