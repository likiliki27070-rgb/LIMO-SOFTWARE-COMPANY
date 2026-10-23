// ==============================================================================
// LIMO DASHBOARD — MULTI-ROLE ADAPTIVE HOMEPAGE
// Section 5: Client Dashboard / Freelancer Dashboard / Admin Dashboard
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { Project } from '@/types';

export default function DashboardScreen() {
  const { user, role } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const {
    projects,
    proposals,
    milestones,
    payments,
    payouts,
    agencyQuotes,
    allProfiles,
    auditLogs,
  } = useData();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // --- CLIENT DASHBOARD EXPERIENCE ---
  const renderClientDashboard = () => {
    // Client projects
    const myProjects = projects.filter((p) => p.client_id === user?.id);
    const activeProjects = myProjects.filter((p) => p.status === 'in_progress');
    const reviewProjects = myProjects.filter((p) => p.status === 'proposal_review');
    const openProjects = myProjects.filter((p) => p.status === 'open');

    // Total in escrow for client
    const escrowFunded = payments
      .filter((p) => p.payer_id === user?.id && p.status === 'escrow_funded')
      .reduce((sum, p) => sum + p.amount, 0);

    return (
      <View style={styles.dashboardContainer}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <Avatar url={user?.avatar_url} name={user?.full_name} size="lg" />
            <View style={styles.welcomeTextCol}>
              <View style={styles.welcomeBadgeRow}>
                <Badge label="CLIENT WORKSPACE" variant="client" size="sm" />
                {user?.is_verified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={BrandColors.electricBlue}
                    style={{ marginLeft: 6 }}
                  />
                )}
              </View>
              <Text style={[styles.welcomeName, { color: colors.text }]}>
                {user?.full_name}
              </Text>
              <Text style={[styles.welcomeHeadline, { color: colors.textSecondary }]}>
                {user?.headline || 'Client Member'}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={[styles.quickActionsRow, { borderTopColor: colors.border }]}>
            <Button
              title="Post New Project"
              variant="primary"
              size="sm"
              onPress={() => router.push('/project/new')}
              leftIcon={<Ionicons name="add-circle" size={16} color="#FFF" />}
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
            <Button
              title="Browse Talent"
              variant="secondary"
              size="sm"
              onPress={() => router.push('/(tabs)/freelancers')}
              leftIcon={<Ionicons name="search" size={16} color={colors.text} />}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* Financial & Status KPI Cards */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(0, 82, 255, 0.15)' : '#EFF6FF' }]}>
              <Ionicons name="briefcase" size={18} color={BrandColors.electricBlue} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>
              {myProjects.length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Total Projects
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(0, 210, 255, 0.15)' : '#ECFEFF' }]}>
              <Ionicons name="shield-checkmark" size={18} color={BrandColors.cyanDark} />
            </View>
            <Text style={[styles.kpiValue, { color: BrandColors.electricBlue }]}>
              ${escrowFunded.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Escrow Funded
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB' }]}>
              <Ionicons name="document-text" size={18} color="#D97706" />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>
              {reviewProjects.length + openProjects.length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Pending Review
            </Text>
          </Card>
        </View>

        {/* Projects Requiring Attention / In Progress */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            My Active & Posted Projects
          </Text>
          <TouchableOpacity onPress={() => router.push('/project/new')}>
            <Text style={[styles.sectionAction, { color: BrandColors.electricBlue }]}>
              + Post New
            </Text>
          </TouchableOpacity>
        </View>

        {myProjects.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Projects Posted Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Publish your first development project to receive proposals from vetted specialists.
            </Text>
            <Button
              title="Post Your First Project"
              variant="primary"
              size="md"
              onPress={() => router.push('/project/new')}
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        ) : (
          myProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onPress={() => router.push(`/project/${p.id}`)}
            />
          ))
        )}
      </View>
    );
  };

  // --- FREELANCER DASHBOARD EXPERIENCE ---
  const renderFreelancerDashboard = () => {
    // Accepted projects where assigned_freelancer_id is user
    const assignedProjects = projects.filter((p) => p.assigned_freelancer_id === user?.id);
    // My proposals
    const myProposals = proposals.filter((p) => p.freelancer_id === user?.id);

    // Lifetime earnings & available balance
    const releasedPayments = payments.filter(
      (p) => p.payee_id === user?.id && p.status === 'released'
    );
    const inFlightEscrow = payments.filter(
      (p) => p.payee_id === user?.id && p.status === 'escrow_funded'
    );

    const lifetimeEarnings = releasedPayments.reduce((sum, p) => sum + p.net_amount, 0);
    const pendingEscrow = inFlightEscrow.reduce((sum, p) => sum + p.net_amount, 0);

    return (
      <View style={styles.dashboardContainer}>
        {/* Welcome Freelancer Card */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <Avatar url={user?.avatar_url} name={user?.full_name} size="lg" showOnlineStatus />
            <View style={styles.welcomeTextCol}>
              <View style={styles.welcomeBadgeRow}>
                <Badge label="VERIFIED TALENT" variant="freelancer" size="sm" />
                <Badge
                  label={user?.availability_status.replace('_', ' ') || 'available'}
                  variant="success"
                  size="sm"
                  style={{ marginLeft: 6 }}
                />
              </View>
              <Text style={[styles.welcomeName, { color: colors.text }]}>
                {user?.full_name}
              </Text>
              <Text style={[styles.welcomeHeadline, { color: colors.textSecondary }]}>
                {user?.headline || 'Senior Software Engineer'}
              </Text>
            </View>
          </View>

          {/* Profile Completion Bar */}
          <View style={styles.completionContainer}>
            <View style={styles.completionHeader}>
              <Text style={[styles.completionLabel, { color: colors.textSecondary }]}>
                Profile Strength: Top Tier Specialist
              </Text>
              <Text style={[styles.completionPercent, { color: BrandColors.emerald }]}>
                95%
              </Text>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: colors.backgroundSubtle }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: '95%', backgroundColor: BrandColors.emerald },
                ]}
              />
            </View>
          </View>

          {/* Action Row */}
          <View style={[styles.quickActionsRow, { borderTopColor: colors.border }]}>
            <Button
              title="Discover Projects"
              variant="primary"
              size="sm"
              onPress={() => router.push('/(tabs)/projects')}
              leftIcon={<Ionicons name="search" size={16} color="#FFF" />}
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
            <Button
              title="My Portfolio"
              variant="secondary"
              size="sm"
              onPress={() => router.push('/(tabs)/profile')}
              leftIcon={<Ionicons name="images-outline" size={16} color={colors.text} />}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* Freelancer Earnings KPI Grid */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
              <Ionicons name="cash" size={18} color={BrandColors.emerald} />
            </View>
            <Text style={[styles.kpiValue, { color: BrandColors.emerald }]}>
              ${lifetimeEarnings.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Net Earned
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(0, 210, 255, 0.15)' : '#ECFEFF' }]}>
              <Ionicons name="hourglass" size={18} color={BrandColors.cyanDark} />
            </View>
            <Text style={[styles.kpiValue, { color: BrandColors.cyanDark }]}>
              ${pendingEscrow.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              In Escrow
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: isDark ? 'rgba(0, 82, 255, 0.15)' : '#EFF6FF' }]}>
              <Ionicons name="paper-plane" size={18} color={BrandColors.electricBlue} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>
              {myProposals.length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Proposals Sent
            </Text>
          </Card>
        </View>

        {/* Active Contracts & Milestones */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Contracts ({assignedProjects.length})
          </Text>
        </View>

        {assignedProjects.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="briefcase-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Active Contracts
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Search the project marketplace and submit proposals with your portfolio references.
            </Text>
            <Button
              title="Explore Open Projects"
              variant="primary"
              size="md"
              onPress={() => router.push('/(tabs)/projects')}
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        ) : (
          assignedProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onPress={() => router.push(`/project/${p.id}`)}
            />
          ))
        )}
      </View>
    );
  };

  // --- ADMIN DASHBOARD EXPERIENCE ---
  const renderAdminDashboard = () => {
    const totalUsers = allProfiles.length;
    const clientCount = allProfiles.filter((p) => p.role === 'client').length;
    const freelancerCount = allProfiles.filter((p) => p.role === 'freelancer').length;
    const totalEscrowVolume = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
      <View style={styles.dashboardContainer}>
        {/* Admin Header */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <Avatar url={user?.avatar_url} name={user?.full_name} size="lg" />
            <View style={styles.welcomeTextCol}>
              <View style={styles.welcomeBadgeRow}>
                <Badge label="ADMINISTRATOR" variant="admin" size="sm" />
                <Badge label="PLATFORM CONTROL" variant="neutral" size="sm" style={{ marginLeft: 6 }} />
              </View>
              <Text style={[styles.welcomeName, { color: colors.text }]}>
                {user?.full_name}
              </Text>
              <Text style={[styles.welcomeHeadline, { color: colors.textSecondary }]}>
                Platform Security, Moderation & Audit Officer
              </Text>
            </View>
          </View>
        </Card>

        {/* Global Platform KPIs */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{totalUsers}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Total Users ({clientCount}c / {freelancerCount}f)
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: BrandColors.electricBlue }]}>
              ${totalEscrowVolume.toLocaleString()}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Ledger Escrow
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: BrandColors.emerald }]}>
              {agencyQuotes.length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              Agency Quotes
            </Text>
          </Card>
        </View>

        {/* Admin Management Navigation Shortcuts */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Administrative Controls
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/users')}
          style={[styles.adminMenuRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.adminMenuIconBox}>
            <Ionicons name="people" size={20} color={BrandColors.electricBlue} />
          </View>
          <View style={styles.adminMenuTextCol}>
            <Text style={[styles.adminMenuTitle, { color: colors.text }]}>
              User & Verification Management
            </Text>
            <Text style={[styles.adminMenuSub, { color: colors.textSecondary }]}>
              Review talent identity, grant verified badges, suspend/reinstate
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/disputes')}
          style={[styles.adminMenuRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.adminMenuIconBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}>
            <Ionicons name="alert-circle" size={20} color={BrandColors.rose} />
          </View>
          <View style={styles.adminMenuTextCol}>
            <Text style={[styles.adminMenuTitle, { color: colors.text }]}>
              Dispute Resolution Center
            </Text>
            <Text style={[styles.adminMenuSub, { color: colors.textSecondary }]}>
              Arbitrate escrow funds, release milestone or execute refunds
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/audit')}
          style={[styles.adminMenuRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.adminMenuIconBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
            <Ionicons name="shield" size={20} color={BrandColors.emerald} />
          </View>
          <View style={styles.adminMenuTextCol}>
            <Text style={[styles.adminMenuTitle, { color: colors.text }]}>
              Tamper-Evident Audit Logs ({auditLogs.length})
            </Text>
            <Text style={[styles.adminMenuSub, { color: colors.textSecondary }]}>
              Immutable record of escrow operations, approvals, and security events
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {role === 'admin'
        ? renderAdminDashboard()
        : role === 'freelancer'
        ? renderFreelancerDashboard()
        : renderClientDashboard()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  dashboardContainer: {
    width: '100%',
  },
  welcomeCard: {
    marginBottom: Spacing.base,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  welcomeTextCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  welcomeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  welcomeHeadline: {
    fontSize: 12,
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  kpiCard: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  completionContainer: {
    marginBottom: Spacing.md,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  completionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  completionPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  adminMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  adminMenuIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  adminMenuTextCol: {
    flex: 1,
  },
  adminMenuTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  adminMenuSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
