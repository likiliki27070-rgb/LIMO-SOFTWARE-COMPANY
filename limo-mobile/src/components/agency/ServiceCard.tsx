// ==============================================================================
// LIMO AGENCY — DIRECT SERVICE CARD COMPONENT
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export interface AgencyService {
  id: string;
  title: string;
  tagline: string;
  iconName: keyof typeof Ionicons.glyphMap;
  deliverables: string[];
  startingBudget: string;
  deliveryEstimate: string;
}

interface ServiceCardProps {
  service: AgencyService;
  onRequestQuote: (service: AgencyService) => void;
}

export function ServiceCard({ service, onRequestQuote }: ServiceCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isDark ? 'rgba(0, 82, 255, 0.15)' : '#EFF6FF',
              borderColor: BrandColors.electricBlue,
            },
          ]}>
          <Ionicons name={service.iconName} size={24} color={BrandColors.electricBlue} />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{service.title}</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            {service.tagline}
          </Text>
        </View>
      </View>

      {/* Deliverables Bullet List */}
      <View style={styles.deliverablesList}>
        {service.deliverables.map((item, idx) => (
          <View key={idx} style={styles.deliverableItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={BrandColors.emerald}
              style={styles.bulletIcon}
            />
            <Text style={[styles.deliverableText, { color: colors.textSecondary }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* Price & Timeline Badge */}
      <View
        style={[
          styles.metaRow,
          {
            backgroundColor: isDark ? colors.backgroundSubtle : '#F8FAFC',
            borderColor: colors.border,
          },
        ]}>
        <View>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
            Starting Investment
          </Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>
            {service.startingBudget}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Delivery</Text>
          <Text style={[styles.metaValue, { color: BrandColors.electricBlue }]}>
            {service.deliveryEstimate}
          </Text>
        </View>
      </View>

      {/* Request Quote Button */}
      <Button
        title="Request Quote from LIMO Team"
        variant="primary"
        size="md"
        onPress={() => onRequestQuote(service)}
        rightIcon={<Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
        fullWidth
        style={{ marginTop: Spacing.md }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  deliverablesList: {
    marginBottom: Spacing.md,
  },
  deliverableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletIcon: {
    marginRight: Spacing.sm,
  },
  deliverableText: {
    fontSize: 13,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
});
