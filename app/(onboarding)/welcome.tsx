/**
 * LifeQuran Welcome Screen
 * 
 * Pengenalan singkat aplikasi dengan visual menarik
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const featureOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animations
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });

    titleOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(200, withTiming(0, { duration: 500 }));

    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subtitleTranslateY.value = withDelay(400, withTiming(0, { duration: 500 }));

    featureOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const featureStyle = useAnimatedStyle(() => ({
    opacity: featureOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleContinue = () => {
    router.push('/(onboarding)/registration');
  };

  const handleSkip = () => {
    // Skip to main app
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? [theme.colors.background, theme.primary.midnight]
            : [theme.colors.background, theme.primary.emerald + '10']
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo/Icon */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor: theme.primary.emerald + '20',
                borderColor: theme.primary.emerald,
              },
            ]}
          >
            <Text style={[styles.logoText, { color: theme.primary.emerald }]}>
              📖
            </Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.satoshi.black,
            },
            titleStyle,
          ]}
        >
          Selamat Datang di{'\n'}LifeQuran
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.fontFamily.instrumentSerif.regular,
            },
            subtitleStyle,
          ]}
        >
          Aplikasi Al-Qur'an digital dengan gamifikasi untuk membantu Anda
          istiqomah membaca setiap hari
        </Animated.Text>

        {/* Features */}
        <Animated.View style={[styles.features, featureStyle]}>
          <FeatureItem
            icon="📚"
            title="Baca Al-Qur'an Lengkap"
            description="30 Juz, 114 Surah dengan terjemahan"
            theme={theme}
          />
          <FeatureItem
            icon="🎯"
            title="Target Harian"
            description="Atur target bacaan dan raih pencapaian"
            theme={theme}
          />
          <FeatureItem
            icon="🏆"
            title="Gamifikasi"
            description="XP, Level, Streak, dan Badge"
            theme={theme}
          />
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <Animated.View style={[styles.bottomActions, buttonStyle]}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
        >
          Mulai
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

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  theme: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  theme,
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureContent}>
      <Text
        style={[
          styles.featureTitle,
          {
            color: theme.colors.text.primary,
            fontFamily: theme.fontFamily.satoshi.medium,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.featureDescription,
          {
            color: theme.colors.text.secondary,
            fontFamily: theme.fontFamily.satoshi.regular,
          },
        ]}
      >
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  features: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    padding: 24,
    paddingBottom: 40,
  },
});
