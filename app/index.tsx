/**
 * LifeQuran Splash/Welcome Screen
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { Button } from '../src/components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useAppStore } from '../src/store/appStore';
import { Colors } from '../src/theme/colors';

export default function Index() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  
  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    // Start animations immediately
    startAnimations();
    
    // Check onboarding status after short delay for splash effect
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        // User has completed onboarding, go to home
        router.replace('/(tabs)/home');
      } else {
        // User hasn't completed onboarding, show welcome screen
        setIsChecking(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding]);

  const startAnimations = () => {
    // Stagger animation sequence
    titleOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
    titleTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    taglineOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      })
    );
    taglineTranslateY.value = withDelay(
      150,
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      })
    );

    buttonOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      })
    );
    buttonTranslateY.value = withDelay(
      300,
      withTiming(0, {
        duration: 800,
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
    // Navigate to onboarding
    router.push('/(onboarding)/welcome');
  };

  // Splash screen
  if (isChecking) {
    return (
      <View
        style={[
          styles.container,
          { 
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background, 
            justifyContent: 'center', 
            alignItems: 'center' 
          },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Animated.Text
          style={[
            styles.title,
            titleStyle,
            {
              color: Colors.primary.emerald,
              fontFamily: 'Satoshi-Black',
              fontSize: 42,
            },
          ]}
        >
          LifeQuran
        </Animated.Text>
        <Animated.Text
          style={[
            styles.tagline,
            taglineStyle,
            {
              color: isDark 
                ? Colors.primary.celestial 
                : Colors.light.text.secondary,
              fontFamily: 'InstrumentSerif-Italic',
              fontSize: 18,
              marginTop: 8,
            },
          ]}
        >
          Elevating Devotion through Divine Design
        </Animated.Text>
        <ActivityIndicator 
          size="small" 
          color={Colors.primary.emerald} 
          style={{ marginTop: 32 }}
        />
      </View>
    );
  }

  // Welcome screen for new users
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.title,
            titleStyle,
            {
              color: Colors.primary.emerald,
              fontFamily: 'Satoshi-Black',
              fontSize: 42,
            },
          ]}
        >
          LifeQuran
        </Animated.Text>
        
        <Animated.Text
          style={[
            styles.tagline,
            taglineStyle,
            {
              color: isDark 
                ? Colors.primary.celestial 
                : Colors.light.text.secondary,
              fontFamily: 'InstrumentSerif-Italic',
              fontSize: 20,
            },
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

      <Text
        style={[
          styles.signature,
          {
            color: isDark ? Colors.dark.text.tertiary : Colors.light.text.tertiary,
            fontFamily: 'Satoshi-Regular',
            fontSize: 14,
          },
        ]}
      >
        Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
      </Text>
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
