/**
 * Daily Challenge Card Component
 * 
 * Menampilkan tantangan harian dengan progress
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface DailyChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
  onPress?: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  title,
  description,
  progress,
  target,
  xpReward,
  completed,
  onPress,
}) => {
  const progressWidth = useSharedValue(0);
  const progressPercentage = Math.min((progress / target) * 100, 100);

  useEffect(() => {
    progressWidth.value = withSpring(progressPercentage / 100, {
      damping: 15,
      stiffness: 100,
    });
  }, [progressPercentage]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 600,
        delay: 100,
        easing: Easing.out(Easing.exp),
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.96}
        disabled={completed}
        className={`bg-white dark:bg-midnight-emerald rounded-3xl p-6 shadow-lg ${
          completed ? 'opacity-75' : ''
        }`}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl mr-2">🎯</Text>
              <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white">
                {title}
              </Text>
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 font-satoshi">
              {description}
            </Text>
          </View>

          {/* XP Badge */}
          <View className="bg-primary-emerald/10 px-3 py-1 rounded-full">
            <Text className="text-sm font-satoshi-bold text-primary-emerald">
              +{xpReward} XP
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-2">
          <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <Animated.View
              style={[animatedProgressStyle]}
              className={`h-full rounded-full ${
                completed
                  ? 'bg-primary-emerald'
                  : 'bg-gradient-to-r from-primary-emerald to-celestial-mint'
              }`}
            />
          </View>
        </View>

        {/* Progress Text */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-500 dark:text-gray-400 font-satoshi">
            {completed ? (
              <Text className="text-primary-emerald font-satoshi-bold">
                ✓ Selesai!
              </Text>
            ) : (
              `${progress} / ${target} ${getChallengeUnit(title)}`
            )}
          </Text>

          {!completed && (
            <Text className="text-xs text-primary-emerald font-satoshi-bold">
              {progressPercentage.toFixed(0)}%
            </Text>
          )}
        </View>

        {/* Completed Badge */}
        {completed && (
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              delay: 200,
              damping: 12,
            }}
            className="absolute top-4 right-4"
          >
            <View className="bg-primary-emerald rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white text-lg">✓</Text>
            </View>
          </MotiView>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};

const getChallengeUnit = (title: string): string => {
  if (title.includes('Halaman')) return 'halaman';
  if (title.includes('Menit')) return 'menit';
  if (title.includes('Surah')) return 'surah';
  return '';
};
