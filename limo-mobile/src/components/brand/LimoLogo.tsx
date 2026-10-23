// ==============================================================================
// LIMO BRAND — DISTINCTIVE GEOMETRIC WORDMARK & SYMBOL
// Section 2: Minimal, professional, premium technology brand
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface LimoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
  variant?: 'full' | 'symbol-only' | 'wordmark-only';
}

export function LimoLogo({
  size = 'md',
  showSubtitle = false,
  subtitleText = 'SOFTWARE & TALENT',
  variant = 'full',
}: LimoLogoProps) {
  const { colors, isDark } = useTheme();

  const scale = {
    sm: 0.75,
    md: 1,
    lg: 1.3,
    xl: 1.7,
  }[size];

  const symbolSize = 36 * scale;
  const fontSize = 24 * scale;
  const subFontSize = 9 * scale;

  return (
    <View style={styles.container}>
      {variant !== 'wordmark-only' && (
        <View
          style={[
            styles.symbolContainer,
            {
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize * 0.28,
              backgroundColor: isDark ? '#0F172A' : '#0A1128',
              borderColor: BrandColors.electricBlue,
              borderWidth: 1.5 * scale,
            },
          ]}>
          {/* Geometric precision prism chevrons */}
          <View style={styles.symbolInner}>
            <View
              style={[
                styles.prismLine,
                {
                  width: symbolSize * 0.46,
                  height: 3.2 * scale,
                  backgroundColor: BrandColors.cyan,
                  transform: [{ rotate: '45deg' }, { translateY: -2 * scale }],
                },
              ]}
            />
            <View
              style={[
                styles.prismLine,
                {
                  width: symbolSize * 0.52,
                  height: 3.2 * scale,
                  backgroundColor: BrandColors.electricBlue,
                  transform: [{ rotate: '-45deg' }, { translateY: 2 * scale }],
                },
              ]}
            />
            <View
              style={[
                styles.coreDot,
                {
                  width: 4 * scale,
                  height: 4 * scale,
                  borderRadius: 2 * scale,
                  backgroundColor: '#FFFFFF',
                },
              ]}
            />
          </View>
        </View>
      )}

      {variant !== 'symbol-only' && (
        <View style={styles.textContainer}>
          <View style={styles.brandRow}>
            <Text
              style={[
                styles.brandTitle,
                {
                  fontSize,
                  color: colors.text,
                  letterSpacing: 2 * scale,
                },
              ]}>
              LI<Text style={{ color: BrandColors.electricBlue }}>MO</Text>
            </Text>
            <View
              style={[
                styles.brandDot,
                {
                  width: 5 * scale,
                  height: 5 * scale,
                  borderRadius: 2.5 * scale,
                  backgroundColor: BrandColors.cyan,
                  marginLeft: 3 * scale,
                  marginBottom: 3 * scale,
                },
              ]}
            />
          </View>

          {showSubtitle && (
            <Text
              style={[
                styles.brandSubtitle,
                {
                  fontSize: subFontSize,
                  color: colors.textSecondary,
                  letterSpacing: 1.5 * scale,
                },
              ]}>
              {subtitleText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  symbolContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: BrandColors.electricBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  symbolInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  prismLine: {
    borderRadius: 2,
    position: 'absolute',
  },
  coreDot: {
    position: 'absolute',
    zIndex: 2,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandTitle: {
    fontWeight: '900',
    fontFamily: 'System',
  },
  brandDot: {
    alignSelf: 'flex-end',
  },
  brandSubtitle: {
    fontWeight: '700',
    marginTop: -2,
  },
});
