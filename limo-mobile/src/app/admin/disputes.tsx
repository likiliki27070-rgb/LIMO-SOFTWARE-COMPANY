// ==============================================================================
// LIMO ADMIN — DISPUTE RESOLUTION & ESCROW ARBITRATION
// Section 5.C & 10: Escrow adjudication, refund workflows, audit compliance
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
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { Project } from '@/types';

export default function AdminDisputesScreen() {
  const router = useRouter();
  const { projects, payments, resolveDispute } = useData();
  const { colors } = useTheme();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resolutionAction, setResolutionAction] = useState<
    'release_to_freelancer' | 'refund_to_client'
  >('release_to_freelancer');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Projects that have active escrow or are marked in_progress / disputed
  const eligibleContracts = projects.filter(
    (p) => p.status === 'in_progress' || p.status === 'disputed'
  );

  const handleOpenArbitration = (
    proj: Project,
    action: 'release_to_freelancer' | 'refund_to_client'
  ) => {
    setSelectedProject(proj);
    setResolutionAction(action);
    setResolutionNotes(
      action === 'release_to_freelancer'
        ? 'Arbitration ruling: Freelancer provided verified deliverables adhering to project milestone specifications.'
        : 'Arbitration ruling: Deliverables failed to satisfy core milestone criteria within agreed timeline. Refunding client.'
    );
    setModalOpen(true);
  };

  const handleExecuteArbitration = async () => {
    if (!selectedProject || !resolutionNotes.trim()) {
      Alert.alert('Notes Required', 'Please provide detailed arbitration rationale.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resolveDispute(selectedProject.id, resolutionAction, resolutionNotes.trim());
      setModalOpen(false);
      Alert.alert(
        'Arbitration Executed',
        `Funds successfully ${
          resolutionAction === 'release_to_freelancer' ? 'released to freelancer' : 'refunded to client'
        }. Audit log permanently recorded.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Text style={[styles.title, { color: colors.text }]}>Dispute Resolution</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Escrow arbitration & funds disposition center
          </Text>
        </View>
      </View>

      <Card style={styles.noticeCard}>
        <Ionicons name="shield-checkmark" size={20} color={BrandColors.electricBlue} />
        <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
          Administrators act as trusted platform arbiters. Any fund release or client refund is cryptographically signed and committed to the immutable audit ledger.
        </Text>
      </Card>

      {/* Contracts List */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Active Contracts Under Management ({eligibleContracts.length})
      </Text>

      {eligibleContracts.map((proj) => {
        const escrowPay = payments.find(
          (p) => p.project_id === proj.id && p.status === 'escrow_funded'
        );

        return (
          <Card key={proj.id} style={styles.contractCard}>
            <View style={styles.contractHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.contractTitle, { color: colors.text }]}>
                  {proj.title}
                </Text>
                <Text style={[styles.contractMeta, { color: colors.textMuted }]}>
                  Client: {proj.client_name} • Specialist: {proj.assigned_freelancer_name}
                </Text>
              </View>
              <Badge label={proj.status.replace('_', ' ')} variant={proj.status as any} size="sm" />
            </View>

            {escrowPay && (
              <View style={[styles.escrowBox, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.escrowLabel, { color: colors.textMuted }]}>
                    FUNDS IN ESCROW
                  </Text>
                  <Text style={[styles.escrowAmount, { color: BrandColors.electricBlue }]}>
                    ${escrowPay.amount.toLocaleString()} ({escrowPay.transaction_reference})
                  </Text>
                </View>
                <Badge label="ESCROW SECURED" variant="escrow" size="sm" />
              </View>
            )}

            <View style={styles.arbitrationButtonsRow}>
              <Button
                title="Release to Freelancer"
                variant="primary"
                size="sm"
                onPress={() => handleOpenArbitration(proj, 'release_to_freelancer')}
                leftIcon={<Ionicons name="checkmark-done" size={16} color="#FFF" />}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />

              <Button
                title="Refund to Client"
                variant="danger"
                size="sm"
                onPress={() => handleOpenArbitration(proj, 'refund_to_client')}
                leftIcon={<Ionicons name="arrow-undo" size={16} color="#FFF" />}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        );
      })}

      {/* Arbitration Modal */}
      <Modal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Escrow Arbitration Order"
        subtitle={`Action: ${
          resolutionAction === 'release_to_freelancer'
            ? 'Release Escrow to Specialist'
            : 'Refund Escrow to Client'
        }`}>
        <Input
          label="Arbitration Reason & Ruling Notes"
          value={resolutionNotes}
          onChangeText={setResolutionNotes}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
          placeholder="State the contractual basis for this arbitration..."
          helperText="Permanent audit record"
        />

        <Button
          title={isSubmitting ? 'Recording Ruling...' : 'Execute Binding Ruling'}
          variant={resolutionAction === 'release_to_freelancer' ? 'primary' : 'danger'}
          size="lg"
          isLoading={isSubmitting}
          onPress={handleExecuteArbitration}
          fullWidth
          style={{ marginTop: Spacing.base }}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  contractCard: {
    marginBottom: Spacing.md,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  contractTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  contractMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  escrowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginVertical: Spacing.sm,
  },
  escrowLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  escrowAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  arbitrationButtonsRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
});
