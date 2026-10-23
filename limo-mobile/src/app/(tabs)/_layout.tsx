// ==============================================================================
// LIMO NAVIGATION — ROLE-AWARE BOTTOM TABS LAYOUT
// ==============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { BrandColors } from '@/constants/theme';

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const { role } = useAuth();
  const { conversations } = useData();

  // Compute total unread messages count
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: BrandColors.electricBlue,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size - 2}
              color={color as any}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={size - 2}
              color={color as any}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="freelancers"
        options={{
          title: 'Talent',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={size - 2}
              color={color as any}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="agency"
        options={{
          title: 'Agency',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'rocket' : 'rocket-outline'}
              size={size - 2}
              color={color as any}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          tabBarBadgeStyle: {
            backgroundColor: BrandColors.electricBlue,
            color: '#FFFFFF',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size - 2}
              color={color as any}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={size - 2}
              color={color as any}
            />
          ),
        }}
      />
    </Tabs>
  );
}
