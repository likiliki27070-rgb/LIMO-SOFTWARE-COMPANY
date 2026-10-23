// ==============================================================================
// LIMO ACCOUNT — PROFILE, PORTFOLIO & FINANCIAL SETTINGS
// Section 5 & 10: Profile Editor, Payouts, Transaction Ledger, Theme, Security
// ==============================================================================

import React, { useState } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PersonaSwitcherModal } from '@/components/auth/PersonaSwitcherModal';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { AvailabilityStatus } from '@/types';

export default function ProfileScreen() {
  const { user, role, updateProfile, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { payments, payouts, requestPayout, resetToFactorySeed } = useData();
  const router = useRouter();

  // Modals state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Edit fields
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(user?.hourly_rate?.toString() || '0');
  const [availability, setAvailability] = useState<AvailabilityStatus>(
    user?.availability_status || 'available'
  );

  // Payout fields
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'stripe' | 'paypal' | 'demo_payout'>('bank_transfer');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const handleSaveProfile = async () => {
    await updateProfile({
      headline,
      bio,
      hourly_rate: parseFloat(hourlyRate) || 0,
      availability_status: availability,
    });
    setEditProfileOpen(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payout amount.');
      return;
    }

    setIsSubmittingPayout(true);
    try {
      const record = await requestPayout(user?.id || 'freelancer', amount, payoutMethod);
      setPayoutModalOpen(false);
      Alert.alert(
        'Payout Initiated',
        `Your payout request of $${amount.toFixed(2)} (${payoutMethod}) was submitted with reference ${record.reference_id}.`
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to request payout.');
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      'This will reset all projects, proposals, payments, and messages to the initial factory seed state.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Factory Seed',
          style: 'destructive',
          onPress: async () => {
            await resetToFactorySeed();
            Alert.alert('Reset Complete', 'Database restored to initial development seed state.');
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert('Confirm Sign Out', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  // User's relevant transactions
  const userPayments = payments.filter(
    (p) => role === 'admin' || p.payer_id === user?.id || p.payee_id === user?.id
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Profile Header Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar url={user?.avatar_url} name={user?.full_name} size="xl" showOnlineStatus />
          <View style={styles.profileInfoCol}>
            <View style={styles.nameBadgeRow}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.full_name}
              </Text>
              {user?.is_verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={BrandColors.electricBlue}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>

            <View style={styles.roleRow}>
              <Badge label={role} variant={role as any} size="sm" />
              {role === 'freelancer' && (
                <Text style={[styles.rateText, { color: BrandColors.electricBlue }]}>
                  ${user?.hourly_rate}/hr
                </Text>
              )}
            </View>

            <Text style={[styles.headline, { color: colors.textSecondary }]} numberOfLines={2}>
              {user?.headline || 'LIMO Member'}
            </Text>
          </View>
        </View>

        <Text style={[styles.bioText, { color: colors.textSecondary }]}>
          {user?.bio || 'Verified member on the LIMO software development platform.'}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="call-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{user?.phone}</Text>
          </View>
        </View>

        <Button
          title="Edit Profile Information"
          variant="outline"
          size="sm"
          onPress={() => setEditProfileOpen(true)}
          leftIcon={<Ionicons name="create-outline" size={16} color={colors.text} />}
          fullWidth
          style={{ marginTop: Spacing.md }}
        />
      </Card>

      {/* Freelancer Payout Action */}
      {role === 'freelancer' && (
        <Card style={styles.payoutCard}>
          <View style={styles.payoutHeader}>
            <View>
              <Text style={[styles.payoutTitle, { color: colors.text }]}>
                Available Balance
              </Text>
              <Text style={[styles.payoutSubtitle, { color: colors.textSecondary }]}>
                Cleared funds available for immediate transfer
              </Text>
            </View>
            <Button
              title="Request Payout"
              variant="primary"
              size="sm"
              onPress={() => setPayoutModalOpen(true)}
              leftIcon={<Ionicons name="cash-outline" size={14} color="#FFF" />}
            />
          </View>
        </Card>
      )}

      {/* Transaction & Escrow Ledger */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Escrow & Payment Ledger ({userPayments.length})
        </Text>
      </View>

      {userPayments.map((p) => (
        <Card key={p.id} style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.paymentTitle, { color: colors.text }]}>
                {p.project_title || 'Escrow Milestone'}
              </Text>
              <Text style={[styles.paymentTxRef, { color: colors.textMuted }]}>
                Ref: {p.transaction_reference} • {new Date(p.created_at).toLocaleDateString()}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.paymentAmount, { color: colors.text }]}>
                ${p.amount.toLocaleString()}
              </Text>
              <Badge
                label={p.status.replace('_', ' ')}
                variant={p.status === 'released' ? 'success' : 'escrow'}
                size="sm"
              />
            </View>
          </View>

          <View style={[styles.paymentFeeRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.paymentFeeText, { color: colors.textMuted }]}>
              Platform Fee: ${p.platform_fee.toFixed(2)} (10%)
            </Text>
            <Text style={[styles.paymentNetText, { color: BrandColors.emerald }]}>
              Net: ${p.net_amount.toFixed(2)}
            </Text>
          </View>
        </Card>
      ))}

      {/* System Settings & Testing Tools */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          System & Testing Settings
        </Text>
      </View>

      <Card style={styles.settingsCard}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingIconRow}>
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={20}
              color={BrandColors.electricBlue}
            />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {isDark ? 'Enabled' : 'Disabled'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSwitcherOpen(true)}
          style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingIconRow}>
            <Ionicons name="swap-horizontal" size={20} color={BrandColors.cyanDark} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Switch Role / Persona
            </Text>
          </View>
          <Text style={[styles.settingValue, { color: BrandColors.electricBlue }]}>
            {role.toUpperCase()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetData}
          style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingIconRow}>
            <Ionicons name="refresh" size={20} color="#F59E0B" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Reset Database to Seed State
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignOut} style={styles.settingRow}>
          <View style={styles.settingIconRow}>
            <Ionicons name="log-out-outline" size={20} color={BrandColors.rose} />
            <Text style={[styles.settingLabel, { color: BrandColors.rose }]}>
              Sign Out from Device
            </Text>
          </View>
        </TouchableOpacity>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Profile"
        subtitle="Update your visible information on LIMO">
        <Input
          label="Headline"
          value={headline}
          onChangeText={setHeadline}
          placeholder="e.g. Senior Full-Stack Engineer"
        />

        {role === 'freelancer' && (
          <Input
            label="Hourly Rate ($ USD)"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
            placeholder="90"
          />
        )}

        <Input
          label="Professional Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={{ height: 90, textAlignVertical: 'top' }}
          placeholder="Describe your engineering background and domain expertise..."
        />

        <Button
          title="Save Profile Updates"
          variant="primary"
          size="lg"
          onPress={handleSaveProfile}
          fullWidth
          style={{ marginTop: Spacing.md }}
        />
      </Modal>

      {/* Request Payout Modal */}
      <Modal
        visible={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Request Payout"
        subtitle="Transfer your cleared project earnings securely">
        <Input
          label="Payout Amount ($ USD)"
          value={payoutAmount}
          onChangeText={setPayoutAmount}
          keyboardType="numeric"
          placeholder="500"
        />

        <Text style={[styles.payoutMethodLabel, { color: colors.textSecondary }]}>
          Select Transfer Destination
        </Text>
        <View style={styles.payoutMethodsRow}>
          {(['bank_transfer', 'stripe', 'paypal', 'demo_payout'] as const).map((method) => {
            const isSelected = payoutMethod === method;
            return (
              <TouchableOpacity
                key={method}
                onPress={() => setPayoutMethod(method)}
                style={[
                  styles.methodPill,
                  {
                    backgroundColor: isSelected
                      ? BrandColors.electricBlue
                      : colors.backgroundSubtle,
                    borderColor: isSelected ? BrandColors.electricBlue : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.methodText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}>
                  {method.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title={isSubmittingPayout ? 'Processing...' : 'Confirm Payout Request'}
          variant="primary"
          size="lg"
          isLoading={isSubmittingPayout}
          onPress={handleRequestPayout}
          fullWidth
          style={{ marginTop: Spacing.lg }}
        />
      </Modal>

      <PersonaSwitcherModal
        visible={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  profileCard: {
    marginBottom: Spacing.base,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileInfoCol: {
    flex: 1,
    marginLeft: Spacing.base,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginVertical: 4,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '700',
  },
  headline: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  payoutCard: {
    marginBottom: Spacing.base,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  payoutSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  paymentCard: {
    marginBottom: Spacing.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  paymentTxRef: {
    fontSize: 11,
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  paymentFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 6,
    borderTopWidth: 1,
  },
  paymentFeeText: {
    fontSize: 11,
  },
  paymentNetText: {
    fontSize: 12,
    fontWeight: '700',
  },
  settingsCard: {
    marginBottom: Spacing.xl,
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
  },
  settingIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  payoutMethodLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  payoutMethodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  methodPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  methodText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
