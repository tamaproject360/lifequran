/**
 * XP Progress Bar Component
 * 
 * Animated progress bar untuk menampilkan XP progress
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { MotiView } from 'moti';

interface XPProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  levelName: string;
  levelIcon: string;
  progress: number; // 0-1
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  nextLevelXP,
  level,
  levelName,
  levelIcon,
  progress,
}) => {
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.exp) }}
      className="bg-white dark:bg-midnight-emerald rounded-3xl p-6 shadow-lg"
    >
      {/* Level Info */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-4xl mr-3">{levelIcon}</Text>
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 font-satoshi">
              Level {level}
            </Text>
            <Text className="text-xl font-satoshi-bold text-gray-900 dark:text-white">
              {levelName}
            </Text>
          </View>
        </View>
        
        <View className="items-end">
          <Text className="text-sm text-gray-500 dark:text-gray-400 font-satoshi">
            XP
          </Text>
          <Text className="text-xl font-satoshi-bold text-primary-emerald">
            {currentXP.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-2">
        <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <Animated.View
            style={[animatedProgressStyle]}
            className="h-full bg-gradient-to-r from-primary-emerald to-celestial-mint rounded-full"
          />
        </View>
      </View>

      {/* XP Text */}
      <Text className="text-xs text-gray-500 dark:text-gray-400 font-satoshi text-center">
        {level < 6
          ? `${(progress * 100).toFixed(0)}% menuju level berikutnya (${nextLevelXP.toLocaleString()} XP)`
          : 'Level Maksimum Tercapai! 👑'}
      </Text>
    </MotiView>
  );
};
