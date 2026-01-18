/**
 * LifeQuran Font Loading Hook
 * 
 * Loads custom fonts with fallback to system fonts
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        // For now, we'll use system fonts
        // Custom fonts can be added later by placing font files in assets/fonts/
        // See docs/FONT_SETUP.md for instructions
        
        // Uncomment when font files are available:
        /*
        await Font.loadAsync({
          'Satoshi-Regular': require('../../assets/fonts/Satoshi-Regular.otf'),
          'Satoshi-Medium': require('../../assets/fonts/Satoshi-Medium.otf'),
          'Satoshi-Bold': require('../../assets/fonts/Satoshi-Bold.otf'),
          'Satoshi-Black': require('../../assets/fonts/Satoshi-Black.otf'),
          'InstrumentSerif-Regular': require('../../assets/fonts/InstrumentSerif-Regular.ttf'),
          'InstrumentSerif-Italic': require('../../assets/fonts/InstrumentSerif-Italic.ttf'),
          'UthmanicHafs-Regular': require('../../assets/fonts/UthmanicHafs1Ver18.otf'),
        });
        */
        
        // For now, just mark as loaded (using system fonts)
        console.log('Using system fonts. See docs/FONT_SETUP.md to add custom fonts.');
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Failed to load fonts:', e);
        setError(e as Error);
        setFontsLoaded(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, error };
};
