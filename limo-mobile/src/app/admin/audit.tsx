// ==============================================================================
// LIMO ADMIN — TAMPER-EVIDENT AUDIT LOGS LEDGER
// Section 12: Security, Administrative & Financial Audit Trail
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function AdminAuditScreen() {
  const router = useRouter();
  const { auditLogs } = useData();
  const { colors, isDark } = useTheme();

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const actionCategories = ['ALL', 'ESCROW', 'PROPOSAL', 'MILESTONE', 'USER'];

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedFilter === 'ALL') return true;
    return log.action.includes(selectedFilter);
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
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
          <Text style={[styles.title, { color: colors.text }]}>Audit Logs Ledger</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {auditLogs.length} immutable events recorded
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsRow}>
        {actionCategories.map((cat) => {
          const isSelected = selectedFilter === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedFilter(cat)}
              style={[
                styles.filterPill,
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
                  styles.filterPillText,
                  { color: isSelected ? '#FFFFFF' : colors.text },
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Logs Timeline */}
      <ScrollView contentContainerStyle={styles.logsList}>
        {filteredLogs.map((log) => (
          <Card key={log.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <Badge
                label={log.action.replace(/_/g, ' ')}
                variant={
                  log.action.includes('ESCROW') || log.action.includes('APPROVED')
                    ? 'success'
                    : log.action.includes('REVISION')
                    ? 'warning'
                    : 'open'
                }
                size="sm"
              />
              <Text style={[styles.logTime, { color: colors.textMuted }]}>
                {new Date(log.created_at).toLocaleString()}
              </Text>
            </View>

            <View style={styles.actorRow}>
              <Ionicons name="person-circle-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.actorName, { color: colors.text }]}>
                Actor: <Text style={{ fontWeight: '700' }}>{log.actor_name}</Text>
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Target: {log.target_type} ({log.target_id})
              </Text>
              {log.ip_address && (
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                  IP: {log.ip_address}
                </Text>
              )}
            </View>

            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <View
                style={[
                  styles.metadataBox,
                  {
                    backgroundColor: isDark ? colors.backgroundSubtle : '#F8FAFC',
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[styles.metadataText, { color: colors.textSecondary }]}
                  numberOfLines={3}>
                  {JSON.stringify(log.metadata, null, 2)}
                </Text>
              </View>
            )}
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
  filterTabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  logsList: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  logCard: {
    marginBottom: Spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  logTime: {
    fontSize: 11,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 2,
  },
  actorName: {
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 11,
  },
  metadataBox: {
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginTop: 4,
  },
  metadataText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
