// ==============================================================================
// LIMO UI — ACCESSIBLE BUTTON COMPONENT
// ==============================================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Radius, Spacing } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  // Size metrics
  let paddingVertical: number = Spacing.md;
  let paddingHorizontal: number = Spacing.base;
  let borderRadius: number = Radius.md;
  let fontSize = 15;

  if (size === 'sm') {
    paddingVertical = Spacing.xs + 2;
    paddingHorizontal = Spacing.md;
    borderRadius = Radius.sm;
    fontSize = 13;
  } else if (size === 'lg') {
    paddingVertical = Spacing.base;
    paddingHorizontal = Spacing.xl;
    borderRadius = Radius.lg;
    fontSize = 17;
  }

  // Variant styles
  let backgroundColor: string = colors.primary;
  let borderWidth = 0;
  let borderColor: string | undefined = undefined;
  let textColor = '#FFFFFF';

  if (variant === 'secondary') {
    backgroundColor = colors.backgroundSelected;
    textColor = colors.text;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderWidth = 1.5;
    borderColor = colors.borderStrong;
    textColor = colors.text;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
  } else if (variant === 'danger') {
    backgroundColor = colors.danger;
    textColor = '#FFFFFF';
  }

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical,
    paddingHorizontal,
    borderRadius,
    backgroundColor,
    borderWidth,
    borderColor,
    opacity: disabled || isLoading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[containerStyle, style]}>
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" style={styles.spinner} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize,
              },
              textStyle,
            ]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  spinner: {
    marginVertical: 2,
  },
  leftIconWrapper: {
    marginRight: Spacing.sm,
  },
  rightIconWrapper: {
    marginLeft: Spacing.sm,
  },
});
