/**
 * LifeQuran Notification Manager
 * 
 * Handles all notification functionality:
 * - Daily reminders
 * - Streak protection
 * - Achievement unlocks
 * - Motivational messages
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export class NotificationManager {
    private static instance: NotificationManager;

    private constructor() { }

    static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }

    /**
     * Request notification permissions
     */
    async requestPermissions(): Promise<boolean> {
        if (!Device.isDevice) {
            console.log('Must use physical device for notifications');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return false;
        }

        // Save permission status
        await AsyncStorage.setItem('notification_permission', 'granted');
        return true;
    }

    /**
     * Schedule daily reminder notification
     */
    async scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
        try {
            // Cancel existing daily reminder
            await this.cancelDailyReminder();

            const trigger: Notifications.DailyTriggerInput = {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour,
                minute,
            };

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Assalamu'alaikum! 🌙",
                    body: this.getMotivationalMessage(),
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: { type: 'daily_reminder' },
                },
                trigger,
            });

            // Save notification ID
            await AsyncStorage.setItem('daily_reminder_id', notificationId);
            await AsyncStorage.setItem('reminder_time', JSON.stringify({ hour, minute }));

            console.log('Daily reminder scheduled:', notificationId);
            return notificationId;
        } catch (error) {
            console.error('Error scheduling daily reminder:', error);
            return null;
        }
    }

    /**
     * Cancel daily reminder
     */
    async cancelDailyReminder(): Promise<void> {
        try {
            const notificationId = await AsyncStorage.getItem('daily_reminder_id');
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
                await AsyncStorage.removeItem('daily_reminder_id');
                console.log('Daily reminder cancelled');
            }
        } catch (error) {
            console.error('Error cancelling daily reminder:', error);
        }
    }

    /**
     * Get saved reminder time
     */
    async getReminderTime(): Promise<{ hour: number; minute: number } | null> {
        try {
            const timeStr = await AsyncStorage.getItem('reminder_time');
            if (timeStr) {
                return JSON.parse(timeStr);
            }
            return null;
        } catch (error) {
            console.error('Error getting reminder time:', error);
            return null;
        }
    }

    /**
     * Schedule streak protection reminder (if user hasn't read today)
     */
    async scheduleStreakProtectionReminder(): Promise<void> {
        try {
            // Schedule for 9 PM if user hasn't read today
            const trigger: Notifications.DailyTriggerInput = {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: 21,
                minute: 0,
            };

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🔥 Streak Anda Terancam!',
                    body: 'Jangan putuskan streak Anda! Baca minimal 1 halaman hari ini.',
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: { type: 'streak_protection' },
                },
                trigger,
            });
        } catch (error) {
            console.error('Error scheduling streak protection:', error);
        }
    }

    /**
     * Send achievement unlock notification
     */
    async sendAchievementNotification(
        badgeName: string,
        badgeEmoji: string
    ): Promise<void> {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🎉 Badge Baru Terbuka!',
                    body: `Selamat! Anda mendapatkan badge "${badgeName}" ${badgeEmoji}`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: { type: 'achievement', badgeName },
                },
                trigger: null, // Send immediately
            });
        } catch (error) {
            console.error('Error sending achievement notification:', error);
        }
    }

    /**
     * Send level up notification
     */
    async sendLevelUpNotification(newLevel: number, levelName: string): Promise<void> {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '⭐ Naik Level!',
                    body: `Luar biasa! Anda naik ke Level ${newLevel}: ${levelName}`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: { type: 'level_up', level: newLevel },
                },
                trigger: null,
            });
        } catch (error) {
            console.error('Error sending level up notification:', error);
        }
    }

    /**
     * Get motivational message for daily reminder
     */
    private getMotivationalMessage(): string {
        const messages = [
            'Waktunya tilawah! Mari baca Al-Qur\'an hari ini 📖',
            'Jaga streak Anda! Baca minimal 1 halaman 🔥',
            'Al-Qur\'an menanti Anda. Yuk mulai membaca! ✨',
            'Istiqomah adalah kunci. Baca Al-Qur\'an sekarang 🌙',
            'Raih pahala dengan membaca Al-Qur\'an hari ini 🤲',
            'Target harian menanti! Mari lanjutkan bacaan 📚',
            'Setiap ayat adalah berkah. Mulai membaca sekarang 💚',
        ];

        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    /**
     * Handle notification tap (deep linking)
     */
    async handleNotificationResponse(
        response: Notifications.NotificationResponse
    ): Promise<string | null> {
        const data = response.notification.request.content.data;

        switch (data.type) {
            case 'daily_reminder':
            case 'streak_protection':
                return '/reading'; // Navigate to continue reading
            case 'achievement':
                return '/gamification'; // Navigate to achievements
            case 'level_up':
                return '/progress'; // Navigate to progress screen
            default:
                return '/';
        }
    }

    /**
     * Get all scheduled notifications
     */
    async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    /**
     * Cancel all notifications
     */
    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem('daily_reminder_id');
        await AsyncStorage.removeItem('reminder_time');
    }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance();
