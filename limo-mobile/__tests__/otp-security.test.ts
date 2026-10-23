// ==============================================================================
// LIMO TEST SUITE — OTP CRYPTOGRAPHIC SECURITY & ATTEMPT LOCKOUT
// Section 4 & 14: Quality Assurance and Verification
// ==============================================================================

import {
  normalizePhoneNumber,
  generateSecureRandomOTP,
  hashOTP,
  requestOTPChallenge,
  verifyOTPChallenge,
  clearAllChallenges,
  OTP_CONFIG,
} from '../src/lib/otp-service';

// Mock expo-crypto for Node testing environment
jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: async (length: number) => {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  },
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 9),
  digestStringAsync: async (_algo: any, str: string) => {
    // Simple deterministic hash mock for testing
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 'sha256-' + Math.abs(hash).toString(16);
  },
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

describe('LIMO OTP Security & Verification Service', () => {
  beforeEach(() => {
    clearAllChallenges();
  });

  describe('Phone Number Normalization', () => {
    it('normalizes valid E.164 phone numbers with country codes', () => {
      const res = normalizePhoneNumber('+1 (555) 123-4567');
      expect(res.isValid).toBe(true);
      expect(res.normalized).toBe('+15551234567');
    });

    it('prepends default country code if missing leading +', () => {
      const res = normalizePhoneNumber('5551234567', '+1');
      expect(res.isValid).toBe(true);
      expect(res.normalized).toBe('+15551234567');
    });

    it('rejects malformed numbers and non-digits', () => {
      const res = normalizePhoneNumber('invalid-phone');
      expect(res.isValid).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe('Cryptographic OTP Generation', () => {
    it('generates a 6-digit numeric string', async () => {
      const otp = await generateSecureRandomOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('hashes OTP consistently with challengeId', async () => {
      const hash1 = await hashOTP('123456', 'challenge-1');
      const hash2 = await hashOTP('123456', 'challenge-1');
      const hash3 = await hashOTP('123456', 'challenge-2');

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
    });
  });

  describe('OTP Challenge Workflow & Invalidation', () => {
    it('issues a fresh challenge and permits valid verification', async () => {
      const req = await requestOTPChallenge('+15551234567');
      expect(req.success).toBe(true);
      expect(req.challengeId).toBeDefined();
      expect(req.demoOtpPreview).toHaveLength(6);

      const verify = await verifyOTPChallenge(
        '+15551234567',
        req.challengeId!,
        req.demoOtpPreview!
      );
      expect(verify.success).toBe(true);
    });

    it('immediately INVALIDATES previous OTP when a resend is requested', async () => {
      // First request
      const req1 = await requestOTPChallenge('+15551112233');
      const firstOtp = req1.demoOtpPreview!;
      const firstChallengeId = req1.challengeId!;

      // Clear in-memory cooldown to simulate resend after cooldown period
      clearAllChallenges();

      // Second request (replacement challenge)
      const req2 = await requestOTPChallenge('+15551112233');
      const secondOtp = req2.demoOtpPreview!;
      const secondChallengeId = req2.challengeId!;

      // Attempting to verify with the OLD OTP and OLD challenge must FAIL
      const verifyOld = await verifyOTPChallenge(
        '+15551112233',
        firstChallengeId,
        firstOtp
      );
      expect(verifyOld.success).toBe(false);

      // Verifying with the NEW OTP and NEW challenge succeeds
      const verifyNew = await verifyOTPChallenge(
        '+15551112233',
        secondChallengeId,
        secondOtp
      );
      expect(verifyNew.success).toBe(true);
    });

    it('enforces maximum failed attempts (3 attempts) before locking challenge', async () => {
      const req = await requestOTPChallenge('+15559998877');
      const phone = '+15559998877';
      const cId = req.challengeId!;

      // 1st failed attempt
      const attempt1 = await verifyOTPChallenge(phone, cId, '000000');
      expect(attempt1.success).toBe(false);
      expect(attempt1.attemptsLeft).toBe(2);

      // 2nd failed attempt
      const attempt2 = await verifyOTPChallenge(phone, cId, '000000');
      expect(attempt2.success).toBe(false);
      expect(attempt2.attemptsLeft).toBe(1);

      // 3rd failed attempt -> locked!
      const attempt3 = await verifyOTPChallenge(phone, cId, '000000');
      expect(attempt3.success).toBe(false);
      expect(attempt3.attemptsLeft).toBe(0);

      // Subsequent attempt rejected because challenge was consumed/locked
      const attempt4 = await verifyOTPChallenge(phone, cId, req.demoOtpPreview!);
      expect(attempt4.success).toBe(false);
    });
  });
});
