/**
 * LifeQuran Reminder Time Screen
 * 
 * Set waktu pengingat harian
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Card } from '../../src/components';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type ReminderOption = {
  id: string;
  time: string;
  label: string;
  description: string;
  icon: string;
};

const reminderOptions: ReminderOption[] = [
  {
    id: 'morning',
    time: '07:00',
    label: 'Pagi Hari',
    description: 'Setelah Sholat Subuh',
    icon: '🌅',
  },
  {
    id: 'afternoon',
    time: '15:00',
    label: 'Sore Hari',
    description: 'Setelah Sholat Ashar',
    icon: '☀️',
  },
  {
    id: 'evening',
    time: '19:00',
    label: 'Malam Hari',
    description: 'Setelah Sholat Maghrib',
    icon: '🌙',
  },
  {
    id: 'night',
    time: '21:00',
    label: 'Malam Sebelum Tidur',
    description: 'Sebelum istirahat',
    icon: '✨',
  },
  {
    id: 'custom',
    time: 'custom',
    label: 'Atur Sendiri',
    description: 'Pilih waktu sesuai keinginan',
    icon: '⏰',
  },
];

export default function ReminderScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedReminder, setSelectedReminder] = useState<string>('morning');
  const [enableReminder, setEnableReminder] = useState(true);

  const handleSelectReminder = (id: string) => {
    setSelectedReminder(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    // TODO: Save reminder settings and schedule notifications
    const selected = reminderOptions.find(opt => opt.id === selectedReminder);
    console.log('Reminder set:', { enabled: enableReminder, time: selected });
    router.push('/(onboarding)/tutorial');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/tutorial');
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
            Pengingat Harian
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
            Kapan waktu terbaik untuk mengingatkan Anda membaca Al-Qur'an?
          </Text>
        </Animated.View>

        {/* Toggle Enable/Disable */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.toggleContainer}
        >
          <Card
            variant="filled"
            size="medium"
            onPress={() => {
              setEnableReminder(!enableReminder);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.toggleContent}>
              <View style={styles.toggleText}>
                <Text
                  style={[
                    styles.toggleLabel,
                    {
                      color: theme.colors.text.primary,
                      fontFamily: theme.fontFamily.satoshi.medium,
                    },
                  ]}
                >
                  Aktifkan Pengingat
                </Text>
                <Text
                  style={[
                    styles.toggleDescription,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: theme.fontFamily.satoshi.regular,
                    },
                  ]}
                >
                  Terima notifikasi untuk tetap istiqomah
                </Text>
              </View>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: enableReminder
                      ? theme.primary.emerald
                      : theme.colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    {
                      transform: [{ translateX: enableReminder ? 20 : 0 }],
                    },
                  ]}
                />
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Reminder Time Options */}
        {enableReminder && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.optionsContainer}
          >
            {reminderOptions.map((option, index) => (
              <Animated.View
                key={option.id}
                entering={FadeInDown.delay(400 + index * 50).duration(500)}
              >
                <Card
                  variant={selectedReminder === option.id ? 'filled' : 'outlined'}
                  size="small"
                  onPress={() => handleSelectReminder(option.id)}
                  style={[
                    styles.optionCard,
                    selectedReminder === option.id && {
                      backgroundColor: theme.primary.emerald + '15',
                      borderColor: theme.primary.emerald,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionLeft}>
                      <Text style={styles.optionIcon}>{option.icon}</Text>
                      <View>
                        <Text
                          style={[
                            styles.optionLabel,
                            {
                              color: theme.colors.text.primary,
                              fontFamily: theme.fontFamily.satoshi.medium,
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
                    {option.time !== 'custom' && (
                      <Text
                        style={[
                          styles.optionTime,
                          {
                            color: theme.primary.emerald,
                            fontFamily: theme.fontFamily.satoshi.bold,
                          },
                        ]}
                      >
                        {option.time}
                      </Text>
                    )}
                    {selectedReminder === option.id && (
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
        )}

        {/* Info Box */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
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
            🔔 Kami akan mengirim pengingat lembut setiap hari untuk menjaga streak Anda
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(500)}
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
    paddingBottom: 140,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  toggleContainer: {
    marginBottom: 24,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    marginLeft: 16,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
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
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
  },
  optionTime: {
    fontSize: 16,
    marginHorizontal: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
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
