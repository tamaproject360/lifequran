/**
 * LifeQuran Organic Wavy Shape Component
 * 
 * Divine Nature Architecture - Organic topography shapes
 * 
 * Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type WavyShapeProps = {
    width?: number;
    height?: number;
    variant?: 'top' | 'bottom' | 'floating';
    opacity?: number;
};

export const WavyShape: React.FC<WavyShapeProps> = ({
    width = 400,
    height = 200,
    variant = 'top',
    opacity = 0.15,
}) => {
    const { theme } = useTheme();
    const animationProgress = useSharedValue(0);

    useEffect(() => {
        // 8s pulse animation as per design system
        animationProgress.value = withRepeat(
            withTiming(1, {
                duration: 8000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedProps = useAnimatedProps(() => {
        const scale = 1 + animationProgress.value * 0.05; // Subtle 5% scale
        const translateY = animationProgress.value * 10; // 10px vertical movement

        // Generate organic wave path with animation
        const baseY = variant === 'top' ? 0 : height - 100;
        const waveHeight = 40 + animationProgress.value * 10;

        const path = `
      M 0 ${baseY}
      Q ${width * 0.25} ${baseY - waveHeight}, ${width * 0.5} ${baseY}
      T ${width} ${baseY}
      L ${width} ${height}
      L 0 ${height}
      Z
    `;

        return {
            d: path,
        };
    });

    return (
        <View style={[styles.container, { width, height, opacity }]}>
            <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <Defs>
                    <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={theme.primary.emerald} stopOpacity="0.3" />
                        <Stop offset="100%" stopColor={theme.primary.emerald} stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>
                <AnimatedPath
                    animatedProps={animatedProps}
                    fill="url(#waveGradient)"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
});
