/**
 * Streak Counter Component
 * 
 * Menampilkan streak harian dengan animasi fire
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

interface StreakCounterProps {
  streak: number;
  longestStreak: number;
  freezeAvailable?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  longestStreak,
  freezeAvailable = true,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 500,
        easing: Easing.out(Easing.exp),
      }}
      className="bg-white dark:bg-midnight-emerald rounded-3xl p-6 shadow-lg"
    >
      {/* Main Streak Display */}
      <View className="items-center mb-4">
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            delay: 200,
            damping: 12,
            stiffness: 100,
          }}
        >
          <Text className="text-6xl mb-2">🔥</Text>
        </MotiView>
        
        <Text className="text-4xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
          {streak}
        </Text>
        
        <Text className="text-sm text-gray-500 dark:text-gray-400 font-satoshi">
          Hari Berturut-turut
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />

      {/* Stats Row */}
      <View className="flex-row justify-around">
        {/* Longest Streak */}
        <View className="items-center">
          <Text className="text-2xl font-satoshi-bold text-primary-emerald">
            {longestStreak}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 font-satoshi">
            Terpanjang
          </Text>
        </View>

        {/* Freeze Status */}
        <View className="items-center">
          <Text className="text-2xl">
            {freezeAvailable ? '❄️' : '🚫'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 font-satoshi">
            Freeze
          </Text>
        </View>
      </View>

      {/* Next Milestone */}
      {streak > 0 && streak < 100 && (
        <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-xs text-center text-gray-500 dark:text-gray-400 font-satoshi">
            {getNextMilestoneText(streak)}
          </Text>
        </View>
      )}
    </MotiView>
  );
};

const getNextMilestoneText = (streak: number): string => {
  const nextMilestone = Math.ceil((streak + 1) / 7) * 7;
  const daysLeft = nextMilestone - streak;
  
  if (daysLeft === 1) {
    return `1 hari lagi untuk mencapai ${nextMilestone} hari! 🎯`;
  }
  
  return `${daysLeft} hari lagi untuk mencapai ${nextMilestone} hari! 🎯`;
};
