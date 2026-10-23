// ==============================================================================
// LIMO AUTH — INSTANT PERSONA SWITCHER MODAL
// Essential for pair-programming, QA, and multi-role evaluation
// ==============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SEED_PROFILES } from '@/lib/seed-data';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

interface PersonaSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PersonaSwitcherModal({ visible, onClose }: PersonaSwitcherModalProps) {
  const { user, switchPersona } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleSelect = async (profileId: string) => {
    await switchPersona(profileId);
    onClose();
  };

  const handleOpenCustomAuth = () => {
    onClose();
    router.push('/auth/login');
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Switch Role & Persona"
      subtitle="Select a pre-configured profile to experience different role views">
      <View style={styles.container}>
        {SEED_PROFILES.map((profile) => {
          const isCurrent = user?.id === profile.id;

          return (
            <TouchableOpacity
              key={profile.id}
              activeOpacity={0.75}
              onPress={() => handleSelect(profile.id)}
              style={[
                styles.personaCard,
                {
                  backgroundColor: isCurrent
                    ? isDark
                      ? 'rgba(0, 82, 255, 0.18)'
                      : '#EFF6FF'
                    : isDark
                    ? colors.backgroundSubtle
                    : '#FFFFFF',
                  borderColor: isCurrent ? BrandColors.electricBlue : colors.border,
                },
              ]}>
              <Avatar url={profile.avatar_url} name={profile.full_name} size="md" />

              <View style={styles.infoCol}>
                <View style={styles.row}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {profile.full_name}
                  </Text>
                  <Badge
                    label={profile.role}
                    variant={profile.role as any}
                    size="sm"
                    style={{ marginLeft: 6 }}
                  />
                </View>

                <Text
                  style={[styles.headline, { color: colors.textSecondary }]}
                  numberOfLines={1}>
                  {profile.headline}
                </Text>

                <Text style={[styles.email, { color: colors.textMuted }]}>
                  {profile.email} • {profile.phone}
                </Text>
              </View>

              {isCurrent ? (
                <Ionicons name="checkmark-circle" size={24} color={BrandColors.electricBlue} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Action to test fresh real phone OTP flow */}
        <View style={[styles.divider, { borderTopColor: colors.border }]} />

        <Button
          title="Sign in with Custom Phone OTP / Google"
          variant="outline"
          size="md"
          onPress={handleOpenCustomAuth}
          leftIcon={<Ionicons name="phone-portrait-outline" size={18} color={colors.text} />}
          fullWidth
          style={{ marginTop: Spacing.sm }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
  },
  personaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.sm,
  },
  infoCol: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headline: {
    fontSize: 12,
    marginTop: 2,
  },
  email: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: Spacing.sm,
  },
});
