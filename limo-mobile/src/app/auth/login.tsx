// ==============================================================================
// LIMO AUTH — SIGN IN SCREEN (PHONE OTP & GOOGLE OAUTH)
// Mandatory Option A (Phone + OTP) and Option B (Google OAuth)
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LimoLogo } from '@/components/brand/LimoLogo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { SEED_PROFILES } from '@/lib/seed-data';

export default function LoginScreen() {
  const { sendOtp, loginWithGoogle, switchPersona } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('5551110001'); // Pre-filled with Sarah Jenkins demo for convenience
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const countryCodes = [
    { code: '+1', flag: '🇺🇸', name: 'US / CA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+91', flag: '🇮🇳', name: 'IN' },
    { code: '+49', flag: '🇩🇪', name: 'DE' },
    { code: '+61', flag: '🇦🇺', name: 'AU' },
  ];

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Phone Required', 'Please enter your mobile phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = `${countryCode}${phoneNumber.trim()}`;
      const result = await sendOtp(fullPhone);

      if (result.success) {
        router.push({
          pathname: '/auth/otp-verify',
          params: {
            role: selectedRole,
            fullName: fullName.trim() || 'LIMO Member',
          },
        });
      } else {
        Alert.alert('Unable to Request OTP', result.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Network error requesting verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle(selectedRole);
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Google Sign-In Error', res.error || 'Google authorization failed.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickPersona = async (profileId: string) => {
    await switchPersona(profileId);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <LimoLogo size="md" showSubtitle subtitleText="AUTHENTICATION & IDENTITY" />
        <Text style={[styles.title, { color: colors.text }]}>Sign In to LIMO</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Access verified client dashboards, submit proposals, or manage software contracts.
        </Text>
      </View>

      {/* Role Picker for New Registrations */}
      <View style={styles.rolePickerContainer}>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          Select Your Workspace Role
        </Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedRole('client')}
            style={[
              styles.roleCard,
              {
                backgroundColor:
                  selectedRole === 'client'
                    ? isDark
                      ? 'rgba(0, 82, 255, 0.18)'
                      : '#EFF6FF'
                    : colors.card,
                borderColor:
                  selectedRole === 'client' ? BrandColors.electricBlue : colors.border,
              },
            ]}>
            <Ionicons
              name="briefcase"
              size={20}
              color={selectedRole === 'client' ? BrandColors.electricBlue : colors.textMuted}
            />
            <Text
              style={[
                styles.roleText,
                {
                  color: selectedRole === 'client' ? BrandColors.electricBlue : colors.text,
                },
              ]}>
              Client
            </Text>
            <Text style={[styles.roleSubtext, { color: colors.textSecondary }]}>
              Post projects & hire
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedRole('freelancer')}
            style={[
              styles.roleCard,
              {
                backgroundColor:
                  selectedRole === 'freelancer'
                    ? isDark
                      ? 'rgba(0, 82, 255, 0.18)'
                      : '#EFF6FF'
                    : colors.card,
                borderColor:
                  selectedRole === 'freelancer' ? BrandColors.electricBlue : colors.border,
              },
            ]}>
            <Ionicons
              name="code-working"
              size={20}
              color={selectedRole === 'freelancer' ? BrandColors.electricBlue : colors.textMuted}
            />
            <Text
              style={[
                styles.roleText,
                {
                  color:
                    selectedRole === 'freelancer' ? BrandColors.electricBlue : colors.text,
                },
              ]}>
              Freelancer
            </Text>
            <Text style={[styles.roleSubtext, { color: colors.textSecondary }]}>
              Find work & submit bids
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Option A: Mobile Number + OTP Form */}
      <View style={[styles.authCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.optionHeader}>
          <View style={styles.optionPill}>
            <Text style={styles.optionPillText}>OPTION A</Text>
          </View>
          <Text style={[styles.optionTitle, { color: colors.text }]}>Mobile Number + OTP</Text>
        </View>

        <Input
          label="Full Legal Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. Sarah Jenkins"
        />

        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          Country Code
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.countryRow}>
          {countryCodes.map((c) => {
            const isSelected = countryCode === c.code;
            return (
              <TouchableOpacity
                key={c.code}
                onPress={() => setCountryCode(c.code)}
                style={[
                  styles.countryPill,
                  {
                    backgroundColor: isSelected
                      ? BrandColors.electricBlue
                      : colors.backgroundSubtle,
                    borderColor: isSelected ? BrandColors.electricBlue : colors.border,
                  },
                ]}>
                <Text style={{ fontSize: 13 }}>{c.flag}</Text>
                <Text
                  style={[
                    styles.countryText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}>
                  {c.code} ({c.name})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Input
          label="Mobile Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="555 123 4567"
          leftIcon={<Text style={{ fontWeight: '700', color: colors.text }}>{countryCode}</Text>}
          helperText="A fresh cryptographically secure 6-digit OTP challenge will be issued."
        />

        <Button
          title={isLoading ? 'Generating OTP Challenge...' : 'Request Secure OTP'}
          variant="primary"
          size="lg"
          isLoading={isLoading}
          onPress={handleSendOtp}
          rightIcon={<Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />}
          fullWidth
          style={{ marginTop: Spacing.sm }}
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textMuted }]}>OR AUTHENTICATE WITH</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      {/* Option B: Continue with Google */}
      <Button
        title="Continue with Google"
        variant="outline"
        size="lg"
        isLoading={isGoogleLoading}
        onPress={handleGoogleLogin}
        leftIcon={<Ionicons name="logo-google" size={18} color={BrandColors.electricBlue} />}
        fullWidth
      />

      {/* Quick Test Demo Login Shortcuts */}
      <View style={[styles.demoCard, { backgroundColor: isDark ? colors.backgroundSubtle : '#F8FAFC', borderColor: colors.border }]}>
        <View style={styles.demoHeader}>
          <Ionicons name="flash" size={16} color="#F59E0B" />
          <Text style={[styles.demoTitle, { color: colors.text }]}>1-Tap Demo Evaluation Profiles</Text>
        </View>
        <Text style={[styles.demoSubtitle, { color: colors.textSecondary }]}>
          Pre-populated with rich real-world projects, proposals, escrow records, and milestones:
        </Text>

        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={[styles.demoPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickPersona(SEED_PROFILES[1].id)}>
            <Text style={[styles.demoPillText, { color: BrandColors.electricBlue }]}>
              Client: Sarah Jenkins
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickPersona(SEED_PROFILES[3].id)}>
            <Text style={[styles.demoPillText, { color: '#0284C7' }]}>
              Freelancer: Alex Rivera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickPersona(SEED_PROFILES[0].id)}>
            <Text style={[styles.demoPillText, { color: '#E11D48' }]}>
              Admin: Super Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  rolePickerContainer: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  roleText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  roleSubtext: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  authCard: {
    padding: Spacing.base,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  optionPill: {
    backgroundColor: BrandColors.electricBlue,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
  },
  optionPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  countryRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  countryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  demoCard: {
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.xl,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  demoSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  demoPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
