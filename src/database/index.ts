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
  try {
    const db = await SQLite.openDatabaseAsync('lifequran.db', {
      useNewConnection: true, // Fix for Android NullPointerException
    });

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
      juz_number INTEGER,
      page_number INTEGER,
      FOREIGN KEY (surah_id) REFERENCES surahs (id)
    );
  `);

  // Create tafsir table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tafsir (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      text_short TEXT,
      text_long TEXT,
      FOREIGN KEY (surah_id) REFERENCES surahs (id)
    );
  `);

  // Create asbabun_nuzul table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS asbabun_nuzul (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL,
      ayah_number INTEGER,
      story TEXT NOT NULL,
      source TEXT,
      FOREIGN KEY (surah_id) REFERENCES surahs (id)
    );
  `);

  // Create surah_virtues table (keutamaan surah)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS surah_virtues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL UNIQUE,
      virtue_text TEXT NOT NULL,
      hadith_reference TEXT,
      FOREIGN KEY (surah_id) REFERENCES surahs (id)
    );
  `);

  // Create daily_duas table (doa sehari-hari)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_duas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      arabic_text TEXT NOT NULL,
      transliteration TEXT,
      translation TEXT NOT NULL,
      category TEXT NOT NULL,
      reference TEXT
    );
  `);

  // Create motivational_quotes table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS motivational_quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT,
      category TEXT,
      is_quranic INTEGER DEFAULT 0
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

  // Create badges table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      category TEXT NOT NULL,
      requirement_type TEXT NOT NULL,
      requirement_value INTEGER NOT NULL,
      xp_reward INTEGER DEFAULT 0,
      unlocked INTEGER DEFAULT 0,
      unlocked_at TEXT
    );
  `);

  // Create daily_challenges table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      challenge_type TEXT NOT NULL,
      target_value INTEGER NOT NULL,
      current_progress INTEGER DEFAULT 0,
      xp_reward INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT
    );
  `);

  // Create streak_history table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS streak_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      streak_count INTEGER NOT NULL,
      freeze_used INTEGER DEFAULT 0
    );
  `);

  // Create xp_transactions table for tracking XP gains
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS xp_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      source TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = async () => {
  try {
    return await SQLite.openDatabaseAsync('lifequran.db', {
      useNewConnection: true, // Fix for Android NullPointerException
    });
  } catch (error) {
    console.error('❌ Error opening database:', error);
    throw error;
  }
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
      [surahId, ayahId, note ?? null]
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

  // XP & Leveling Operations
  addXP: async (amount: number, source: string, description?: string) => {
    const db = await getDatabase();
    
    // Add XP transaction
    await db.runAsync(
      'INSERT INTO xp_transactions (amount, source, description) VALUES (?, ?, ?)',
      [amount, source, description ?? null]
    );

    // Update total XP
    const stats = await DatabaseOperations.getUserStats();
    if (stats) {
      const newXP = stats.totalXP + amount;
      const newLevel = DatabaseOperations.calculateLevel(newXP);
      
      await db.runAsync(
        'UPDATE user_stats SET total_xp = ?, level = ? WHERE id = 1',
        [newXP, newLevel]
      );

      return { newXP, newLevel, leveledUp: newLevel > stats.level };
    }
  },

  calculateLevel: (xp: number): number => {
    if (xp < 500) return 1;
    if (xp < 1500) return 2;
    if (xp < 3500) return 3;
    if (xp < 7000) return 4;
    if (xp < 15000) return 5;
    return 6;
  },

  getLevelName: (level: number): string => {
    const levels = ['Pemula', 'Pelajar', 'Rajin', 'Istiqomah', 'Hafizh Muda', 'Master'];
    return levels[level - 1] || 'Master';
  },

  getLevelIcon: (level: number): string => {
    const icons = ['🌱', '📖', '⭐', '🌙', '💎', '👑'];
    return icons[level - 1] || '👑';
  },

  getXPForNextLevel: (currentLevel: number): number => {
    const thresholds = [500, 1500, 3500, 7000, 15000];
    return thresholds[currentLevel - 1] || 15000;
  },

  // Streak Operations
  updateStreak: async () => {
    const db = await getDatabase();
    const stats = await DatabaseOperations.getUserStats();
    if (!stats) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate).toISOString().split('T')[0] : null;

    if (lastActive === today) {
      // Already active today
      return stats.currentStreak;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = stats.currentStreak;

    if (lastActive === yesterday) {
      // Continue streak
      newStreak = stats.currentStreak + 1;
    } else if (lastActive !== today) {
      // Streak broken
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, stats.longestStreak);

    await db.runAsync(
      'UPDATE user_stats SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE id = 1',
      [newStreak, longestStreak, new Date().toISOString()]
    );

    // Record streak history
    await db.runAsync(
      'INSERT INTO streak_history (date, streak_count) VALUES (?, ?)',
      [today, newStreak]
    );

    // Award bonus XP for 7-day streak
    if (newStreak % 7 === 0) {
      await DatabaseOperations.addXP(100, 'streak_bonus', `${newStreak} hari streak!`);
    }

    return newStreak;
  },

  // Badge Operations
  initializeBadges: async () => {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM badges');
    
    if (existing.count > 0) return; // Already initialized

    const badges = [
      // Reading Milestones
      { name: 'Langkah Pertama', description: 'Baca 1 halaman pertama', icon: '🌱', category: 'reading', requirement_type: 'pages_read', requirement_value: 1, xp_reward: 10 },
      { name: 'Pembaca Rajin', description: 'Baca 10 halaman', icon: '📖', category: 'reading', requirement_type: 'pages_read', requirement_value: 10, xp_reward: 50 },
      { name: 'Pencinta Al-Quran', description: 'Baca 50 halaman', icon: '💚', category: 'reading', requirement_type: 'pages_read', requirement_value: 50, xp_reward: 100 },
      { name: 'Khatam Pertama', description: 'Selesaikan 1 Juz', icon: '⭐', category: 'reading', requirement_type: 'juz_completed', requirement_value: 1, xp_reward: 500 },
      { name: 'Hafizh Muda', description: 'Selesaikan 10 Juz', icon: '💎', category: 'reading', requirement_type: 'juz_completed', requirement_value: 10, xp_reward: 2000 },
      { name: 'Khatam 30 Juz', description: 'Selesaikan seluruh Al-Quran', icon: '👑', category: 'reading', requirement_type: 'juz_completed', requirement_value: 30, xp_reward: 5000 },
      
      // Streak Milestones
      { name: 'Konsisten 3 Hari', description: 'Baca 3 hari berturut-turut', icon: '🔥', category: 'streak', requirement_type: 'streak', requirement_value: 3, xp_reward: 30 },
      { name: 'Istiqomah 7 Hari', description: 'Baca 7 hari berturut-turut', icon: '🌟', category: 'streak', requirement_type: 'streak', requirement_value: 7, xp_reward: 100 },
      { name: 'Istiqomah 30 Hari', description: 'Baca 30 hari berturut-turut', icon: '🌙', category: 'streak', requirement_type: 'streak', requirement_value: 30, xp_reward: 500 },
      { name: 'Istiqomah 100 Hari', description: 'Baca 100 hari berturut-turut', icon: '💫', category: 'streak', requirement_type: 'streak', requirement_value: 100, xp_reward: 2000 },
      
      // Challenge Milestones
      { name: 'Penakluk Tantangan', description: 'Selesaikan 10 daily challenge', icon: '🎯', category: 'challenge', requirement_type: 'challenges_completed', requirement_value: 10, xp_reward: 200 },
      { name: 'Master Tantangan', description: 'Selesaikan 50 daily challenge', icon: '🏆', category: 'challenge', requirement_type: 'challenges_completed', requirement_value: 50, xp_reward: 1000 },
    ];

    for (const badge of badges) {
      await db.runAsync(
        'INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value, xp_reward) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [badge.name, badge.description, badge.icon, badge.category, badge.requirement_type, badge.requirement_value, badge.xp_reward]
      );
    }
  },

  checkAndUnlockBadges: async () => {
    const db = await getDatabase();
    const stats = await DatabaseOperations.getUserStats();
    if (!stats) return [];

    const unlockedBadges = [];
    const badges = await db.getAllAsync<any>('SELECT * FROM badges WHERE unlocked = 0');

    for (const badge of badges) {
      let shouldUnlock = false;

      switch (badge.requirement_type) {
        case 'pages_read':
          shouldUnlock = stats.totalPagesRead >= badge.requirement_value;
          break;
        case 'streak':
          shouldUnlock = stats.currentStreak >= badge.requirement_value;
          break;
        case 'juz_completed':
          // Calculate from pages (each juz ≈ 20 pages)
          const juzCompleted = Math.floor(stats.totalPagesRead / 20);
          shouldUnlock = juzCompleted >= badge.requirement_value;
          break;
      }

      if (shouldUnlock) {
        await db.runAsync(
          'UPDATE badges SET unlocked = 1, unlocked_at = ? WHERE id = ?',
          [new Date().toISOString(), badge.id]
        );
        
        // Award XP
        if (badge.xp_reward > 0) {
          await DatabaseOperations.addXP(badge.xp_reward, 'badge_unlock', badge.name);
        }

        unlockedBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          xpReward: badge.xp_reward,
        });
      }
    }

    return unlockedBadges;
  },

  getAllBadges: async () => {
    const db = await getDatabase();
    return await db.getAllAsync<any>('SELECT * FROM badges ORDER BY requirement_value');
  },

  getUnlockedBadges: async () => {
    const db = await getDatabase();
    return await db.getAllAsync<any>('SELECT * FROM badges WHERE unlocked = 1 ORDER BY unlocked_at DESC');
  },

  // Daily Challenge Operations
  generateDailyChallenge: async () => {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if challenge already exists for today
    const existing = await db.getFirstAsync<any>(
      'SELECT * FROM daily_challenges WHERE date = ?',
      [today]
    );

    if (existing) return existing;

    // Generate random challenge
    const challenges = [
      { title: 'Baca 1 Halaman', description: 'Baca minimal 1 halaman Al-Quran hari ini', type: 'pages', target: 1, xp: 25 },
      { title: 'Baca 2 Halaman', description: 'Baca minimal 2 halaman Al-Quran hari ini', type: 'pages', target: 2, xp: 50 },
      { title: 'Baca 5 Menit', description: 'Habiskan 5 menit membaca Al-Quran', type: 'minutes', target: 5, xp: 30 },
      { title: 'Baca 1 Surah Pendek', description: 'Selesaikan membaca 1 surah pendek', type: 'surah', target: 1, xp: 40 },
      { title: 'Dengarkan Murottal', description: 'Dengarkan 1 surah murottal', type: 'audio', target: 1, xp: 20 },
    ];

    const challenge = challenges[Math.floor(Math.random() * challenges.length)];

    await db.runAsync(
      'INSERT INTO daily_challenges (date, title, description, challenge_type, target_value, xp_reward) VALUES (?, ?, ?, ?, ?, ?)',
      [today, challenge.title, challenge.description, challenge.type, challenge.target, challenge.xp]
    );

    return await db.getFirstAsync<any>('SELECT * FROM daily_challenges WHERE date = ?', [today]);
  },

  getTodayChallenge: async () => {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    
    let challenge = await db.getFirstAsync<any>(
      'SELECT * FROM daily_challenges WHERE date = ?',
      [today]
    );

    if (!challenge) {
      challenge = await DatabaseOperations.generateDailyChallenge();
    }

    return challenge;
  },

  updateChallengeProgress: async (progress: number) => {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const challenge = await DatabaseOperations.getTodayChallenge();

    if (!challenge || challenge.completed) return;

    const newProgress = Math.min(progress, challenge.target_value);
    const completed = newProgress >= challenge.target_value ? 1 : 0;

    await db.runAsync(
      'UPDATE daily_challenges SET current_progress = ?, completed = ?, completed_at = ? WHERE date = ?',
      [newProgress, completed, completed ? new Date().toISOString() : null, today]
    );

    if (completed && !challenge.completed) {
      // Award XP
      await DatabaseOperations.addXP(challenge.xp_reward, 'daily_challenge', challenge.title);
      return true; // Challenge completed
    }

    return false;
  },

  // Tafsir Operations
  getTafsirByAyah: async (surahId: number, ayahNumber: number) => {
    const db = await getDatabase();
    return await db.getFirstAsync<any>(
      'SELECT * FROM tafsir WHERE surah_id = ? AND ayah_number = ?',
      [surahId, ayahNumber]
    );
  },

  addTafsir: async (surahId: number, ayahNumber: number, textShort: string, textLong?: string) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO tafsir (surah_id, ayah_number, text_short, text_long) VALUES (?, ?, ?, ?)',
      [surahId, ayahNumber, textShort, textLong ?? null]
    );
  },

  // Asbabun Nuzul Operations
  getAsbabunNuzulBySurah: async (surahId: number) => {
    const db = await getDatabase();
    return await db.getAllAsync<any>(
      'SELECT * FROM asbabun_nuzul WHERE surah_id = ? ORDER BY ayah_number',
      [surahId]
    );
  },

  addAsbabunNuzul: async (surahId: number, story: string, ayahNumber?: number, source?: string) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO asbabun_nuzul (surah_id, ayah_number, story, source) VALUES (?, ?, ?, ?)',
      [surahId, ayahNumber ?? null, story, source ?? null]
    );
  },

  // Surah Virtues Operations
  getSurahVirtue: async (surahId: number) => {
    const db = await getDatabase();
    return await db.getFirstAsync<any>(
      'SELECT * FROM surah_virtues WHERE surah_id = ?',
      [surahId]
    );
  },

  addSurahVirtue: async (surahId: number, virtueText: string, hadithReference?: string) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO surah_virtues (surah_id, virtue_text, hadith_reference) VALUES (?, ?, ?)',
      [surahId, virtueText, hadithReference ?? null]
    );
  },

  // Daily Duas Operations
  getAllDuas: async () => {
    const db = await getDatabase();
    return await db.getAllAsync<any>('SELECT * FROM daily_duas ORDER BY category, title');
  },

  getDuasByCategory: async (category: string) => {
    const db = await getDatabase();
    return await db.getAllAsync<any>(
      'SELECT * FROM daily_duas WHERE category = ? ORDER BY title',
      [category]
    );
  },

  addDua: async (title: string, arabicText: string, translation: string, category: string, transliteration?: string, reference?: string) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO daily_duas (title, arabic_text, transliteration, translation, category, reference) VALUES (?, ?, ?, ?, ?, ?)',
      [title, arabicText, transliteration ?? null, translation, category, reference ?? null]
    );
  },

  // Motivational Quotes Operations
  getRandomQuote: async () => {
    const db = await getDatabase();
    return await db.getFirstAsync<any>(
      'SELECT * FROM motivational_quotes ORDER BY RANDOM() LIMIT 1'
    );
  },

  getAllQuotes: async () => {
    const db = await getDatabase();
    return await db.getAllAsync<any>('SELECT * FROM motivational_quotes');
  },

  addQuote: async (text: string, author?: string, category?: string, isQuranic: boolean = false) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO motivational_quotes (text, author, category, is_quranic) VALUES (?, ?, ?, ?)',
      [text, author ?? null, category ?? null, isQuranic ? 1 : 0]
    );
  },

  // Initialize content data
  initializeContentData: async () => {
    const db = await getDatabase();
    
    // Check if data already exists
    const duasCount = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM daily_duas');
    const quotesCount = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM motivational_quotes');
    
    if (duasCount.count === 0) {
      // Add sample duas
      const duas = [
        {
          title: 'Doa Sebelum Tidur',
          arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          transliteration: 'Bismika Allahumma amuutu wa ahyaa',
          translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup',
          category: 'Tidur',
          reference: 'HR. Bukhari'
        },
        {
          title: 'Doa Bangun Tidur',
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
          transliteration: 'Alhamdulillahil-ladzi ahyana ba\'da ma amatana wa ilaihin-nusyur',
          translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami akan kembali',
          category: 'Bangun Tidur',
          reference: 'HR. Bukhari'
        },
        {
          title: 'Doa Sebelum Makan',
          arabic: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismillah',
          translation: 'Dengan nama Allah',
          category: 'Makan',
          reference: 'HR. Abu Dawud'
        },
        {
          title: 'Doa Sesudah Makan',
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
          transliteration: 'Alhamdulillahil-ladzi ath\'amana wa saqana wa ja\'alana muslimin',
          translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim',
          category: 'Makan',
          reference: 'HR. Abu Dawud'
        },
        {
          title: 'Doa Keluar Rumah',
          arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
          transliteration: 'Bismillah, tawakkaltu \'alallah, la hawla wa la quwwata illa billah',
          translation: 'Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan pertolongan Allah',
          category: 'Perjalanan',
          reference: 'HR. Abu Dawud'
        },
      ];

      for (const dua of duas) {
        await DatabaseOperations.addDua(
          dua.title,
          dua.arabic,
          dua.translation,
          dua.category,
          dua.transliteration,
          dua.reference
        );
      }
    }

    if (quotesCount.count === 0) {
      // Add sample quotes
      const quotes = [
        { text: 'Sesungguhnya bersama kesulitan ada kemudahan', author: 'QS. Al-Insyirah: 6', category: 'Motivasi', isQuranic: true },
        { text: 'Dan Dia bersama kamu di mana saja kamu berada', author: 'QS. Al-Hadid: 4', category: 'Keimanan', isQuranic: true },
        { text: 'Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?', author: 'QS. Ar-Rahman: 13', category: 'Syukur', isQuranic: true },
        { text: 'Karena itu, ingatlah kamu kepada-Ku niscaya Aku ingat (pula) kepadamu', author: 'QS. Al-Baqarah: 152', category: 'Dzikir', isQuranic: true },
        { text: 'Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar', author: 'QS. At-Talaq: 2', category: 'Takwa', isQuranic: true },
      ];

      for (const quote of quotes) {
        await DatabaseOperations.addQuote(quote.text, quote.author, quote.category, quote.isQuranic);
      }
    }

    console.log('✅ Content data initialized');
  },
};

// Export seed function
export { seedSurahs } from './seed';
