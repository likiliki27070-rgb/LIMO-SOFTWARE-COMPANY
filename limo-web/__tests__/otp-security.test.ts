import {
  normalizePhoneNumber,
  requestOTPChallenge,
  verifyOTPChallenge,
  OTP_CONFIG,
} from '../src/lib/otp-service';

describe('LIMO Web — Cryptographic OTP Security Suite (Section 6 & 17)', () => {
  const testPhone = '+15559990001';

  it('normalizes international phone formats accurately', () => {
    const valid1 = normalizePhoneNumber('+1 (555) 234-5678');
    expect(valid1.valid).toBe(true);
    expect(valid1.formatted).toBe('+15552345678');

    const valid2 = normalizePhoneNumber('5552345678');
    expect(valid2.valid).toBe(true);
    expect(valid2.formatted).toBe('+15552345678');

    const invalid = normalizePhoneNumber('123');
    expect(invalid.valid).toBe(false);
    expect(invalid.error).toBeDefined();
  });

  it('generates a fresh cryptographically secure OTP challenge', async () => {
    const result = await requestOTPChallenge(testPhone);
    expect(result.success).toBe(true);
    expect(result.challengeId).toBeDefined();
    expect(result.demoOtpPreview).toHaveLength(OTP_CONFIG.CODE_LENGTH);
    expect(result.expiresAt).toBeGreaterThan(Date.now());
  });

  it('verifies the correct OTP code and creates profile', async () => {
    const req = await requestOTPChallenge('+15559990002');
    expect(req.success).toBe(true);
    const code = req.demoOtpPreview!;

    const verification = await verifyOTPChallenge(
      '+15559990002',
      code,
      'client',
      'Test Client'
    );
    expect(verification.success).toBe(true);
    expect(verification.user).toBeDefined();
    expect(verification.user?.role).toBe('client');
  });

  it('immediately invalidates OTP after successful verification (prevents replay)', async () => {
    const req = await requestOTPChallenge('+15559990003');
    const code = req.demoOtpPreview!;

    // First verification succeeds
    const firstAttempt = await verifyOTPChallenge('+15559990003', code);
    expect(firstAttempt.success).toBe(true);

    // Replay attempt fails immediately
    const replayAttempt = await verifyOTPChallenge('+15559990003', code);
    expect(replayAttempt.success).toBe(false);
    expect(replayAttempt.error).toMatch(/no active verification challenge/i);
  });

  it('rejects incorrect OTP and decrements attempts', async () => {
    const req = await requestOTPChallenge('+15559990004');
    expect(req.success).toBe(true);

    const failAttempt = await verifyOTPChallenge('+15559990004', '000000');
    expect(failAttempt.success).toBe(false);
    expect(failAttempt.attemptsLeft).toBe(OTP_CONFIG.MAX_ATTEMPTS - 1);
  });
});
