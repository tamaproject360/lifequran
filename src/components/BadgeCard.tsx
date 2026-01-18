/**
 * Badge Card Component
 * 
 * Menampilkan badge/achievement dengan animasi unlock
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpReward?: number;
  onPress?: () => void;
  index?: number;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  icon,
  unlocked,
  xpReward,
  onPress,
  index = 0,
}) => {
  const handlePress = () => {
    if (unlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay: index * 50,
        easing: Easing.out(Easing.exp),
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.96}
        className={`bg-white dark:bg-midnight-emerald rounded-2xl p-4 shadow-md ${
          !unlocked ? 'opacity-50' : ''
        }`}
      >
        {/* Badge Icon */}
        <View className="items-center mb-3">
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{
              type: 'spring',
              delay: index * 50 + 200,
              damping: 12,
              stiffness: 100,
            }}
            className={`w-16 h-16 rounded-full items-center justify-center ${
              unlocked
                ? 'bg-gradient-to-br from-primary-emerald to-celestial-mint'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className="text-3xl">{unlocked ? icon : '🔒'}</Text>
          </MotiView>
        </View>

        {/* Badge Info */}
        <View className="items-center">
          <Text
            className={`text-sm font-satoshi-bold text-center mb-1 ${
              unlocked
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            numberOfLines={2}
          >
            {name}
          </Text>
          
          <Text
            className="text-xs text-gray-500 dark:text-gray-400 font-satoshi text-center"
            numberOfLines={2}
          >
            {description}
          </Text>

          {/* XP Reward */}
          {xpReward && xpReward > 0 && (
            <View className="mt-2">
              <View
                className={`px-2 py-1 rounded-full ${
                  unlocked
                    ? 'bg-primary-emerald/10'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <Text
                  className={`text-xs font-satoshi-bold ${
                    unlocked ? 'text-primary-emerald' : 'text-gray-400'
                  }`}
                >
                  +{xpReward} XP
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Unlocked Indicator */}
        {unlocked && (
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              delay: index * 50 + 300,
              damping: 12,
            }}
            className="absolute top-2 right-2"
          >
            <View className="bg-primary-emerald rounded-full w-6 h-6 items-center justify-center">
              <Text className="text-white text-xs">✓</Text>
            </View>
          </MotiView>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};
