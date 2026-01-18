/**
 * LifeQuran Seed Data - 114 Surahs
 * 
 * Data dasar 114 Surah Al-Qur'an
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import * as SQLite from 'expo-sqlite';

export const SURAHS_DATA = [
  { id: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة', englishName: 'The Opening', revelationType: 'Makkiyah', numberOfAyahs: 7, order: 1 },
  { id: 2, name: 'Al-Baqarah', arabicName: 'البقرة', englishName: 'The Cow', revelationType: 'Madaniyah', numberOfAyahs: 286, order: 2 },
  { id: 3, name: 'Ali Imran', arabicName: 'آل عمران', englishName: 'Family of Imran', revelationType: 'Madaniyah', numberOfAyahs: 200, order: 3 },
  { id: 4, name: 'An-Nisa', arabicName: 'النساء', englishName: 'The Women', revelationType: 'Madaniyah', numberOfAyahs: 176, order: 4 },
  { id: 5, name: 'Al-Maidah', arabicName: 'المائدة', englishName: 'The Table Spread', revelationType: 'Madaniyah', numberOfAyahs: 120, order: 5 },
  { id: 6, name: 'Al-Anam', arabicName: 'الأنعام', englishName: 'The Cattle', revelationType: 'Makkiyah', numberOfAyahs: 165, order: 6 },
  { id: 7, name: 'Al-Araf', arabicName: 'الأعراف', englishName: 'The Heights', revelationType: 'Makkiyah', numberOfAyahs: 206, order: 7 },
  { id: 8, name: 'Al-Anfal', arabicName: 'الأنفال', englishName: 'The Spoils of War', revelationType: 'Madaniyah', numberOfAyahs: 75, order: 8 },
  { id: 9, name: 'At-Taubah', arabicName: 'التوبة', englishName: 'The Repentance', revelationType: 'Madaniyah', numberOfAyahs: 129, order: 9 },
  { id: 10, name: 'Yunus', arabicName: 'يونس', englishName: 'Jonah', revelationType: 'Makkiyah', numberOfAyahs: 109, order: 10 },
  { id: 11, name: 'Hud', arabicName: 'هود', englishName: 'Hud', revelationType: 'Makkiyah', numberOfAyahs: 123, order: 11 },
  { id: 12, name: 'Yusuf', arabicName: 'يوسف', englishName: 'Joseph', revelationType: 'Makkiyah', numberOfAyahs: 111, order: 12 },
  { id: 13, name: 'Ar-Rad', arabicName: 'الرعد', englishName: 'The Thunder', revelationType: 'Madaniyah', numberOfAyahs: 43, order: 13 },
  { id: 14, name: 'Ibrahim', arabicName: 'ابراهيم', englishName: 'Abraham', revelationType: 'Makkiyah', numberOfAyahs: 52, order: 14 },
  { id: 15, name: 'Al-Hijr', arabicName: 'الحجر', englishName: 'The Rocky Tract', revelationType: 'Makkiyah', numberOfAyahs: 99, order: 15 },
  { id: 16, name: 'An-Nahl', arabicName: 'النحل', englishName: 'The Bee', revelationType: 'Makkiyah', numberOfAyahs: 128, order: 16 },
  { id: 17, name: 'Al-Isra', arabicName: 'الإسراء', englishName: 'The Night Journey', revelationType: 'Makkiyah', numberOfAyahs: 111, order: 17 },
  { id: 18, name: 'Al-Kahf', arabicName: 'الكهف', englishName: 'The Cave', revelationType: 'Makkiyah', numberOfAyahs: 110, order: 18 },
  { id: 19, name: 'Maryam', arabicName: 'مريم', englishName: 'Mary', revelationType: 'Makkiyah', numberOfAyahs: 98, order: 19 },
  { id: 20, name: 'Taha', arabicName: 'طه', englishName: 'Ta-Ha', revelationType: 'Makkiyah', numberOfAyahs: 135, order: 20 },
  { id: 21, name: 'Al-Anbiya', arabicName: 'الأنبياء', englishName: 'The Prophets', revelationType: 'Makkiyah', numberOfAyahs: 112, order: 21 },
  { id: 22, name: 'Al-Hajj', arabicName: 'الحج', englishName: 'The Pilgrimage', revelationType: 'Madaniyah', numberOfAyahs: 78, order: 22 },
  { id: 23, name: 'Al-Muminun', arabicName: 'المؤمنون', englishName: 'The Believers', revelationType: 'Makkiyah', numberOfAyahs: 118, order: 23 },
  { id: 24, name: 'An-Nur', arabicName: 'النور', englishName: 'The Light', revelationType: 'Madaniyah', numberOfAyahs: 64, order: 24 },
  { id: 25, name: 'Al-Furqan', arabicName: 'الفرقان', englishName: 'The Criterion', revelationType: 'Makkiyah', numberOfAyahs: 77, order: 25 },
  { id: 26, name: 'Ash-Shuara', arabicName: 'الشعراء', englishName: 'The Poets', revelationType: 'Makkiyah', numberOfAyahs: 227, order: 26 },
  { id: 27, name: 'An-Naml', arabicName: 'النمل', englishName: 'The Ant', revelationType: 'Makkiyah', numberOfAyahs: 93, order: 27 },
  { id: 28, name: 'Al-Qasas', arabicName: 'القصص', englishName: 'The Stories', revelationType: 'Makkiyah', numberOfAyahs: 88, order: 28 },
  { id: 29, name: 'Al-Ankabut', arabicName: 'العنكبوت', englishName: 'The Spider', revelationType: 'Makkiyah', numberOfAyahs: 69, order: 29 },
  { id: 30, name: 'Ar-Rum', arabicName: 'الروم', englishName: 'The Romans', revelationType: 'Makkiyah', numberOfAyahs: 60, order: 30 },
  { id: 31, name: 'Luqman', arabicName: 'لقمان', englishName: 'Luqman', revelationType: 'Makkiyah', numberOfAyahs: 34, order: 31 },
  { id: 32, name: 'As-Sajdah', arabicName: 'السجدة', englishName: 'The Prostration', revelationType: 'Makkiyah', numberOfAyahs: 30, order: 32 },
  { id: 33, name: 'Al-Ahzab', arabicName: 'الأحزاب', englishName: 'The Combined Forces', revelationType: 'Madaniyah', numberOfAyahs: 73, order: 33 },
  { id: 34, name: 'Saba', arabicName: 'سبإ', englishName: 'Sheba', revelationType: 'Makkiyah', numberOfAyahs: 54, order: 34 },
  { id: 35, name: 'Fatir', arabicName: 'فاطر', englishName: 'Originator', revelationType: 'Makkiyah', numberOfAyahs: 45, order: 35 },
  { id: 36, name: 'Ya-Sin', arabicName: 'يس', englishName: 'Ya Sin', revelationType: 'Makkiyah', numberOfAyahs: 83, order: 36 },
  { id: 37, name: 'As-Saffat', arabicName: 'الصافات', englishName: 'Those who set the Ranks', revelationType: 'Makkiyah', numberOfAyahs: 182, order: 37 },
  { id: 38, name: 'Sad', arabicName: 'ص', englishName: 'The Letter Saad', revelationType: 'Makkiyah', numberOfAyahs: 88, order: 38 },
  { id: 39, name: 'Az-Zumar', arabicName: 'الزمر', englishName: 'The Troops', revelationType: 'Makkiyah', numberOfAyahs: 75, order: 39 },
  { id: 40, name: 'Ghafir', arabicName: 'غافر', englishName: 'The Forgiver', revelationType: 'Makkiyah', numberOfAyahs: 85, order: 40 },
  { id: 41, name: 'Fussilat', arabicName: 'فصلت', englishName: 'Explained in Detail', revelationType: 'Makkiyah', numberOfAyahs: 54, order: 41 },
  { id: 42, name: 'Ash-Shuraa', arabicName: 'الشورى', englishName: 'The Consultation', revelationType: 'Makkiyah', numberOfAyahs: 53, order: 42 },
  { id: 43, name: 'Az-Zukhruf', arabicName: 'الزخرف', englishName: 'The Ornaments of Gold', revelationType: 'Makkiyah', numberOfAyahs: 89, order: 43 },
  { id: 44, name: 'Ad-Dukhan', arabicName: 'الدخان', englishName: 'The Smoke', revelationType: 'Makkiyah', numberOfAyahs: 59, order: 44 },
  { id: 45, name: 'Al-Jathiyah', arabicName: 'الجاثية', englishName: 'The Crouching', revelationType: 'Makkiyah', numberOfAyahs: 37, order: 45 },
  { id: 46, name: 'Al-Ahqaf', arabicName: 'الأحقاف', englishName: 'The Wind-Curved Sandhills', revelationType: 'Makkiyah', numberOfAyahs: 35, order: 46 },
  { id: 47, name: 'Muhammad', arabicName: 'محمد', englishName: 'Muhammad', revelationType: 'Madaniyah', numberOfAyahs: 38, order: 47 },
  { id: 48, name: 'Al-Fath', arabicName: 'الفتح', englishName: 'The Victory', revelationType: 'Madaniyah', numberOfAyahs: 29, order: 48 },
  { id: 49, name: 'Al-Hujurat', arabicName: 'الحجرات', englishName: 'The Rooms', revelationType: 'Madaniyah', numberOfAyahs: 18, order: 49 },
  { id: 50, name: 'Qaf', arabicName: 'ق', englishName: 'The Letter Qaf', revelationType: 'Makkiyah', numberOfAyahs: 45, order: 50 },
  { id: 51, name: 'Adh-Dhariyat', arabicName: 'الذاريات', englishName: 'The Winnowing Winds', revelationType: 'Makkiyah', numberOfAyahs: 60, order: 51 },
  { id: 52, name: 'At-Tur', arabicName: 'الطور', englishName: 'The Mount', revelationType: 'Makkiyah', numberOfAyahs: 49, order: 52 },
  { id: 53, name: 'An-Najm', arabicName: 'النجم', englishName: 'The Star', revelationType: 'Makkiyah', numberOfAyahs: 62, order: 53 },
  { id: 54, name: 'Al-Qamar', arabicName: 'القمر', englishName: 'The Moon', revelationType: 'Makkiyah', numberOfAyahs: 55, order: 54 },
  { id: 55, name: 'Ar-Rahman', arabicName: 'الرحمن', englishName: 'The Beneficent', revelationType: 'Madaniyah', numberOfAyahs: 78, order: 55 },
  { id: 56, name: 'Al-Waqiah', arabicName: 'الواقعة', englishName: 'The Inevitable', revelationType: 'Makkiyah', numberOfAyahs: 96, order: 56 },
  { id: 57, name: 'Al-Hadid', arabicName: 'الحديد', englishName: 'The Iron', revelationType: 'Madaniyah', numberOfAyahs: 29, order: 57 },
  { id: 58, name: 'Al-Mujadila', arabicName: 'المجادلة', englishName: 'The Pleading Woman', revelationType: 'Madaniyah', numberOfAyahs: 22, order: 58 },
  { id: 59, name: 'Al-Hashr', arabicName: 'الحشر', englishName: 'The Exile', revelationType: 'Madaniyah', numberOfAyahs: 24, order: 59 },
  { id: 60, name: 'Al-Mumtahanah', arabicName: 'الممتحنة', englishName: 'She that is to be examined', revelationType: 'Madaniyah', numberOfAyahs: 13, order: 60 },
  { id: 61, name: 'As-Saf', arabicName: 'الصف', englishName: 'The Ranks', revelationType: 'Madaniyah', numberOfAyahs: 14, order: 61 },
  { id: 62, name: 'Al-Jumuah', arabicName: 'الجمعة', englishName: 'The Congregation', revelationType: 'Madaniyah', numberOfAyahs: 11, order: 62 },
  { id: 63, name: 'Al-Munafiqun', arabicName: 'المنافقون', englishName: 'The Hypocrites', revelationType: 'Madaniyah', numberOfAyahs: 11, order: 63 },
  { id: 64, name: 'At-Taghabun', arabicName: 'التغابن', englishName: 'The Mutual Disillusion', revelationType: 'Madaniyah', numberOfAyahs: 18, order: 64 },
  { id: 65, name: 'At-Talaq', arabicName: 'الطلاق', englishName: 'The Divorce', revelationType: 'Madaniyah', numberOfAyahs: 12, order: 65 },
  { id: 66, name: 'At-Tahrim', arabicName: 'التحريم', englishName: 'The Prohibition', revelationType: 'Madaniyah', numberOfAyahs: 12, order: 66 },
  { id: 67, name: 'Al-Mulk', arabicName: 'الملك', englishName: 'The Sovereignty', revelationType: 'Makkiyah', numberOfAyahs: 30, order: 67 },
  { id: 68, name: 'Al-Qalam', arabicName: 'القلم', englishName: 'The Pen', revelationType: 'Makkiyah', numberOfAyahs: 52, order: 68 },
  { id: 69, name: 'Al-Haqqah', arabicName: 'الحاقة', englishName: 'The Reality', revelationType: 'Makkiyah', numberOfAyahs: 52, order: 69 },
  { id: 70, name: 'Al-Maarij', arabicName: 'المعارج', englishName: 'The Ascending Stairways', revelationType: 'Makkiyah', numberOfAyahs: 44, order: 70 },
  { id: 71, name: 'Nuh', arabicName: 'نوح', englishName: 'Noah', revelationType: 'Makkiyah', numberOfAyahs: 28, order: 71 },
  { id: 72, name: 'Al-Jinn', arabicName: 'الجن', englishName: 'The Jinn', revelationType: 'Makkiyah', numberOfAyahs: 28, order: 72 },
  { id: 73, name: 'Al-Muzzammil', arabicName: 'المزمل', englishName: 'The Enshrouded One', revelationType: 'Makkiyah', numberOfAyahs: 20, order: 73 },
  { id: 74, name: 'Al-Muddaththir', arabicName: 'المدثر', englishName: 'The Cloaked One', revelationType: 'Makkiyah', numberOfAyahs: 56, order: 74 },
  { id: 75, name: 'Al-Qiyamah', arabicName: 'القيامة', englishName: 'The Resurrection', revelationType: 'Makkiyah', numberOfAyahs: 40, order: 75 },
  { id: 76, name: 'Al-Insan', arabicName: 'الانسان', englishName: 'The Man', revelationType: 'Madaniyah', numberOfAyahs: 31, order: 76 },
  { id: 77, name: 'Al-Mursalat', arabicName: 'المرسلات', englishName: 'The Emissaries', revelationType: 'Makkiyah', numberOfAyahs: 50, order: 77 },
  { id: 78, name: 'An-Naba', arabicName: 'النبإ', englishName: 'The Tidings', revelationType: 'Makkiyah', numberOfAyahs: 40, order: 78 },
  { id: 79, name: 'An-Naziat', arabicName: 'النازعات', englishName: 'Those who drag forth', revelationType: 'Makkiyah', numberOfAyahs: 46, order: 79 },
  { id: 80, name: 'Abasa', arabicName: 'عبس', englishName: 'He Frowned', revelationType: 'Makkiyah', numberOfAyahs: 42, order: 80 },
  { id: 81, name: 'At-Takwir', arabicName: 'التكوير', englishName: 'The Overthrowing', revelationType: 'Makkiyah', numberOfAyahs: 29, order: 81 },
  { id: 82, name: 'Al-Infitar', arabicName: 'الإنفطار', englishName: 'The Cleaving', revelationType: 'Makkiyah', numberOfAyahs: 19, order: 82 },
  { id: 83, name: 'Al-Mutaffifin', arabicName: 'المطففين', englishName: 'The Defrauding', revelationType: 'Makkiyah', numberOfAyahs: 36, order: 83 },
  { id: 84, name: 'Al-Inshiqaq', arabicName: 'الإنشقاق', englishName: 'The Sundering', revelationType: 'Makkiyah', numberOfAyahs: 25, order: 84 },
  { id: 85, name: 'Al-Buruj', arabicName: 'البروج', englishName: 'The Mansions of the Stars', revelationType: 'Makkiyah', numberOfAyahs: 22, order: 85 },
  { id: 86, name: 'At-Tariq', arabicName: 'الطارق', englishName: 'The Nightcomer', revelationType: 'Makkiyah', numberOfAyahs: 17, order: 86 },
  { id: 87, name: 'Al-Ala', arabicName: 'الأعلى', englishName: 'The Most High', revelationType: 'Makkiyah', numberOfAyahs: 19, order: 87 },
  { id: 88, name: 'Al-Ghashiyah', arabicName: 'الغاشية', englishName: 'The Overwhelming', revelationType: 'Makkiyah', numberOfAyahs: 26, order: 88 },
  { id: 89, name: 'Al-Fajr', arabicName: 'الفجر', englishName: 'The Dawn', revelationType: 'Makkiyah', numberOfAyahs: 30, order: 89 },
  { id: 90, name: 'Al-Balad', arabicName: 'البلد', englishName: 'The City', revelationType: 'Makkiyah', numberOfAyahs: 20, order: 90 },
  { id: 91, name: 'Ash-Shams', arabicName: 'الشمس', englishName: 'The Sun', revelationType: 'Makkiyah', numberOfAyahs: 15, order: 91 },
  { id: 92, name: 'Al-Layl', arabicName: 'الليل', englishName: 'The Night', revelationType: 'Makkiyah', numberOfAyahs: 21, order: 92 },
  { id: 93, name: 'Ad-Duhaa', arabicName: 'الضحى', englishName: 'The Morning Hours', revelationType: 'Makkiyah', numberOfAyahs: 11, order: 93 },
  { id: 94, name: 'Ash-Sharh', arabicName: 'الشرح', englishName: 'The Relief', revelationType: 'Makkiyah', numberOfAyahs: 8, order: 94 },
  { id: 95, name: 'At-Tin', arabicName: 'التين', englishName: 'The Fig', revelationType: 'Makkiyah', numberOfAyahs: 8, order: 95 },
  { id: 96, name: 'Al-Alaq', arabicName: 'العلق', englishName: 'The Clot', revelationType: 'Makkiyah', numberOfAyahs: 19, order: 96 },
  { id: 97, name: 'Al-Qadr', arabicName: 'القدر', englishName: 'The Power', revelationType: 'Makkiyah', numberOfAyahs: 5, order: 97 },
  { id: 98, name: 'Al-Bayyinah', arabicName: 'البينة', englishName: 'The Clear Proof', revelationType: 'Madaniyah', numberOfAyahs: 8, order: 98 },
  { id: 99, name: 'Az-Zalzalah', arabicName: 'الزلزلة', englishName: 'The Earthquake', revelationType: 'Madaniyah', numberOfAyahs: 8, order: 99 },
  { id: 100, name: 'Al-Adiyat', arabicName: 'العاديات', englishName: 'The Courser', revelationType: 'Makkiyah', numberOfAyahs: 11, order: 100 },
  { id: 101, name: 'Al-Qariah', arabicName: 'القارعة', englishName: 'The Calamity', revelationType: 'Makkiyah', numberOfAyahs: 11, order: 101 },
  { id: 102, name: 'At-Takathur', arabicName: 'التكاثر', englishName: 'The Rivalry in world increase', revelationType: 'Makkiyah', numberOfAyahs: 8, order: 102 },
  { id: 103, name: 'Al-Asr', arabicName: 'العصر', englishName: 'The Declining Day', revelationType: 'Makkiyah', numberOfAyahs: 3, order: 103 },
  { id: 104, name: 'Al-Humazah', arabicName: 'الهمزة', englishName: 'The Traducer', revelationType: 'Makkiyah', numberOfAyahs: 9, order: 104 },
  { id: 105, name: 'Al-Fil', arabicName: 'الفيل', englishName: 'The Elephant', revelationType: 'Makkiyah', numberOfAyahs: 5, order: 105 },
  { id: 106, name: 'Quraish', arabicName: 'قريش', englishName: 'Quraysh', revelationType: 'Makkiyah', numberOfAyahs: 4, order: 106 },
  { id: 107, name: 'Al-Maun', arabicName: 'الماعون', englishName: 'The Small kindnesses', revelationType: 'Makkiyah', numberOfAyahs: 7, order: 107 },
  { id: 108, name: 'Al-Kauthar', arabicName: 'الكوثر', englishName: 'The Abundance', revelationType: 'Makkiyah', numberOfAyahs: 3, order: 108 },
  { id: 109, name: 'Al-Kafirun', arabicName: 'الكافرون', englishName: 'The Disbelievers', revelationType: 'Makkiyah', numberOfAyahs: 6, order: 109 },
  { id: 110, name: 'An-Nasr', arabicName: 'النصر', englishName: 'The Divine Support', revelationType: 'Madaniyah', numberOfAyahs: 3, order: 110 },
  { id: 111, name: 'Al-Masad', arabicName: 'المسد', englishName: 'The Palm Fiber', revelationType: 'Makkiyah', numberOfAyahs: 5, order: 111 },
  { id: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص', englishName: 'The Sincerity', revelationType: 'Makkiyah', numberOfAyahs: 4, order: 112 },
  { id: 113, name: 'Al-Falaq', arabicName: 'الفلق', englishName: 'The Daybreak', revelationType: 'Makkiyah', numberOfAyahs: 5, order: 113 },
  { id: 114, name: 'An-Nas', arabicName: 'الناس', englishName: 'Mankind', revelationType: 'Makkiyah', numberOfAyahs: 6, order: 114 },
];

export const seedSurahs = async () => {
  const db = await SQLite.openDatabaseAsync('lifequran.db');

  // Check if data already exists
  const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM surahs');
  
  if (existing && existing.count > 0) {
    console.log('✅ Surahs data already seeded');
    return;
  }

  console.log('🌱 Seeding surahs data...');

  // Insert all surahs
  for (const surah of SURAHS_DATA) {
    await db.runAsync(
      'INSERT INTO surahs (id, name, arabic_name, english_name, revelation_type, number_of_ayahs, surah_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [surah.id, surah.name, surah.arabicName, surah.englishName, surah.revelationType, surah.numberOfAyahs, surah.order]
    );
  }

  console.log('✅ Successfully seeded 114 surahs');
};
