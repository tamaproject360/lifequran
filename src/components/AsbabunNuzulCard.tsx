/**
 * LifeQuran Asbabun Nuzul Card Component
 * 
 * Komponen untuk menampilkan cerita latar belakang turunnya ayat
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

interface AsbabunNuzulCardProps {
  story: string;
  ayahNumber?: number;
  source?: string;
}

export const AsbabunNuzulCard: React.FC<AsbabunNuzulCardProps> = ({
  story,
  ayahNumber,
  source,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  // Truncate story for preview
  const previewText = story.length > 150 ? story.substring(0, 150) + '...' : story;
  const hasMore = story.length > 150;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 shadow-sm"
    >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mr-3">
          <Ionicons name="time-outline" size={20} color={colors.primary.emerald} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white">
            Asbabun Nuzul
          </Text>
          {ayahNumber && (
            <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400 mt-0.5">
              Ayat {ayahNumber}
            </Text>
          )}
        </View>
      </View>

      {/* Story Content */}
      <Text className="text-sm font-satoshi text-gray-700 dark:text-gray-300 leading-6">
        {isExpanded ? story : previewText}
      </Text>

      {/* Expand/Collapse Button */}
      {hasMore && (
        <TouchableOpacity
          onPress={handleToggle}
          className="flex-row items-center justify-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
        >
          <Text className="text-sm font-satoshi-medium text-primary-emerald mr-2">
            {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
          </Text>
          <MotiView
            animate={{ rotate: isExpanded ? '180deg' : '0deg' }}
            transition={{ type: 'timing', duration: 200 }}
          >
            <Ionicons name="chevron-down" size={16} color={colors.primary.emerald} />
          </MotiView>
        </TouchableOpacity>
      )}

      {/* Source */}
      {source && (
        <View className="flex-row items-center mt-3">
          <Ionicons name="document-text-outline" size={14} color={colors.gray[500]} />
          <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400 ml-2">
            Sumber: {source}
          </Text>
        </View>
      )}
    </MotiView>
  );
};
