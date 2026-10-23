// ==============================================================================
// LIMO UI — AVATAR COMPONENT WITH ONLINE INDICATOR & FALLBACK INITIALS
// ==============================================================================

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BrandColors, Radius } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface AvatarProps {
  url?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

export function Avatar({
  url,
  name = 'User',
  size = 'md',
  showOnlineStatus = false,
  isOnline = true,
}: AvatarProps) {
  const { colors } = useTheme();
  const [hasError, setHasError] = useState(false);

  const dimension = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72,
  }[size];

  const getInitials = (n: string): string => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const statusIndicatorSize = Math.max(8, dimension * 0.24);

  return (
    <View style={[styles.wrapper, { width: dimension, height: dimension }]}>
      {url && !hasError ? (
        <Image
          source={{ uri: url }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: colors.backgroundSubtle,
            },
          ]}
          onError={() => setHasError(true)}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: BrandColors.electricBlue,
            },
          ]}>
          <Text
            style={[
              styles.initials,
              {
                fontSize: dimension * 0.38,
                color: '#FFFFFF',
              },
            ]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {showOnlineStatus && (
        <View
          style={[
            styles.statusDot,
            {
              width: statusIndicatorSize,
              height: statusIndicatorSize,
              borderRadius: statusIndicatorSize / 2,
              backgroundColor: isOnline ? BrandColors.emerald : '#94A3B8',
              borderColor: colors.card,
              borderWidth: 2,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statusDot: {
    position: 'absolute',
  },
});
