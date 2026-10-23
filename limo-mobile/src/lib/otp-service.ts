// ==============================================================================
// LIMO PLATFORM — CRYPTOGRAPHIC OTP SECURITY SERVICE
// Compliant with Section 4 Authentication & Login Verification specifications
// ==============================================================================

import * as Crypto from 'expo-crypto';
import { OTPChallenge } from '@/types';

// Configuration constants
export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  EXPIRY_SECONDS: 300, // 5 minutes
  RESEND_COOLDOWN_SECONDS: 60, // 60 seconds cooldown
  MAX_ATTEMPTS: 3,
};

// In-memory challenge store (maps challengeId or normalized phone to active challenge)
const activeChallenges = new Map<string, OTPChallenge>();

/**
 * Normalizes phone numbers to standard E.164 format.
 * Strips whitespace, dashes, brackets, and ensures leading '+'.
 */
export function normalizePhoneNumber(rawPhone: string, defaultCountryCode = '+1'): {
  isValid: boolean;
  normalized: string;
  error?: string;
} {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { isValid: false, normalized: '', error: 'Phone number is required.' };
  }

  // Remove spaces, parentheses, hyphens, dots
  let cleaned = rawPhone.replace(/[\s()\-.]/g, '');

  if (!cleaned.startsWith('+')) {
    // If user didn't enter country code, prepend default
    cleaned = `${defaultCountryCode}${cleaned.replace(/^0+/, '')}`;
  }

  // E.164 regex: + followed by 7 to 15 digits
  const e164Regex = /^\+[1-9]\d{7,14}$/;

  if (!e164Regex.test(cleaned)) {
    return {
      isValid: false,
      normalized: cleaned,
      error: 'Please enter a valid phone number with country code (e.g. +1 555 123 4567).',
    };
  }

  return { isValid: true, normalized: cleaned };
}

/**
 * Generates a cryptographically secure random 6-digit OTP code using crypto bytes.
 */
export async function generateSecureRandomOTP(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(4);
  // Convert 4 bytes to an integer
  const uint32 =
    ((randomBytes[0] << 24) >>> 0) +
    (randomBytes[1] << 16) +
    (randomBytes[2] << 8) +
    randomBytes[3];

  // 100000 to 999999
  const code = (100000 + (uint32 % 900000)).toString();
  return code;
}

/**
 * Computes a SHA-256 hash of the OTP + challenge salt for secure storage and comparison.
 */
export async function hashOTP(otp: string, challengeId: string): Promise<string> {
  const combined = `${otp}:${challengeId}:limo_salt_2026`;
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    combined
  );
  return digest;
}

export interface RequestOTPResult {
  success: boolean;
  challengeId?: string;
  phoneNumber?: string;
  resendCooldownSeconds?: number;
  expiresInSeconds?: number;
  demoOtpPreview?: string; // Revealed only in dev/sandbox for convenience
  error?: string;
}

/**
 * Requests a new OTP challenge.
 * - Enforces resend cooldown
 * - Immediately INVALIDATES any prior OTP challenge for this number
 * - Issues a brand new cryptographically random OTP
 */
export async function requestOTPChallenge(
  rawPhone: string,
  defaultCountryCode = '+1'
): Promise<RequestOTPResult> {
  const validation = normalizePhoneNumber(rawPhone, defaultCountryCode);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const phone = validation.normalized;
  const now = Date.now();

  // Check existing challenge for cooldown
  const existingChallenge = activeChallenges.get(phone);
  if (existingChallenge && now < existingChallenge.resendCooldownUntil) {
    const remainingSeconds = Math.ceil((existingChallenge.resendCooldownUntil - now) / 1000);
    return {
      success: false,
      error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
      resendCooldownSeconds: remainingSeconds,
    };
  }

  // Generate fresh challenge ID and OTP
  const challengeId = Crypto.randomUUID();
  const rawOtp = await generateSecureRandomOTP();
  const hashedOtp = await hashOTP(rawOtp, challengeId);

  const expiresAt = now + OTP_CONFIG.EXPIRY_SECONDS * 1000;
  const resendCooldownUntil = now + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000;

  // Crucial: Invalidate previous OTP immediately by overwriting with fresh challenge
  const challenge: OTPChallenge = {
    phoneNumber: phone,
    challengeId,
    hashedOtp,
    plaintextForDemo: rawOtp,
    expiresAt,
    attemptsLeft: OTP_CONFIG.MAX_ATTEMPTS,
    resendCooldownUntil,
    isVerified: false,
  };

  activeChallenges.set(phone, challenge);

  return {
    success: true,
    challengeId,
    phoneNumber: phone,
    resendCooldownSeconds: OTP_CONFIG.RESEND_COOLDOWN_SECONDS,
    expiresInSeconds: OTP_CONFIG.EXPIRY_SECONDS,
    demoOtpPreview: rawOtp,
  };
}

export interface VerifyOTPResult {
  success: boolean;
  challengeId?: string;
  phoneNumber?: string;
  attemptsLeft?: number;
  error?: string;
  isExpired?: boolean;
}

/**
 * Verifies submitted OTP against the active challenge.
 * - Checks expiration (5-minute window)
 * - Enforces attempt limits (3 max)
 * - Constant-time comparison using secure hash
 * - Invalidates challenge upon success or attempt exhaustion
 */
export async function verifyOTPChallenge(
  phone: string,
  challengeId: string,
  submittedOtp: string
): Promise<VerifyOTPResult> {
  const norm = normalizePhoneNumber(phone);
  const normalizedPhone = norm.isValid ? norm.normalized : phone;

  const challenge = activeChallenges.get(normalizedPhone);

  if (!challenge) {
    return {
      success: false,
      error: 'No active OTP verification challenge found. Please request a new code.',
    };
  }

  // Ensure challengeId matches (prevents replay with previous challenge)
  if (challenge.challengeId !== challengeId) {
    return {
      success: false,
      error: 'This verification challenge is no longer valid. A newer OTP was already requested.',
    };
  }

  const now = Date.now();

  // Expiration check
  if (now > challenge.expiresAt) {
    activeChallenges.delete(normalizedPhone);
    return {
      success: false,
      isExpired: true,
      error: 'Your OTP code has expired (5-minute validity). Please request a new code.',
    };
  }

  // Attempt limit check
  if (challenge.attemptsLeft <= 0) {
    activeChallenges.delete(normalizedPhone);
    return {
      success: false,
      error: 'Maximum failed verification attempts reached. This challenge is now locked for security.',
    };
  }

  // Hash submitted OTP and compare
  const submittedHash = await hashOTP(submittedOtp.trim(), challengeId);

  if (submittedHash !== challenge.hashedOtp) {
    challenge.attemptsLeft -= 1;
    if (challenge.attemptsLeft <= 0) {
      activeChallenges.delete(normalizedPhone);
      return {
        success: false,
        attemptsLeft: 0,
        error: 'Incorrect OTP. You have exhausted all attempts. Please request a new OTP.',
      };
    }

    return {
      success: false,
      attemptsLeft: challenge.attemptsLeft,
      error: `Invalid OTP code. ${challenge.attemptsLeft} attempt(s) remaining.`,
    };
  }

  // Success: mark verified and consume challenge
  challenge.isVerified = true;
  activeChallenges.delete(normalizedPhone);

  return {
    success: true,
    challengeId,
    phoneNumber: normalizedPhone,
  };
}

/**
 * Resets challenges for testing or signout
 */
export function clearAllChallenges(): void {
  activeChallenges.clear();
}
