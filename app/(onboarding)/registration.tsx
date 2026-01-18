/**
 * LifeQuran Registration Screen
 * 
 * Login/Registration dengan skip option (mode guest)
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Card } from '../../src/components';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

export default function RegistrationScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    // Save user data (optional)
    if (name.trim()) {
      // TODO: Save to database/storage
      console.log('User registered:', { name, email });
    }
    router.push('/(onboarding)/dailyTarget');
  };

  const handleSkip = () => {
    // Continue as guest
    router.push('/(onboarding)/dailyTarget');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
            Perkenalkan Diri Anda
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
            Bantu kami mengenal Anda lebih baik{'\n'}(opsional, bisa dilewati)
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.form}
        >
          <Card variant="filled" size="medium">
            <View style={styles.formContent}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.fontFamily.satoshi.medium,
                  },
                ]}
              >
                Nama Anda
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text.primary,
                    fontFamily: theme.fontFamily.satoshi.regular,
                  },
                ]}
                placeholder="Masukkan nama Anda"
                placeholderTextColor={theme.colors.text.tertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.fontFamily.satoshi.medium,
                    marginTop: theme.spacing.lg,
                  },
                ]}
              >
                Email (Opsional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text.primary,
                    fontFamily: theme.fontFamily.satoshi.regular,
                  },
                ]}
                placeholder="email@example.com"
                placeholderTextColor={theme.colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />

              <View
                style={[
                  styles.infoBox,
                  {
                    backgroundColor: theme.primary.emerald + '10',
                    borderColor: theme.primary.emerald + '30',
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
                  💡 Email digunakan untuk backup progress Anda ke cloud
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Social Login Options (Future) */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.socialSection}
        >
          <Text
            style={[
              styles.orText,
              {
                color: theme.colors.text.tertiary,
                fontFamily: theme.fontFamily.satoshi.regular,
              },
            ]}
          >
            atau lanjutkan dengan
          </Text>
          {/* TODO: Add Google/Facebook login buttons */}
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(500)}
        style={[
          styles.bottomActions,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
        >
          Lanjutkan
        </Button>
        <Button
          variant="ghost"
          size="medium"
          fullWidth
          onPress={handleSkip}
          style={{ marginTop: theme.spacing.md }}
        >
          Lewati (Mode Guest)
        </Button>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
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
  form: {
    marginBottom: 24,
  },
  formContent: {
    // Form container
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  socialSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  orText: {
    fontSize: 14,
  },
  bottomActions: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
});
