/**
 * LifeQuran Tabs Layout
 * Bottom Navigation dengan custom icons dan animations
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

// Tab Icon Component
const TabIcon = ({
  icon,
  color,
  focused,
}: {
  icon: string;
  color: string;
  focused: boolean;
}) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, { fontSize: focused ? 26 : 24 }]}>{icon}</Text>
    {focused && (
      <View
        style={[
          styles.activeIndicator,
          { backgroundColor: color },
        ]}
      />
    )}
  </View>
);

export default function TabsLayout() {
  const { theme, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary.emerald,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fontFamily.satoshi.medium,
          fontSize: 11,
          marginTop: -4,
        },
        tabBarHideOnKeyboard: true,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🏠" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Al-Qur\'an',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📖" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📊" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="gamification"
        options={{
          title: 'Badge',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🏆" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="👤" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="juz"
        options={{
          title: 'Juz',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📑" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🔖" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    // Icon styling
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
