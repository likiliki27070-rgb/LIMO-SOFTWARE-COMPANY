// ==============================================================================
// LIMO UI — STATUS & ROLE BADGE
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export type BadgeVariant =
  | 'open'
  | 'proposal_review'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'verified'
  | 'admin'
  | 'client'
  | 'freelancer'
  | 'escrow'
  | 'success'
  | 'warning'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'neutral', style, size = 'md' }: BadgeProps) {
  const { isDark } = useTheme();

  const getColors = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'open':
      case 'client':
        return {
          bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
          text: BrandColors.electricBlue,
          border: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
        };
      case 'in_progress':
        return {
          bg: isDark ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
          text: BrandColors.purple,
          border: isDark ? 'rgba(139, 92, 246, 0.3)' : '#DDD6FE',
        };
      case 'completed':
      case 'success':
        return {
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
          text: BrandColors.emerald,
          border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
        };
      case 'escrow':
      case 'verified':
        return {
          bg: isDark ? 'rgba(0, 210, 255, 0.15)' : '#ECFEFF',
          text: BrandColors.cyanDark,
          border: isDark ? 'rgba(0, 210, 255, 0.3)' : '#A5F3FC',
        };
      case 'proposal_review':
      case 'submitted':
      case 'warning':
        return {
          bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
          text: '#D97706',
          border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
        };
      case 'disputed':
      case 'cancelled':
        return {
          bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
          text: BrandColors.rose,
          border: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
        };
      case 'admin':
        return {
          bg: isDark ? 'rgba(244, 63, 94, 0.15)' : '#FFF1F2',
          text: '#E11D48',
          border: isDark ? 'rgba(244, 63, 94, 0.3)' : '#FECDD3',
        };
      case 'freelancer':
        return {
          bg: isDark ? 'rgba(14, 165, 233, 0.15)' : '#F0F9FF',
          text: '#0284C7',
          border: isDark ? 'rgba(14, 165, 233, 0.3)' : '#BAE6FD',
        };
      case 'neutral':
      default:
        return {
          bg: isDark ? '#1E293B' : '#F1F5F9',
          text: isDark ? '#94A3B8' : '#475569',
          border: isDark ? '#334155' : '#E2E8F0',
        };
    }
  };

  const scheme = getColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? Spacing.sm : Spacing.md,
        },
        style,
      ]}>
      <Text
        style={[
          styles.label,
          {
            color: scheme.text,
            fontSize: size === 'sm' ? 10 : 12,
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
