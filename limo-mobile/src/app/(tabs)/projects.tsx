// ==============================================================================
// LIMO MARKETPLACE — PROJECT DISCOVERY & BROWSE
// Search, category filters, budget indicators, and proposal counts
// ==============================================================================

import React, { useState, useMemo } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Card } from '@/components/ui/Card';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function ProjectsMarketplaceScreen() {
  const { projects } = useData();
  const { colors, isDark } = useTheme();
  const { role } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories = [
    'All',
    'Web Applications',
    'Mobile Applications',
    'UI/UX Design',
    'AI Integration',
    'Custom Software',
  ];

  const statuses = ['All', 'open', 'in_progress', 'completed'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search title, description, skills
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.required_skills.some((s) => s.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'All' || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Project Marketplace</Text>
            <Text style={[styles.screenSub, { color: colors.textSecondary }]}>
              {filteredProjects.length} active opportunities available
            </Text>
          </View>

          {role === 'client' && (
            <Button
              title="+ Post Project"
              variant="primary"
              size="sm"
              onPress={() => router.push('/project/new')}
            />
          )}
        </View>

        <Input
          placeholder="Search by keywords, tech stack, or category..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          rightIcon={
            searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : undefined
          }
          containerStyle={{ marginBottom: Spacing.xs }}
        />

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat)}
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
      </View>

      {/* Projects List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredProjects.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="search-outline" size={44} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Projects Match Your Filter
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Try adjusting your search keywords or switching category filters.
            </Text>
            <Button
              title="Reset Filters"
              variant="secondary"
              size="sm"
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        ) : (
          filteredProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onPress={() => router.push(`/project/${p.id}`)}
            />
          ))
        )}
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  filterPillsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
