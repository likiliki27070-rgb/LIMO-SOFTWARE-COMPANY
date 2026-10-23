// ==============================================================================
// LIMO PLATFORM — ROOT APPLICATION LAYOUT
// Providers for Theme, Auth, Data, and Universal Header Controls
// ==============================================================================

import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { LimoLogo } from '@/components/brand/LimoLogo';
import { PersonaSwitcherModal } from '@/components/auth/PersonaSwitcherModal';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { Badge } from '@/components/ui/Badge';

function HeaderBar() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, role } = useAuth();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: colors.card }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.headerContainer, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)')}
          style={styles.logoPressable}>
          <LimoLogo size="sm" showSubtitle subtitleText="SOFTWARE & TALENT" />
        </TouchableOpacity>

        <View style={styles.headerControls}>
          {/* Active Role & Persona Switcher */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSwitcherOpen(true)}
            style={[
              styles.personaButton,
              {
                backgroundColor: isDark ? colors.backgroundSubtle : '#F1F5F9',
                borderColor: colors.border,
              },
            ]}>
            <View style={styles.personaRow}>
              <Badge label={role} variant={role as any} size="sm" />
              <Ionicons
                name="swap-horizontal"
                size={14}
                color={colors.textSecondary}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>

          {/* Theme switcher */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleTheme}
            style={[
              styles.iconButton,
              { backgroundColor: isDark ? colors.backgroundSubtle : '#F1F5F9' },
            ]}>
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={isDark ? '#FBBF24' : BrandColors.electricBlue}
            />
          </TouchableOpacity>
        </View>
      </View>

      <PersonaSwitcherModal
        visible={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
    </SafeAreaView>
  );
}

function NavigationStack() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/otp-verify" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="project/[id]" />
        <Stack.Screen name="project/new" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="admin/users" />
        <Stack.Screen name="admin/disputes" />
        <Stack.Screen name="admin/audit" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <NavigationStack />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
    borderBottomWidth: 1,
  },
  logoPressable: {
    paddingVertical: 2,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  personaButton: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  personaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
