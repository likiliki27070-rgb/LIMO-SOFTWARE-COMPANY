// ==============================================================================
// LIMO UI — CARD CONTAINER COMPONENT
// ==============================================================================

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Radius, Shadows, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'elevated',
}: CardProps) {
  const { colors, isDark } = useTheme();

  const getStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: colors.border,
    };

    if (variant === 'elevated') {
      return {
        ...base,
        ...(Shadows.card as ViewStyle),
        borderColor: isDark ? colors.border : '#EDF2F7',
      };
    }

    if (variant === 'flat') {
      return {
        ...base,
        backgroundColor: colors.backgroundSubtle,
        borderWidth: 0,
      };
    }

    return base;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        style={[getStyle(), style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getStyle(), style]}>{children}</View>;
}
