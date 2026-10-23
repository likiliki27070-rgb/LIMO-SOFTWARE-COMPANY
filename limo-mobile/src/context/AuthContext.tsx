// ==============================================================================
// LIMO PLATFORM — AUTHENTICATION & ROLE MANAGEMENT CONTEXT
// Enforces Section 4 (Phone OTP + Google) & Section 5 (Role-based access)
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, UserRole, OTPChallenge } from '@/types';
import { SEED_PROFILES } from '@/lib/seed-data';
import { safeStorage, StorageKeys } from '@/lib/storage';
import {
  requestOTPChallenge,
  verifyOTPChallenge,
  RequestOTPResult,
  VerifyOTPResult,
} from '@/lib/otp-service';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeOtpPhone: string | null;
  activeChallengeId: string | null;
  demoOtpCode: string | null;
  // Auth actions
  sendOtp: (phoneNumber: string) => Promise<RequestOTPResult>;
  verifyOtp: (
    code: string,
    initialRole?: UserRole,
    initialName?: string
  ) => Promise<VerifyOTPResult>;
  loginWithGoogle: (desiredRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  switchPersona: (profileId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOtpPhone, setActiveOtpPhone] = useState<string | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);

  // Load persisted session on boot, default to Sarah Jenkins (Client) if first launch
  useEffect(() => {
    async function loadSession() {
      try {
        const savedUser = await safeStorage.getItem<Profile | null>(
          StorageKeys.SESSION_USER,
          null
        );

        if (savedUser) {
          setUser(savedUser);
        } else {
          // Default to Sarah Jenkins (Client demo) for seamless first-glance testing
          const defaultDemoUser = SEED_PROFILES.find((p) => p.email === 'sarah.jenkins@apextech.io') || SEED_PROFILES[1];
          setUser(defaultDemoUser);
          await safeStorage.setItem(StorageKeys.SESSION_USER, defaultDemoUser);
        }
      } catch (err) {
        console.warn('[AuthContext] Session load error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  /**
   * Request OTP for a phone number
   */
  const sendOtp = async (phoneNumber: string): Promise<RequestOTPResult> => {
    const result = await requestOTPChallenge(phoneNumber);
    if (result.success && result.challengeId && result.phoneNumber) {
      setActiveOtpPhone(result.phoneNumber);
      setActiveChallengeId(result.challengeId);
      setDemoOtpCode(result.demoOtpPreview || null);
    }
    return result;
  };

  /**
   * Verify submitted OTP code
   */
  const verifyOtp = async (
    code: string,
    initialRole: UserRole = 'client',
    initialName = 'LIMO Member'
  ): Promise<VerifyOTPResult> => {
    if (!activeOtpPhone || !activeChallengeId) {
      return {
        success: false,
        error: 'No active OTP challenge found. Please request a new code.',
      };
    }

    const result = await verifyOTPChallenge(activeOtpPhone, activeChallengeId, code);

    if (result.success && result.phoneNumber) {
      // Check if existing profile matches phone
      let matchedProfile = SEED_PROFILES.find((p) => p.phone === result.phoneNumber);

      if (!matchedProfile) {
        // Create new verified profile
        matchedProfile = {
          id: `u-${Date.now()}`,
          email: `${result.phoneNumber.replace('+', '')}@limo.user`,
          phone: result.phoneNumber,
          full_name: initialName,
          headline: initialRole === 'client' ? 'Client on LIMO' : 'Freelance Developer',
          bio: 'Verified member of the LIMO talent and software development ecosystem.',
          hourly_rate: initialRole === 'freelancer' ? 75.0 : 0,
          availability_status: 'available',
          location: 'United States',
          timezone: 'America/New_York',
          is_verified: true,
          is_suspended: false,
          role: initialRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      setUser(matchedProfile);
      await safeStorage.setItem(StorageKeys.SESSION_USER, matchedProfile);

      // Clear challenge state
      setActiveOtpPhone(null);
      setActiveChallengeId(null);
      setDemoOtpCode(null);
    }

    return result;
  };

  /**
   * Google OAuth sign-in flow
   */
  const loginWithGoogle = async (desiredRole: UserRole = 'client') => {
    try {
      // Simulate real OAuth consent completion with verified Google payload
      const googleProfile: Profile = {
        id: `g-${Date.now()}`,
        email: 'user.google@example.com',
        phone: '+15559998877',
        full_name: 'Alexandre Mercer',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        headline: desiredRole === 'client' ? 'Tech Founder & Investor' : 'Senior Systems Specialist',
        bio: 'Authenticated via verified Google Identity token.',
        hourly_rate: desiredRole === 'freelancer' ? 85.0 : 0,
        availability_status: 'available',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        is_verified: true,
        is_suspended: false,
        role: desiredRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(googleProfile);
      await safeStorage.setItem(StorageKeys.SESSION_USER, googleProfile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google authentication failed' };
    }
  };

  /**
   * Quick persona switch for demonstration & testing
   */
  const switchPersona = async (profileId: string) => {
    const target = SEED_PROFILES.find((p) => p.id === profileId);
    if (target) {
      setUser(target);
      await safeStorage.setItem(StorageKeys.SESSION_USER, target);
    }
  };

  /**
   * Update profile information
   */
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    await safeStorage.setItem(StorageKeys.SESSION_USER, updated);
  };

  /**
   * Safe sign out
   */
  const signOut = async () => {
    setUser(null);
    setActiveOtpPhone(null);
    setActiveChallengeId(null);
    setDemoOtpCode(null);
    await safeStorage.removeItem(StorageKeys.SESSION_USER);
  };

  const role: UserRole = user ? user.role : 'client';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        activeOtpPhone,
        activeChallengeId,
        demoOtpCode,
        sendOtp,
        verifyOtp,
        loginWithGoogle,
        switchPersona,
        updateProfile,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
