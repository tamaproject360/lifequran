/**
 * LifeQuran Profile/Settings Screen
 * 
 * Profil user dan pengaturan aplikasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card, Button } from '../../src/components';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.fontFamily.satoshi.bold }]}>
          Profil
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card variant="filled" size="medium">
          <View style={styles.profileInfo}>
            <View style={[styles.avatar, { backgroundColor: theme.primary.emerald + '20' }]}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={[styles.name, { color: theme.colors.text.primary, fontFamily: theme.fontFamily.satoshi.bold }]}>
              Guest User
            </Text>
            <Text style={[styles.email, { color: theme.colors.text.secondary, fontFamily: theme.fontFamily.satoshi.regular }]}>
              Mode Guest
            </Text>
          </View>
        </Card>

        <Card variant="outlined" size="medium" style={{ marginTop: 16 }}>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary, fontFamily: theme.fontFamily.satoshi.medium }]}>
              Dark Mode
            </Text>
            <Button variant="ghost" size="small" onPress={toggleTheme}>
              {isDark ? '🌙 On' : '☀️ Off'}
            </Button>
          </View>
        </Card>

        <Card variant="outlined" size="medium" style={{ marginTop: 16 }}>
          <Text style={[styles.placeholder, { color: theme.colors.text.secondary }]}>
            ⚙️ Settings & More{'\n\n'}Coming soon...
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
  profileInfo: { alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40 },
  name: { fontSize: 20, marginBottom: 4 },
  email: { fontSize: 14 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLabel: { fontSize: 16 },
  placeholder: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingVertical: 20 },
});
