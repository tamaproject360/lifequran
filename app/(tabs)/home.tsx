/**
 * LifeQuran Home Dashboard
 * 
 * Main dashboard dengan streak counter, XP progress, ayat harian, dll
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
} from '../../src/components';
import { useGamificationStore } from '../../src/store';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';

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
      
      {/* Header with Wave Background */}
      <View className="pt-16">
        <LinearGradient
          colors={
            isDark
              ? [theme.primary.emerald + '30', theme.colors.background]
              : [theme.primary.emerald + '15', theme.colors.background]
          }
          className="pb-6"
        >
          <WaveDecoration />
          
          <View className="px-6">
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.exp) }}
            >
              <Text className="text-3xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
                Assalamu'alaikum
              </Text>
              <Text className="text-base font-instrument-serif-italic text-gray-600 dark:text-gray-400">
                Tetaplah istiqomah membaca hari ini 🤲
              </Text>
            </MotiView>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-3 pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* XP Progress Bar */}
        <View className="mb-4">
          <XPProgressBar
            currentXP={levelInfo.currentXP}
            nextLevelXP={levelInfo.nextLevelXP}
            level={levelInfo.level}
            levelName={levelInfo.name}
            levelIcon={levelInfo.icon}
            progress={levelInfo.progress}
          />
        </View>

        {/* Streak Counter */}
        <View className="mb-4">
          <StreakCounter
            streak={streakInfo.currentStreak}
            longestStreak={streakInfo.longestStreak}
            freezeAvailable={streakInfo.freezeAvailable}
          />
        </View>

        {/* Ayat Harian */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <Card variant="filled" size="large">
            <View className="space-y-3">
              <Text className="text-base font-satoshi-bold text-primary-emerald">
                ✨ Ayat Harian
              </Text>
              <Text className="text-2xl font-uthmani text-gray-900 dark:text-white text-right leading-10">
                {ayatHarian.arabic}
              </Text>
              <Text className="text-base font-instrument-serif-italic text-gray-600 dark:text-gray-300 leading-6">
                "{ayatHarian.translation}"
              </Text>
              <Text className="text-sm font-satoshi-medium text-gray-500 dark:text-gray-400">
                QS. {ayatHarian.surah}:{ayatHarian.ayah}
              </Text>
            </View>
          </Card>
        </MotiView>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <View className="mb-4">
            <DailyChallengeCard
              title={dailyChallenge.title}
              description={dailyChallenge.description}
              progress={dailyChallenge.currentProgress}
              target={dailyChallenge.targetValue}
              xpReward={dailyChallenge.xpReward}
              completed={dailyChallenge.completed}
              onPress={() => router.push('/quran')}
            />
          </View>
        )}

        {/* Lanjutkan Baca */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400, easing: Easing.out(Easing.exp) }}
          className="mb-4"
        >
          <Card variant="filled" size="medium">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-satoshi-medium text-gray-500 dark:text-gray-400 mb-1">
                  Lanjutkan Baca
                </Text>
                <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white">
                  {lastRead.surah}, Ayat {lastRead.ayah}
                </Text>
              </View>
              <Button variant="primary" size="small" onPress={() => router.push('/quran')}>
                Baca →
              </Button>
            </View>
          </Card>
        </MotiView>

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 500, easing: Easing.out(Easing.exp) }}
            className="mb-4"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white">
                Badge Terbaru
              </Text>
              <TouchableOpacity onPress={() => router.push('/gamification')}>
                <Text className="text-sm font-satoshi-bold text-primary-emerald">
                  Lihat Semua →
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
              {recentBadges.map((badge, index) => (
                <View key={badge.id} className="w-32">
                  <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 items-center">
                    <View className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-emerald to-celestial-mint items-center justify-center mb-2">
                      <Text className="text-3xl">{badge.icon}</Text>
                    </View>
                    <Text className="text-xs font-satoshi-bold text-gray-900 dark:text-white text-center" numberOfLines={2}>
                      {badge.name}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </MotiView>
        )}

        {/* Quick Stats */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 600, easing: Easing.out(Easing.exp) }}
        >
          <Card variant="outlined" size="medium">
            <View className="space-y-4">
              <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white">
                Statistik Minggu Ini
              </Text>
              <View className="flex-row justify-around">
                <StatItem icon="📚" label="Halaman" value="14" />
                <StatItem icon="⏱️" label="Menit" value="70" />
                <StatItem icon="✅" label="Hari Aktif" value="7" />
              </View>
            </View>
          </Card>
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

// Wave Decoration Component
const WaveDecoration: React.FC = () => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', top: 20, right: 24, opacity: 0.3 }, animatedStyle]}>
      <Text className="text-4xl">〰️</Text>
    </Animated.View>
  );
};

const StatItem: React.FC<{
  icon: string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <View className="flex-1 items-center">
    <Text className="text-3xl mb-2">{icon}</Text>
    <Text className="text-xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
      {value}
    </Text>
    <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
      {label}
    </Text>
  </View>
);

