/**
 * LifeQuran Al-Qur'an Screen
 * 
 * Premium Surah list dengan Divine Nature Architecture
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { LoadingScreen, WavyShape } from '../../src/components';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { DatabaseOperations } from '../../src/database';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

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

  const handleTabChange = (tab: 'surah' | 'juz') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleSurahPress = (surahNumber: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/reading?surah=${surahNumber}`);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-midnight-emerald">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header with Wave */}
      <View className="relative">
        <LinearGradient
          colors={
            isDark
              ? ['#022C22', '#022C22']
              : ['#F0FDF4', '#FFFFFF']
          }
          className="pt-16 pb-6"
        >
          {/* Wavy Shape Background */}
          <View className="absolute top-0 left-0 right-0">
            <WavyShape width={width} height={180} variant="top" opacity={0.1} />
          </View>
          
          <View className="px-6 relative z-10">
            {/* Title */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.exp) }}
            >
              <Text className="text-3xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                Al-Qur'an
              </Text>
              <Text className="text-sm font-satoshi text-gray-600 dark:text-gray-400 mb-4">
                114 Surah • 30 Juz
              </Text>
            </MotiView>

            {/* Search Bar */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 100 }}
            >
              <View className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 flex-row items-center shadow-sm border border-gray-200 dark:border-gray-700">
                <Ionicons name="search" size={20} color={Colors.light.text.tertiary} />
                <TextInput
                  className="flex-1 ml-3 text-base font-satoshi text-gray-900 dark:text-white"
                  placeholder="Cari surah..."
                  placeholderTextColor={Colors.light.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={Colors.light.text.tertiary} />
                  </TouchableOpacity>
                )}
              </View>
            </MotiView>

            {/* Tab Switcher */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 150 }}
              className="mt-4"
            >
              <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 flex-row">
                <TouchableOpacity
                  onPress={() => handleTabChange('surah')}
                  className="flex-1"
                  activeOpacity={0.7}
                >
                  <View
                    className={`py-3 rounded-xl items-center ${
                      activeTab === 'surah'
                        ? 'bg-primary-emerald'
                        : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-sm font-satoshi-bold ${
                        activeTab === 'surah'
                          ? 'text-white'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Surah
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => handleTabChange('juz')}
                  className="flex-1"
                  activeOpacity={0.7}
                >
                  <View
                    className={`py-3 rounded-xl items-center ${
                      activeTab === 'juz'
                        ? 'bg-primary-emerald'
                        : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-sm font-satoshi-bold ${
                        activeTab === 'juz'
                          ? 'text-white'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Juz
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </MotiView>
          </View>
        </LinearGradient>
      </View>

      {/* Surah List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredSurahs.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-base font-satoshi text-gray-500 dark:text-gray-400">
              Tidak ada surah yang ditemukan
            </Text>
          </View>
        ) : (
          filteredSurahs.map((surah, index) => (
            <MotiView
              key={surah.number}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 400,
                delay: index * 30,
                easing: Easing.out(Easing.exp),
              }}
            >
              <TouchableOpacity
                onPress={() => handleSurahPress(surah.number)}
                activeOpacity={0.7}
                className="mb-3"
              >
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-center shadow-sm border border-gray-100 dark:border-gray-700">
                  {/* Surah Number */}
                  <View className="w-12 h-12 rounded-full bg-primary-emerald/10 items-center justify-center mr-4">
                    <Text className="text-base font-satoshi-bold text-primary-emerald">
                      {surah.number}
                    </Text>
                  </View>

                  {/* Surah Info */}
                  <View className="flex-1">
                    <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white mb-1">
                      {surah.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                        {surah.type}
                      </Text>
                      <View className="w-1 h-1 rounded-full bg-gray-400 mx-2" />
                      <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                        {surah.ayahs} Ayat
                      </Text>
                    </View>
                  </View>

                  {/* Arabic Name */}
                  <Text className="text-xl font-instrument-serif text-primary-emerald ml-3">
                    {surah.arabicName}
                  </Text>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))
        )}

        {/* Signature */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 800, delay: 500 }}
          className="mt-8 items-center"
        >
          <Text className="text-xs font-instrument-serif-italic text-gray-400 dark:text-gray-600 text-center">
            Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
          </Text>
        </MotiView>
      </ScrollView>
    </View>
  );
}
