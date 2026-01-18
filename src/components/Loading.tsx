/**
 * LifeQuran Loading Components
 * 
 * Custom loading screens with emerald flow animations
 * Follows design system principles
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Shimmer Loading Effect
export const Shimmer: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { theme } = useTheme();
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, {
        duration: theme.animations.shimmer.duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerValue.value,
      [0, 1],
      [-width, width]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        styles.shimmerContainer,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmerOverlay, animatedStyle]}>
        <LinearGradient
          colors={[
            'rgba(34, 197, 94, 0)',
            'rgba(34, 197, 94, 0.1)',
            'rgba(34, 197, 94, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

// Skeleton Text Line
interface SkeletonLineProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = 16,
  style,
}) => {
  return (
    <Shimmer
      style={[
        {
          width,
          height,
          marginVertical: 4,
        },
        style,
      ]}
    />
  );
};

// Skeleton Circle (for avatars, icons)
interface SkeletonCircleProps {
  size?: number;
  style?: ViewStyle;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 48,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <Shimmer
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.borderRadius.full,
        },
        style,
      ]}
    />
  );
};

// Pulsing Dot Indicator
export const PulsingDots: React.FC = () => {
  const { theme } = useTheme();
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const duration = 600;
    const delay = 150;

    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration }),
        withTiming(0, { duration })
      ),
      -1,
      false
    );

    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0, { duration })
        ),
        -1,
        false
      );
    }, delay);

    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0, { duration })
        ),
        -1,
        false
      );
    }, delay * 2);
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot1.value, [0, 1], [0.8, 1.2]) }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot2.value, [0, 1], [0.8, 1.2]) }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot3.value, [0, 1], [0.8, 1.2]) }],
  }));

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: theme.primary.emerald },
          dot1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: theme.primary.emerald },
          dot2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: theme.primary.emerald },
          dot3Style,
        ]}
      />
    </View>
  );
};

// Full Screen Loading
interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.loadingScreen,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PulsingDots />
      {message && (
        <Animated.Text
          style={[
            styles.loadingMessage,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.fontFamily.satoshi.regular,
              fontSize: theme.fontSize.body.medium,
              marginTop: theme.spacing.xl,
            },
          ]}
        >
          {message}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    overflow: 'hidden',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMessage: {
    textAlign: 'center',
  },
});
