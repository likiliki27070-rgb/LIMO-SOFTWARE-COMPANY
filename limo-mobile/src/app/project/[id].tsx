// ==============================================================================
// LIMO PROJECT DETAILS — LIFECYCLE, PROPOSALS & MILESTONES
// Section 6, 7, 9 & 10: State transitions, proposal acceptance, deliverable approval
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { Proposal } from '@/types';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, role } = useAuth();
  const { colors, isDark } = useTheme();
  const {
    projects,
    proposals,
    milestones,
    getMilestonesForProject,
    submitProposal,
    acceptProposal,
    shortlistProposal,
    submitDeliverable,
    approveMilestone,
    requestMilestoneRevision,
    startConversationWithUser,
  } = useData();

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);

  const projectProposals = useMemo(
    () => proposals.filter((p) => p.project_id === id),
    [proposals, id]
  );

  const projectMilestones = useMemo(
    () => (id ? getMilestonesForProject(id) : []),
    [milestones, id]
  );

  // Proposal modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [bidPrice, setBidPrice] = useState(project?.budget_min.toString() || '3000');
  const [duration, setDuration] = useState('4 weeks');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Deliverable modal state
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [targetMilestoneId, setTargetMilestoneId] = useState<string | null>(null);
  const [delivTitle, setDelivTitle] = useState('');
  const [delivUrl, setDelivUrl] = useState('');
  const [delivNotes, setDelivNotes] = useState('');
  const [isSubmittingDeliv, setIsSubmittingDeliv] = useState(false);

  // Revision modal state
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  if (!project) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Project Not Found</Text>
        <Button title="Back to Marketplace" onPress={() => router.back()} />
      </View>
    );
  }

  const isClientOwner = project.client_id === user?.id || role === 'client';
  const isAssignedFreelancer = project.assigned_freelancer_id === user?.id;
  const hasUserSubmittedProposal = proposals.some(
    (p) => p.project_id === project.id && p.freelancer_id === user?.id
  );

  const handleStartChatWith = async (targetId: string) => {
    const convId = await startConversationWithUser(targetId, project.id);
    router.push(`/chat/${convId}`);
  };

  const handleAcceptProposal = (proposal: Proposal) => {
    Alert.alert(
      'Accept Proposal & Fund Escrow?',
      `Accept ${proposal.freelancer_name}’s bid of $${proposal.proposed_price.toLocaleString()}? This will allocate milestone escrow funds and transition the project to In Progress.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Fund Escrow',
          onPress: async () => {
            await acceptProposal(proposal.id);
            Alert.alert('Contract Initiated', 'Milestone escrow successfully funded!');
          },
        },
      ]
    );
  };

  const handleSubmitProposalForm = async () => {
    const price = parseFloat(bidPrice);
    if (!price || price <= 0) {
      Alert.alert('Invalid Bid', 'Please enter a valid positive bid amount.');
      return;
    }
    if (coverLetter.trim().length < 20) {
      Alert.alert(
        'Cover Letter Required',
        'Please enter a cover letter of at least 20 characters explaining your technical approach.'
      );
      return;
    }

    setIsSubmittingProposal(true);
    try {
      await submitProposal({
        project_id: project.id,
        project_title: project.title,
        freelancer_id: user?.id || 'freelancer',
        freelancer_name: user?.full_name || 'Freelancer',
        freelancer_avatar: user?.avatar_url,
        freelancer_headline: user?.headline || 'Engineer',
        freelancer_rating: 5.0,
        cover_letter: coverLetter.trim(),
        proposed_price: price,
        estimated_duration: duration,
        relevant_skills: project.required_skills,
      });

      setProposalModalOpen(false);
      Alert.alert('Proposal Submitted', 'The client has been notified of your bid.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!targetMilestoneId || !delivTitle.trim()) {
      Alert.alert('Required', 'Please enter a deliverable title.');
      return;
    }

    setIsSubmittingDeliv(true);
    try {
      await submitDeliverable(targetMilestoneId, delivTitle.trim(), delivUrl.trim(), delivNotes.trim());
      setDeliverableModalOpen(false);
      Alert.alert('Deliverable Submitted', 'Milestone submitted for client review.');
    } finally {
      setIsSubmittingDeliv(false);
    }
  };

  const handleApproveMilestone = (milestoneId: string, amount: number) => {
    Alert.alert(
      'Approve Work & Release Escrow?',
      `Are you satisfied with this milestone? Releasing $${amount.toLocaleString()} from escrow to the freelancer.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Release Funds',
          onPress: async () => {
            await approveMilestone(milestoneId, 'Approved by client. Excellent work.');
            Alert.alert('Funds Released', 'Escrow funds successfully released to specialist.');
          },
        },
      ]
    );
  };

  const handleRequestRevision = async () => {
    if (!targetMilestoneId || !revisionFeedback.trim()) {
      Alert.alert('Feedback Required', 'Please provide notes explaining required revisions.');
      return;
    }
    await requestMilestoneRevision(targetMilestoneId, revisionFeedback.trim());
    setRevisionModalOpen(false);
    Alert.alert('Revision Requested', 'Feedback delivered to the specialist.');
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
        <Badge label={project.status.replace('_', ' ')} variant={project.status as any} />
      </View>

      {/* Main Project Card */}
      <Card style={styles.projectMainCard}>
        <Text style={[styles.categoryPill, { color: BrandColors.electricBlue }]}>
          {project.category}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>{project.title}</Text>

        {/* Client Row */}
        <View style={styles.clientRow}>
          <Avatar url={project.client_avatar} name={project.client_name || 'Client'} size="md" />
          <View style={styles.clientInfo}>
            <Text style={[styles.clientName, { color: colors.text }]}>
              {project.client_name || 'Client'}
            </Text>
            <Text style={[styles.postedDate, { color: colors.textMuted }]}>
              Posted {new Date(project.created_at).toLocaleDateString()}
            </Text>
          </View>

          {project.client_id !== user?.id && (
            <Button
              title="Message"
              variant="outline"
              size="sm"
              onPress={() => handleStartChatWith(project.client_id)}
              leftIcon={<Ionicons name="chatbubble-outline" size={14} color={colors.text} />}
            />
          )}
        </View>

        {/* Budget & Timeline Bar */}
        <View
          style={[
            styles.metaBar,
            {
              backgroundColor: isDark ? colors.backgroundSubtle : '#F8FAFC',
              borderColor: colors.border,
            },
          ]}>
          <View>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>BUDGET RANGE</Text>
            <Text style={[styles.metaVal, { color: colors.text }]}>
              ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.metaLabel, { color: colors.textMuted }]}>TIMELINE</Text>
            <Text style={[styles.metaVal, { color: BrandColors.electricBlue }]}>
              {project.estimated_timeline}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Scope of Work</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {project.description}
        </Text>

        {/* Required Skills */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Required Skills</Text>
        <View style={styles.skillsRow}>
          {project.required_skills.map((skill, i) => (
            <View
              key={i}
              style={[
                styles.skillPill,
                { backgroundColor: isDark ? colors.backgroundSubtle : '#F1F5F9' },
              ]}>
              <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* Freelancer Action: Submit Proposal */}
        {role === 'freelancer' && project.status === 'open' && (
          <View style={styles.freelancerActionBox}>
            {hasUserSubmittedProposal ? (
              <View style={[styles.alreadySubmittedBox, { backgroundColor: isDark ? '#1E293B' : '#ECFDF5' }]}>
                <Ionicons name="checkmark-circle" size={20} color={BrandColors.emerald} />
                <Text style={[styles.alreadySubmittedText, { color: BrandColors.emerald }]}>
                  You have submitted a proposal for this project.
                </Text>
              </View>
            ) : (
              <Button
                title="Submit a Proposal"
                variant="primary"
                size="lg"
                onPress={() => setProposalModalOpen(true)}
                leftIcon={<Ionicons name="paper-plane" size={18} color="#FFF" />}
                fullWidth
              />
            )}
          </View>
        )}
      </Card>

      {/* Contract Milestones Section */}
      {projectMilestones.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.containerTitle, { color: colors.text }]}>
            Project Milestones ({projectMilestones.length})
          </Text>

          {projectMilestones.map((milestone) => (
            <Card key={milestone.id} style={styles.milestoneCard}>
              <View style={styles.milestoneHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.milestoneTitle, { color: colors.text }]}>
                    {milestone.title}
                  </Text>
                  <Text style={[styles.milestoneDesc, { color: colors.textSecondary }]}>
                    {milestone.description}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: Spacing.sm }}>
                  <Text style={[styles.milestoneAmount, { color: BrandColors.electricBlue }]}>
                    ${milestone.amount.toLocaleString()}
                  </Text>
                  <Badge label={milestone.status.replace('_', ' ')} variant={milestone.status as any} size="sm" />
                </View>
              </View>

              {/* Deliverable preview if submitted */}
              {milestone.deliverable_url && (
                <View
                  style={[
                    styles.deliverableBox,
                    {
                      backgroundColor: isDark ? colors.backgroundSubtle : '#F8FAFC',
                      borderColor: colors.border,
                    },
                  ]}>
                  <Text style={[styles.delivHeader, { color: colors.text }]}>
                    Deliverable Submitted:
                  </Text>
                  <Text style={[styles.delivUrl, { color: BrandColors.electricBlue }]}>
                    {milestone.deliverable_url}
                  </Text>
                  {milestone.deliverable_notes && (
                    <Text style={[styles.delivNotes, { color: colors.textSecondary }]}>
                      Notes: {milestone.deliverable_notes}
                    </Text>
                  )}
                </View>
              )}

              {/* Client Actions on Submitted Milestone */}
              {isClientOwner && milestone.status === 'submitted' && (
                <View style={styles.milestoneActionRow}>
                  <Button
                    title="Request Revision"
                    variant="outline"
                    size="sm"
                    onPress={() => {
                      setTargetMilestoneId(milestone.id);
                      setRevisionModalOpen(true);
                    }}
                    style={{ flex: 1, marginRight: Spacing.sm }}
                  />
                  <Button
                    title="Approve & Release Funds"
                    variant="primary"
                    size="sm"
                    onPress={() => handleApproveMilestone(milestone.id, milestone.amount)}
                    style={{ flex: 1 }}
                  />
                </View>
              )}

              {/* Freelancer Action: Submit Work */}
              {isAssignedFreelancer &&
                (milestone.status === 'in_progress' ||
                  milestone.status === 'revision_requested') && (
                  <Button
                    title="Submit Deliverable for Review"
                    variant="primary"
                    size="sm"
                    onPress={() => {
                      setTargetMilestoneId(milestone.id);
                      setDeliverableModalOpen(true);
                    }}
                    style={{ marginTop: Spacing.sm }}
                  />
                )}
            </Card>
          ))}
        </View>
      )}

      {/* Proposals Section (Client View) */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.containerTitle, { color: colors.text }]}>
          Submitted Proposals ({projectProposals.length})
        </Text>

        {projectProposals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No proposals submitted yet for this project.
            </Text>
          </Card>
        ) : (
          projectProposals.map((prop) => (
            <Card key={prop.id} style={styles.proposalCard}>
              <View style={styles.proposalHeader}>
                <Avatar url={prop.freelancer_avatar} name={prop.freelancer_name} size="md" />
                <View style={styles.proposalInfo}>
                  <Text style={[styles.freelancerName, { color: colors.text }]}>
                    {prop.freelancer_name}
                  </Text>
                  <Text style={[styles.freelancerHeadline, { color: colors.textSecondary }]}>
                    {prop.freelancer_headline}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.proposalBid, { color: BrandColors.electricBlue }]}>
                    ${prop.proposed_price.toLocaleString()}
                  </Text>
                  <Text style={[styles.proposalDuration, { color: colors.textMuted }]}>
                    in {prop.estimated_duration}
                  </Text>
                </View>
              </View>

              <Text style={[styles.coverLetter, { color: colors.textSecondary }]}>
                "{prop.cover_letter}"
              </Text>

              {/* Actions */}
              <View style={[styles.proposalActionRow, { borderTopColor: colors.border }]}>
                <Button
                  title="Message"
                  variant="secondary"
                  size="sm"
                  onPress={() => handleStartChatWith(prop.freelancer_id)}
                  leftIcon={<Ionicons name="chatbubble-outline" size={14} color={colors.text} />}
                  style={{ flex: 1, marginRight: Spacing.sm }}
                />

                {isClientOwner && prop.status !== 'accepted' && (
                  <Button
                    title="Accept & Fund Escrow"
                    variant="primary"
                    size="sm"
                    onPress={() => handleAcceptProposal(prop)}
                    style={{ flex: 1 }}
                  />
                )}

                {prop.status === 'accepted' && (
                  <Badge label="ACCEPTED & FUNDED" variant="success" size="sm" />
                )}
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Modal: Submit Proposal */}
      <Modal
        visible={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        title="Submit Project Proposal"
        subtitle={`Bidding on: ${project.title}`}>
        <Input
          label="Your Proposed Bid ($ USD)"
          value={bidPrice}
          onChangeText={setBidPrice}
          keyboardType="numeric"
          placeholder="e.g. 5000"
        />

        <Input
          label="Estimated Duration"
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 6 weeks"
        />

        <Input
          label="Proposal Cover Letter & Approach"
          value={coverLetter}
          onChangeText={setCoverLetter}
          multiline
          numberOfLines={5}
          style={{ height: 110, textAlignVertical: 'top' }}
          placeholder="Explain your technical roadmap, milestones, and relevant past projects..."
          helperText="Minimum 20 characters"
        />

        <Button
          title={isSubmittingProposal ? 'Submitting Bid...' : 'Submit Official Proposal'}
          variant="primary"
          size="lg"
          isLoading={isSubmittingProposal}
          onPress={handleSubmitProposalForm}
          fullWidth
          style={{ marginTop: Spacing.md }}
        />
      </Modal>

      {/* Modal: Submit Deliverable */}
      <Modal
        visible={deliverableModalOpen}
        onClose={() => setDeliverableModalOpen(false)}
        title="Submit Milestone Deliverable"
        subtitle="Deliver work for client review">
        <Input
          label="Deliverable Title"
          value={delivTitle}
          onChangeText={setDelivTitle}
          placeholder="e.g. Completed React Native Build v1.0"
        />
        <Input
          label="Code / Staging URL"
          value={delivUrl}
          onChangeText={setDelivUrl}
          placeholder="e.g. https://github.com/... or https://staging..."
        />
        <Input
          label="Submission Notes & Benchmark Results"
          value={delivNotes}
          onChangeText={setDelivNotes}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: 'top' }}
          placeholder="Provide verification notes or test credentials..."
        />
        <Button
          title={isSubmittingDeliv ? 'Submitting...' : 'Submit for Client Approval'}
          variant="primary"
          size="lg"
          isLoading={isSubmittingDeliv}
          onPress={handleSubmitDeliverable}
          fullWidth
          style={{ marginTop: Spacing.md }}
        />
      </Modal>

      {/* Modal: Request Revision */}
      <Modal
        visible={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="Request Deliverable Revision"
        subtitle="Detail required improvements before escrow release">
        <Input
          label="Revision Feedback & Requirements"
          value={revisionFeedback}
          onChangeText={setRevisionFeedback}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
          placeholder="Describe what needs correction or enhancement..."
        />
        <Button
          title="Send Revision Request"
          variant="primary"
          size="lg"
          onPress={handleRequestRevision}
          fullWidth
          style={{ marginTop: Spacing.md }}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectMainCard: {
    marginBottom: Spacing.base,
  },
  categoryPill: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: Spacing.md,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  clientInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
  },
  postedDate: {
    fontSize: 12,
    marginTop: 1,
  },
  metaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  skillPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  freelancerActionBox: {
    marginTop: Spacing.sm,
  },
  alreadySubmittedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  alreadySubmittedText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: Spacing.base,
  },
  containerTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: Spacing.sm,
  },
  milestoneCard: {
    marginBottom: Spacing.sm,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  milestoneDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  milestoneAmount: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  deliverableBox: {
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  delivHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  delivUrl: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  delivNotes: {
    fontSize: 12,
    marginTop: 2,
  },
  milestoneActionRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  emptyCard: {
    padding: Spacing.base,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  proposalCard: {
    marginBottom: Spacing.sm,
  },
  proposalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  proposalInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  freelancerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  freelancerHeadline: {
    fontSize: 11,
    marginTop: 1,
  },
  proposalBid: {
    fontSize: 16,
    fontWeight: '800',
  },
  proposalDuration: {
    fontSize: 11,
  },
  coverLetter: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  proposalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
});
