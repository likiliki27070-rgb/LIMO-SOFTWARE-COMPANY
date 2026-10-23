// ==============================================================================
// LIMO AGENCY — INTERACTIVE QUOTE REQUEST MODAL
// ==============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AgencyService } from './ServiceCard';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

interface QuoteModalProps {
  visible: boolean;
  service: AgencyService | null;
  onClose: () => void;
}

export function QuoteModal({ visible, service, onClose }: QuoteModalProps) {
  const { user } = useAuth();
  const { submitAgencyQuote } = useData();
  const { colors } = useTheme();

  const [contactName, setContactName] = useState(user?.full_name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [projectScope, setProjectScope] = useState('');
  const [budgetTier, setBudgetTier] = useState('$5k - $10k');
  const [timeline, setTimeline] = useState('4-6 weeks');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const budgetOptions = ['$3k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'];

  const handleSubmit = async () => {
    if (!projectScope.trim() || projectScope.trim().length < 20) {
      Alert.alert(
        'More Details Required',
        'Please describe your software scope and objectives in at least 20 characters so the LIMO engineering architects can evaluate feasibility.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAgencyQuote({
        client_id: user?.id,
        contact_name: contactName || 'Client',
        contact_email: contactEmail || 'client@example.com',
        contact_phone: contactPhone,
        service_type: service?.title || 'Custom Software',
        project_scope: projectScope.trim(),
        estimated_budget: budgetTier,
        target_timeline: timeline,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setProjectScope('');
        onClose();
      }, 2000);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit quote request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={isSuccess ? 'Quote Request Received' : `Request Quote: ${service?.title || 'Service'}`}
      subtitle="Direct engagement with the dedicated LIMO engineering squad">
      {isSuccess ? (
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={48} color={BrandColors.emerald} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Request Received!
          </Text>
          <Text style={[styles.successBody, { color: colors.textSecondary }]}>
            A LIMO Senior Technical Architect has received your scope and will review feasibility within 1 business day.
          </Text>
        </View>
      ) : (
        <View style={styles.form}>
          <Input
            label="Your Name"
            value={contactName}
            onChangeText={setContactName}
            placeholder="e.g. Sarah Jenkins"
          />

          <Input
            label="Work Email"
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            placeholder="e.g. sarah@company.io"
          />

          <Input
            label="Mobile Number (Optional)"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="Project Scope & Technical Goals"
            value={projectScope}
            onChangeText={setProjectScope}
            multiline
            numberOfLines={4}
            placeholder="Describe what you want to build, tech stack requirements, target users, or key integrations..."
            helperText="Minimum 20 characters"
            style={{ height: 90, textAlignVertical: 'top' }}
          />

          {/* Budget tier selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Target Budget Tier
          </Text>
          <View style={styles.optionsRow}>
            {budgetOptions.map((opt) => {
              const selected = budgetTier === opt;
              return (
                <View
                  key={opt}
                  style={[
                    styles.optionPill,
                    {
                      backgroundColor: selected ? BrandColors.electricBlue : colors.backgroundSubtle,
                      borderColor: selected ? BrandColors.electricBlue : colors.border,
                    },
                  ]}>
                  <Text
                    onPress={() => setBudgetTier(opt)}
                    style={[
                      styles.optionText,
                      { color: selected ? '#FFFFFF' : colors.text },
                    ]}>
                    {opt}
                  </Text>
                </View>
              );
            })}
          </View>

          <Button
            title={isSubmitting ? 'Transmitting Request...' : 'Submit to LIMO Engineering'}
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            onPress={handleSubmit}
            fullWidth
            style={{ marginTop: Spacing.base }}
          />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  optionPill: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  successIconCircle: {
    marginBottom: Spacing.base,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  successBody: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
