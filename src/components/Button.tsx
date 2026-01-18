/**
 * LifeQuran Button Component
 * 
 * Premium button with haptic feedback and smooth animations
 * Follows design system principles
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
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

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: string | React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hapticFeedback?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  hapticFeedback = true,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Animation style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Press handlers with haptic feedback
  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 400,
    });
    if (hapticFeedback && !disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  // Get button colors based on variant
  const getButtonColors = () => {
    const isDisabled = disabled || loading;
    
    switch (variant) {
      case 'primary':
        return {
          background: isDisabled 
            ? theme.colors.border 
            : theme.primary.emerald,
          text: theme.colors.text.inverse,
        };
      case 'secondary':
        return {
          background: isDisabled 
            ? theme.colors.border 
            : theme.colors.surface,
          text: theme.primary.emerald,
        };
      case 'outline':
        return {
          background: 'transparent',
          text: isDisabled 
            ? theme.colors.text.tertiary 
            : theme.primary.emerald,
          border: isDisabled 
            ? theme.colors.border 
            : theme.primary.emerald,
        };
      case 'ghost':
        return {
          background: 'transparent',
          text: isDisabled 
            ? theme.colors.text.tertiary 
            : theme.colors.text.primary,
        };
      case 'gold':
        return {
          background: isDisabled 
            ? theme.colors.border 
            : theme.primary.gold,
          text: theme.mode === 'dark' 
            ? theme.primary.midnight 
            : '#FFFFFF',
        };
      default:
        return {
          background: theme.primary.emerald,
          text: theme.colors.text.inverse,
        };
    }
  };

  // Get button size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          fontSize: theme.fontSize.body.small,
          height: 36,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          fontSize: theme.fontSize.body.medium,
          height: 44,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing['2xl'],
          fontSize: theme.fontSize.body.large,
          height: 52,
        };
      default:
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          fontSize: theme.fontSize.body.medium,
          height: 44,
        };
    }
  };

  const colors = getButtonColors();
  const sizeStyles = getSizeStyles();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: colors.background,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          height: sizeStyles.height,
          borderRadius: theme.borderRadius.lg,
          ...(colors.border && {
            borderWidth: 2,
            borderColor: colors.border,
          }),
          ...(fullWidth && { width: '100%' }),
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Animated.View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
          )}
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.text,
                {
                  color: colors.text,
                  fontSize: sizeStyles.fontSize,
                  fontFamily: theme.fontFamily.satoshi.medium,
                },
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {icon && iconPosition === 'right' && (
            <Animated.View style={styles.iconRight}>{icon}</Animated.View>
          )}
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
