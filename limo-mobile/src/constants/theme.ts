// ==============================================================================
// LIMO BRAND DESIGN SYSTEM & TOKENS
// Minimal, professional, premium technology brand
// ==============================================================================

import { Platform } from 'react-native';

export const BrandColors = {
  // LIMO Primary Signature
  electricBlue: '#0052FF',
  electricBlueHover: '#0041CC',
  electricBlueSubtle: '#EFF6FF',
  
  // High-Tech Cyan Accent
  cyan: '#00D2FF',
  cyanSubtle: '#ECFEFF',
  cyanDark: '#0891B2',
  
  // Deep Navy Typographic Foundation
  navyDeep: '#0A1128',
  navySlate: '#0F172A',
  navyMuted: '#334155',
  
  // Status Accents
  emerald: '#10B981',
  emeraldSubtle: '#ECFDF5',
  amber: '#F59E0B',
  amberSubtle: '#FFFBEB',
  rose: '#EF4444',
  roseSubtle: '#FEF2F2',
  purple: '#8B5CF6',
  purpleSubtle: '#F5F3FF',
};

export const Colors = {
  light: {
    // Surfaces
    background: '#F8FAFC',
    backgroundElement: '#FFFFFF',
    backgroundSubtle: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    card: '#FFFFFF',
    
    // Typography
    text: '#0A1128',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Borders & Dividers
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    
    // Brand & Interactive
    primary: BrandColors.electricBlue,
    primaryHover: BrandColors.electricBlueHover,
    accent: BrandColors.cyan,
    accentSubtle: BrandColors.cyanSubtle,
    primarySubtle: BrandColors.electricBlueSubtle,
    
    // Status
    success: BrandColors.emerald,
    successSubtle: BrandColors.emeraldSubtle,
    warning: BrandColors.amber,
    warningSubtle: BrandColors.amberSubtle,
    danger: BrandColors.rose,
    dangerSubtle: BrandColors.roseSubtle,
    
    // Shadows
    shadowColor: '#0A1128',
  },
  dark: {
    // Surfaces
    background: '#070D18',
    backgroundElement: '#0F172A',
    backgroundSubtle: '#1E293B',
    backgroundSelected: '#334155',
    card: '#0F172A',
    
    // Typography
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0A1128',
    
    // Borders & Dividers
    border: '#1E293B',
    borderStrong: '#334155',
    
    // Brand & Interactive
    primary: '#3B82F6',
    primaryHover: '#60A5FA',
    accent: '#38BDF8',
    accentSubtle: 'rgba(56, 189, 248, 0.12)',
    primarySubtle: 'rgba(59, 130, 246, 0.15)',
    
    // Status
    success: '#34D399',
    successSubtle: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningSubtle: 'rgba(251, 191, 36, 0.15)',
    danger: '#F87171',
    dangerSubtle: 'rgba(248, 113, 113, 0.15)',
    
    // Shadows
    shadowColor: '#000000',
  },
} as const;

export type ThemeType = 'light' | 'dark';
export type ThemeColorName = keyof typeof Colors.light;
export type AppThemeColors = Record<ThemeColorName, string>;

export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  tiny: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    lineHeight: 14,
  },
};

export const Shadows = {
  subtle: Platform.select({
    ios: {
      shadowColor: '#0A1128',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: '#0A1128',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
    },
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#0A1128',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: {
      elevation: 3,
    },
    default: {
      shadowColor: '#0A1128',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: '#0052FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
    android: {
      elevation: 6,
    },
    default: {
      shadowColor: '#0052FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
  }),
};
