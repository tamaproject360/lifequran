/**
 * Level Up Modal Component
 * 
 * Modal animasi celebrasi saat naik level
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  levelName: string;
  levelIcon: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  level,
  levelName,
  levelIcon,
  onClose,
}) => {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        {/* Confetti Background */}
        {visible && (
          <>
            {[...Array(20)].map((_, i) => (
              <MotiView
                key={i}
                from={{
                  opacity: 0,
                  translateY: -100,
                  translateX: Math.random() * width - width / 2,
                  rotate: '0deg',
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  translateY: height,
                  translateX: Math.random() * width - width / 2,
                  rotate: `${Math.random() * 720}deg`,
                }}
                transition={{
                  type: 'timing',
                  duration: 3000,
                  delay: i * 100,
                  easing: Easing.out(Easing.quad),
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: ['#22C55E', '#ADFFD8', '#D4AF37'][i % 3],
                }}
              />
            ))}
          </>
        )}

        {/* Main Card */}
        <MotiView
          from={{ scale: 0, opacity: 0, rotate: '-180deg' }}
          animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 100,
          }}
          className="bg-white dark:bg-midnight-emerald rounded-3xl p-8 mx-6 shadow-2xl"
          style={{ maxWidth: 320 }}
        >
          {/* Icon */}
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              delay: 300,
              damping: 10,
              stiffness: 100,
            }}
            className="items-center mb-4"
          >
            <View className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-emerald to-celestial-mint items-center justify-center">
              <Text className="text-6xl">{levelIcon}</Text>
            </View>
          </MotiView>

          {/* Text */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              delay: 500,
              duration: 400,
              easing: Easing.out(Easing.exp),
            }}
          >
            <Text className="text-center text-2xl font-satoshi-bold text-gray-900 dark:text-white mb-2">
              Selamat! 🎉
            </Text>
            
            <Text className="text-center text-lg font-satoshi text-gray-600 dark:text-gray-300 mb-1">
              Anda naik ke
            </Text>
            
            <Text className="text-center text-3xl font-satoshi-bold text-primary-emerald mb-4">
              Level {level}: {levelName}
            </Text>

            <Text className="text-center text-sm font-satoshi text-gray-500 dark:text-gray-400">
              Masya Allah! Terus tingkatkan ibadah Anda! 🌟
            </Text>
          </MotiView>

          {/* Button */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              delay: 700,
              damping: 12,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.96}
              className="bg-primary-emerald rounded-2xl py-4 mt-6"
            >
              <Text className="text-center text-white font-satoshi-bold text-lg">
                Lanjutkan
              </Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </View>
    </Modal>
  );
};
