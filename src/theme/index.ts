/**
 * LifeQuran Theme System
 * Main theme export combining all design tokens
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { Colors, getThemeColors, type ThemeMode } from './colors';
import { Typography, FontFamily, FontSize } from './typography';
import { Spacing, BorderRadius, CardRadius, Shadows } from './spacing';
import { Animations, Duration, AnimationEasing, HapticFeedback } from './animations';

export interface Theme {
  mode: ThemeMode;
  colors: ReturnType<typeof getThemeColors>;
  primary: typeof Colors.primary;
  semantic: typeof Colors.semantic;
  gamification: typeof Colors.gamification;
  gradients: typeof Colors.gradients;
  typography: typeof Typography;
  fontFamily: typeof FontFamily;
  fontSize: typeof FontSize;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  cardRadius: typeof CardRadius;
  shadows: typeof Shadows;
  animations: typeof Animations;
  duration: typeof Duration;
  easing: typeof AnimationEasing;
  haptic: typeof HapticFeedback;
}

export const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: getThemeColors(mode),
  primary: Colors.primary,
  semantic: Colors.semantic,
  gamification: Colors.gamification,
  gradients: Colors.gradients,
  typography: Typography,
  fontFamily: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  borderRadius: BorderRadius,
  cardRadius: CardRadius,
  shadows: Shadows,
  animations: Animations,
  duration: Duration,
  easing: AnimationEasing,
  haptic: HapticFeedback,
});

// Export individual modules
export { Colors, getThemeColors };
export { Typography, FontFamily, FontSize };
export { Spacing, BorderRadius, CardRadius, Shadows };
export { Animations, Duration, AnimationEasing, HapticFeedback };
export type { ThemeMode };
