/**
 * LifeQuran Color System
 * Based on Design System - Divine Nature Architecture
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

export const Colors = {
  // Primary Colors
  primary: {
    emerald: '#22C55E',      // Growth indicators, life-affirming actions
    midnight: '#022C22',     // Dark mode base, deep ocular comfort
    celestial: '#ADFFD8',    // Interaction highlights, active states
    gold: '#D4AF37',         // High-value achievements, tajwid honors (max 5x per screen)
    canvas: '#FFFFFF',       // Light mode base
  },

  // Light Mode
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceElevated: '#FFFFFF',
    text: {
      primary: '#022C22',
      secondary: '#4B5563',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    border: '#E5E7EB',
    divider: '#F3F4F6',
  },

  // Dark Mode
  dark: {
    background: '#022C22',    // Midnight Emerald
    surface: '#0A3A2E',
    surfaceElevated: '#124235',
    text: {
      primary: '#FFFFFF',
      secondary: '#ADFFD8',
      tertiary: '#6EE7B7',
      inverse: '#022C22',
    },
    border: '#1E5A47',
    divider: '#134D3C',
  },

  // Semantic Colors
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Gamification Colors
  gamification: {
    streak: '#F97316',       // Fire/orange for streak counter
    xp: '#22C55E',           // Primary emerald for XP
    level: '#D4AF37',        // Muted gold for level
    badge: '#D4AF37',        // Muted gold for achievements
  },

  // Gradient Presets (Emerald variants)
  gradients: {
    emerald: ['#22C55E', '#10B981', '#059669'],
    soft: ['#ADFFD8', '#6EE7B7', '#34D399'],
    dark: ['#022C22', '#0A3A2E', '#124235'],
  },
};

export type ThemeMode = 'light' | 'dark';

export const getThemeColors = (mode: ThemeMode) => {
  return mode === 'dark' ? Colors.dark : Colors.light;
};
