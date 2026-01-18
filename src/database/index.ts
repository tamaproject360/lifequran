/**
 * LifeQuran Database Setup
 * 
 * SQLite Database Schema untuk Al-Qur'an dan User Data
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import * as SQLite from 'expo-sqlite';

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  revelationType: 'Makkiyah' | 'Madaniyah';
  numberOfAyahs: number;
  order: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  numberInSurah: number;
  text: string;
  translation: string;
  transliteration?: string;
}

export interface Bookmark {
  id: number;
  surahId: number;
  ayahId: number;
  createdAt: string;
  note?: string;
}

export interface ReadingProgress {
  id: number;
  surahId: number;
  ayahId: number;
  lastReadAt: string;
  percentage: number;
}

export interface UserStats {
  id: number;
  totalPagesRead: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  totalXP: number;
  lastActiveDate: string;
  dailyTargetPages: number;
}

// Initialize database
export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('lifequran.db');

  // Create surahs table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS surahs (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      arabic_name TEXT NOT NULL,
      english_name TEXT NOT NULL,
      revelation_type TEXT NOT NULL,
      number_of_ayahs INTEGER NOT NULL,
      surah_order INTEGER NOT NULL
    );
  `);

  // Create ayahs table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ayahs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL,
      number_in_surah INTEGER NOT NULL,
      text TEXT NOT NULL,
      translation TEXT NOT NULL,
      transliteration TEXT,
      FOREIGN KEY (surah_id) REFERENCES surahs (id)
    );
  `);

  // Create bookmarks table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL,
      ayah_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      note TEXT,
      FOREIGN KEY (surah_id) REFERENCES surahs (id),
      FOREIGN KEY (ayah_id) REFERENCES ayahs (id)
    );
  `);

  // Create reading_progress table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reading_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL,
      ayah_id INTEGER NOT NULL,
      last_read_at TEXT DEFAULT CURRENT_TIMESTAMP,
      percentage REAL DEFAULT 0,
      FOREIGN KEY (surah_id) REFERENCES surahs (id),
      FOREIGN KEY (ayah_id) REFERENCES ayahs (id)
    );
  `);

  // Create user_stats table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_pages_read INTEGER DEFAULT 0,
      total_minutes INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      total_xp INTEGER DEFAULT 0,
      last_active_date TEXT,
      daily_target_pages INTEGER DEFAULT 2
    );
  `);

  // Create daily_progress table for tracking daily reading
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      pages_read INTEGER DEFAULT 0,
      minutes_spent INTEGER DEFAULT 0,
      xp_gained INTEGER DEFAULT 0,
      target_completed INTEGER DEFAULT 0
    );
  `);

  console.log('✅ Database initialized successfully');
  return db;
};

// Get database instance
export const getDatabase = async () => {
  return await SQLite.openDatabaseAsync('lifequran.db');
};

// Database operations
export const DatabaseOperations = {
  // Get all surahs
  getAllSurahs: async (): Promise<Surah[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>('SELECT * FROM surahs ORDER BY surah_order');
    return result.map(row => ({
      id: row.id,
      name: row.name,
      arabicName: row.arabic_name,
      englishName: row.english_name,
      revelationType: row.revelation_type as 'Makkiyah' | 'Madaniyah',
      numberOfAyahs: row.number_of_ayahs,
      order: row.surah_order,
    }));
  },

  // Get surah by id
  getSurahById: async (id: number): Promise<Surah | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>('SELECT * FROM surahs WHERE id = ?', [id]);
    if (!result) return null;
    return {
      id: result.id,
      name: result.name,
      arabicName: result.arabic_name,
      englishName: result.english_name,
      revelationType: result.revelation_type,
      numberOfAyahs: result.number_of_ayahs,
      order: result.surah_order,
    };
  },

  // Get ayahs by surah id
  getAyahsBySurahId: async (surahId: number): Promise<Ayah[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>(
      'SELECT * FROM ayahs WHERE surah_id = ? ORDER BY number_in_surah',
      [surahId]
    );
    return result.map(row => ({
      id: row.id,
      surahId: row.surah_id,
      numberInSurah: row.number_in_surah,
      text: row.text,
      translation: row.translation,
      transliteration: row.transliteration,
    }));
  },

  // Add bookmark
  addBookmark: async (surahId: number, ayahId: number, note?: string) => {
    const db = await getDatabase();
    const result = await db.runAsync(
      'INSERT INTO bookmarks (surah_id, ayah_id, note) VALUES (?, ?, ?)',
      [surahId, ayahId, note || null]
    );
    return result.lastInsertRowId;
  },

  // Remove bookmark
  removeBookmark: async (id: number) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM bookmarks WHERE id = ?', [id]);
  },

  // Get all bookmarks
  getBookmarks: async (): Promise<Bookmark[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>('SELECT * FROM bookmarks ORDER BY created_at DESC');
    return result.map(row => ({
      id: row.id,
      surahId: row.surah_id,
      ayahId: row.ayah_id,
      createdAt: row.created_at,
      note: row.note,
    }));
  },

  // Update reading progress
  updateReadingProgress: async (surahId: number, ayahId: number, percentage: number) => {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<any>(
      'SELECT * FROM reading_progress WHERE surah_id = ?',
      [surahId]
    );

    if (existing) {
      await db.runAsync(
        'UPDATE reading_progress SET ayah_id = ?, last_read_at = CURRENT_TIMESTAMP, percentage = ? WHERE surah_id = ?',
        [ayahId, percentage, surahId]
      );
    } else {
      await db.runAsync(
        'INSERT INTO reading_progress (surah_id, ayah_id, percentage) VALUES (?, ?, ?)',
        [surahId, ayahId, percentage]
      );
    }
  },

  // Get user stats
  getUserStats: async (): Promise<UserStats | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>('SELECT * FROM user_stats WHERE id = 1');
    if (!result) {
      // Initialize default stats
      await db.runAsync(
        'INSERT INTO user_stats (total_pages_read, total_minutes, current_streak, longest_streak, level, total_xp, daily_target_pages) VALUES (0, 0, 0, 0, 1, 0, 2)'
      );
      return {
        id: 1,
        totalPagesRead: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        totalXP: 0,
        lastActiveDate: new Date().toISOString(),
        dailyTargetPages: 2,
      };
    }
    return {
      id: result.id,
      totalPagesRead: result.total_pages_read,
      totalMinutes: result.total_minutes,
      currentStreak: result.current_streak,
      longestStreak: result.longest_streak,
      level: result.level,
      totalXP: result.total_xp,
      lastActiveDate: result.last_active_date,
      dailyTargetPages: result.daily_target_pages,
    };
  },

  // Update user stats
  updateUserStats: async (stats: Partial<UserStats>) => {
    const db = await getDatabase();
    const fields = Object.keys(stats)
      .filter(key => key !== 'id')
      .map(key => {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        return `${snakeKey} = ?`;
      })
      .join(', ');
    
    const values = Object.keys(stats)
      .filter(key => key !== 'id')
      .map(key => stats[key as keyof UserStats]);

    await db.runAsync(`UPDATE user_stats SET ${fields} WHERE id = 1`, values);
  },
};

// Export seed function
export { seedSurahs } from './seed';
