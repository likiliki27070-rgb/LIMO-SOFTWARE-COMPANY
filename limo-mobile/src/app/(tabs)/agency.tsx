// ==============================================================================
// LIMO AGENCY — DEDICATED SOFTWARE DEVELOPMENT SERVICES
// Core Business Model: Enterprise Software Agency + Direct Quote System
// ==============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCard, AgencyService } from '@/components/agency/ServiceCard';
import { QuoteModal } from '@/components/agency/QuoteModal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function AgencyScreen() {
  const { colors, isDark } = useTheme();
  const { agencyQuotes } = useData();
  const { user } = useAuth();

  const [selectedService, setSelectedService] = useState<AgencyService | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const agencyServices: AgencyService[] = [
    {
      id: 'srv-web-apps',
      title: 'Web Application Development',
      tagline: 'High-velocity full-stack SaaS engineering with Next.js & PostgreSQL',
      iconName: 'browsers-outline',
      deliverables: [
        'Multi-tenant cloud architecture',
        'Real-time WebSockets & background workers',
        'End-to-end type safety with TypeScript & Prisma/Drizzle',
        'Stripe billing & subscription workflows',
      ],
      startingBudget: '$7,500',
      deliveryEstimate: '4-8 weeks',
    },
    {
      id: 'srv-mobile',
      title: 'Mobile Application Development',
      tagline: 'Buttery-smooth 60fps iOS and Android apps with Expo and React Native',
      iconName: 'phone-portrait-outline',
      deliverables: [
        'Cross-platform single codebase for iOS & Android',
        'Offline-first synchronization & SQLite storage',
        'Native push notifications & biometric auth',
        'App Store and Google Play compliance & publishing',
      ],
      startingBudget: '$8,500',
      deliveryEstimate: '6-10 weeks',
    },
    {
      id: 'srv-ai',
      title: 'AI & LLM Integration',
      tagline: 'Custom intelligent agents, RAG vector pipelines, and autonomous workflows',
      iconName: 'hardware-chip-outline',
      deliverables: [
        'Retrieval-Augmented Generation (RAG) on private documents',
        'Fine-tuned model adapters & prompt evaluation',
        'Sub-second streaming completions & fallback orchestration',
        'Enterprise data compliance & zero data leakage',
      ],
      startingBudget: '$6,000',
      deliveryEstimate: '3-6 weeks',
    },
    {
      id: 'srv-ui-ux',
      title: 'UI/UX Design & Design Systems',
      tagline: 'World-class product aesthetics, micro-interactions, and conversion-focused UX',
      iconName: 'color-palette-outline',
      deliverables: [
        'Accessible Figma token libraries (WCAG AAA)',
        'Clickable high-fidelity interactive prototypes',
        'Responsive layout specs for mobile, tablet, and desktop',
        'Design-to-code component handoff',
      ],
      startingBudget: '$4,000',
      deliveryEstimate: '2-4 weeks',
    },
    {
      id: 'srv-custom',
      title: 'Custom Enterprise Software',
      tagline: 'Mission-critical distributed systems, telemetry engines, and internal tools',
      iconName: 'server-outline',
      deliverables: [
        'Microservices & containerized Kubernetes workloads',
        'High-throughput message queues (Kafka, RabbitMQ)',
        'Role-based access control & SOC 2 audit readiness',
        'Automated CI/CD deployment pipelines',
      ],
      startingBudget: '$15,000+',
      deliveryEstimate: '8-16 weeks',
    },
    {
      id: 'srv-maintenance',
      title: 'Maintenance & 24/7 SLA Support',
      tagline: 'Continuous uptime monitoring, dependency patching, and rapid hotfixes',
      iconName: 'construct-outline',
      deliverables: [
        '99.9% uptime guarantee with PagerDuty alerts',
        'Weekly automated security vulnerability audits',
        'Monthly feature iterations and performance tuning',
        'Dedicated senior engineering point of contact',
      ],
      startingBudget: '$1,500/mo',
      deliveryEstimate: 'Ongoing SLA',
    },
  ];

  const handleOpenQuote = (service: AgencyService) => {
    setSelectedService(service);
    setQuoteModalOpen(true);
  };

  // Quotes submitted by this user or all quotes if admin
  const userQuotes = agencyQuotes.filter(
    (q) => user?.role === 'admin' || q.client_id === user?.id || q.contact_email === user?.email
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Agency Header Banner */}
      <Card style={styles.bannerCard}>
        <View style={styles.bannerBadgeRow}>
          <Badge label="LIMO DIRECT SERVICES" variant="open" size="sm" />
          <Text style={[styles.guaranteeText, { color: BrandColors.emerald }]}>
            • 100% In-House Senior Squad
          </Text>
        </View>

        <Text style={[styles.bannerTitle, { color: colors.text }]}>
          Need a Dedicated Development Team?
        </Text>
        <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
          In addition to our freelancing marketplace, LIMO’s direct engineering squads build and ship production software for enterprise clients. We manage product scoping, architecture, QA, and deployment with guaranteed deliverables.
        </Text>
      </Card>

      {/* User's Active Quote Requests (if any) */}
      {userQuotes.length > 0 && (
        <View style={styles.activeQuotesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Direct Quote Inquiries ({userQuotes.length})
          </Text>

          {userQuotes.map((q) => (
            <Card key={q.id} style={styles.quoteStatusCard}>
              <View style={styles.quoteHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.quoteService, { color: colors.text }]}>
                    {q.service_type}
                  </Text>
                  <Text style={[styles.quoteDate, { color: colors.textMuted }]}>
                    Submitted {new Date(q.created_at).toLocaleDateString()} • Target:{' '}
                    {q.estimated_budget}
                  </Text>
                </View>
                <Badge
                  label={q.status.replace('_', ' ')}
                  variant={q.status === 'in_discussion' ? 'warning' : 'neutral'}
                  size="sm"
                />
              </View>
              <Text
                style={[styles.quoteScope, { color: colors.textSecondary }]}
                numberOfLines={2}>
                "{q.project_scope}"
              </Text>
              {q.admin_notes && (
                <View
                  style={[
                    styles.adminNoteBox,
                    { backgroundColor: isDark ? colors.backgroundSubtle : '#EFF6FF' },
                  ]}>
                  <Text style={[styles.adminNoteText, { color: BrandColors.electricBlue }]}>
                    LIMO Architect: {q.admin_notes}
                  </Text>
                </View>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* Services Showcase */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.sm }]}>
        LIMO Engineering Capabilities
      </Text>

      {agencyServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onRequestQuote={handleOpenQuote}
        />
      ))}

      {/* Quote Form Modal */}
      <QuoteModal
        visible={quoteModalOpen}
        service={selectedService}
        onClose={() => setQuoteModalOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  bannerCard: {
    marginBottom: Spacing.base,
  },
  bannerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },
  activeQuotesSection: {
    marginBottom: Spacing.base,
  },
  quoteStatusCard: {
    marginBottom: Spacing.sm,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  quoteService: {
    fontSize: 15,
    fontWeight: '700',
  },
  quoteDate: {
    fontSize: 12,
    marginTop: 2,
  },
  quoteScope: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  adminNoteBox: {
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  adminNoteText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
