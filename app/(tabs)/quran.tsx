/**
 * LifeQuran Al-Qur'an Screen
 * 
 * Daftar Surah dan navigasi ke reading screen
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card, Loading } from '../../src/components';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { DatabaseOperations } from '../../src/database';

interface SurahItem {
  number: number;
  name: string;
  arabicName: string;
  ayahs: number;
  type: string;
}

export default function QuranScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const data = await DatabaseOperations.getAllSurahs();
      const formatted = data.map(surah => ({
        number: surah.id,
        name: surah.name,
        arabicName: surah.arabicName,
        ayahs: surah.numberOfAyahs,
        type: surah.revelationType,
      }));
      setSurahs(formatted);
    } catch (error) {
      console.error('Error loading surahs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(
    surah =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arabicName.includes(searchQuery)
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.satoshi.bold,
            },
          ]}
        >
          Al-Qur'an
        </Text>
        
        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.fontFamily.satoshi.regular,
              },
            ]}
            placeholder="Cari surah..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'surah' && {
                backgroundColor: theme.primary.emerald,
              },
            ]}
            onPress={() => setActiveTab('surah')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'surah' ? '#FFFFFF' : theme.colors.text.secondary,
                  fontFamily: theme.fontFamily.satoshi.medium,
                },
              ]}
            >
              Surah
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'juz' && {
                backgroundColor: theme.primary.emerald,
              },
            ]}
            onPress={() => setActiveTab('juz')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'juz' ? '#FFFFFF' : theme.colors.text.secondary,
                  fontFamily: theme.fontFamily.satoshi.medium,
                },
              ]}
            >
              Juz
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Surah List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <Loading.LoadingScreen message="Memuat Al-Qur'an..." />
        ) : filteredSurahs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              Tidak ada surah yang ditemukan
            </Text>
          </View>
        ) : (
          filteredSurahs.map((surah, index) => (
          <Animated.View
            key={surah.number}
            entering={FadeInDown.delay(index * 30).duration(400)}
          >
            <Card
              variant="outlined"
              size="small"
              onPress={() => {
                // TODO: Navigate to reading screen
                console.log('Open surah:', surah.name);
              }}
              style={styles.surahCard}
            >
              <View style={styles.surahContent}>
                <View
                  style={[
                    styles.surahNumber,
                    { backgroundColor: theme.primary.emerald + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.surahNumberText,
                      {
                        color: theme.primary.emerald,
                        fontFamily: theme.fontFamily.satoshi.bold,
                      },
                    ]}
                  >
                    {surah.number}
                  </Text>
                </View>
                
                <View style={styles.surahInfo}>
                  <Text
                    style={[
                      styles.surahName,
                      {
                        color: theme.colors.text.primary,
                        fontFamily: theme.fontFamily.satoshi.bold,
                      },
                    ]}
                  >
                    {surah.name}
                  </Text>
                  <Text
                    style={[
                      styles.surahMeta,
                      {
                        color: theme.colors.text.secondary,
                        fontFamily: theme.fontFamily.satoshi.regular,
                      },
                    ]}
                  >
                    {surah.type} • {surah.ayahs} Ayat
                  </Text>
                </View>

                <Text
                  style={[
                    styles.surahArabic,
                    {
                      color: theme.primary.emerald,
                      fontFamily: theme.fontFamily.uthmani.regular,
                    },
                  ]}
                >
                  {surah.arabicName}
                </Text>
              </View>
            </Card>
          </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 12,
  },
  surahCard: {
    marginBottom: 0,
  },
  surahContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNumberText: {
    fontSize: 16,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    marginBottom: 2,
  },
  surahMeta: {
    fontSize: 13,
  },
  surahArabic: {
    fontSize: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
  },
});
