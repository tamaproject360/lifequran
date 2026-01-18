/**
 * LifeQuran Growth Map Timeline Component
 * 
 * Vertical timeline visualization untuk spiritual growth
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  completed: boolean;
  xpEarned?: number;
}

interface GrowthMapTimelineProps {
  milestones: Milestone[];
}

export const GrowthMapTimeline: React.FC<GrowthMapTimelineProps> = ({
  milestones,
}) => {
  return (
    <View className="py-4">
      {milestones.map((milestone, index) => (
        <View key={milestone.id} className="flex-row mb-6">
          {/* Timeline Line */}
          <View className="items-center mr-4">
            {/* Node */}
            <MotiView
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                delay: index * 100,
                damping: 15,
                stiffness: 200,
              }}
            >
              {milestone.completed ? (
                <LinearGradient
                  colors={[Colors.primary.emerald, '#16A34A']}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    shadowColor: Colors.primary.emerald,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Ionicons name={milestone.icon} size={24} color="white" />
                </LinearGradient>
              ) : (
                <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                  <Ionicons
                    name={milestone.icon}
                    size={24}
                    color={Colors.gray[400]}
                  />
                </View>
              )}
            </MotiView>

            {/* Connecting Line */}
            {index < milestones.length - 1 && (
              <MotiView
                from={{ height: 0 }}
                animate={{ height: 40 }}
                transition={{
                  type: 'timing',
                  duration: 400,
                  delay: index * 100 + 200,
                  easing: Easing.out(Easing.exp),
                }}
                className={`w-0.5 mt-2 ${
                  milestone.completed
                    ? 'bg-primary-emerald'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            )}
          </View>

          {/* Content */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: 'timing',
              duration: 500,
              delay: index * 100 + 100,
              easing: Easing.out(Easing.exp),
            }}
            className="flex-1"
          >
            <View
              className={`rounded-2xl p-4 ${
                milestone.completed
                  ? 'bg-primary-emerald/10 dark:bg-primary-emerald/20'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Text
                className={`text-base font-satoshi-bold mb-1 ${
                  milestone.completed
                    ? 'text-primary-emerald'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {milestone.title}
              </Text>
              <Text className="text-sm font-satoshi text-gray-600 dark:text-gray-400 mb-2">
                {milestone.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-500">
                  {new Date(milestone.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
                {milestone.completed && milestone.xpEarned && (
                  <View className="flex-row items-center">
                    <Ionicons
                      name="star"
                      size={14}
                      color={Colors.primary.gold}
                    />
                    <Text className="text-xs font-satoshi-bold text-muted-gold ml-1">
                      +{milestone.xpEarned} XP
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </MotiView>
        </View>
      ))}
    </View>
  );
};
