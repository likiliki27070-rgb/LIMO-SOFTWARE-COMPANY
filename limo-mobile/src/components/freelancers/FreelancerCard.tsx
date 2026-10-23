// ==============================================================================
// LIMO COMPONENTS — FREELANCER TALENT CARD
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { SEED_SKILLS } from '@/lib/seed-data';

interface FreelancerCardProps {
  freelancer: Profile;
  onPress: () => void;
  onContact: () => void;
}

export function FreelancerCard({
  freelancer,
  onPress,
  onContact,
}: FreelancerCardProps) {
  const { colors, isDark } = useTheme();

  const skills = SEED_SKILLS.filter(
    (s) => s.freelancer_id === freelancer.id
  ).map((s) => s.skill_name);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <Avatar
          url={freelancer.avatar_url}
          name={freelancer.full_name}
          size="md"
          showOnlineStatus
          isOnline={freelancer.availability_status === 'available'}
        />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {freelancer.full_name}
            </Text>
            {freelancer.is_verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={BrandColors.electricBlue}
                style={styles.verifiedIcon}
              />
            )}
          </View>

          <Text
            style={[styles.headline, { color: colors.textSecondary }]}
            numberOfLines={1}>
            {freelancer.headline || 'Software Engineer'}
          </Text>

          <View style={styles.rateLocationRow}>
            <Text style={[styles.rate, { color: colors.text }]}>
              ${freelancer.hourly_rate}
              <Text style={{ fontSize: 12, fontWeight: '400', color: colors.textSecondary }}>
                /hr
              </Text>
            </Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.location, { color: colors.textSecondary }]}>
              {freelancer.location || 'Remote'}
            </Text>
          </View>
        </View>

        <Badge
          label={freelancer.availability_status.replace('_', ' ')}
          variant={freelancer.availability_status === 'available' ? 'success' : 'neutral'}
          size="sm"
        />
      </View>

      {/* Bio snippet */}
      <Text
        style={[styles.bio, { color: colors.textSecondary }]}
        numberOfLines={2}>
        {freelancer.bio}
      </Text>

      {/* Skills tags */}
      {skills.length > 0 && (
        <View style={styles.skillsRow}>
          {skills.slice(0, 4).map((skill, index) => (
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
        </View>
      )}

      {/* Actions */}
      <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
        <Button
          title="View Profile"
          variant="secondary"
          size="sm"
          onPress={onPress}
          style={{ flex: 1, marginRight: Spacing.sm }}
        />
        <Button
          title="Message"
          variant="primary"
          size="sm"
          onPress={onContact}
          leftIcon={<Ionicons name="chatbubble-ellipses-outline" size={14} color="#FFF" />}
          style={{ flex: 1 }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  infoCol: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  headline: {
    fontSize: 13,
    marginTop: 1,
  },
  rateLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  rate: {
    fontSize: 14,
    fontWeight: '700',
  },
  dot: {
    marginHorizontal: 6,
  },
  location: {
    fontSize: 12,
  },
  bio: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
});
