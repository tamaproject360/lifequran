/**
 * LifeQuran Tafsir Card Component
 * 
 * Komponen untuk menampilkan tafsir ayat dengan expandable UI
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

interface TafsirCardProps {
  surahId: number;
  ayahNumber: number;
  textShort?: string;
  textLong?: string;
}

export const TafsirCard: React.FC<TafsirCardProps> = ({
  surahId,
  ayahNumber,
  textShort,
  textLong,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  if (!textShort && !textLong) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      className="bg-celestial-mint/10 dark:bg-celestial-mint/5 rounded-2xl p-4 mb-4"
    >
      {/* Header */}
      <TouchableOpacity
        onPress={handleToggle}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 rounded-full bg-primary-emerald/20 items-center justify-center mr-3">
            <Ionicons name="book-outline" size={16} color={colors.primary.emerald} />
          </View>
          <Text className="text-sm font-satoshi-bold text-primary-emerald">
            Tafsir Ayat {ayahNumber}
          </Text>
        </View>
        
        <MotiView
          animate={{ rotate: isExpanded ? '180deg' : '0deg' }}
          transition={{ type: 'timing', duration: 200 }}
        >
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.primary.emerald}
          />
        </MotiView>
      </TouchableOpacity>

      {/* Short Tafsir (Always visible) */}
      {textShort && (
        <Text className="text-sm font-satoshi text-gray-700 dark:text-gray-300 mt-3 leading-6">
          {textShort}
        </Text>
      )}

      {/* Long Tafsir (Expandable) */}
      <AnimatePresence>
        {isExpanded && textLong && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <View className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-satoshi text-gray-600 dark:text-gray-400 leading-6">
                {textLong}
              </Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </MotiView>
  );
};
