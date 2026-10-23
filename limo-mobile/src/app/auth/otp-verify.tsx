// ==============================================================================
// LIMO AUTH — CRYPTOGRAPHIC OTP VERIFICATION SCREEN
// Fully implements Section 4 Security Rules: Expiry, Cooldown, Invalidation, Attempt Limits
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { OTP_CONFIG } from '@/lib/otp-service';

export default function OtpVerifyScreen() {
  const params = useLocalSearchParams<{ role?: string; fullName?: string }>();
  const desiredRole = (params.role as UserRole) || 'client';
  const fullName = params.fullName || 'LIMO Member';

  const { activeOtpPhone, demoOtpCode, verifyOtp, sendOtp } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [expirySeconds, setExpirySeconds] = useState(OTP_CONFIG.EXPIRY_SECONDS);
  const [cooldownSeconds, setCooldownSeconds] = useState(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(OTP_CONFIG.MAX_ATTEMPTS);

  const inputRefs = useRef<Array<any>>([]);

  // Timer: 5-minute expiry countdown
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [expirySeconds]);

  // Timer: 60-second resend cooldown countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleDigitChange = (value: string, index: number) => {
    // Only accept numeric digit
    const cleaned = value.replace(/[^0-9]/g, '');
    const newDigits = [...digits];

    if (cleaned.length > 1) {
      // Pasted code
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      if (pasted.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    newDigits[index] = cleaned;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const code = digits.join('');

  const handleVerify = async () => {
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    if (expirySeconds <= 0) {
      setErrorMessage('This OTP code has expired. Please request a new one.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const result = await verifyOtp(code, desiredRole, fullName);

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(result.error || 'Verification failed.');
        if (result.attemptsLeft !== undefined) {
          setAttemptsLeft(result.attemptsLeft);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification error.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldownSeconds > 0 || !activeOtpPhone) return;

    setIsResending(true);
    setErrorMessage(null);

    try {
      const result = await sendOtp(activeOtpPhone);
      if (result.success) {
        setExpirySeconds(OTP_CONFIG.EXPIRY_SECONDS);
        setCooldownSeconds(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
        setAttemptsLeft(OTP_CONFIG.MAX_ATTEMPTS);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert(
          'Fresh OTP Generated',
          'A brand new 6-digit OTP challenge has been issued. The previous code has been invalidated.'
        );
      } else {
        setErrorMessage(result.error || 'Unable to resend OTP.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Top Bar */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isDark ? 'rgba(0, 82, 255, 0.15)' : '#EFF6FF',
              borderColor: BrandColors.electricBlue,
            },
          ]}>
          <Ionicons name="shield-checkmark" size={32} color={BrandColors.electricBlue} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Enter Verification Code</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We sent a fresh cryptographic 6-digit challenge to:
        </Text>
        <Text style={[styles.phoneNumber, { color: BrandColors.electricBlue }]}>
          {activeOtpPhone || '+1 (555) 000-0000'}
        </Text>
      </View>

      {/* Demo helper badge: Shows the cryptographically generated code for convenience */}
      {demoOtpCode && (
        <View
          style={[
            styles.demoCodeBox,
            {
              backgroundColor: isDark ? 'rgba(0, 210, 255, 0.12)' : '#ECFEFF',
              borderColor: BrandColors.cyan,
            },
          ]}>
          <Ionicons name="key" size={16} color={BrandColors.cyanDark} />
          <Text style={[styles.demoCodeText, { color: colors.text }]}>
            Sandbox Challenge Code:{' '}
            <Text style={{ fontWeight: '800', color: BrandColors.electricBlue }}>
              {demoOtpCode}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              const parts = demoOtpCode.split('');
              setDigits(parts);
            }}
            style={styles.autoFillBtn}>
            <Text style={styles.autoFillText}>Auto-Fill</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 6 Digit Input Boxes */}
      <View style={styles.digitsRow}>
        {digits.map((digit, index) => {
          const isFilled = Boolean(digit);
          return (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(val) => handleDigitChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              style={[
                styles.digitBox,
                {
                  backgroundColor: isDark ? colors.backgroundSubtle : colors.backgroundElement,
                  borderColor: isFilled
                    ? BrandColors.electricBlue
                    : errorMessage
                    ? colors.danger
                    : colors.border,
                  color: colors.text,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Error Message */}
      {errorMessage && (
        <View style={[styles.errorBox, { backgroundColor: colors.dangerSubtle }]}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text>
        </View>
      )}

      {/* Security Status Info */}
      <View style={styles.securityMetaRow}>
        <View style={styles.securityMetaItem}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.securityMetaText, { color: colors.textSecondary }]}>
            Code expires in:{' '}
            <Text
              style={{
                fontWeight: '700',
                color: expirySeconds < 60 ? colors.danger : colors.text,
              }}>
              {formatTime(expirySeconds)}
            </Text>
          </Text>
        </View>

        {attemptsLeft !== null && (
          <View style={styles.securityMetaItem}>
            <Ionicons name="lock-closed-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.securityMetaText, { color: colors.textSecondary }]}>
              {attemptsLeft} attempts left
            </Text>
          </View>
        )}
      </View>

      {/* Verify Button */}
      <Button
        title={isVerifying ? 'Verifying Challenge...' : 'Verify & Continue'}
        variant="primary"
        size="lg"
        isLoading={isVerifying}
        disabled={code.length < 6 || expirySeconds <= 0}
        onPress={handleVerify}
        fullWidth
        style={{ marginTop: Spacing.lg }}
      />

      {/* Resend Cooldown Section */}
      <View style={styles.resendSection}>
        <Text style={[styles.resendPrompt, { color: colors.textSecondary }]}>
          Didn’t receive the code?
        </Text>

        <TouchableOpacity
          disabled={cooldownSeconds > 0 || isResending}
          onPress={handleResend}
          style={styles.resendButton}>
          <Text
            style={[
              styles.resendButtonText,
              {
                color:
                  cooldownSeconds > 0
                    ? colors.textMuted
                    : BrandColors.electricBlue,
              },
            ]}>
            {cooldownSeconds > 0
              ? `Resend available in ${cooldownSeconds}s`
              : 'Resend New OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  demoCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  demoCodeText: {
    fontSize: 13,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  autoFillBtn: {
    backgroundColor: BrandColors.electricBlue,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
  },
  autoFillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  digitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.md,
  },
  digitBox: {
    width: 46,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    fontSize: 24,
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    gap: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  securityMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  securityMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  securityMetaText: {
    fontSize: 12,
  },
  resendSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  resendPrompt: {
    fontSize: 13,
  },
  resendButton: {
    marginTop: 4,
    padding: Spacing.xs,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
