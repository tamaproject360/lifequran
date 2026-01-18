/**
 * LifeQuran Surah Virtue Card Component
 * 
 * Komponen untuk menampilkan keutamaan surah
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface SurahVirtueCardProps {
  virtueText: string;
  hadithReference?: string;
}

export const SurahVirtueCard: React.FC<SurahVirtueCardProps> = ({
  virtueText,
  hadithReference,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400 }}
      className="bg-gradient-to-br from-muted-gold/10 to-muted-gold/5 rounded-2xl p-5 mb-4 border border-muted-gold/20"
    >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-muted-gold/20 items-center justify-center mr-3">
          <Ionicons name="star" size={20} color={colors.muted.gold} />
        </View>
        <Text className="text-base font-satoshi-bold text-muted-gold">
          Keutamaan Surah
        </Text>
      </View>

      {/* Content */}
      <Text className="text-sm font-satoshi text-gray-700 dark:text-gray-300 leading-6 mb-3">
        {virtueText}
      </Text>

      {/* Reference */}
      {hadithReference && (
        <View className="flex-row items-center">
          <Ionicons name="bookmark-outline" size={14} color={colors.gray[500]} />
          <Text className="text-xs font-satoshi-medium text-gray-500 dark:text-gray-400 ml-2">
            {hadithReference}
          </Text>
        </View>
      )}
    </MotiView>
  );
};
