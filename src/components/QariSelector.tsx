/**
 * LifeQuran Qari Selector Component
 * 
 * Komponen untuk memilih qari murottal
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAudioStore, AVAILABLE_QARIS, Qari } from '../store/audioStore';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

interface QariSelectorProps {
  onSelect?: (qari: Qari) => void;
}

export const QariSelector: React.FC<QariSelectorProps> = ({ onSelect }) => {
  const { currentQari, setQari } = useAudioStore();

  const handleSelectQari = (qari: Qari) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQari(qari);
    onSelect?.(qari);
  };

  return (
    <View className="py-4">
      <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white mb-4 px-6">
        Pilih Qari
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        className="space-x-3"
      >
        {AVAILABLE_QARIS.map((qari, index) => {
          const isSelected = currentQari.id === qari.id;
          
          return (
            <MotiView
              key={qari.id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'timing',
                duration: 300,
                delay: index * 50,
              }}
            >
              <TouchableOpacity
                onPress={() => handleSelectQari(qari)}
                className={`
                  w-40 p-4 rounded-2xl border-2
                  ${isSelected 
                    ? 'bg-primary-emerald/10 border-primary-emerald' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                <View className="items-center">
                  {/* Icon */}
                  <View
                    className={`
                      w-12 h-12 rounded-full items-center justify-center mb-3
                      ${isSelected 
                        ? 'bg-primary-emerald' 
                        : 'bg-gray-100 dark:bg-gray-700'
                      }
                    `}
                  >
                    <Ionicons
                      name="mic"
                      size={24}
                      color={isSelected ? 'white' : colors.gray[600]}
                    />
                  </View>

                  {/* Name */}
                  <Text
                    className={`
                      text-sm font-satoshi-bold text-center mb-1
                      ${isSelected 
                        ? 'text-primary-emerald' 
                        : 'text-gray-900 dark:text-white'
                      }
                    `}
                    numberOfLines={2}
                  >
                    {qari.name}
                  </Text>

                  {/* Arabic Name */}
                  <Text
                    className="text-xs font-instrument-serif text-center text-gray-500 dark:text-gray-400"
                    numberOfLines={1}
                  >
                    {qari.arabicName}
                  </Text>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <MotiView
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="absolute top-2 right-2"
                    >
                      <View className="w-6 h-6 rounded-full bg-primary-emerald items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    </MotiView>
                  )}
                </View>
              </TouchableOpacity>
            </MotiView>
          );
        })}
      </ScrollView>
    </View>
  );
};
