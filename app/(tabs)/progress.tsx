/**
 * LifeQuran Progress/Statistics Screen
 * 
 * Premium statistics dengan Growth Map visualization
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { LoadingScreen, WavyShape } from '../../src/components';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useGamificationStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { theme, isDark } = useTheme();
  const { levelInfo, streakInfo, isLoading, loadGamificationData } = useGamificationStore();

  useEffect(() => {
    loadGamificationData();
  }, []);

  if (isLoading || !levelInfo || !streakInfo) {
    return <LoadingScreen />;
  }

  // Mock data for demonstration
  const stats = {
    totalPages: 142,
    totalMinutes: 350,
    totalDays: 28,
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
            colors={[colors.primary.emerald, '#16A34A']}
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
              {stats.totalPages} dari 604 halaman
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
          </LinearGradient>
        </MotiView>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}
            className="flex-1 min-w-[45%]"
          >
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mb-3">
                <Ionicons name="book" size={20} color={colors.primary.emerald} />
              </View>
              <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                {stats.totalPages}
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
            className="flex-1 min-w-[45%]"
          >
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <View className="w-10 h-10 rounded-full bg-celestial-mint/20 items-center justify-center mb-3">
                <Ionicons name="time" size={20} color={colors.celestial.mint} />
              </View>
              <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                {stats.totalMinutes}
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
            className="flex-1 min-w-[45%]"
          >
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <View className="w-10 h-10 rounded-full bg-muted-gold/20 items-center justify-center mb-3">
                <Ionicons name="flame" size={20} color={colors.muted.gold} />
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
            className="flex-1 min-w-[45%]"
          >
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mb-3">
                <Ionicons name="calendar" size={20} color={colors.primary.emerald} />
              </View>
              <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                {stats.totalDays}
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
                color={colors.muted.gold}
              />
              <AchievementItem
                icon="📈"
                title="Rata-rata Harian"
                value={`${stats.averagePerDay} halaman`}
                color={colors.primary.emerald}
              />
              <AchievementItem
                icon="⭐"
                title="Level Saat Ini"
                value={levelInfo.name}
                color={colors.celestial.mint}
              />
            </View>
          </View>
        </MotiView>

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
