// ==============================================================================
// LIMO COMPONENTS — PROJECT CARD
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const { colors, isDark } = useTheme();

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Header: Client info & Status Badge */}
      <View style={styles.header}>
        <View style={styles.clientRow}>
          <Avatar
            url={project.client_avatar}
            name={project.client_name || 'Client'}
            size="sm"
          />
          <View style={styles.clientTextCol}>
            <Text style={[styles.clientName, { color: colors.textSecondary }]}>
              {project.client_name || 'Client'}
            </Text>
            <Text style={[styles.categoryText, { color: BrandColors.electricBlue }]}>
              {project.category}
            </Text>
          </View>
        </View>

        <Badge label={project.status.replace('_', ' ')} variant={project.status as any} size="sm" />
      </View>

      {/* Project Title */}
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {project.title}
      </Text>

      {/* Description Snippet */}
      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={2}>
        {project.description}
      </Text>

      {/* Required Skills Tags */}
      <View style={styles.skillsRow}>
        {project.required_skills.slice(0, 3).map((skill, index) => (
          <View
            key={index}
            style={[
              styles.skillPill,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}>
            <Text style={[styles.skillText, { color: colors.textSecondary }]}>
              {skill}
            </Text>
          </View>
        ))}
        {project.required_skills.length > 3 && (
          <Text style={[styles.moreSkills, { color: colors.textMuted }]}>
            +{project.required_skills.length - 3} more
          </Text>
        )}
      </View>

      {/* Footer: Budget & Proposals */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.budgetCol}>
          <Text style={[styles.budgetLabel, { color: colors.textMuted }]}>Budget</Text>
          <Text style={[styles.budgetValue, { color: colors.text }]}>
            {formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}
            <Text style={[styles.budgetType, { color: colors.textSecondary }]}>
              {' '}({project.budget_type})
            </Text>
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {project.proposals_count || 0} bids
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {project.estimated_timeline}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientTextCol: {
    marginLeft: Spacing.sm,
  },
  clientName: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: Spacing.xs,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  skillPill: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreSkills: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  budgetCol: {
    justifyContent: 'center',
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  budgetType: {
    fontSize: 12,
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
