/**
 * LifeQuran Tutorial Screen
 * 
 * Interactive walkthrough fitur-fitur aplikasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type TutorialSlide = {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
};

const slides: TutorialSlide[] = [
  {
    id: 1,
    icon: '📖',
    title: 'Baca Al-Qur'an Lengkap',
    description:
      '30 Juz, 114 Surah dengan terjemahan Indonesia. Akses semua kapan saja, di mana saja.',
    color: '#22C55E',
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Target Harian',
    description:
      'Atur target bacaan harian dan raih pencapaian. Mulai dari 1 halaman/hari!',
    color: '#3B82F6',
  },
  {
    id: 3,
    icon: '🔥',
    title: 'Streak & Gamifikasi',
    description:
      'Dapatkan XP, naik level, unlock badge, dan jaga streak harian Anda!',
    color: '#F59E0B',
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Pencapaian',
    description:
      'Kumpulkan badge spesial, compete di leaderboard, dan raih milestone!',
    color: '#D4AF37',
  },
  {
    id: 5,
    icon: '🎵',
    title: 'Audio Murottal',
    description:
      'Dengarkan murottal dari qari terbaik dengan fitur repeat untuk hafalan.',
    color: '#8B5CF6',
  },
];

export default function TutorialScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      translateX.value = withTiming(-(currentIndex + 1) * width, { duration: 300 });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // Navigate to main app (tabs)
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Slides Container */}
      <View style={styles.slidesContainer}>
        <Animated.View
          style={[
            styles.slides,
            {
              transform: [
                {
                  translateX: useAnimatedStyle(() => ({
                    translateX: translateX.value,
                  })).translateX,
                },
              ],
            },
          ]}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={[styles.slide, { width }]}>
              <SlideContent slide={slide} theme={theme} />
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? theme.primary.emerald
                    : theme.colors.border,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {currentIndex < slides.length - 1 ? (
          <>
            <Button variant="ghost" size="medium" onPress={handleSkip}>
              Lewati
            </Button>
            <Button variant="primary" size="medium" onPress={handleNext}>
              Lanjut
            </Button>
          </>
        ) : (
          <Button variant="primary" size="large" fullWidth onPress={handleFinish}>
            Mulai Membaca
          </Button>
        )}
      </View>
    </View>
  );
}

const SlideContent: React.FC<{ slide: TutorialSlide; theme: any }> = ({
  slide,
  theme,
}) => (
  <View style={styles.slideContent}>
    {/* Icon */}
    <View
      style={[
        styles.iconContainer,
        {
          backgroundColor: slide.color + '15',
          borderColor: slide.color + '30',
        },
      ]}
    >
      <Text style={styles.icon}>{slide.icon}</Text>
    </View>

    {/* Title */}
    <Text
      style={[
        styles.slideTitle,
        {
          color: theme.colors.text.primary,
          fontFamily: theme.fontFamily.satoshi.bold,
        },
      ]}
    >
      {slide.title}
    </Text>

    {/* Description */}
    <Text
      style={[
        styles.slideDescription,
        {
          color: theme.colors.text.secondary,
          fontFamily: theme.fontFamily.satoshi.regular,
        },
      ]}
    >
      {slide.description}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slidesContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  slides: {
    flexDirection: 'row',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
  },
  slideTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
});
