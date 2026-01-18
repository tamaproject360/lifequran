/**
 * LifeQuran Animation System
 * 
 * Motion Principles:
 * 1. Fluidity: No instant changes, everything is a transition
 * 2. Serenity: Ease-out-expo for graceful finish
 * 3. Stagger: Cascade into view with 30ms delay
 * 
 * Forbidden: Bounce easing, Linear easing, Delays > 0.4s
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { Easing } from 'react-native-reanimated';

// Duration presets
export const Duration = {
  instant: 0,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  wave: 8000,  // For organic wave animations
};

// Easing curves
export const AnimationEasing = {
  // Serene Flow - primary easing
  easeOutExpo: Easing.bezier(0.16, 1, 0.3, 1),
  
  // Alternative easings
  easeOut: Easing.out(Easing.quad),
  easeInOut: Easing.inOut(Easing.quad),
  
  // Spring configs
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springGentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 1,
  },
};

// Animation presets
export const Animations = {
  // Fade In with vertical slide (8px)
  fadeInSlide: {
    duration: Duration.normal,
    easing: AnimationEasing.easeOutExpo,
    translateY: 8,
  },
  
  // Stagger delay for list items
  stagger: {
    delay: 30,  // 30ms per item
  },
  
  // Button press animation
  buttonPress: {
    scale: 0.96,
    duration: Duration.fast,
    tension: 400,
  },
  
  // Card reveal
  cardReveal: {
    duration: Duration.normal,
    easing: AnimationEasing.easeOutExpo,
    opacity: { from: 0, to: 1 },
    translateY: { from: 20, to: 0 },
  },
  
  // Navigation fade
  navigationFade: {
    duration: Duration.normal,
    easing: AnimationEasing.easeOut,
    opacity: { from: 1, to: 0.1 },
  },
  
  // Counting animation (for stats)
  counting: {
    duration: Duration.slower,
    easing: AnimationEasing.easeOutExpo,
  },
  
  // Particle burst (achievement unlock)
  particleBurst: {
    duration: Duration.slow,
    easing: AnimationEasing.easeOut,
  },
  
  // Wavy animation (organic shapes)
  wave: {
    duration: Duration.wave,
    easing: Easing.inOut(Easing.ease),
  },
  
  // Shimmer effect (loading)
  shimmer: {
    duration: 1500,
    easing: Easing.linear,
  },
};

// Haptic feedback types
export const HapticFeedback = {
  light: 'light' as const,      // Verse completion
  medium: 'medium' as const,    // Surah completion
  heavy: 'heavy' as const,      // Achievement unlock
  success: 'success' as const,  // Goal reached
  warning: 'warning' as const,  // Streak protection
  error: 'error' as const,      // Error state
};
