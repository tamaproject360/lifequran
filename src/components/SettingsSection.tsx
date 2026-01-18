/**
 * LifeQuran Settings Section Component
 * 
 * Reusable settings section dengan kategori
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  value?: string | number;
  type: 'toggle' | 'navigation' | 'info';
  enabled?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  delay?: number;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  description,
  value,
  type,
  enabled = false,
  onPress,
  onToggle,
  delay = 0,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const handleToggle = (newValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle?.(newValue);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay,
        easing: Easing.out(Easing.exp),
      }}
    >
      <TouchableOpacity
        onPress={type !== 'toggle' ? handlePress : undefined}
        disabled={type === 'toggle'}
        activeOpacity={0.7}
        className="flex-row items-center py-4 border-b border-gray-100 dark:border-gray-800"
      >
        {/* Icon */}
        <View className="w-10 h-10 rounded-full bg-primary-emerald/10 items-center justify-center mr-4">
          <Ionicons name={icon} size={20} color={Colors.primary.emerald} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-base font-satoshi-bold text-gray-900 dark:text-white mb-0.5">
            {title}
          </Text>
          {description && (
            <Text className="text-sm font-satoshi text-gray-500 dark:text-gray-400">
              {description}
            </Text>
          )}
        </View>

        {/* Right Side */}
        {type === 'toggle' && (
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{
              false: Colors.gray[300],
              true: Colors.primary.emerald,
            }}
            thumbColor="white"
            ios_backgroundColor={Colors.gray[300]}
          />
        )}

        {type === 'navigation' && (
          <View className="flex-row items-center">
            {value && (
              <Text className="text-sm font-satoshi text-gray-500 dark:text-gray-400 mr-2">
                {value}
              </Text>
            )}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.gray[400]}
            />
          </View>
        )}

        {type === 'info' && value && (
          <Text className="text-sm font-satoshi-bold text-primary-emerald">
            {value}
          </Text>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  delay = 0,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay,
        easing: Easing.out(Easing.exp),
      }}
      className="mb-6"
    >
      <Text className="text-sm font-satoshi-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">
        {title}
      </Text>
      <View className="bg-white dark:bg-gray-800 rounded-3xl px-6 shadow-sm">
        {children}
      </View>
    </MotiView>
  );
};
