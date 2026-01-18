/**
 * LifeQuran Dua Card Component
 * 
 * Komponen untuk menampilkan doa sehari-hari
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

interface DuaCardProps {
  title: string;
  arabicText: string;
  transliteration?: string;
  translation: string;
  reference?: string;
  onPress?: () => void;
}

export const DuaCard: React.FC<DuaCardProps> = ({
  title,
  arabicText,
  transliteration,
  translation,
  reference,
  onPress,
}) => {
  const handleCopy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const textToCopy = `${title}\n\n${arabicText}\n\n${transliteration || ''}\n\n${translation}${reference ? `\n\n${reference}` : ''}`;
    await Clipboard.setStringAsync(textToCopy);
    // TODO: Show toast notification
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 shadow-sm"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mr-3">
              <Ionicons name="hand-right-outline" size={20} color={colors.primary.emerald} />
            </View>
            <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white flex-1">
              {title}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={handleCopy}
            className="w-9 h-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <Ionicons name="copy-outline" size={18} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* Arabic Text */}
        <View className="bg-celestial-mint/5 rounded-xl p-4 mb-3">
          <Text
            className="text-xl font-instrument-serif text-right text-gray-900 dark:text-white leading-10"
            style={{ writingDirection: 'rtl' }}
          >
            {arabicText}
          </Text>
        </View>

        {/* Transliteration */}
        {transliteration && (
          <Text className="text-sm font-satoshi-medium italic text-gray-600 dark:text-gray-400 mb-2 leading-6">
            {transliteration}
          </Text>
        )}

        {/* Translation */}
        <Text className="text-sm font-satoshi text-gray-700 dark:text-gray-300 leading-6">
          {translation}
        </Text>

        {/* Reference */}
        {reference && (
          <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Ionicons name="bookmark-outline" size={14} color={colors.gray[500]} />
            <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400 ml-2">
              {reference}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};
