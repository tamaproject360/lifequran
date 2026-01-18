/**
 * LifeQuran Progress/Statistics Screen
 * 
 * Premium statistics dengan Growth Map visualization
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { LoadingScreen, WavyShape, HeatmapCalendar, GrowthMapTimeline } from '../../src/components';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useGamificationStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getProgressStats,
  getHeatmapData,
  calculateKhatamPrediction,
} from '../../src/utils/statisticsManager';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { theme, isDark } = useTheme();
  const { levelInfo, streakInfo, isLoading, loadGamificationData } = useGamificationStore();
  const [progressStats, setProgressStats] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [khatamPrediction, setKhatamPrediction] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'heatmap' | 'timeline'>('overview');

  useEffect(() => {
    loadGamificationData();
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // Mock user ID - replace with actual user ID from auth
      const userId = 'user_1';
      
      const stats = await getProgressStats(userId);
      setProgressStats(stats);

      // Get last 90 days heatmap
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);
      
      const heatmap = await getHeatmapData(
        userId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setHeatmapData(heatmap);

      const prediction = await calculateKhatamPrediction(userId);
      setKhatamPrediction(prediction);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  if (isLoading || !levelInfo || !streakInfo) {
    return <LoadingScreen />;
  }

  const stats = progressStats || {
    totalPagesRead: 142,
    totalMinutesSpent: 350,
    totalDaysActive: 28,
    currentStreak: streakInfo.currentStreak,
    longestStreak: streakInfo.longestStreak,
    averagePerDay: 5,
    completionPercentage: 23,
  };

  const weeklyData = [
    { day: 'Sen', pages: 8, active: true },
    { day: 'Sel', pages: 5, active: true },
    { day: 'Rab', pages: 7, active: true },
    { day: 'Kam', pages: 6, active: true },
    { day: 'Jum', pages: 9, active: true },
    { day: 'Sab', pages: 4, active: true },
    { day: 'Min', pages: 7, active: true },
  ];

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
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.exp) }}
            >
              <Text className="text-3xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                Progress
              </Text>
              <Text className="text-sm font-satoshi text-gray-600 dark:text-gray-400">
                Pantau perjalanan spiritual Anda
              </Text>
            </MotiView>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 100, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <LinearGradient
            colors={[Colors.primary.emerald, '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, padding: 24 }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-satoshi-bold text-white">
                Total Progress
              </Text>
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="trophy" size={20} color="white" />
              </View>
            </View>
            
            <Text className="text-5xl font-satoshi-bold text-white mb-2">
              {stats.completionPercentage}%
            </Text>
            <Text className="text-sm font-satoshi text-white/80">
              {stats.totalPagesRead} dari 604 halaman
            </Text>
            
            {/* Progress Bar */}
            <View className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: `${stats.completionPercentage}%` }}
                transition={{ type: 'timing', duration: 1000, delay: 300 }}
                className="h-full bg-white rounded-full"
              />
            </View>

            {/* Khatam Prediction */}
            {khatamPrediction && (
              <View className="mt-4 pt-4 border-t border-white/20">
                <Text className="text-xs font-satoshi text-white/80 mb-1">
                  Prediksi Khatam
                </Text>
                <Text className="text-base font-satoshi-bold text-white">
                  {new Date(khatamPrediction.estimatedDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text className="text-xs font-satoshi text-white/70 mt-1">
                  {khatamPrediction.daysRemaining} hari lagi
                </Text>
              </View>
            )}
          </LinearGradient>
        </MotiView>

        {/* Tab Selector */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 150, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
            <TouchableOpacity
              onPress={() => setSelectedTab('overview')}
              className={`flex-1 py-2 rounded-xl ${
                selectedTab === 'overview' ? 'bg-white dark:bg-gray-700' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-satoshi-bold ${
                  selectedTab === 'overview'
                    ? 'text-primary-emerald'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('heatmap')}
              className={`flex-1 py-2 rounded-xl ${
                selectedTab === 'heatmap' ? 'bg-white dark:bg-gray-700' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-satoshi-bold ${
                  selectedTab === 'heatmap'
                    ? 'text-primary-emerald'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Heatmap
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('timeline')}
              className={`flex-1 py-2 rounded-xl ${
                selectedTab === 'timeline' ? 'bg-white dark:bg-gray-700' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-satoshi-bold ${
                  selectedTab === 'timeline'
                    ? 'text-primary-emerald'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Timeline
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Content based on selected tab */}
        {selectedTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <View className="flex-row flex-wrap gap-3 mb-4">
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 200 }}
                className="flex-1"
                style={{ minWidth: '45%' }}
              >
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mb-3">
                    <Ionicons name="book" size={20} color={Colors.primary.emerald} />
                  </View>
                  <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                    {stats.totalPagesRead}
                  </Text>
                  <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                    Total Halaman
                  </Text>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 250 }}
                className="flex-1"
                style={{ minWidth: '45%' }}
              >
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <View className="w-10 h-10 rounded-full bg-celestial-mint/20 items-center justify-center mb-3">
                    <Ionicons name="time" size={20} color={Colors.primary.celestial} />
                  </View>
                  <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                    {stats.totalMinutesSpent}
                  </Text>
                  <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                    Total Menit
                  </Text>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 300 }}
                className="flex-1"
                style={{ minWidth: '45%' }}
              >
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <View className="w-10 h-10 rounded-full bg-muted-gold/20 items-center justify-center mb-3">
                    <Ionicons name="flame" size={20} color={Colors.primary.gold} />
                  </View>
                  <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                    {stats.currentStreak}
                  </Text>
                  <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                    Hari Streak
                  </Text>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 350 }}
                className="flex-1"
                style={{ minWidth: '45%' }}
              >
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mb-3">
                    <Ionicons name="calendar" size={20} color={Colors.primary.emerald} />
                  </View>
                  <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                    {stats.totalDaysActive}
                  </Text>
                  <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                    Hari Aktif
                  </Text>
                </View>
              </MotiView>
            </View>

            {/* Weekly Activity */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 400, easing: Easing.out(Easing.exp) }}
              className="mb-4"
            >
              <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
                <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white mb-4">
                  Aktivitas Minggu Ini
                </Text>
                
                <View className="flex-row justify-between items-end" style={{ height: 120 }}>
                  {weeklyData.map((item, index) => {
                    const maxPages = Math.max(...weeklyData.map(d => d.pages));
                    const heightPercentage = (item.pages / maxPages) * 100;
                    
                    return (
                      <View key={item.day} className="flex-1 items-center">
                        <MotiView
                          from={{ height: 0 }}
                          animate={{ height: `${heightPercentage}%` }}
                          transition={{ 
                            type: 'timing', 
                            duration: 600, 
                            delay: 500 + (index * 50),
                            easing: Easing.out(Easing.exp)
                          }}
                          className="w-8 bg-primary-emerald rounded-t-lg mb-2"
                          style={{ minHeight: 20 }}
                        />
                        <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                          {item.day}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </MotiView>

            {/* Achievements Summary */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 450, easing: Easing.out(Easing.exp) }}
            >
              <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
                <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white mb-4">
                  Pencapaian
                </Text>
                
                <View className="space-y-3">
                  <AchievementItem
                    icon="🏆"
                    title="Longest Streak"
                    value={`${stats.longestStreak} hari`}
                    color={Colors.primary.gold}
                  />
                  <AchievementItem
                    icon="📈"
                    title="Rata-rata Harian"
                    value={`${stats.averagePerDay} halaman`}
                    color={Colors.primary.emerald}
                  />
                  <AchievementItem
                    icon="⭐"
                    title="Level Saat Ini"
                    value={levelInfo.name}
                    color={Colors.primary.celestial}
                  />
                </View>
              </View>
            </MotiView>
          </>
        )}

        {selectedTab === 'heatmap' && heatmapData.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 200, easing: Easing.out(Easing.exp) }}
          >
            <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
              <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white mb-4">
                Aktivitas 90 Hari Terakhir
              </Text>
              <HeatmapCalendar
                data={heatmapData}
                startDate={heatmapData[0]?.date || ''}
                endDate={heatmapData[heatmapData.length - 1]?.date || ''}
              />
            </View>
          </MotiView>
        )}

        {selectedTab === 'timeline' && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 200, easing: Easing.out(Easing.exp) }}
          >
            <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
              <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white mb-4">
                Growth Map
              </Text>
              <GrowthMapTimeline
                milestones={[
                  {
                    id: '1',
                    title: 'Memulai Perjalanan',
                    description: 'Membaca halaman pertama',
                    date: '2026-01-01',
                    icon: 'flag',
                    completed: true,
                    xpEarned: 10,
                  },
                  {
                    id: '2',
                    title: 'Streak 7 Hari',
                    description: 'Konsisten membaca 7 hari berturut-turut',
                    date: '2026-01-07',
                    icon: 'flame',
                    completed: true,
                    xpEarned: 100,
                  },
                  {
                    id: '3',
                    title: 'Level 2',
                    description: 'Naik ke level Pembelajar',
                    date: '2026-01-10',
                    icon: 'trophy',
                    completed: true,
                    xpEarned: 50,
                  },
                  {
                    id: '4',
                    title: '100 Halaman',
                    description: 'Membaca 100 halaman Al-Quran',
                    date: '2026-01-15',
                    icon: 'book',
                    completed: false,
                  },
                ]}
              />
            </View>
          </MotiView>
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

const AchievementItem: React.FC<{
  icon: string;
  title: string;
  value: string;
  color: string;
}> = ({ icon, title, value, color }) => (
  <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <View className="flex-row items-center flex-1">
      <Text className="text-2xl mr-3">{icon}</Text>
      <Text className="text-sm font-satoshi text-gray-600 dark:text-gray-400">
        {title}
      </Text>
    </View>
    <Text 
      className="text-base font-satoshi-bold"
      style={{ color }}
    >
      {value}
    </Text>
  </View>
);
