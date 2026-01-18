/**
 * LifeQuran Profile Screen
 * 
 * Premium profile dengan personalization settings
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useGamificationStore } from '../../src/store';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Import components inline to avoid circular dependencies
import { SettingsSection, SettingsItem } from '../../src/components/SettingsSection';
import { FontSizeAdjuster } from '../../src/components/FontSizeAdjuster';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { reading, app, updateReadingSettings, updateAppSettings } = useSettingsStore();
  const { levelInfo } = useGamificationStore();
  
  const [showFontSettings, setShowFontSettings] = useState(false);

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTheme();
  };

  return (
    <View className="flex-1 bg-white dark:bg-midnight-emerald">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={
            isDark
              ? ['#022C22', '#022C22']
              : ['#F0FDF4', '#FFFFFF']
          }
          className="pt-16 pb-8 px-6"
        >
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 200,
            }}
            className="items-center"
          >
            {/* Avatar */}
            <View className="relative mb-4">
              <View className="w-24 h-24 rounded-full bg-primary-emerald items-center justify-center">
                <Text className="text-4xl">👤</Text>
              </View>
              <TouchableOpacity
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 items-center justify-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="camera" size={16} color={Colors.primary.emerald} />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <Text className="text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-1">
              Pengguna LifeQuran
            </Text>
            <Text className="text-sm font-satoshi text-gray-600 dark:text-gray-400 mb-4">
              {levelInfo?.name || 'Pemula'}
            </Text>

            {/* Quick Stats */}
            <View className="flex-row gap-4">
              <View className="items-center">
                <Text className="text-2xl font-satoshi-bold text-primary-emerald">
                  {levelInfo?.level || 1}
                </Text>
                <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                  Level
                </Text>
              </View>
              <View className="w-px h-10 bg-gray-300 dark:bg-gray-700" />
              <View className="items-center">
                <Text className="text-2xl font-satoshi-bold text-primary-emerald">
                  {levelInfo?.currentXP || 0}
                </Text>
                <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                  XP
                </Text>
              </View>
              <View className="w-px h-10 bg-gray-300 dark:bg-gray-700" />
              <View className="items-center">
                <Text className="text-2xl font-satoshi-bold text-primary-emerald">
                  {app.dailyTarget}
                </Text>
                <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
                  Target
                </Text>
              </View>
            </View>
          </MotiView>
        </LinearGradient>

        {/* Settings Sections */}
        <View className="px-6 mt-4">
          {/* Reading Settings */}
          <SettingsSection title="Pengaturan Baca" delay={100}>
            <SettingsItem
              icon="text"
              title="Ukuran Font"
              description="Atur ukuran teks Arab & terjemahan"
              type="navigation"
              value={`${reading.arabicFontSize}/${reading.translationFontSize}`}
              onPress={() => setShowFontSettings(true)}
              delay={150}
            />
            <SettingsItem
              icon="color-palette"
              title="Tajwid Berwarna"
              description="Tampilkan warna tajwid"
              type="toggle"
              enabled={reading.showTajwid}
              onToggle={(value) => updateReadingSettings({ showTajwid: value })}
              delay={200}
            />
            <SettingsItem
              icon="book"
              title="Tampilkan Tafsir"
              description="Otomatis tampilkan tafsir"
              type="toggle"
              enabled={reading.showTafsir}
              onToggle={(value) => updateReadingSettings({ showTafsir: value })}
              delay={250}
            />
            <SettingsItem
              icon="eye-off"
              title="Layar Tetap Menyala"
              description="Cegah layar mati saat membaca"
              type="toggle"
              enabled={app.keepScreenOn}
              onToggle={(value) => updateAppSettings({ keepScreenOn: value })}
              delay={300}
            />
          </SettingsSection>

          {/* App Settings */}
          <SettingsSection title="Pengaturan Aplikasi" delay={200}>
            <SettingsItem
              icon="moon"
              title="Mode Gelap"
              description="Tema gelap untuk kenyamanan mata"
              type="toggle"
              enabled={isDark}
              onToggle={handleThemeToggle}
              delay={250}
            />
            <SettingsItem
              icon="time"
              title="Mode Gelap Otomatis"
              description="Aktifkan berdasarkan waktu"
              type="toggle"
              enabled={app.autoNightMode}
              onToggle={(value) => updateAppSettings({ autoNightMode: value })}
              delay={300}
            />
            <SettingsItem
              icon="notifications"
              title="Pengingat Harian"
              description="Notifikasi untuk membaca"
              type="toggle"
              enabled={app.reminderEnabled}
              onToggle={(value) => updateAppSettings({ reminderEnabled: value })}
              delay={350}
            />
            <SettingsItem
              icon="vibration"
              title="Haptic Feedback"
              description="Getaran saat interaksi"
              type="toggle"
              enabled={app.hapticFeedback}
              onToggle={(value) => updateAppSettings({ hapticFeedback: value })}
              delay={400}
            />
            <SettingsItem
              icon="volume-high"
              title="Efek Suara"
              description="Suara untuk notifikasi"
              type="toggle"
              enabled={app.soundEffects}
              onToggle={(value) => updateAppSettings({ soundEffects: value })}
              delay={450}
            />
          </SettingsSection>

          {/* About */}
          <SettingsSection title="Tentang" delay={400}>
            <SettingsItem
              icon="information-circle"
              title="Versi Aplikasi"
              type="info"
              value="1.0.0"
              delay={450}
            />
            <SettingsItem
              icon="heart"
              title="Tentang LifeQuran"
              description="Dipersembahkan untuk Umat Muslim"
              type="navigation"
              onPress={() => {}}
              delay={500}
            />
          </SettingsSection>
        </View>

        {/* Signature */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 800, delay: 600 }}
          className="mt-8 items-center px-6"
        >
          <Text className="text-xs font-instrument-serif-italic text-gray-400 dark:text-gray-600 text-center">
            Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
          </Text>
        </MotiView>
      </ScrollView>

      {/* Font Settings Modal */}
      <Modal
        visible={showFontSettings}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFontSettings(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6" style={{ maxHeight: '80%' }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-satoshi-bold text-gray-900 dark:text-white">
                Ukuran Font
              </Text>
              <TouchableOpacity
                onPress={() => setShowFontSettings(false)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 items-center justify-center"
              >
                <Ionicons name="close" size={20} color={Colors.gray[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FontSizeAdjuster
                arabicSize={reading.arabicFontSize}
                translationSize={reading.translationFontSize}
                onArabicSizeChange={(size) =>
                  updateReadingSettings({ arabicFontSize: size })
                }
                onTranslationSizeChange={(size) =>
                  updateReadingSettings({ translationFontSize: size })
                }
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
