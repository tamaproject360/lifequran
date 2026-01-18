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
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card, Button } from '../../src/components';
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

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  // Mock data (akan diganti dengan data real dari database/store)
  const userData = {
    name: 'Assalamu\'alaikum',
    streak: 7,
    level: 3,
    levelName: 'Rajin',
    xp: 2500,
    xpToNextLevel: 3500,
    dailyGoal: 2, // pages
    dailyProgress: 1, // pages completed today
    lastRead: {
      surah: 'Al-Baqarah',
      ayah: 142,
    },
  };

  const ayatHarian = {
    arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan',
    surah: 'Al-Insyirah',
    ayah: 5,
  };

  const dailyChallenge = {
    title: 'Baca 2 Halaman Hari Ini',
    description: 'Selesaikan target harian Anda',
    xpReward: 25,
    progress: userData.dailyProgress,
    target: userData.dailyGoal,
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header with Wave Background */}
      <View style={styles.header}>
        <LinearGradient
          colors={
            isDark
              ? [theme.primary.emerald + '30', theme.colors.background]
              : [theme.primary.emerald + '15', theme.colors.background]
          }
          style={styles.headerGradient}
        >
          <WaveDecoration theme={theme} />
          
          <View style={styles.headerContent}>
            <Animated.Text
              entering={FadeInDown.delay(100).duration(500)}
              style={[
                styles.greeting,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.fontFamily.satoshi.bold,
                },
              ]}
            >
              {userData.name}
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(200).duration(500)}
              style={[
                styles.tagline,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fontFamily.instrumentSerif.italic,
                },
              ]}
            >
              Tetaplah istiqomah membaca hari ini 🤲
            </Animated.Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Streak & Level Row */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.statsRow}
        >
          <StreakCard streak={userData.streak} theme={theme} />
          <LevelCard
            level={userData.level}
            levelName={userData.levelName}
            xp={userData.xp}
            xpToNextLevel={userData.xpToNextLevel}
            theme={theme}
          />
        </Animated.View>

        {/* Ayat Harian */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <AyatHarianCard ayat={ayatHarian} theme={theme} />
        </Animated.View>

        {/* Daily Challenge */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <DailyChallengeCard challenge={dailyChallenge} theme={theme} />
        </Animated.View>

        {/* Lanjutkan Baca */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <ContinueReadingCard lastRead={userData.lastRead} theme={theme} />
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
          <QuickStatsCard theme={theme} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Wave Decoration Component
const WaveDecoration: React.FC<{ theme: any }> = ({ theme }) => {
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
    <Animated.View style={[styles.wave, animatedStyle]}>
      <Text style={styles.waveText}>〰️</Text>
    </Animated.View>
  );
};

// Streak Card Component
const StreakCard: React.FC<{ streak: number; theme: any }> = ({ streak, theme }) => (
  <Card variant="elevated" size="medium" style={styles.statCard}>
    <View style={styles.statCardContent}>
      <Text style={styles.statIcon}>🔥</Text>
      <View>
        <Text
          style={[
            styles.statValue,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.satoshi.bold,
            },
          ]}
        >
          {streak} Hari
        </Text>
        <Text
          style={[
            styles.statLabel,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.fontFamily.satoshi.regular,
            },
          ]}
        >
          Streak
        </Text>
      </View>
    </View>
  </Card>
);

