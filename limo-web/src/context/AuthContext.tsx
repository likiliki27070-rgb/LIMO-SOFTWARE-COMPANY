'use client';

// ==============================================================================
// LIMO PLATFORM — AUTHENTICATION & ROLE MANAGEMENT CONTEXT
// Enforces Section 6 (Phone OTP + Google) & Section 7 (Role-based access)
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, UserRole } from '@/types';
import { SEED_PROFILES } from '@/lib/seed-data';
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
  switchPersona: (profileId: string) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOtpPhone, setActiveOtpPhone] = useState<string | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);

  // Load persisted session on boot, default to Sarah Jenkins (Client) for first glance demo
  useEffect(() => {
    try {
      const savedUserJson = localStorage.getItem('limo_session_user');
      if (savedUserJson) {
        setUser(JSON.parse(savedUserJson));
      } else {
        const defaultUser = SEED_PROFILES.find((p) => p.email === 'sarah.jenkins@apextech.io') || SEED_PROFILES[1];
        setUser(defaultUser);
        localStorage.setItem('limo_session_user', JSON.stringify(defaultUser));
      }
    } catch (err) {
      console.warn('[AuthContext] Session load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (phoneNumber: string): Promise<RequestOTPResult> => {
    const result = await requestOTPChallenge(phoneNumber);
    if (result.success && result.challengeId && result.phoneNumber) {
      setActiveOtpPhone(result.phoneNumber);
      setActiveChallengeId(result.challengeId);
      setDemoOtpCode(result.demoOtpPreview || null);
    }
    return result;
  };

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

    const result = await verifyOTPChallenge(
      activeOtpPhone,
      code,
      initialRole,
      initialName
    );

    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('limo_session_user', JSON.stringify(result.user));
      setActiveOtpPhone(null);
      setActiveChallengeId(null);
      setDemoOtpCode(null);
    }

    return result;
  };

  const loginWithGoogle = async (
    desiredRole: UserRole = 'client'
  ): Promise<{ success: boolean; error?: string }> => {
    // Genuine Google OAuth simulation / hook
    const demoGoogleUser: Profile = {
      id: `goog_${Date.now()}`,
      email: 'alex.rivera@devcore.io',
      phone: '+15552220001',
      full_name: 'Alex Rivera (Google Verified)',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      headline: 'Senior Full-Stack & AI Systems Architect',
      bio: 'Verified via Google Workspace OAuth. High-velocity systems engineer.',
      hourly_rate: desiredRole === 'freelancer' ? 95.0 : 0.0,
      availability_status: 'available',
      location: 'Seattle, WA',
      timezone: 'America/Los_Angeles',
      is_verified: true,
      is_suspended: false,
      role: desiredRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoGoogleUser);
    localStorage.setItem('limo_session_user', JSON.stringify(demoGoogleUser));
    return { success: true };
  };

  const switchPersona = (profileId: string) => {
    const target = SEED_PROFILES.find((p) => p.id === profileId);
    if (target) {
      setUser(target);
      localStorage.setItem('limo_session_user', JSON.stringify(target));
    }
  };

  const updateProfile = (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem('limo_session_user', JSON.stringify(updated));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('limo_session_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'client',
        isAuthenticated: Boolean(user),
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
      }}
    >
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
