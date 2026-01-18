/**
 * LifeQuran Audio Store
 * 
 * State management untuk audio murottal player
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import { create } from 'zustand';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { DatabaseOperations } from '../database';

export interface Qari {
  id: string;
  name: string;
  arabicName: string;
  baseUrl: string;
}

export interface AudioState {
  // Player State
  sound: Audio.Sound | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentSurahId: number | null;
  currentAyahNumber: number | null;
  
  // Playback Controls
  playbackRate: number;
  repeatMode: 'off' | 'ayah' | 'surah';
  currentQari: Qari;
  
  // Progress
  position: number;
  duration: number;
  
  // Actions
  loadAudio: (surahId: number, ayahNumber?: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  setRepeatMode: (mode: 'off' | 'ayah' | 'surah') => void;
  setQari: (qari: Qari) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  cleanup: () => Promise<void>;
}

// Available Qaris
export const AVAILABLE_QARIS: Qari[] = [
  {
    id: 'mishari_rashid',
    name: 'Mishari Rashid Alafasy',
    arabicName: 'مشاري بن راشد العفاسي',
    baseUrl: 'https://server8.mp3quran.net/afs',
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit Abdus Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    baseUrl: 'https://server7.mp3quran.net/basit',
  },
  {
    id: 'saad_al_ghamdi',
    name: "Sa'd Al-Ghamdi",
    arabicName: 'سعد الغامدي',
    baseUrl: 'https://server7.mp3quran.net/s_gmd',
  },
  {
    id: 'ahmed_al_ajmi',
    name: 'Ahmed Al-Ajmi',
    arabicName: 'أحمد بن علي العجمي',
    baseUrl: 'https://server10.mp3quran.net/ajm',
  },
  {
    id: 'maher_al_muaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    baseUrl: 'https://server12.mp3quran.net/maher',
  },
];

export const useAudioStore = create<AudioState>((set, get) => ({
  sound: null,
  isPlaying: false,
  isLoading: false,
  currentSurahId: null,
  currentAyahNumber: null,
  playbackRate: 1.0,
  repeatMode: 'off',
  currentQari: AVAILABLE_QARIS[0],
  position: 0,
  duration: 0,

  loadAudio: async (surahId: number, ayahNumber?: number) => {
    try {
      set({ isLoading: true });
      
      // Cleanup previous sound
      await get().cleanup();

      // Configure audio mode for background playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
      });

      // Format surah number with leading zeros (001, 002, etc.)
      const formattedSurahId = surahId.toString().padStart(3, '0');
      
      // Construct audio URL
      const { currentQari } = get();
      const audioUrl = `${currentQari.baseUrl}/${formattedSurahId}.mp3`;

      console.log('Loading audio from:', audioUrl);

      // Create and load sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false, rate: get().playbackRate },
        (status) => get().onPlaybackStatusUpdate(status)
      );

      set({
        sound,
        currentSurahId: surahId,
        currentAyahNumber: ayahNumber || null,
        isLoading: false,
      });

      console.log('✅ Audio loaded successfully');
    } catch (error) {
      console.error('Error loading audio:', error);
      set({ isLoading: false });
    }
  },

  play: async () => {
    try {
      const { sound } = get();
      if (!sound) return;

      await sound.playAsync();
      set({ isPlaying: true });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  },

  pause: async () => {
    try {
      const { sound } = get();
      if (!sound) return;

      await sound.pauseAsync();
      set({ isPlaying: false });
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  },

  stop: async () => {
    try {
      const { sound } = get();
      if (!sound) return;

      await sound.stopAsync();
      await sound.setPositionAsync(0);
      set({ isPlaying: false, position: 0 });
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  },

  seekTo: async (position: number) => {
    try {
      const { sound } = get();
      if (!sound) return;

      await sound.setPositionAsync(position);
      set({ position });
    } catch (error) {
      console.error('Error seeking:', error);
    }
  },

  setPlaybackRate: async (rate: number) => {
    try {
      const { sound } = get();
      
      // Clamp rate between 0.5 and 2.0
      const clampedRate = Math.max(0.5, Math.min(2.0, rate));
      
      if (sound) {
        await sound.setRateAsync(clampedRate, true);
      }
      
      set({ playbackRate: clampedRate });
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  },

  setRepeatMode: (mode: 'off' | 'ayah' | 'surah') => {
    set({ repeatMode: mode });
  },

  setQari: (qari: Qari) => {
    set({ currentQari: qari });
  },

  playNext: async () => {
    const { currentSurahId } = get();
    if (!currentSurahId) return;

    // Load next surah (max 114)
    const nextSurahId = currentSurahId < 114 ? currentSurahId + 1 : 1;
    await get().loadAudio(nextSurahId);
    await get().play();
  },

  playPrevious: async () => {
    const { currentSurahId } = get();
    if (!currentSurahId) return;

    // Load previous surah
    const prevSurahId = currentSurahId > 1 ? currentSurahId - 1 : 114;
    await get().loadAudio(prevSurahId);
    await get().play();
  },

  cleanup: async () => {
    try {
      const { sound } = get();
      if (sound) {
        await sound.unloadAsync();
        set({ sound: null, isPlaying: false, position: 0, duration: 0 });
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  },

  onPlaybackStatusUpdate: (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const { position, duration, isPlaying, didJustFinish } = status as any;

    set({
      position: position || 0,
      duration: duration || 0,
      isPlaying: isPlaying || false,
    });

    // Handle playback finish
    if (didJustFinish) {
      const { repeatMode, currentSurahId } = get();

      if (repeatMode === 'surah') {
        // Replay current surah
        get().stop().then(() => get().play());
      } else if (repeatMode === 'off') {
        // Auto-play next surah
        get().playNext();
      }

      // Award XP for listening to complete surah
      if (currentSurahId) {
        DatabaseOperations.addXP(5, 'audio_complete', `Mendengarkan Surah ${currentSurahId}`);
      }
    }
  },
}));
