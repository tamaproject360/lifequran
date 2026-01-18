/**
 * LifeQuran Card Component
 * 
 * Premium card with soft shadows and rounded corners
 * Follows design system principles
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardSize = 'small' | 'medium' | 'large';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  onPress?: () => void;
  hapticFeedback?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  size = 'medium',
  onPress,
  hapticFeedback = true,
  style,
  contentStyle,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  // Animation style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Press handlers
  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 300,
      });
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    }
  };

  // Get card styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surfaceElevated,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.surface,
        };
      default:
        return {
          backgroundColor: theme.colors.surfaceElevated,
          ...theme.shadows.md,
        };
    }
  };

  // Get padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return theme.spacing.md;
      case 'medium':
        return theme.spacing.lg;
      case 'large':
        return theme.spacing.xl;
      default:
        return theme.spacing.lg;
    }
  };

  const variantStyles = getVariantStyles();
  const padding = getPadding();

  const cardContent = (
    <View
      style={[
        styles.content,
        { padding },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            borderRadius: theme.cardRadius.medium,
            ...variantStyles,
          },
          animatedStyle,
          style,
        ]}
      >
        {cardContent}
      </AnimatedPressable>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: theme.cardRadius.medium,
          ...variantStyles,
        },
        style,
      ]}
    >
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  content: {
    // Content container
  },
});
