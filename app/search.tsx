/**
 * LifeQuran Search Results Screen
 * 
 * Display search results with highlighting
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
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { Card } from '../src/components';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';

type SearchResult = {
    id: number;
    surah_number: number;
    surah_name: string;
    ayah_number: number;
    verse_text: string;
    translation: string;
};

export default function SearchResultsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const db = useSQLiteContext();

    const [searchQuery, setSearchQuery] = useState(params.q as string || '');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            performSearch(searchQuery);
        } else {
            setResults([]);
        }
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        try {
            setLoading(true);
            const searchTerm = `%${query}%`;

            const result = await db.getAllAsync<SearchResult>(`
        SELECT 
          v.id,
          v.surah_number,
          v.ayah_number,
          v.text as verse_text,
          s.name as surah_name,
          t.text as translation
        FROM verses v
        JOIN surahs s ON v.surah_number = s.number
        LEFT JOIN translations t ON v.surah_number = t.surah_number 
          AND v.ayah_number = t.ayah_number
        WHERE v.text LIKE ? OR t.text LIKE ?
        ORDER BY v.surah_number ASC, v.ayah_number ASC
        LIMIT 50
      `, [searchTerm, searchTerm]);

            setResults(result);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResultPress = (result: SearchResult) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(
            `/reading?surah=${result.surah_number}&ayah=${result.ayah_number}`
        );
    };

    const highlightText = (text: string, query: string) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) => {
            if (part.toLowerCase() === query.toLowerCase()) {
                return (
                    <Text
                        key={index}
                        style={[styles.highlight, { backgroundColor: theme.primary.emerald + '30' }]}
                    >
                        {part}
                    </Text>
                );
            }
            return part;
        });
    };

    const renderResultCard = ({ item, index }: { item: SearchResult; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 30).duration(300)}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleResultPress(item)}
            >
                <Card variant="elevated" size="medium">
                    <View style={styles.resultContent}>
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

                        {/* Arabic Text */}
                        <Text
                            style={[
                                styles.arabicText,
                                {
                                    color: theme.colors.text.primary,
                                    fontFamily: theme.fontFamily.instrumentSerif.regular,
                                },
                            ]}
                            numberOfLines={3}
                        >
                            {item.verse_text}
                        </Text>

                        {/* Translation with Highlight */}
                        {item.translation && (
                            <Text
                                style={[
                                    styles.translationText,
                                    {
                                        color: theme.colors.text.secondary,
                                        fontFamily: theme.fontFamily.satoshi.regular,
                                    },
                                ]}
                                numberOfLines={3}
                            >
                                {highlightText(item.translation, searchQuery)}
                            </Text>
                        )}
                    </View>
                </Card>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderEmptyState = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={theme.primary.emerald} />
                    <Text
                        style={[
                            styles.emptyText,
                            {
                                color: theme.colors.text.secondary,
                                fontFamily: theme.fontFamily.satoshi.regular,
                            },
                        ]}
                    >
                        Mencari...
                    </Text>
                </View>
            );
        }

        if (searchQuery.length < 3) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyIcon, { color: theme.colors.text.tertiary }]}>
                        🔍
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
                        Cari Ayat Al-Qur'an
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
                        Masukkan minimal 3 karakter untuk mencari
                    </Text>
                </View>
            );
        }

        return (
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
                    Tidak Ada Hasil
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
                    Coba kata kunci lain
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Search Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={[styles.backIcon, { color: theme.primary.emerald }]}>←</Text>
                </TouchableOpacity>

                <TextInput
                    style={[
                        styles.searchInput,
                        {
                            backgroundColor: theme.colors.surface,
                            color: theme.colors.text.primary,
                            fontFamily: theme.fontFamily.satoshi.regular,
                        },
                    ]}
                    placeholder="Cari ayat..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                />
            </View>

            {/* Results Count */}
            {results.length > 0 && (
                <View style={styles.resultsCount}>
                    <Text
                        style={[
                            styles.resultsCountText,
                            {
                                color: theme.colors.text.secondary,
                                fontFamily: theme.fontFamily.satoshi.regular,
                            },
                        ]}
                    >
                        {results.length} hasil ditemukan
                    </Text>
                </View>
            )}

            {/* Results List */}
            <FlatList
                data={results}
                renderItem={renderResultCard}
                keyExtractor={(item) => `result-${item.id}`}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 16,
        gap: 12,
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        fontSize: 28,
    },
    searchInput: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    resultsCount: {
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    resultsCountText: {
        fontSize: 14,
    },
    listContent: {
        padding: 24,
        paddingTop: 0,
    },
    cardContainer: {
        marginBottom: 12,
    },
    resultContent: {
        gap: 12,
    },
    surahInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    surahName: {
        fontSize: 16,
    },
    ayahNumber: {
        fontSize: 14,
    },
    arabicText: {
        fontSize: 18,
        lineHeight: 32,
        textAlign: 'right',
    },
    translationText: {
        fontSize: 14,
        lineHeight: 22,
    },
    highlight: {
        fontWeight: 'bold',
        borderRadius: 2,
        paddingHorizontal: 2,
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
        marginTop: 8,
    },
});
