// ==============================================================================
// LIMO DIRECTORY — FREELANCER TALENT & PORTFOLIO DISCOVERY
// Vetted talent, portfolio previews, and direct project engagement
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Profile } from '@/types';
import { SEED_PORTFOLIOS, SEED_SKILLS } from '@/lib/seed-data';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function FreelancersDirectoryScreen() {
  const { allProfiles, startConversationWithUser } = useData();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Profile | null>(null);

  const freelancers = useMemo(() => {
    return allProfiles.filter((p) => p.role === 'freelancer');
  }, [allProfiles]);

  const filteredFreelancers = useMemo(() => {
    return freelancers.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const skills = SEED_SKILLS.filter((s) => s.freelancer_id === f.id).map((s) =>
        s.skill_name.toLowerCase()
      );

      const matchesSearch =
        !q ||
        f.full_name.toLowerCase().includes(q) ||
        (f.headline && f.headline.toLowerCase().includes(q)) ||
        (f.bio && f.bio.toLowerCase().includes(q)) ||
        skills.some((s) => s.includes(q));

      const matchesAvailability =
        !onlyAvailable || f.availability_status === 'available';

      return matchesSearch && matchesAvailability;
    });
  }, [freelancers, searchQuery, onlyAvailable]);

  const handleStartChat = async (freelancerId: string) => {
    const convId = await startConversationWithUser(freelancerId);
    setSelectedFreelancer(null);
    router.push(`/chat/${convId}`);
  };

  const selectedPortfolios = useMemo(() => {
    if (!selectedFreelancer) return [];
    return SEED_PORTFOLIOS.filter((p) => p.freelancer_id === selectedFreelancer.id);
  }, [selectedFreelancer]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Top Vetted Talent</Text>
            <Text style={[styles.screenSub, { color: colors.textSecondary }]}>
              Engineers, UI/UX designers, and AI specialists vetted by LIMO
            </Text>
          </View>
        </View>

        <Input
          placeholder="Search by skill (React Native, Next.js, AI, Figma)..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          containerStyle={{ marginBottom: Spacing.xs }}
        />

        {/* Availability Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOnlyAvailable(!onlyAvailable)}
          style={[
            styles.availableToggle,
            {
              backgroundColor: onlyAvailable
                ? BrandColors.emerald
                : isDark
                ? colors.backgroundSubtle
                : '#F1F5F9',
              borderColor: onlyAvailable ? BrandColors.emerald : colors.border,
            },
          ]}>
          <Ionicons
            name={onlyAvailable ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={onlyAvailable ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.availableToggleText,
              { color: onlyAvailable ? '#FFFFFF' : colors.text },
            ]}>
            Available for Immediate Hire
          </Text>
        </TouchableOpacity>
      </View>

      {/* Freelancers List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredFreelancers.map((f) => (
          <FreelancerCard
            key={f.id}
            freelancer={f}
            onPress={() => setSelectedFreelancer(f)}
            onContact={() => handleStartChat(f.id)}
          />
        ))}
      </ScrollView>

      {/* Freelancer Portfolio & Bio Detail Modal */}
      <Modal
        visible={Boolean(selectedFreelancer)}
        onClose={() => setSelectedFreelancer(null)}
        title={selectedFreelancer?.full_name || 'Profile'}
        subtitle={selectedFreelancer?.headline || 'Specialist'}>
        {selectedFreelancer && (
          <View style={styles.modalContent}>
            <View style={styles.modalProfileRow}>
              <Avatar
                url={selectedFreelancer.avatar_url}
                name={selectedFreelancer.full_name}
                size="xl"
              />
              <View style={styles.modalProfileInfo}>
                <View style={styles.modalNameRow}>
                  <Text style={[styles.modalName, { color: colors.text }]}>
                    {selectedFreelancer.full_name}
                  </Text>
                  {selectedFreelancer.is_verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={BrandColors.electricBlue}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>

                <Text style={[styles.modalRate, { color: BrandColors.electricBlue }]}>
                  ${selectedFreelancer.hourly_rate}
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>/hour</Text>
                </Text>

                <Text style={[styles.modalLocation, { color: colors.textSecondary }]}>
                  {selectedFreelancer.location} • {selectedFreelancer.timezone}
                </Text>
              </View>
            </View>

            {/* Bio */}
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
              About Specialist
            </Text>
            <Text style={[styles.modalBio, { color: colors.textSecondary }]}>
              {selectedFreelancer.bio}
            </Text>

            {/* Portfolio Projects Showcase */}
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
              Featured Portfolios & Case Studies ({selectedPortfolios.length})
            </Text>
            {selectedPortfolios.map((port) => (
              <View
                key={port.id}
                style={[
                  styles.portfolioCard,
                  {
                    backgroundColor: isDark ? colors.backgroundSubtle : '#F8FAFC',
                    borderColor: colors.border,
                  },
                ]}>
                {port.image_url && (
                  <Image source={{ uri: port.image_url }} style={styles.portfolioImage} />
                )}
                <View style={styles.portfolioBody}>
                  <Text style={[styles.portfolioTitle, { color: colors.text }]}>
                    {port.title}
                  </Text>
                  <Text
                    style={[styles.portfolioDesc, { color: colors.textSecondary }]}>
                    {port.description}
                  </Text>
                  <View style={styles.portfolioTagsRow}>
                    {port.tags.map((t, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.portfolioTagPill,
                          { backgroundColor: isDark ? '#0F172A' : '#EFF6FF' },
                        ]}>
                        <Text
                          style={[
                            styles.portfolioTagText,
                            { color: BrandColors.electricBlue },
                          ]}>
                          {t}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}

            <Button
              title="Initiate Project Discussion"
              variant="primary"
              size="lg"
              onPress={() => handleStartChat(selectedFreelancer.id)}
              leftIcon={<Ionicons name="chatbubbles" size={18} color="#FFF" />}
              fullWidth
              style={{ marginTop: Spacing.base }}
            />
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerRow: {
    marginBottom: Spacing.sm,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSub: {
    fontSize: 12,
    marginTop: 2,
  },
  availableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  availableToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  modalContent: {
    paddingBottom: Spacing.lg,
  },
  modalProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalProfileInfo: {
    flex: 1,
    marginLeft: Spacing.base,
  },
  modalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalName: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalRate: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  modalLocation: {
    fontSize: 12,
    marginTop: 2,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  modalBio: {
    fontSize: 14,
    lineHeight: 22,
  },
  portfolioCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  portfolioImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  portfolioBody: {
    padding: Spacing.md,
  },
  portfolioTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  portfolioDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  portfolioTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  portfolioTagPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
  },
  portfolioTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