// Level Card Component
const LevelCard: React.FC<{
  level: number;
  levelName: string;
  xp: number;
  xpToNextLevel: number;
  theme: any;
}> = ({ level, levelName, xp, xpToNextLevel, theme }) => {
  const progress = (xp / xpToNextLevel) * 100;

  return (
    <Card variant="elevated" size="medium" style={styles.statCard}>
      <View style={styles.levelCardContent}>
        <View style={styles.levelHeader}>
          <Text style={styles.statIcon}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.levelName,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.fontFamily.satoshi.bold,
                },
              ]}
            >
              Level {level} - {levelName}
            </Text>
            <Text
              style={[
                styles.xpText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fontFamily.satoshi.regular,
                },
              ]}
            >
              {xp} / {xpToNextLevel} XP
            </Text>
          </View>
        </View>
        <View
          style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress}%`,
                backgroundColor: theme.primary.emerald,
              },
            ]}
          />
        </View>
      </View>
    </Card>
  );
};

// Ayat Harian Card
const AyatHarianCard: React.FC<{ ayat: any; theme: any }> = ({ ayat, theme }) => (
  <Card variant="filled" size="large">
    <View style={styles.ayatCard}>
      <Text
        style={[
          styles.ayatTitle,
          {
            color: theme.primary.emerald,
            fontFamily: theme.fontFamily.satoshi.bold,
          },
        ]}
      >
        ✨ Ayat Harian
      </Text>
      <Text
        style={[
          styles.ayatArabic,
          {
            color: theme.colors.text.primary,
            fontFamily: theme.fontFamily.uthmani.regular,
            textAlign: 'right',
          },
        ]}
      >
        {ayat.arabic}
      </Text>
      <Text
        style={[
          styles.ayatTranslation,
          {
            color: theme.colors.text.secondary,
            fontFamily: theme.fontFamily.instrumentSerif.italic,
          },
        ]}
      >
        "{ayat.translation}"
      </Text>
      <Text
        style={[
          styles.ayatReference,
          {
            color: theme.colors.text.tertiary,
            fontFamily: theme.fontFamily.satoshi.medium,
          },
        ]}
      >
        QS. {ayat.surah}:{ayat.ayah}
      </Text>
    </View>
  </Card>
);

// Daily Challenge Card
const DailyChallengeCard: React.FC<{ challenge: any; theme: any }> = ({
  challenge,
  theme,
}) => {
  const progress = (challenge.progress / challenge.target) * 100;

  return (
    <Card variant="elevated" size="medium">
      <View style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.challengeTitle,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.fontFamily.satoshi.bold,
                },
              ]}
            >
              🎯 {challenge.title}
            </Text>
            <Text
              style={[
                styles.challengeDescription,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fontFamily.satoshi.regular,
                },
              ]}
            >
              {challenge.description}
            </Text>
          </View>
          <View
            style={[
              styles.xpBadge,
              { backgroundColor: theme.primary.gold + '20' },
            ]}
          >
            <Text
              style={[
                styles.xpBadgeText,
                {
                  color: theme.primary.gold,
                  fontFamily: theme.fontFamily.satoshi.bold,
                },
              ]}
            >
              +{challenge.xpReward} XP
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.challengeProgressBg,
            { backgroundColor: theme.colors.border },
          ]}
        >
          <View
            style={[
              styles.challengeProgressFill,
              {
                width: `${progress}%`,
                backgroundColor: theme.primary.emerald,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.challengeProgress,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.fontFamily.satoshi.medium,
            },
          ]}
        >
          {challenge.progress} / {challenge.target} halaman
        </Text>
      </View>
    </Card>
  );
};

// Continue Reading Card
const ContinueReadingCard: React.FC<{ lastRead: any; theme: any }> = ({
  lastRead,
  theme,
}) => (
  <Card variant="filled" size="medium">
    <View style={styles.continueCard}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.continueTitle,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.fontFamily.satoshi.medium,
            },
          ]}
        >
          Lanjutkan Baca
        </Text>
        <Text
          style={[
            styles.continueSubtitle,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.satoshi.bold,
            },
          ]}
        >
          {lastRead.surah}, Ayat {lastRead.ayah}
        </Text>
      </View>
      <Button variant="primary" size="small">
        Baca →
      </Button>
    </View>
  </Card>
);

// Quick Stats Card
const QuickStatsCard: React.FC<{ theme: any }> = ({ theme }) => (
  <Card variant="outlined" size="medium">
    <View style={styles.quickStats}>
      <Text
        style={[
          styles.quickStatsTitle,
          {
            color: theme.colors.text.primary,
            fontFamily: theme.fontFamily.satoshi.bold,
          },
        ]}
      >
        Statistik Minggu Ini
      </Text>
      <View style={styles.statsGrid}>
        <StatItem icon="📚" label="Halaman" value="14" theme={theme} />
        <StatItem icon="⏱️" label="Menit" value="70" theme={theme} />
        <StatItem icon="✅" label="Hari Aktif" value="7" theme={theme} />
      </View>
    </View>
  </Card>
);

const StatItem: React.FC<{
  icon: string;
  label: string;
  value: string;
  theme: any;
}> = ({ icon, label, value, theme }) => (
  <View style={styles.statItem}>
    <Text style={styles.statItemIcon}>{icon}</Text>
    <Text
      style={[
        styles.statItemValue,
        {
          color: theme.colors.text.primary,
          fontFamily: theme.fontFamily.satoshi.bold,
        },
      ]}
    >
      {value}
    </Text>
    <Text
      style={[
        styles.statItemLabel,
        {
          color: theme.colors.text.secondary,
          fontFamily: theme.fontFamily.satoshi.regular,
        },
      ]}
    >
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
  },
  headerGradient: {
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  wave: {
    position: 'absolute',
    top: 20,
    right: 24,
    opacity: 0.3,
  },
  waveText: {
    fontSize: 40,
  },
  greeting: {
    fontSize: 28,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 12,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 20,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  levelCardContent: {
    gap: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelName: {
    fontSize: 14,
    marginBottom: 2,
  },
  xpText: {
    fontSize: 12,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  ayatCard: {
    gap: 12,
  },
  ayatTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  ayatArabic: {
    fontSize: 24,
    lineHeight: 40,
  },
  ayatTranslation: {
    fontSize: 16,
    lineHeight: 24,
  },
  ayatReference: {
    fontSize: 13,
    marginTop: 4,
  },
  challengeCard: {
    gap: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  challengeTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
  },
  xpBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpBadgeText: {
    fontSize: 12,
  },
  challengeProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  challengeProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  challengeProgress: {
    fontSize: 13,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  continueTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  continueSubtitle: {
    fontSize: 18,
  },
  quickStats: {
    gap: 16,
  },
  quickStatsTitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statItemValue: {
    fontSize: 20,
    marginBottom: 2,
  },
  statItemLabel: {
    fontSize: 12,
  },
});
