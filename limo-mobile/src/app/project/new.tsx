// ==============================================================================
// LIMO PROJECTS — CREATE NEW PROJECT FLOW
// Section 6: Title, Description, Category, Skills, Budget Min/Max, Timeline
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
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function NewProjectScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createProject } = useData();
  const { colors, isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Applications');
  const [description, setDescription] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'TypeScript',
    'Next.js',
  ]);
  const [budgetMin, setBudgetMin] = useState('3000');
  const [budgetMax, setBudgetMax] = useState('6000');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [timeline, setTimeline] = useState('4-6 weeks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Web Applications',
    'Mobile Applications',
    'UI/UX Design',
    'AI Integration',
    'Custom Software',
    'Website Development',
  ];

  const popularSkills = [
    'React Native',
    'Expo',
    'Next.js',
    'TypeScript',
    'PostgreSQL',
    'Python',
    'AI & LLM',
    'Figma',
    'UI/UX',
    'Tailwind CSS',
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = async () => {
    if (title.trim().length < 5) {
      Alert.alert('Title Too Short', 'Please enter a title of at least 5 characters.');
      return;
    }
    if (description.trim().length < 20) {
      Alert.alert(
        'Description Too Short',
        'Please provide a detailed project description of at least 20 characters so specialists can evaluate requirements.'
      );
      return;
    }

    const min = parseFloat(budgetMin);
    const max = parseFloat(budgetMax);

    if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
      Alert.alert(
        'Invalid Budget',
        'Please enter a valid budget range where maximum is greater than or equal to minimum.'
      );
      return;
    }

    if (selectedSkills.length === 0) {
      Alert.alert('Skills Required', 'Please select at least one required skill tag.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProj = await createProject({
        client_id: user?.id || 'client-default',
        title: title.trim(),
        description: description.trim(),
        category,
        required_skills: selectedSkills,
        budget_min: min,
        budget_max: max,
        budget_type: budgetType,
        estimated_timeline: timeline.trim() || '4 weeks',
        status: 'open',
        is_featured: false,
      });

      Alert.alert('Project Published', 'Your project is now live on the LIMO marketplace!');
      router.replace(`/project/${newProj.id}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to publish project.');
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
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Post a New Project</Text>
        <View style={{ width: 36 }} />
      </View>

      <Card style={styles.formCard}>
        {/* Title */}
        <Input
          label="Project Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Next-Gen Fintech Analytics Dashboard"
          helperText="A concise, descriptive headline (min 5 chars)"
        />

        {/* Category Pills */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}>
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryPill,
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
                    styles.categoryPillText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Detailed Scope */}
        <Input
          label="Detailed Scope of Work"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          style={{ height: 120, textAlignVertical: 'top' }}
          placeholder="Outline deliverables, technical stack requirements, expected user flows, performance benchmarks..."
          helperText="Minimum 20 characters required"
        />

        {/* Required Skills */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          Required Skills ({selectedSkills.length} selected)
        </Text>
        <View style={styles.skillsGrid}>
          {popularSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <TouchableOpacity
                key={skill}
                onPress={() => handleToggleSkill(skill)}
                style={[
                  styles.skillTag,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(0, 82, 255, 0.25)'
                        : '#EFF6FF'
                      : colors.backgroundSubtle,
                    borderColor: isSelected ? BrandColors.electricBlue : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.skillTagText,
                    {
                      color: isSelected ? BrandColors.electricBlue : colors.text,
                    },
                  ]}>
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add custom skill */}
        <View style={styles.customSkillRow}>
          <Input
            placeholder="Add custom skill tag..."
            value={customSkill}
            onChangeText={setCustomSkill}
            containerStyle={{ flex: 1, marginBottom: 0 }}
          />
          <Button
            title="Add"
            variant="secondary"
            size="md"
            onPress={handleAddCustomSkill}
            style={{ marginLeft: Spacing.sm }}
          />
        </View>

        {/* Budget Type Toggle */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: Spacing.base }]}>
          Budget Structure
        </Text>
        <View style={styles.budgetTypeRow}>
          <TouchableOpacity
            onPress={() => setBudgetType('fixed')}
            style={[
              styles.budgetTypeCard,
              {
                backgroundColor:
                  budgetType === 'fixed'
                    ? isDark
                      ? 'rgba(0, 82, 255, 0.2)'
                      : '#EFF6FF'
                    : colors.backgroundSubtle,
                borderColor: budgetType === 'fixed' ? BrandColors.electricBlue : colors.border,
              },
            ]}>
            <Text
              style={[
                styles.budgetTypeText,
                { color: budgetType === 'fixed' ? BrandColors.electricBlue : colors.text },
              ]}>
              Fixed Price Milestone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setBudgetType('hourly')}
            style={[
              styles.budgetTypeCard,
              {
                backgroundColor:
                  budgetType === 'hourly'
                    ? isDark
                      ? 'rgba(0, 82, 255, 0.2)'
                      : '#EFF6FF'
                    : colors.backgroundSubtle,
                borderColor: budgetType === 'hourly' ? BrandColors.electricBlue : colors.border,
              },
            ]}>
            <Text
              style={[
                styles.budgetTypeText,
                { color: budgetType === 'hourly' ? BrandColors.electricBlue : colors.text },
              ]}>
              Hourly Rate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Budget Range Inputs */}
        <View style={styles.budgetInputsRow}>
          <Input
            label="Minimum Budget ($ USD)"
            value={budgetMin}
            onChangeText={setBudgetMin}
            keyboardType="numeric"
            placeholder="1000"
            containerStyle={{ flex: 1, marginRight: Spacing.sm }}
          />
          <Input
            label="Maximum Budget ($ USD)"
            value={budgetMax}
            onChangeText={setBudgetMax}
            keyboardType="numeric"
            placeholder="5000"
            containerStyle={{ flex: 1 }}
          />
        </View>

        {/* Estimated Timeline */}
        <Input
          label="Estimated Timeline"
          value={timeline}
          onChangeText={setTimeline}
          placeholder="e.g. 6-8 weeks"
        />

        <Button
          title={isSubmitting ? 'Publishing Project...' : 'Publish Project to Marketplace'}
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          onPress={handleSubmit}
          fullWidth
          style={{ marginTop: Spacing.base }}
        />
      </Card>
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
    justifyContent: 'space-between',
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
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  formCard: {
    marginBottom: Spacing.base,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  skillTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customSkillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  budgetTypeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  budgetTypeCard: {
    flex: 1,
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  budgetTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  budgetInputsRow: {
    flexDirection: 'row',
  },
});
