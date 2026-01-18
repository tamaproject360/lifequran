/**
 * LifeQuran - Quran Data Fetcher & Importer
 * 
 * Download dan import data Al-Qur'an lengkap ke SQLite
 * Source: https://github.com/renomureza/quran-api-id
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { getDatabase } from './index';

// API Source - renomureza/quran-api-id
const QURAN_API_BASE = 'https://raw.githubusercontent.com/renomureza/quran-api-id/main/data';

interface SurahData {
  number: number;
  name: string;
  numberOfAyahs: number;
  revelation: string;
  tafsir: {
    id: string;
  };
  ayahs: Array<{
    number: {
      inQuran: number;
      inSurah: number;
    };
    arab: string;
    translation: string;
    tafsir: {
      kemenag: {
        short: string;
        long: string;
      };
    };
    meta: {
      juz: number;
      page: number;
      manzil: number;
      ruku: number;
      hizbQuarter: number;
      sajda: {
        recommended: boolean;
        obligatory: boolean;
      };
    };
    audio: {
      url: string;
    };
  }>;
}

export const QuranDataImporter = {
  /**
   * Import semua data Al-Qur'an dari GitHub JSON
   */
  importAllQuranData: async (onProgress?: (progress: number, message: string) => void) => {
    const db = await getDatabase();
    
    try {
      onProgress?.(0, 'Memulai import data Al-Qur\'an...');
      
      // Check if data already exists
      const existingData = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM surahs');
      if (existingData && existingData.count > 0) {
        onProgress?.(100, 'Data Al-Qur\'an sudah ada di database');
        return { success: true, message: 'Data already exists' };
      }

      // Fetch complete Quran data from GitHub
      onProgress?.(10, 'Mengunduh data Al-Qur\'an...');
      const response = await fetch(`${QURAN_API_BASE}/quran.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Quran data: ${response.statusText}`);
      }

      const quranData: SurahData[] = await response.json();
      onProgress?.(30, 'Data berhasil diunduh, memulai import...');

      // Import all surahs
      for (let i = 0; i < quranData.length; i++) {
        const surah = quranData[i];
        const progress = 30 + Math.floor((i / quranData.length) * 70);
        onProgress?.(progress, `Mengimport Surah ${surah.number}/114: ${surah.name}...`);
        
        await QuranDataImporter.importSurahData(surah);
      }

      onProgress?.(100, 'Import selesai! ✅');
      return { success: true, message: 'All data imported successfully' };
      
    } catch (error) {
      console.error('Error importing Quran data:', error);
      throw error;
    }
  },

  /**
   * Import satu surah data ke database
   */
  importSurahData: async (surah: SurahData) => {
    const db = await getDatabase();
    
    try {
      // Insert surah metadata
      await db.runAsync(
        `INSERT OR REPLACE INTO surahs (id, name, arabic_name, english_name, revelation_type, number_of_ayahs, surah_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          surah.number,
          surah.name,
          surah.name,
          surah.name,
          surah.revelation === 'Makkiyyah' ? 'Makkiyah' : 'Madaniyah',
          surah.numberOfAyahs,
          surah.number
        ]
      );

      // Insert all ayahs
      for (const ayah of surah.ayahs) {
        await db.runAsync(
          `INSERT OR REPLACE INTO ayahs (surah_id, number_in_surah, text, translation, juz_number, page_number)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            surah.number,
            ayah.number.inSurah,
            ayah.arab,
            ayah.translation,
            ayah.meta.juz,
            ayah.meta.page
          ]
        );

        // Insert tafsir if available
        if (ayah.tafsir?.kemenag) {
          await db.runAsync(
            `INSERT OR REPLACE INTO tafsir (surah_id, ayah_number, text_short, text_long)
             VALUES (?, ?, ?, ?)`,
            [
              surah.number,
              ayah.number.inSurah,
              ayah.tafsir.kemenag.short,
              ayah.tafsir.kemenag.long
            ]
          );
        }
      }
      
    } catch (error) {
      console.error(`Error importing surah ${surah.number}:`, error);
      throw error;
    }
  },

  /**
   * Check if Quran data exists in database
   */
  checkDataExists: async (): Promise<boolean> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM surahs');
    return result && result.count > 0;
  },

  /**
   * Get import progress
   */
  getImportProgress: async (): Promise<{ surahs: number; verses: number }> => {
    const db = await getDatabase();
    const surahCount = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM surahs');
    const verseCount = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM ayahs');
    
    return {
      surahs: surahCount?.count || 0,
      verses: verseCount?.count || 0
    };
  },

  /**
   * Clear all Quran data (for re-import)
   */
  clearAllData: async () => {
    const db = await getDatabase();
    await db.execAsync('DELETE FROM ayahs');
    await db.execAsync('DELETE FROM surahs');
    await db.execAsync('DELETE FROM tafsir');
    console.log('✅ All Quran data cleared');
  }
};
