# Font Setup Instructions

## Fonts Required for LifeQuran

### 1. Satoshi Font Family (UI & Headlines)
**Download from**: [https://www.fontshare.com/fonts/satoshi](https://www.fontshare.com/fonts/satoshi)

Files needed:
- `Satoshi-Regular.otf`
- `Satoshi-Medium.otf`
- `Satoshi-Bold.otf`
- `Satoshi-Black.otf`

Place in: `assets/fonts/`

### 2. Instrument Serif (Quranic Quotes)
**Download from**: [https://fonts.google.com/specimen/Instrument+Serif](https://fonts.google.com/specimen/Instrument+Serif)

Files needed:
- `InstrumentSerif-Regular.ttf`
- `InstrumentSerif-Italic.ttf`

Place in: `assets/fonts/`

### 3. Uthmanic Hafs (Arabic Quran Text)
**Download from**: [https://fonts.qurancomplex.gov.sa/](https://fonts.qurancomplex.gov.sa/)

Files needed:
- `UthmanicHafs-Regular.otf` or `UthmanicHafs1Ver18.otf`

Place in: `assets/fonts/`

## Installation Steps

1. Download all font files from the links above
2. Place them in the `assets/fonts/` directory
3. The app will automatically load them on startup via `app/_layout.tsx`

## Font Licenses

- **Satoshi**: Free for personal and commercial use (Open Font License)
- **Instrument Serif**: Google Fonts (Open Font License)
- **Uthmanic Hafs**: King Fahd Complex (Free for Quranic purposes)

## Current Status

✅ Font structure defined in theme system
⏳ Font files need to be downloaded and placed in assets/fonts/
⏳ Font loading hook needs to be implemented

---

**Note**: For development, the app will fallback to system fonts if custom fonts are not loaded.
