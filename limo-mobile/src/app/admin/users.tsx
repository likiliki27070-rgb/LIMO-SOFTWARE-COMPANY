// ==============================================================================
// LIMO ADMIN — USER & VERIFICATION MANAGEMENT
// Section 5.C & 10: Vetted badges, suspension/reinstatement, account integrity
// ==============================================================================

import React, { useState, useMemo } from 'react';
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
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function AdminUsersScreen() {
  const router = useRouter();
  const { allProfiles, toggleUserVerification, toggleUserSuspension } = useData();
  const { colors, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'freelancer'>('all');

  const filteredUsers = useMemo(() => {
    return allProfiles.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [allProfiles, searchQuery, roleFilter]);

  const handleToggleVerification = (userId: string, name: string, current: boolean) => {
    Alert.alert(
      current ? 'Revoke Verification Badge?' : 'Grant Verified Badge?',
      `Are you sure you want to ${current ? 'revoke' : 'grant'} the verified specialist badge for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: current ? 'Revoke' : 'Grant Badge',
          onPress: async () => {
            await toggleUserVerification(userId);
          },
        },
      ]
    );
  };

  const handleToggleSuspension = (userId: string, name: string, current: boolean) => {
    Alert.alert(
      current ? 'Reinstate Account?' : 'Suspend Account?',
      `Are you sure you want to ${current ? 'reinstate' : 'suspend'} access for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: current ? 'Reinstate' : 'Suspend Account',
          style: 'destructive',
          onPress: async () => {
            await toggleUserSuspension(userId);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.headerBar,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>User & Talent Curation</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {allProfiles.length} registered platform accounts
          </Text>
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.filterSection}>
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          containerStyle={{ marginBottom: Spacing.xs }}
        />

        <View style={styles.roleTabsRow}>
          {(['all', 'client', 'freelancer'] as const).map((r) => {
            const isSelected = roleFilter === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => setRoleFilter(r)}
                style={[
                  styles.roleTabPill,
                  {
                    backgroundColor: isSelected
                      ? BrandColors.electricBlue
                      : isDark
                      ? colors.backgroundSubtle
                      : '#F1F5F9',
                    borderColor: isSelected ? BrandColors.electricBlue : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.roleTabText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}>
                  {r.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* User list */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredUsers.map((u) => (
          <Card key={u.id} style={styles.userCard}>
            <View style={styles.userRow}>
              <Avatar url={u.avatar_url} name={u.full_name} size="md" />
              <View style={styles.userInfoCol}>
                <View style={styles.nameRow}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {u.full_name}
                  </Text>
                  {u.is_verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={BrandColors.electricBlue}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                  {u.is_suspended && (
                    <Badge
                      label="SUSPENDED"
                      variant="disputed"
                      size="sm"
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>

                <View style={styles.badgeRow}>
                  <Badge label={u.role} variant={u.role as any} size="sm" />
                  <Text style={[styles.userContact, { color: colors.textMuted }]}>
                    {u.email}
                  </Text>
                </View>

                <Text style={[styles.userHeadline, { color: colors.textSecondary }]}>
                  {u.headline || 'Member'} • {u.location || 'Remote'}
                </Text>
              </View>
            </View>

            {/* Admin actions */}
            <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
              <Button
                title={u.is_verified ? 'Revoke Verified' : 'Verify Specialist'}
                variant={u.is_verified ? 'outline' : 'secondary'}
                size="sm"
                onPress={() => handleToggleVerification(u.id, u.full_name, u.is_verified)}
                leftIcon={
                  <Ionicons
                    name={u.is_verified ? 'close-circle-outline' : 'checkmark-circle-outline'}
                    size={16}
                    color={colors.text}
                  />
                }
                style={{ flex: 1, marginRight: Spacing.sm }}
              />

              <Button
                title={u.is_suspended ? 'Reinstate' : 'Suspend'}
                variant={u.is_suspended ? 'secondary' : 'danger'}
                size="sm"
                onPress={() => handleToggleSuspension(u.id, u.full_name, u.is_suspended)}
                leftIcon={
                  <Ionicons
                    name={u.is_suspended ? 'refresh-outline' : 'ban-outline'}
                    size={16}
                    color="#FFFFFF"
                  />
                }
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  filterSection: {
    padding: Spacing.base,
    paddingBottom: Spacing.xs,
  },
  roleTabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  roleTabPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listContainer: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  userCard: {
    marginBottom: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  userInfoCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginVertical: 3,
  },
  userContact: {
    fontSize: 11,
  },
  userHeadline: {
    fontSize: 12,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
});
