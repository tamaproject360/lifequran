/**
 * LifeQuran Splash/Welcome Screen
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { Button } from '../src/components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { QuranDataImporter } from '../src/database/quranData';

export default function Index() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    checkQuranData();
  }, []);

  const checkQuranData = async () => {
    try {
      const exists = await QuranDataImporter.checkDataExists();
      if (exists) {
        // Data exists, go to home
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
      } else {
        setIsChecking(false);
        startAnimations();
      }
    } catch (error) {
      console.error('Error checking data:', error);
      setIsChecking(false);
      startAnimations();
    }
  };

  const startAnimations = () => {
    // Stagger animation sequence
    titleOpacity.value = withTiming(1, {
      duration: theme.duration.slow,
      easing: Easing.out(Easing.exp),
    });
    titleTranslateY.value = withTiming(0, {
      duration: theme.duration.slow,
      easing: Easing.out(Easing.exp),
    });

    taglineOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: theme.duration.slow,
        easing: Easing.out(Easing.exp),
      })
    );
    taglineTranslateY.value = withDelay(
      150,
      withTiming(0, {
        duration: theme.duration.slow,
        easing: Easing.out(Easing.exp),
      })
    );

    buttonOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: theme.duration.slow,
        easing: Easing.out(Easing.exp),
      })
    );
    buttonTranslateY.value = withDelay(
      300,
      withTiming(0, {
        duration: theme.duration.slow,
        easing: Easing.out(Easing.exp),
      })
    );
  };

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handleGetStarted = () => {
    // Navigate to data import screen
    router.push('/dataImport');
  };

  if (isChecking) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.primary.emerald,
              fontFamily: theme.fontFamily.satoshi.black,
              fontSize: theme.fontSize.display.medium,
            },
          ]}
        >
          LifeQuran
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.title,
            {
              color: theme.primary.emerald,
              fontFamily: theme.fontFamily.satoshi.black,
              fontSize: theme.fontSize.display.medium,
            },
            titleStyle,
          ]}
        >
          LifeQuran
        </Animated.Text>
        
        <Animated.Text
          style={[
            styles.tagline,
            {
              color: isDark 
                ? theme.primary.celestial 
                : theme.colors.text.secondary,
              fontFamily: theme.fontFamily.instrumentSerif.italic,
              fontSize: theme.fontSize.title.large,
            },
            taglineStyle,
          ]}
        >
          Elevating Devotion through Divine Design
        </Animated.Text>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleGetStarted}
          >
            Mulai Perjalanan Spiritual
          </Button>
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          styles.signature,
          {
            color: theme.colors.text.tertiary,
            fontFamily: theme.fontFamily.satoshi.regular,
            fontSize: theme.fontSize.body.small,
          },
        ]}
      >
        Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 28,
  },
  buttonContainer: {
    marginTop: 48,
    width: '100%',
    maxWidth: 400,
  },
  signature: {
    textAlign: 'center',
    opacity: 0.7,
    paddingBottom: 24,
  },
});
