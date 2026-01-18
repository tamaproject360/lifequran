/**
 * LifeQuran Bookmark List Screen
 * 
 * Display all saved bookmarks with quick access
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card } from '../../src/components';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';

type Bookmark = {
    id: number;
    surah_number: number;
    surah_name: string;
    ayah_number: number;
    verse_text: string;
    created_at: string;
};

export default function BookmarkListScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const db = useSQLiteContext();

    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = async () => {
        try {
            setLoading(true);
            const result = await db.getAllAsync<Bookmark>(`
        SELECT 
          b.id,
          b.surah_number,
          b.ayah_number,
          b.created_at,
          s.name as surah_name,
          v.text as verse_text
        FROM bookmarks b
        JOIN surahs s ON b.surah_number = s.number
        JOIN verses v ON b.surah_number = v.surah_number 
          AND b.ayah_number = v.ayah_number
        ORDER BY b.created_at DESC
      `);
            setBookmarks(result);
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmarkPress = (bookmark: Bookmark) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(
            `/reading?surah=${bookmark.surah_number}&ayah=${bookmark.ayah_number}`
        );
    };

    const handleDeleteBookmark = async (bookmarkId: number) => {
        Alert.alert(
            'Hapus Bookmark',
            'Apakah Anda yakin ingin menghapus bookmark ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await db.runAsync('DELETE FROM bookmarks WHERE id = ?', [bookmarkId]);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            loadBookmarks();
                        } catch (error) {
                            console.error('Error deleting bookmark:', error);
                        }
                    },
                },
            ]
        );
    };

    const renderBookmarkCard = ({ item, index }: { item: Bookmark; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 30).duration(300)}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleBookmarkPress(item)}
                onLongPress={() => handleDeleteBookmark(item.id)}
            >
                <Card variant="elevated" size="medium">
                    <View style={styles.bookmarkContent}>
                        {/* Surah Info */}
                        <View style={styles.surahInfo}>
                            <Text
                                style={[
                                    styles.surahName,
                                    {
                                        color: theme.colors.text.primary,
                                        fontFamily: theme.fontFamily.satoshi.bold,
                                    },
                                ]}
                            >
                                {item.surah_name}
                            </Text>
                            <Text
                                style={[
                                    styles.ayahNumber,
                                    {
                                        color: theme.colors.text.secondary,
                                        fontFamily: theme.fontFamily.satoshi.regular,
                                    },
                                ]}
                            >
                                Ayat {item.ayah_number}
                            </Text>
                        </View>

                        {/* Verse Preview */}
                        <Text
                            style={[
                                styles.versePreview,
                                {
                                    color: theme.colors.text.secondary,
                                    fontFamily: theme.fontFamily.instrumentSerif.regular,
                                },
                            ]}
                            numberOfLines={2}
                        >
                            {item.verse_text}
                        </Text>

                        {/* Bookmark Date */}
                        <Text
                            style={[
                                styles.bookmarkDate,
                                {
                                    color: theme.colors.text.tertiary,
                                    fontFamily: theme.fontFamily.satoshi.regular,
                                },
                            ]}
                        >
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                </Card>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon, { color: theme.colors.text.tertiary }]}>
                📖
            </Text>
            <Text
                style={[
                    styles.emptyTitle,
                    {
                        color: theme.colors.text.primary,
                        fontFamily: theme.fontFamily.satoshi.bold,
                    },
                ]}
            >
                Belum Ada Bookmark
            </Text>
            <Text
                style={[
                    styles.emptyText,
                    {
                        color: theme.colors.text.secondary,
                        fontFamily: theme.fontFamily.satoshi.regular,
                    },
                ]}
            >
                Tandai ayat favorit Anda saat membaca Al-Qur'an
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: theme.colors.text.primary,
                            fontFamily: theme.fontFamily.satoshi.bold,
                        },
                    ]}
                >
                    Bookmark Saya
                </Text>
                <Text
                    style={[
                        styles.headerSubtitle,
                        {
                            color: theme.colors.text.secondary,
                            fontFamily: theme.fontFamily.satoshi.regular,
                        },
                    ]}
                >
                    {bookmarks.length} ayat tersimpan
                </Text>
            </View>

            {/* Bookmark List */}
            <FlatList
                data={bookmarks}
                renderItem={renderBookmarkCard}
                keyExtractor={(item) => `bookmark-${item.id}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 32,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
    },
    listContent: {
        padding: 24,
        paddingTop: 0,
    },
    cardContainer: {
        marginBottom: 12,
    },
    bookmarkContent: {
        gap: 12,
    },
    surahInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    surahName: {
        fontSize: 18,
    },
    ayahNumber: {
        fontSize: 14,
    },
    versePreview: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'right',
    },
    bookmarkDate: {
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
    },
});
