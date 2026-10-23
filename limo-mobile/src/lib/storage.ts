// ==============================================================================
// LIMO PLATFORM — PERSISTENCE ABSTRACTION
// Safe cross-platform storage with fallback for in-memory and web
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  SESSION_USER: '@limo:session_user',
  SESSION_TOKEN: '@limo:session_token',
  THEME_PREFERENCE: '@limo:theme_pref',
  PROJECTS_STORE: '@limo:projects_store',
  PROPOSALS_STORE: '@limo:proposals_store',
  MILESTONES_STORE: '@limo:milestones_store',
  DELIVERABLES_STORE: '@limo:deliverables_store',
  CONVERSATIONS_STORE: '@limo:conversations_store',
  MESSAGES_STORE: '@limo:messages_store',
  PAYMENTS_STORE: '@limo:payments_store',
  PAYOUTS_STORE: '@limo:payouts_store',
  AGENCY_QUOTES_STORE: '@limo:agency_quotes_store',
  PROFILES_STORE: '@limo:profiles_store',
  AUDIT_LOGS_STORE: '@limo:audit_logs_store',
};

export const safeStorage = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
    } catch (err) {
      console.warn(`[safeStorage] Error reading ${key}:`, err);
    }
    return defaultValue;
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[safeStorage] Error writing ${key}:`, err);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[safeStorage] Error removing ${key}:`, err);
      return false;
    }
  },

  async clearPlatformState(): Promise<void> {
    try {
      const keys = Object.values(StorageKeys);
      for (const k of keys) {
        await AsyncStorage.removeItem(k);
      }
    } catch (err) {
      console.warn('[safeStorage] Error clearing storage:', err);
    }
  },
};
