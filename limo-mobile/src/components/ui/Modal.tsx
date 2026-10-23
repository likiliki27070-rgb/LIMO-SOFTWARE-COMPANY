// ==============================================================================
// LIMO UI — ACCESSIBLE MODAL & BOTTOM SHEET
// ==============================================================================

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Radius, Spacing } from '@/constants/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeightPercent?: number;
}

export function Modal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeightPercent = 88,
}: ModalProps) {
  const { colors, isDark } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[
                styles.sheetContainer,
                {
                  backgroundColor: colors.card,
                  maxHeight: `${maxHeightPercent}%`,
                  borderColor: isDark ? colors.border : '#E2E8F0',
                },
              ]}>
              {/* Top grab bar */}
              <View style={styles.grabBarContainer}>
                <View
                  style={[
                    styles.grabBar,
                    { backgroundColor: isDark ? '#334155' : '#CBD5E1' },
                  ]}
                />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                  {title && (
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                  )}
                  {subtitle && (
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                      {subtitle}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    { backgroundColor: colors.backgroundSubtle },
                  ]}>
                  <Ionicons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}>
                {children}
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 17, 40, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    width: '100%',
  },
  grabBarContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  grabBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: Spacing.sm,
  },
});
