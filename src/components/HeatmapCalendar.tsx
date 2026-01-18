/**
 * LifeQuran Heatmap Calendar Component
 * 
 * Visualisasi aktivitas pembacaan dengan heatmap
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface HeatmapData {
  date: string;
  count: number;
  intensity: number;
}

interface HeatmapCalendarProps {
  data: HeatmapData[];
  startDate: string;
  endDate: string;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const getIntensityColor = (intensity: number, isDark: boolean): string => {
    if (intensity === 0) return isDark ? '#1F2937' : '#F3F4F6';
    
    const colors = isDark
      ? ['#064E3B', '#047857', '#10B981', '#34D399', '#6EE7B7']
      : ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981'];
    
    return colors[intensity] || colors[0];
  };

  // Generate weeks
  const weeks: HeatmapData[][] = [];
  let currentWeek: HeatmapData[] = [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayData = data.find(item => item.date === dateStr) || {
      date: dateStr,
      count: 0,
      intensity: 0,
    };
    
    currentWeek.push(dayData);
    
    if (d.getDay() === 6 || d.getTime() === end.getTime()) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-1">
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="gap-1">
            {week.map((day, dayIndex) => (
              <MotiView
                key={day.date}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'timing',
                  duration: 300,
                  delay: (weekIndex * 7 + dayIndex) * 20,
                  easing: Easing.out(Easing.exp),
                }}
              >
                <View
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: getIntensityColor(day.intensity, false),
                  }}
                />
              </MotiView>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
