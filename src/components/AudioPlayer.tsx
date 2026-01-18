/**
 * LifeQuran Audio Player Component
 * 
 * Premium audio player dengan controls dan visualisasi
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAudioStore } from '../store/audioStore';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

interface AudioPlayerProps {
  surahId: number;
  surahName: string;
  onClose?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surahId,
  surahName,
  onClose,
}) => {
  const {
    isPlaying,
    isLoading,
    playbackRate,
    repeatMode,
    position,
    duration,
    loadAudio,
    play,
    pause,
    stop,
    setPlaybackRate,
    setRepeatMode,
    playNext,
    playPrevious,
    cleanup,
  } = useAudioStore();

  useEffect(() => {
    // Load audio when component mounts
    loadAudio(surahId);

    return () => {
      // Cleanup when component unmounts
      cleanup();
    };
  }, [surahId]);

  const handlePlayPause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  const handleStop = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await stop();
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await playNext();
  };

  const handlePrevious = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await playPrevious();
  };

  const handleSpeedChange = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    await setPlaybackRate(speeds[nextIndex]);
  };

  const handleRepeatToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const modes: Array<'off' | 'ayah' | 'surah'> = ['off', 'surah'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      style={styles.container}
      className="bg-white dark:bg-midnight-emerald rounded-3xl p-6 shadow-lg"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1">
          <Text className="text-lg font-satoshi-bold text-gray-900 dark:text-white">
            {surahName}
          </Text>
          <Text className="text-sm font-satoshi text-gray-500 dark:text-gray-400 mt-1">
            Murottal
          </Text>
        </View>
        
        {onClose && (
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <Ionicons name="close" size={24} color={colors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <MotiView
            animate={{ width: `${progress}%` }}
            transition={{ type: 'timing', duration: 100 }}
            className="h-full bg-primary-emerald"
          />
        </View>
        
        <View className="flex-row justify-between mt-2">
          <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
            {formatTime(position)}
          </Text>
          <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400">
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Main Controls */}
      <View className="flex-row items-center justify-center space-x-4 mb-6">
        {/* Previous */}
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={isLoading}
          className="w-12 h-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <Ionicons name="play-skip-back" size={24} color={colors.primary.emerald} />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          disabled={isLoading}
          className="w-16 h-16 items-center justify-center rounded-full bg-primary-emerald"
        >
          {isLoading ? (
            <Text className="text-white">...</Text>
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="white"
            />
          )}
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={isLoading}
          className="w-12 h-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <Ionicons name="play-skip-forward" size={24} color={colors.primary.emerald} />
        </TouchableOpacity>
      </View>

      {/* Secondary Controls */}
      <View className="flex-row items-center justify-around">
        {/* Stop */}
        <TouchableOpacity
          onPress={handleStop}
          disabled={isLoading}
          className="items-center"
        >
          <Ionicons name="stop-circle-outline" size={28} color={colors.gray[600]} />
          <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400 mt-1">
            Stop
          </Text>
        </TouchableOpacity>

        {/* Speed */}
        <TouchableOpacity
          onPress={handleSpeedChange}
          disabled={isLoading}
          className="items-center"
        >
          <View className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Text className="text-sm font-satoshi-bold text-primary-emerald">
              {playbackRate}x
            </Text>
          </View>
          <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400 mt-1">
            Speed
          </Text>
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          onPress={handleRepeatToggle}
          disabled={isLoading}
          className="items-center"
        >
          <Ionicons
            name={repeatMode === 'off' ? 'repeat-outline' : 'repeat'}
            size={28}
            color={repeatMode === 'off' ? colors.gray[600] : colors.primary.emerald}
          />
          <Text className="text-xs font-satoshi text-gray-500 dark:text-gray-400 mt-1">
            {repeatMode === 'off' ? 'Off' : 'Surah'}
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});
