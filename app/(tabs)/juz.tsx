/**
 * LifeQuran Juz List Screen
 * 
 * Browse Al-Qur'an by Juz (30 parts)
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card } from '../../src/components';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type JuzInfo = {
    number: number;
    startSurah: string;
    startAyah: number;
    endSurah: string;
    endAyah: number;
    pages: string;
};

const JUZ_DATA: JuzInfo[] = [
    { number: 1, startSurah: 'Al-Fatihah', startAyah: 1, endSurah: 'Al-Baqarah', endAyah: 141, pages: '1-21' },
    { number: 2, startSurah: 'Al-Baqarah', startAyah: 142, endSurah: 'Al-Baqarah', endAyah: 252, pages: '22-41' },
    { number: 3, startSurah: 'Al-Baqarah', startAyah: 253, endSurah: 'Ali Imran', endAyah: 92, pages: '42-61' },
    { number: 4, startSurah: 'Ali Imran', startAyah: 93, endSurah: 'An-Nisa', endAyah: 23, pages: '62-81' },
    { number: 5, startSurah: 'An-Nisa', startAyah: 24, endSurah: 'An-Nisa', endAyah: 147, pages: '82-101' },
    { number: 6, startSurah: 'An-Nisa', startAyah: 148, endSurah: 'Al-Maidah', endAyah: 81, pages: '102-121' },
    { number: 7, startSurah: 'Al-Maidah', startAyah: 82, endSurah: 'Al-An\'am', endAyah: 110, pages: '122-141' },
    { number: 8, startSurah: 'Al-An\'am', startAyah: 111, endSurah: 'Al-A\'raf', endAyah: 87, pages: '142-161' },
    { number: 9, startSurah: 'Al-A\'raf', startAyah: 88, endSurah: 'Al-Anfal', endAyah: 40, pages: '162-181' },
    { number: 10, startSurah: 'Al-Anfal', startAyah: 41, endSurah: 'At-Taubah', endAyah: 92, pages: '182-201' },
    { number: 11, startSurah: 'At-Taubah', startAyah: 93, endSurah: 'Hud', endAyah: 5, pages: '202-221' },
    { number: 12, startSurah: 'Hud', startAyah: 6, endSurah: 'Yusuf', endAyah: 52, pages: '222-241' },
    { number: 13, startSurah: 'Yusuf', startAyah: 53, endSurah: 'Ibrahim', endAyah: 52, pages: '242-261' },
    { number: 14, startSurah: 'Al-Hijr', startAyah: 1, endSurah: 'An-Nahl', endAyah: 128, pages: '262-281' },
    { number: 15, startSurah: 'Al-Isra', startAyah: 1, endSurah: 'Al-Kahf', endAyah: 74, pages: '282-301' },
    { number: 16, startSurah: 'Al-Kahf', startAyah: 75, endSurah: 'Taha', endAyah: 135, pages: '302-321' },
    { number: 17, startSurah: 'Al-Anbiya', startAyah: 1, endSurah: 'Al-Hajj', endAyah: 78, pages: '322-341' },
    { number: 18, startSurah: 'Al-Mu\'minun', startAyah: 1, endSurah: 'Al-Furqan', endAyah: 20, pages: '342-361' },
    { number: 19, startSurah: 'Al-Furqan', startAyah: 21, endSurah: 'An-Naml', endAyah: 55, pages: '362-381' },
    { number: 20, startSurah: 'An-Naml', startAyah: 56, endSurah: 'Al-Ankabut', endAyah: 45, pages: '382-401' },
    { number: 21, startSurah: 'Al-Ankabut', startAyah: 46, endSurah: 'Al-Ahzab', endAyah: 30, pages: '402-421' },
    { number: 22, startSurah: 'Al-Ahzab', startAyah: 31, endSurah: 'Ya-Sin', endAyah: 27, pages: '422-441' },
    { number: 23, startSurah: 'Ya-Sin', startAyah: 28, endSurah: 'Az-Zumar', endAyah: 31, pages: '442-461' },
    { number: 24, startSurah: 'Az-Zumar', startAyah: 32, endSurah: 'Fussilat', endAyah: 46, pages: '462-481' },
    { number: 25, startSurah: 'Fussilat', startAyah: 47, endSurah: 'Al-Jathiyah', endAyah: 37, pages: '482-501' },
    { number: 26, startSurah: 'Al-Ahqaf', startAyah: 1, endSurah: 'Adh-Dhariyat', endAyah: 30, pages: '502-521' },
    { number: 27, startSurah: 'Adh-Dhariyat', startAyah: 31, endSurah: 'Al-Hadid', endAyah: 29, pages: '522-541' },
    { number: 28, startSurah: 'Al-Mujadila', startAyah: 1, endSurah: 'At-Tahrim', endAyah: 12, pages: '542-561' },
    { number: 29, startSurah: 'Al-Mulk', startAyah: 1, endSurah: 'Al-Mursalat', endAyah: 50, pages: '562-581' },
    { number: 30, startSurah: 'An-Naba', startAyah: 1, endSurah: 'An-Nas', endAyah: 6, pages: '582-604' },
];

export default function JuzListScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const handleJuzPress = (juz: JuzInfo) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Navigate to reading screen with juz parameter
        router.push(`/reading?juz=${juz.number}`);
    };

    const renderJuzCard = ({ item, index }: { item: JuzInfo; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 30).duration(300)}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleJuzPress(item)}
            >
                <Card variant="elevated" padding="medium">
                    <View style={styles.juzContent}>
                        {/* Juz Number */}
                        <View
                            style={[
                                styles.juzNumber,
                                { backgroundColor: theme.primary.emerald + '15' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.juzNumberText,
                                    {
                                        color: theme.primary.emerald,
                                        fontFamily: theme.fontFamily.satoshi.bold,
                                    },
                                ]}
                            >
                                {item.number}
                            </Text>
                        </View>

                        {/* Juz Info */}
                        <View style={styles.juzInfo}>
                            <Text
                                style={[
                                    styles.juzTitle,
                                    {
                                        color: theme.colors.text.primary,
                                        fontFamily: theme.fontFamily.satoshi.bold,
                                    },
                                ]}
                            >
                                Juz {item.number}
                            </Text>
                            <Text
                                style={[
                                    styles.juzRange,
                                    {
                                        color: theme.colors.text.secondary,
                                        fontFamily: theme.fontFamily.satoshi.regular,
                                    },
                                ]}
                            >
                                {item.startSurah} ({item.startAyah}) - {item.endSurah} ({item.endAyah})
                            </Text>
                            <Text
                                style={[
                                    styles.juzPages,
                                    {
                                        color: theme.colors.text.tertiary,
                                        fontFamily: theme.fontFamily.satoshi.regular,
                                    },
                                ]}
                            >
                                Halaman {item.pages}
                            </Text>
                        </View>

                        {/* Arrow Icon */}
                        <View style={styles.arrowContainer}>
                            <Text style={[styles.arrow, { color: theme.primary.emerald }]}>
                                →
                            </Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        </Animated.View>
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
                    30 Juz Al-Qur'an
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
                    Pilih juz untuk mulai membaca
                </Text>
            </View>

            {/* Juz List */}
            <FlatList
                data={JUZ_DATA}
                renderItem={renderJuzCard}
                keyExtractor={(item) => `juz-${item.number}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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
    juzContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    juzNumber: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    juzNumberText: {
        fontSize: 20,
    },
    juzInfo: {
        flex: 1,
    },
    juzTitle: {
        fontSize: 18,
        marginBottom: 4,
    },
    juzRange: {
        fontSize: 14,
        marginBottom: 2,
    },
    juzPages: {
        fontSize: 12,
    },
    arrowContainer: {
        marginLeft: 12,
    },
    arrow: {
        fontSize: 24,
    },
});
