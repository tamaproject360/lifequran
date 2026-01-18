/**
 * LifeQuran Gamification/Badge Screen
 * 
 * Badge gallery dan achievements
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { XPProgressBar, StreakCounter, BadgeCard, LoadingScreen } from '../../src/components';
import { useGamificationStore } from '../../src/store';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

export default function GamificationScreen() {
  const { isDark } = useTheme();
  const {
    levelInfo,
    streakInfo,
    badges,
    isLoading,
    loadGamificationData,
    loadBadges,
  } = useGamificationStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadGamificationData();
    loadBadges();
  }, []);

  if (isLoading || !levelInfo || !streakInfo) {
    return <LoadingScreen />;
  }

  const categories = [
    { id: 'all', label: 'Semua', icon: '🏆' },
    { id: 'reading', label: 'Bacaan', icon: '📖' },
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'challenge', label: 'Tantangan', icon: '🎯' },
  ];

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <View className="flex-1 bg-white dark:bg-midnight-emerald">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.exp) }}
        className="pt-16 px-6 pb-6"
      >
        <Text className="text-3xl font-satoshi-bold text-gray-900 dark:text-white mb-2">
          Pencapaian
        </Text>
        <Text className="text-sm font-satoshi text-gray-500 dark:text-gray-400">
          {unlockedCount} dari {totalCount} badge terbuka ({completionPercentage.toFixed(0)}%)
        </Text>
      </MotiView>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        {/* Level & Streak Cards */}
        <View className="px-6 mb-6 space-y-4">
          <XPProgressBar
            currentXP={levelInfo.currentXP}
            nextLevelXP={levelInfo.nextLevelXP}
            level={levelInfo.level}
            levelName={levelInfo.name}
            levelIcon={levelInfo.icon}
            progress={levelInfo.progress}
          />

          <StreakCounter
            streak={streakInfo.currentStreak}
            longestStreak={streakInfo.longestStreak}
            freezeAvailable={streakInfo.freezeAvailable}
          />
        </View>

        {/* Category Filter */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200, easing: Easing.out(Easing.exp) }}
          className="px-6 mb-6"
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="space-x-3"
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  selectedCategory === category.id
                    ? 'bg-primary-emerald'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <Text className="text-lg mr-2">{category.icon}</Text>
                <Text
                  className={`font-satoshi-bold ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </MotiView>

        {/* Badge Grid */}
        <View className="px-6">
          <View className="flex-row flex-wrap -mx-2">
            {filteredBadges.map((badge, index) => (
              <View key={badge.id} className="w-1/2 px-2 mb-4">
                <BadgeCard
                  name={badge.name}
                  description={badge.description}
                  icon={badge.icon}
                  unlocked={badge.unlocked}
                  xpReward={badge.xpReward}
                  index={index}
                />
              </View>
            ))}
          </View>

          {filteredBadges.length === 0 && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 items-center"
            >
              <Text className="text-4xl mb-3">🔍</Text>
              <Text className="text-center font-satoshi text-gray-600 dark:text-gray-400">
                Tidak ada badge di kategori ini
              </Text>
            </MotiView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
