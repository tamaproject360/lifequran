/**
 * LifeQuran Daily Target Screen
 * 
 * Atur target harian bacaan Al-Qur'an
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Card } from '../../src/components';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type TargetOption = {
  id: string;
  pages: number;
  minutes: number;
  label: string;
  description: string;
  icon: string;
};

const targetOptions: TargetOption[] = [
  {
    id: 'minimal',
    pages: 1,
    minutes: 5,
    label: '1 Halaman',
    description: '~5 menit/hari • Santai & Istiqomah',
    icon: '🌱',
  },
  {
    id: 'moderate',
    pages: 2,
    minutes: 10,
    label: '2 Halaman',
    description: '~10 menit/hari • Seimbang',
    icon: '⭐',
  },
  {
    id: 'active',
    pages: 4,
    minutes: 20,
    label: '4 Halaman',
    description: '~20 menit/hari • Aktif',
    icon: '🔥',
  },
  {
    id: 'ambitious',
    pages: 8,
    minutes: 40,
    label: '8 Halaman',
    description: '~40 menit/hari • Ambisius',
    icon: '🚀',
  },
];

export default function DailyTargetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedTarget, setSelectedTarget] = useState<string>('minimal');

  const handleSelectTarget = (id: string) => {
    setSelectedTarget(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    // TODO: Save target to storage/database
    const selected = targetOptions.find(opt => opt.id === selectedTarget);
    console.log('Daily target set:', selected);
    router.push('/(onboarding)/reminder');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/reminder');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.header}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.fontFamily.satoshi.bold,
              },
            ]}
          >
            Target Harian Anda
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.fontFamily.satoshi.regular,
              },
            ]}
          >
            Pilih target bacaan yang sesuai dengan waktu Anda. Tidak masalah mulai dari yang kecil, yang penting istiqomah! 💚
          </Text>
        </Animated.View>

        {/* Target Options */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.optionsContainer}
        >
          {targetOptions.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={FadeInDown.delay(300 + index * 50).duration(500)}
            >
              <Card
                variant={selectedTarget === option.id ? 'filled' : 'outlined'}
                size="medium"
                onPress={() => handleSelectTarget(option.id)}
                style={[
                  styles.optionCard,
                  selectedTarget === option.id && {
                    backgroundColor: theme.primary.emerald + '15',
                    borderColor: theme.primary.emerald,
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <View style={styles.optionText}>
                      <Text
                        style={[
                          styles.optionLabel,
                          {
                            color: theme.colors.text.primary,
                            fontFamily: theme.fontFamily.satoshi.bold,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.optionDescription,
                          {
                            color: theme.colors.text.secondary,
                            fontFamily: theme.fontFamily.satoshi.regular,
                          },
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  {selectedTarget === option.id && (
                    <View
                      style={[
                        styles.checkmark,
                        { backgroundColor: theme.primary.emerald },
                      ]}
                    >
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Info Box */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.primary.celestial + '15',
              borderColor: theme.primary.celestial + '40',
            },
          ]}
        >
          <Text
            style={[
              styles.infoText,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.fontFamily.satoshi.regular,
              },
            ]}
          >
            💡 Tenang, Anda bisa mengubah target ini kapan saja di pengaturan!
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(500)}
        style={[
          styles.bottomActions,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <Button variant="primary" size="large" fullWidth onPress={handleContinue}>
          Lanjutkan
        </Button>
        <Button
          variant="ghost"
          size="medium"
          fullWidth
          onPress={handleSkip}
          style={{ marginTop: theme.spacing.md }}
        >
          Lewati
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    marginBottom: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
});
