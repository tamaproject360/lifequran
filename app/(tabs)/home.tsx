/**
 * LifeQuran Home Dashboard
 * 
 * Premium dashboard dengan Divine Nature Architecture
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { 
  Card, 
  Button, 
  XPProgressBar, 
  StreakCounter, 
  DailyChallengeCard,
  LoadingScreen,
  LevelUpModal,
  BadgeUnlockModal,
  WavyShape,
} from '../../src/components';
import { useGamificationStore } from '../../src/store';
import { Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    levelInfo,
    streakInfo,
    dailyChallenge,
    recentBadges,
    isLoading,
    loadGamificationData,
    showLevelUpModal,
    showBadgeUnlockModal,
    newlyUnlockedBadge,
    setShowLevelUpModal,
    setShowBadgeUnlockModal,
  } = useGamificationStore();

  useEffect(() => {
    loadGamificationData();
  }, []);

  const ayatHarian = {
    arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan',
    surah: 'Al-Insyirah',
    ayah: 5,
  };

  const lastRead = {
    surah: 'Al-Baqarah',
    ayah: 142,
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadGamificationData().finally(() => setRefreshing(false));
  }, []);

  if (isLoading || !levelInfo || !streakInfo) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-midnight-emerald">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header with Organic Wave */}
      <View className="relative">
        <LinearGradient
          colors={
            isDark
              ? ['#022C22', '#022C22']
              : ['#F0FDF4', '#FFFFFF']
          }
          className="pt-16 pb-8"
        >
          {/* Wavy Shape Background */}
          <View className="absolute top-0 left-0 right-0">
            <WavyShape width={width} height={200} variant="top" opacity={0.15} />
          </View>
          
          <View className="px-6 relative z-10">
            {/* Greeting */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.exp) }}
            >
              <Text className="text-3xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                Assalamu'alaikum
              </Text>
              <Text className="text-base font-satoshi text-gray-600 dark:text-gray-400">
                Tetaplah istiqomah membaca hari ini 🤲
              </Text>
            </MotiView>

            {/* XP Progress Bar */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 100 }}
              className="mt-6"
            >
              <XPProgressBar
                currentXP={levelInfo.currentXP}
                nextLevelXP={levelInfo.nextLevelXP}
                level={levelInfo.level}
                levelName={levelInfo.name}
                levelIcon={levelInfo.icon}
                progress={levelInfo.progress}
              />
            </MotiView>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary.emerald}
          />
        }
      >
        {/* Streak Counter */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 150, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <StreakCounter
            streak={streakInfo.currentStreak}
            longestStreak={streakInfo.longestStreak}
            freezeAvailable={streakInfo.freezeAvailable}
          />
        </MotiView>

        {/* Ayat Harian - Premium Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <View className="bg-gradient-to-br from-celestial-mint/10 to-primary-emerald/5 rounded-3xl p-6 border border-primary-emerald/20">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary-emerald/20 items-center justify-center mr-3">
                <Ionicons name="book-outline" size={20} color={colors.primary.emerald} />
              </View>
              <Text className="text-base font-satoshi-bold text-primary-emerald">
                Ayat Harian
              </Text>
            </View>
            
            <View className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 mb-4">
              <Text 
                className="text-2xl font-instrument-serif text-gray-900 dark:text-white text-right leading-10"
                style={{ writingDirection: 'rtl' }}
              >
                {ayatHarian.arabic}
              </Text>
            </View>
            
            <Text className="text-base font-satoshi text-gray-700 dark:text-gray-300 leading-6 mb-3">
              "{ayatHarian.translation}"
            </Text>
            
            <View className="flex-row items-center">
              <Ionicons name="bookmark-outline" size={14} color={colors.gray[500]} />
              <Text className="text-sm font-satoshi-medium text-gray-500 dark:text-gray-400 ml-2">
                QS. {ayatHarian.surah}:{ayatHarian.ayah}
              </Text>
            </View>
          </View>
        </MotiView>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 250, easing: Easing.out(Easing.exp) }}
            className="mb-4"
          >
            <DailyChallengeCard
              title={dailyChallenge.title}
              description={dailyChallenge.description}
              progress={dailyChallenge.currentProgress}
              target={dailyChallenge.targetValue}
              xpReward={dailyChallenge.xpReward}
              completed={dailyChallenge.completed}
              onPress={() => router.push('/(tabs)/quran')}
            />
          </MotiView>
        )}

        {/* Lanjutkan Baca - 5-Minute Mode Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 300, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/quran')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.primary.emerald, '#16A34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 24, padding: 20 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
                      <Ionicons name="play" size={16} color="white" />
                    </View>
                    <Text className="text-sm font-satoshi-medium text-white/80">
                      5-Minute Mode
                    </Text>
                  </View>
                  <Text className="text-xl font-satoshi-bold text-white mb-1">
                    Lanjutkan Baca
                  </Text>
                  <Text className="text-sm font-satoshi text-white/90">
                    {lastRead.surah}, Ayat {lastRead.ayah}
                  </Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 350, easing: Easing.out(Easing.exp) }}
            className="mb-4"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white">
                Badge Terbaru
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/gamification')}>
                <Text className="text-sm font-satoshi-bold text-primary-emerald">
                  Lihat Semua →
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {recentBadges.map((badge, index) => (
                <MotiView
                  key={badge.id}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: 'timing', 
                    duration: 400, 
                    delay: 400 + (index * 50),
                    easing: Easing.out(Easing.exp)
                  }}
                >
                  <View className="w-32 bg-white dark:bg-gray-800 rounded-2xl p-4 items-center shadow-sm">
                    <LinearGradient
                      colors={['#22C55E', '#ADFFD8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: 32, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: 8 
                      }}
                    >
                      <Text className="text-3xl">{badge.icon}</Text>
                    </LinearGradient>
                    <Text 
                      className="text-xs font-satoshi-bold text-gray-900 dark:text-white text-center" 
                      numberOfLines={2}
                    >
                      {badge.name}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </ScrollView>
          </MotiView>
        )}

        {/* Quick Stats - Growth Map Preview */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400, easing: Easing.out(Easing.exp) }}
        >
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white">
                Statistik Minggu Ini
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/progress')}>
                <Ionicons name="chevron-forward" size={20} color={colors.primary.emerald} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-around">
              <StatItem icon="📚" label="Halaman" value="14" color={colors.primary.emerald} />
              <View className="w-px h-16 bg-gray-200 dark:bg-gray-700" />
              <StatItem icon="⏱️" label="Menit" value="70" color={colors.celestial.mint} />
              <View className="w-px h-16 bg-gray-200 dark:bg-gray-700" />
              <StatItem icon="✅" label="Hari Aktif" value="7" color={colors.muted.gold} />
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

      {/* Level Up Modal */}
      {levelInfo && (
        <LevelUpModal
          visible={showLevelUpModal}
          level={levelInfo.level}
          levelName={levelInfo.name}
          levelIcon={levelInfo.icon}
          onClose={() => setShowLevelUpModal(false)}
        />
      )}

      {/* Badge Unlock Modal */}
      {newlyUnlockedBadge && (
        <BadgeUnlockModal
          visible={showBadgeUnlockModal}
          badgeName={newlyUnlockedBadge.name}
          badgeDescription={newlyUnlockedBadge.description}
          badgeIcon={newlyUnlockedBadge.icon}
          xpReward={newlyUnlockedBadge.xpReward}
          onClose={() => setShowBadgeUnlockModal(false)}
        />
      )}
    </View>
  );
}

const StatItem: React.FC<{
  icon: string;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <View className="flex-1 items-center">
    <Text className="text-3xl mb-2">{icon}</Text>
    <Text 
      className="text-2xl font-satoshi-bold mb-1"
      style={{ color }}
    >
      {value}
    </Text>
    <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
      {label}
    </Text>
  </View>
);
