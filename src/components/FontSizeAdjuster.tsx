/**
 * LifeQuran Font Size Adjuster Component
 * 
 * Komponen untuk mengatur ukuran font Arabic dan terjemahan
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors } from '../theme/colors';
import Slider from '@react-native-community/slider';

interface FontSizeAdjusterProps {
  arabicSize: number;
  translationSize: number;
  onArabicSizeChange: (size: number) => void;
  onTranslationSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
}

export const FontSizeAdjuster: React.FC<FontSizeAdjusterProps> = ({
  arabicSize,
  translationSize,
  onArabicSizeChange,
  onTranslationSizeChange,
  minSize = 16,
  maxSize = 48,
}) => {
  return (
    <View className="space-y-6">
      {/* Arabic Font Size */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white">
            Ukuran Teks Arab
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => onArabicSizeChange(Math.max(minSize, arabicSize - 2))}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
            >
              <Ionicons name="remove" size={16} color={Colors.gray[600]} />
            </TouchableOpacity>
            
            <Text className="text-sm font-satoshi-bold text-primary-emerald w-8 text-center">
              {arabicSize}
            </Text>
            
            <TouchableOpacity
              onPress={() => onArabicSizeChange(Math.min(maxSize, arabicSize + 2))}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
            >
              <Ionicons name="add" size={16} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Slider
          value={arabicSize}
          onValueChange={onArabicSizeChange}
          minimumValue={minSize}
          maximumValue={maxSize}
          step={2}
          minimumTrackTintColor={Colors.primary.emerald}
          maximumTrackTintColor={Colors.gray[300]}
          thumbTintColor={Colors.primary.emerald}
        />
        
        {/* Preview */}
        <MotiView
          animate={{ fontSize: arabicSize }}
          className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
        >
          <Text
            className="text-center font-instrument-serif text-gray-900 dark:text-white"
            style={{ fontSize: arabicSize }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
        </MotiView>
      </View>

      {/* Translation Font Size */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white">
            Ukuran Terjemahan
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => onTranslationSizeChange(Math.max(minSize, translationSize - 2))}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
            >
              <Ionicons name="remove" size={16} color={Colors.gray[600]} />
            </TouchableOpacity>
            
            <Text className="text-sm font-satoshi-bold text-primary-emerald w-8 text-center">
              {translationSize}
            </Text>
            
            <TouchableOpacity
              onPress={() => onTranslationSizeChange(Math.min(maxSize, translationSize + 2))}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
            >
              <Ionicons name="add" size={16} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Slider
          value={translationSize}
          onValueChange={onTranslationSizeChange}
          minimumValue={minSize}
          maximumValue={maxSize}
          step={2}
          minimumTrackTintColor={Colors.primary.emerald}
          maximumTrackTintColor={Colors.gray[300]}
          thumbTintColor={Colors.primary.emerald}
        />
        
        {/* Preview */}
        <MotiView
          animate={{ fontSize: translationSize }}
          className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
        >
          <Text
            className="text-center font-satoshi text-gray-700 dark:text-gray-300"
            style={{ fontSize: translationSize }}
          >
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </Text>
        </MotiView>
      </View>
    </View>
  );
};
