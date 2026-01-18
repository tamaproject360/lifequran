/**
 * Badge Unlock Modal Component
 * 
 * Modal animasi saat unlock badge baru
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface BadgeUnlockModalProps {
  visible: boolean;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
  xpReward: number;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  visible,
  badgeName,
  badgeDescription,
  badgeIcon,
  xpReward,
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
        {/* Particle Burst Effect */}
        {visible && (
          <>
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              const distance = 100;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;

              return (
                <MotiView
                  key={i}
                  from={{
                    opacity: 0,
                    translateX: 0,
                    translateY: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    translateX: x,
                    translateY: y,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    type: 'timing',
                    duration: 1000,
                    delay: 200,
                    easing: Easing.out(Easing.quad),
                  }}
                  style={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#22C55E',
                  }}
                />
              );
            })}
          </>
        )}

        {/* Main Card */}
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 100,
          }}
          className="bg-white dark:bg-midnight-emerald rounded-3xl p-8 mx-6 shadow-2xl"
          style={{ maxWidth: 320 }}
        >
          {/* Badge Icon with Glow */}
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{
              type: 'spring',
              delay: 200,
              damping: 12,
              stiffness: 100,
            }}
            className="items-center mb-4"
          >
            <View className="relative">
              {/* Glow Effect */}
              <MotiView
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  type: 'timing',
                  duration: 2000,
                  loop: true,
                  easing: Easing.inOut(Easing.ease),
                }}
                className="absolute w-28 h-28 rounded-full bg-primary-emerald/30"
                style={{ top: -2, left: -2 }}
              />
              
              <View className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-emerald to-celestial-mint items-center justify-center">
                <Text className="text-6xl">{badgeIcon}</Text>
              </View>
            </View>
          </MotiView>

          {/* Text */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              delay: 400,
              duration: 400,
              easing: Easing.out(Easing.exp),
            }}
          >
            <Text className="text-center text-xl font-satoshi-bold text-gray-900 dark:text-white mb-2">
              Badge Baru Terbuka! 🎊
            </Text>
            
            <Text className="text-center text-2xl font-satoshi-bold text-primary-emerald mb-2">
              {badgeName}
            </Text>

            <Text className="text-center text-sm font-satoshi text-gray-600 dark:text-gray-300 mb-4">
              {badgeDescription}
            </Text>

            {/* XP Reward */}
            {xpReward > 0 && (
              <View className="bg-primary-emerald/10 rounded-2xl py-3 px-4 mb-4">
                <Text className="text-center text-lg font-satoshi-bold text-primary-emerald">
                  +{xpReward} XP
                </Text>
              </View>
            )}
          </MotiView>

          {/* Button */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              delay: 600,
              damping: 12,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.96}
              className="bg-primary-emerald rounded-2xl py-4"
            >
              <Text className="text-center text-white font-satoshi-bold text-lg">
                Alhamdulillah!
              </Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </View>
    </Modal>
  );
};
