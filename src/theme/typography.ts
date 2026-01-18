/**
 * LifeQuran Typography System
 * 
 * Fonts:
 * - Satoshi: Headlines & UI (Geometric, sharp, modern executive feel)
 * - Instrument Serif: Quranic Text & Quotes (Elegant, artistic, scholarly)
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

export const FontFamily = {
  // UI & Headlines (fallback to System until custom fonts are loaded)
  satoshi: {
    regular: 'System',  // Will be 'Satoshi-Regular' when custom font is loaded
    medium: 'System',   // Will be 'Satoshi-Medium'
    bold: 'System',     // Will be 'Satoshi-Bold'
    black: 'System',    // Will be 'Satoshi-Black'
  },
  
  // Quranic Text & Quotes (fallback to System)
  instrumentSerif: {
    regular: 'System',  // Will be 'InstrumentSerif-Regular'
    italic: 'System',   // Will be 'InstrumentSerif-Italic'
  },
  
  // Arabic Quran Text
  uthmani: {
    regular: 'System',  // Will be 'UthmanicHafs-Regular'
  },
  
  // System fallback
  system: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

export const FontSize = {
  // Display
  display: {
    large: 57,
    medium: 45,
    small: 36,
  },
  
  // Headline
  headline: {
    large: 32,
    medium: 28,
    small: 24,
  },
  
  // Title
  title: {
    large: 22,
    medium: 16,
    small: 14,
  },
  
  // Body
  body: {
    large: 16,
    medium: 14,
    small: 12,
  },
  
  // Label
  label: {
    large: 14,
    medium: 12,
    small: 11,
  },
  
  // Quranic Text (adjustable)
  quran: {
    arabic: {
      min: 20,
      default: 28,
      max: 48,
    },
    translation: {
      min: 12,
      default: 16,
      max: 24,
    },
  },
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export const LetterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
};

// Typography Presets
export const Typography = {
  // Display
  displayLarge: {
    fontFamily: FontFamily.satoshi.black,
    fontSize: FontSize.display.large,
    lineHeight: FontSize.display.large * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  displayMedium: {
    fontFamily: FontFamily.satoshi.bold,
    fontSize: FontSize.display.medium,
    lineHeight: FontSize.display.medium * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  displaySmall: {
    fontFamily: FontFamily.satoshi.bold,
    fontSize: FontSize.display.small,
    lineHeight: FontSize.display.small * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Headline
  headlineLarge: {
    fontFamily: FontFamily.satoshi.bold,
    fontSize: FontSize.headline.large,
    lineHeight: FontSize.headline.large * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  headlineMedium: {
    fontFamily: FontFamily.satoshi.medium,
    fontSize: FontSize.headline.medium,
    lineHeight: FontSize.headline.medium * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  headlineSmall: {
    fontFamily: FontFamily.satoshi.medium,
    fontSize: FontSize.headline.small,
    lineHeight: FontSize.headline.small * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Body
  bodyLarge: {
    fontFamily: FontFamily.satoshi.regular,
    fontSize: FontSize.body.large,
    lineHeight: FontSize.body.large * LineHeight.relaxed,
    letterSpacing: LetterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: FontFamily.satoshi.regular,
    fontSize: FontSize.body.medium,
    lineHeight: FontSize.body.medium * LineHeight.relaxed,
    letterSpacing: LetterSpacing.normal,
  },
  bodySmall: {
    fontFamily: FontFamily.satoshi.regular,
    fontSize: FontSize.body.small,
    lineHeight: FontSize.body.small * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Quranic Text
  quranArabic: {
    fontFamily: FontFamily.uthmani.regular,
    fontSize: FontSize.quran.arabic.default,
    lineHeight: FontSize.quran.arabic.default * LineHeight.loose,
    letterSpacing: LetterSpacing.wide,
    textAlign: 'right' as const,
  },
  quranTranslation: {
    fontFamily: FontFamily.instrumentSerif.regular,
    fontSize: FontSize.quran.translation.default,
    lineHeight: FontSize.quran.translation.default * LineHeight.relaxed,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Quote
  quote: {
    fontFamily: FontFamily.instrumentSerif.italic,
    fontSize: FontSize.body.large,
    lineHeight: FontSize.body.large * LineHeight.relaxed,
    letterSpacing: LetterSpacing.wide,
  },
};
