/**
 * LifeQuran Streak Manager
 * 
 * Manages streak tracking and freeze mechanism
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationManager } from './notificationManager';

export type StreakData = {
    currentStreak: number;
    longestStreak: number;
    lastReadDate: string;
    freezeAvailable: boolean;
    freezeUsedDate: string | null;
    totalDaysRead: number;
};

export class StreakManager {
    private static instance: StreakManager;
    private readonly STREAK_KEY = 'user_streak_data';

    private constructor() { }

    static getInstance(): StreakManager {
        if (!StreakManager.instance) {
            StreakManager.instance = new StreakManager();
        }
        return StreakManager.instance;
    }

    /**
     * Get current streak data
     */
    async getStreakData(): Promise<StreakData> {
        try {
            const dataStr = await AsyncStorage.getItem(this.STREAK_KEY);
            if (dataStr) {
                return JSON.parse(dataStr);
            }

            // Initialize default streak data
            const defaultData: StreakData = {
                currentStreak: 0,
                longestStreak: 0,
                lastReadDate: '',
                freezeAvailable: true,
                freezeUsedDate: null,
                totalDaysRead: 0,
            };

            await this.saveStreakData(defaultData);
            return defaultData;
        } catch (error) {
            console.error('Error getting streak data:', error);
            throw error;
        }
    }

    /**
     * Save streak data
     */
    private async saveStreakData(data: StreakData): Promise<void> {
        try {
            await AsyncStorage.setItem(this.STREAK_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving streak data:', error);
            throw error;
        }
    }

    /**
     * Update streak when user reads
     */
    async updateStreak(): Promise<StreakData> {
        try {
            const streakData = await this.getStreakData();
            const today = this.getTodayDateString();
            const yesterday = this.getYesterdayDateString();

            // If already read today, just return current data
            if (streakData.lastReadDate === today) {
                return streakData;
            }

            // Check if streak continues
            if (streakData.lastReadDate === yesterday) {
                // Streak continues
                streakData.currentStreak += 1;
            } else if (streakData.lastReadDate === '') {
                // First time reading
                streakData.currentStreak = 1;
            } else {
                // Streak broken - check if freeze can be used
                const canUseFreeze = await this.canUseFreeze(streakData);

                if (canUseFreeze) {
                    // Use freeze to save streak
                    await this.useFreeze(streakData);
                    streakData.currentStreak += 1; // Continue streak
                } else {
                    // Streak broken, reset to 1
                    streakData.currentStreak = 1;
                }
            }

            // Update longest streak
            if (streakData.currentStreak > streakData.longestStreak) {
                streakData.longestStreak = streakData.currentStreak;
            }

            // Update last read date and total days
            streakData.lastReadDate = today;
            streakData.totalDaysRead += 1;

            // Reset freeze availability every 7 days
            if (streakData.currentStreak % 7 === 0) {
                streakData.freezeAvailable = true;
                streakData.freezeUsedDate = null;
            }

            await this.saveStreakData(streakData);

            // Send notification if milestone reached
            if (streakData.currentStreak === 7) {
                await notificationManager.sendAchievementNotification(
                    '7 Hari Berturut-turut',
                    '🔥'
                );
            } else if (streakData.currentStreak === 30) {
                await notificationManager.sendAchievementNotification(
                    '30 Hari Istiqomah',
                    '🌙'
                );
            } else if (streakData.currentStreak === 100) {
                await notificationManager.sendAchievementNotification(
                    '100 Hari Master',
                    '👑'
                );
            }

            return streakData;
        } catch (error) {
            console.error('Error updating streak:', error);
            throw error;
        }
    }

    /**
     * Check if user can use freeze
     */
    private async canUseFreeze(streakData: StreakData): Promise<boolean> {
        // Freeze is available if:
        // 1. User has freeze available
        // 2. Freeze hasn't been used in current cycle
        return streakData.freezeAvailable && streakData.freezeUsedDate === null;
    }

    /**
     * Use streak freeze
     */
    private async useFreeze(streakData: StreakData): Promise<void> {
        const today = this.getTodayDateString();

        streakData.freezeAvailable = false;
        streakData.freezeUsedDate = today;

        // Send notification about freeze usage
        await notificationManager.sendAchievementNotification(
            'Streak Freeze Digunakan',
            '❄️'
        );

        console.log('Streak freeze used on:', today);
    }

    /**
     * Manually use freeze (user can activate it before missing a day)
     */
    async activateFreeze(): Promise<boolean> {
        try {
            const streakData = await this.getStreakData();

            if (!streakData.freezeAvailable) {
                return false; // No freeze available
            }

            if (streakData.freezeUsedDate !== null) {
                return false; // Already used in this cycle
            }

            await this.useFreeze(streakData);
            await this.saveStreakData(streakData);

            return true;
        } catch (error) {
            console.error('Error activating freeze:', error);
            return false;
        }
    }

    /**
     * Check if streak is at risk (user hasn't read today)
     */
    async isStreakAtRisk(): Promise<boolean> {
        try {
            const streakData = await this.getStreakData();
            const today = this.getTodayDateString();

            return streakData.lastReadDate !== today && streakData.currentStreak > 0;
        } catch (error) {
            console.error('Error checking streak risk:', error);
            return false;
        }
    }

    /**
     * Get streak bonus XP (awarded every 7 days)
     */
    getStreakBonusXP(currentStreak: number): number {
        if (currentStreak % 7 === 0 && currentStreak > 0) {
            return 100; // +100 XP bonus every 7 days
        }
        return 0;
    }

    /**
     * Get today's date string (YYYY-MM-DD)
     */
    private getTodayDateString(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    /**
     * Get yesterday's date string (YYYY-MM-DD)
     */
    private getYesterdayDateString(): string {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    /**
     * Reset streak (for testing or user request)
     */
    async resetStreak(): Promise<void> {
        const defaultData: StreakData = {
            currentStreak: 0,
            longestStreak: 0,
            lastReadDate: '',
            freezeAvailable: true,
            freezeUsedDate: null,
            totalDaysRead: 0,
        };

        await this.saveStreakData(defaultData);
    }
}

// Export singleton instance
export const streakManager = StreakManager.getInstance();
