/**
 * LifeQuran Gamification/Badge Screen
 * 
 * Badge gallery dan achievements
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card } from '../../src/components';
import { StatusBar } from 'expo-status-bar';

export default function GamificationScreen() {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.fontFamily.satoshi.bold }]}>
          Pencapaian
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card variant="filled" size="medium">
          <Text style={[styles.placeholder, { color: theme.colors.text.secondary }]}>
            🏆 Badge & Achievement Gallery{'\n\n'}Coming soon...
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 28 },
  content: { padding: 24 },
  placeholder: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
