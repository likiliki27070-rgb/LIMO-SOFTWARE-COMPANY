// ==============================================================================
// LIMO PLATFORM — ENTRY GATEWAY SCREEN
// Automatic redirection or hero introduction with authentication options
// ==============================================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LimoLogo } from '@/components/brand/LimoLogo';
import { Button } from '@/components/ui/Button';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function IndexScreen() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Brand Hero */}
      <View style={styles.heroSection}>
        <LimoLogo size="xl" showSubtitle subtitleText="SOFTWARE & TALENT" />

        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
            <Text style={[styles.badgeText, { color: BrandColors.electricBlue }]}>
              NEXT-GEN FREELANCE MARKETPLACE & SOFTWARE AGENCY
            </Text>
          </View>
        </View>

        <Text style={[styles.headline, { color: colors.text }]}>
          Build Better.{'\n'}Work Smarter.{'\n'}
          <Text style={{ color: BrandColors.electricBlue }}>Grow Together.</Text>
        </Text>

        <Text style={[styles.subheadline, { color: colors.textSecondary }]}>
          Connecting visionary clients with top 1% vetted software engineers, designers, and AI specialists — backed by LIMO’s direct agency development teams.
        </Text>
      </View>

      {/* Feature Highlights Grid */}
      <View style={styles.featuresGrid}>
        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <Ionicons name="shield-checkmark" size={24} color={BrandColors.emerald} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>
            Escrow Protected
          </Text>
          <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
            Funds held securely in milestone escrow and released only upon your explicit approval.
          </Text>
        </View>

        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <Ionicons name="code-slash" size={24} color={BrandColors.electricBlue} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>
            Dual Business Model
          </Text>
          <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
            Hire individual vetted freelancers or engage the dedicated LIMO engineering squad directly.
          </Text>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaSection}>
        <Button
          title="Sign in with Mobile Phone OTP"
          variant="primary"
          size="lg"
          onPress={() => router.push('/auth/login')}
          leftIcon={<Ionicons name="phone-portrait-outline" size={18} color="#FFFFFF" />}
          fullWidth
          style={{ marginBottom: Spacing.sm }}
        />

        <Button
          title="Enter Dashboard Directly"
          variant="secondary"
          size="md"
          onPress={() => router.push('/(tabs)')}
          rightIcon={<Ionicons name="arrow-forward" size={16} color={colors.text} />}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
  },
  badgeContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -1,
    marginBottom: Spacing.md,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 380,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.xl,
  },
  featureCard: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  ctaSection: {
    width: '100%',
    paddingTop: Spacing.md,
  },
});
