/**
 * LifeQuran Data Import Screen
 * 
 * Screen untuk import data Al-Qur'an pertama kali
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { QuranDataImporter } from '../src/database/quranData';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function DataImportScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkDataExists();
  }, []);

  const checkDataExists = async () => {
    try {
      const exists = await QuranDataImporter.checkDataExists();
      if (exists) {
        setIsComplete(true);
        setMessage('Data Al-Qur\'an sudah tersedia');
      }
    } catch (err) {
      console.error('Error checking data:', err);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await QuranDataImporter.importAllQuranData((prog, msg) => {
        setProgress(prog);
        setMessage(msg);
      });

      setIsComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (err) {
      console.error('Import error:', err);
      setError('Gagal mengimport data. Pastikan koneksi internet aktif.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        {/* Icon */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={styles.icon}>📖</Text>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.fontFamily.satoshi.bold,
              },
            ]}
          >
            {isComplete ? 'Siap Digunakan!' : 'Download Data Al-Qur\'an'}
          </Text>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.fontFamily.satoshi.regular,
              },
            ]}
          >
            {isComplete
              ? 'Data Al-Qur\'an lengkap sudah tersedia. Anda siap untuk memulai perjalanan spiritual Anda.'
              : 'Untuk pengalaman terbaik, kami perlu mengunduh data Al-Qur\'an lengkap (114 Surah, 6236 Ayat) dengan terjemahan dan tafsir Bahasa Indonesia.'}
          </Text>
        </Animated.View>

        {/* Progress */}
        {isImporting && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.primary.emerald,
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fontFamily.satoshi.medium,
                },
              ]}
            >
              {progress}% - {message}
            </Text>
          </Animated.View>
        )}

        {/* Error Message */}
        {error && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text
              style={[
                styles.errorText,
                {
                  color: '#EF4444',
                  fontFamily: theme.fontFamily.satoshi.regular,
                },
              ]}
            >
              {error}
            </Text>
          </Animated.View>
        )}

        {/* Info */}
        {!isComplete && !isImporting && (
          <Animated.View entering={FadeInDown.delay(500).duration(600)}>
            <View style={[styles.infoBox, { backgroundColor: theme.primary.emerald + '10' }]}>
              <Text style={[styles.infoText, { color: theme.primary.emerald }]}>
                ℹ️ Ukuran: ~5-10 MB
              </Text>
              <Text style={[styles.infoText, { color: theme.primary.emerald }]}>
                ⏱️ Waktu: ~2-5 menit
              </Text>
              <Text style={[styles.infoText, { color: theme.primary.emerald }]}>
                📶 Memerlukan koneksi internet
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Action Button */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.buttonContainer}>
          {isComplete ? (
            <Pressable
              style={[
                styles.button,
                { backgroundColor: theme.primary.emerald },
              ]}
              onPress={handleContinue}
            >
              <Text
                style={[
                  styles.buttonText,
                  { fontFamily: theme.fontFamily.satoshi.bold },
                ]}
              >
                Mulai Membaca
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.button,
                { backgroundColor: theme.primary.emerald },
                isImporting && styles.buttonDisabled,
              ]}
              onPress={handleImport}
              disabled={isImporting}
            >
              {isImporting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { fontFamily: theme.fontFamily.satoshi.bold },
                  ]}
                >
                  Download Sekarang
                </Text>
              )}
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'System',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
