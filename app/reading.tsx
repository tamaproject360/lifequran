/**
 * LifeQuran Main Reading Screen (Zen Mode)
 * 
 * Zero-distraction reading experience with:
 * - Arabic Uthmani script
 * - Indonesian translation
 * - Smooth 60fps scrolling
 * - Screen always on
 * - Bottom nav fade on scroll
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    FadeInDown,
} from 'react-native-reanimated';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';

const { width, height } = Dimensions.get('window');

type Verse = {
    id: number;
    surah_id: number;
    number_in_surah: number;
    text: string;
    translation: string;
};

export default function ReadingScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const db = useSQLiteContext();

    const [verses, setVerses] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(24);
    const [showTranslation, setShowTranslation] = useState(true);

    const scrollY = useSharedValue(0);
    const scrollViewRef = useRef<ScrollView>(null);

    // Load verses based on surah/juz/page
    useEffect(() => {
        loadVerses();
        // Keep screen awake while reading
        activateKeepAwakeAsync();

        return () => {
            deactivateKeepAwake();
        };
    }, [params]);

    const loadVerses = async () => {
        try {
            setLoading(true);
            let query = '';
            let queryParams: any[] = [];

            if (params.surah) {
                // Load by surah
                query = `
          SELECT * FROM ayahs
          WHERE surah_id = ?
          ORDER BY number_in_surah ASC
        `;
                queryParams = [params.surah];
            } else if (params.juz) {
                // Load by juz
                query = `
          SELECT * FROM ayahs
          WHERE juz_number = ?
          ORDER BY surah_id ASC, number_in_surah ASC
        `;
                queryParams = [params.juz];
            }

            const result = await db.getAllAsync<Verse>(query, queryParams);
            setVerses(result);
        } catch (error) {
            console.error('Error loading verses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (event: any) => {
        scrollY.value = event.nativeEvent.contentOffset.y;
    };

    const handleFontSizeIncrease = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFontSize((prev) => Math.min(prev + 2, 36));
    };

    const handleFontSizeDecrease = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFontSize((prev) => Math.max(prev - 2, 16));
    };

    const toggleTranslation = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowTranslation((prev) => !prev);
    };

    // Animated controls opacity (fade out on scroll)
    const controlsAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.1],
            'clamp'
        );

        return {
            opacity: withTiming(opacity, { duration: 200 }),
        };
    });

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.primary.emerald} />
                <Text
                    style={[
                        styles.loadingText,
                        {
                            color: theme.colors.text.secondary,
                            fontFamily: theme.fontFamily.satoshi.medium,
                        },
                    ]}
                >
                    Memuat ayat...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header Controls */}
            <Animated.View
                style={[
                    styles.header,
                    { backgroundColor: theme.colors.background },
                    controlsAnimatedStyle,
                ]}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={[styles.backIcon, { color: theme.primary.emerald }]}>←</Text>
                </TouchableOpacity>

                <View style={styles.headerControls}>
                    <TouchableOpacity onPress={handleFontSizeDecrease} style={styles.controlButton}>
                        <Text style={[styles.controlText, { color: theme.colors.text.primary }]}>
                            A-
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleFontSizeIncrease} style={styles.controlButton}>
                        <Text style={[styles.controlText, { color: theme.colors.text.primary }]}>
                            A+
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleTranslation}
                        style={[
                            styles.controlButton,
                            showTranslation && { backgroundColor: theme.primary.emerald + '20' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.controlText,
                                {
                                    color: showTranslation
                                        ? theme.primary.emerald
                                        : theme.colors.text.primary,
                                },
                            ]}
                        >
                            ID
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Verses ScrollView */}
            <ScrollView
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {verses.map((verse, index) => (
                    <VerseCard
                        key={`verse-${verse.id}`}
                        verse={verse}
                        fontSize={fontSize}
                        showTranslation={showTranslation}
                        index={index}
                    />
                ))}

                {/* Bottom Padding */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

// Verse Card Component
type VerseCardProps = {
    verse: Verse;
    fontSize: number;
    showTranslation: boolean;
    index: number;
};

const VerseCard: React.FC<VerseCardProps> = ({
    verse,
    fontSize,
    showTranslation,
    index,
}) => {
    const { theme } = useTheme();

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).duration(300)}
            style={styles.verseContainer}
        >
            {/* Verse Number Indicator */}
            <View
                style={[
                    styles.verseNumber,
                    { backgroundColor: theme.primary.emerald + '15' },
                ]}
            >
                <Text
                    style={[
                        styles.verseNumberText,
                        {
                            color: theme.primary.emerald,
                            fontFamily: theme.fontFamily.satoshi.bold,
                        },
                    ]}
                >
                    {verse.number_in_surah}
                </Text>
            </View>

            {/* Arabic Text */}
            <Text
                style={[
                    styles.arabicText,
                    {
                        fontSize: fontSize + 4,
                        color: theme.colors.text.primary,
                        fontFamily: theme.fontFamily.instrumentSerif.regular,
                    },
                ]}
            >
                {verse.text}
            </Text>

            {/* Translation */}
            {showTranslation && verse.translation && (
                <Text
                    style={[
                        styles.translationText,
                        {
                            fontSize: fontSize - 4,
                            color: theme.colors.text.secondary,
                            fontFamily: theme.fontFamily.satoshi.regular,
                        },
                    ]}
                >
                    {verse.translation}
                </Text>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        fontSize: 28,
    },
    headerControls: {
        flexDirection: 'row',
        gap: 12,
    },
    controlButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    controlText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 24,
    },
    verseContainer: {
        marginBottom: 32,
    },
    verseNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    verseNumberText: {
        fontSize: 14,
    },
    arabicText: {
        textAlign: 'right',
        lineHeight: 48,
        marginBottom: 16,
    },
    translationText: {
        lineHeight: 24,
        textAlign: 'left',
    },
});
