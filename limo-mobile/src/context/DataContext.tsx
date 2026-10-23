// ==============================================================================
// LIMO PLATFORM — DATA & OPERATIONS CONTEXT
// Reactive state store for projects, proposals, milestones, messages, payments
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Project,
  Proposal,
  ProjectMilestone,
  Deliverable,
  Conversation,
  Message,
  PaymentRecord,
  PayoutRecord,
  AgencyQuoteRequest,
  AuditLog,
  Profile,
  ProjectStatus,
  QuoteStatus,
} from '@/types';
import {
  SEED_PROJECTS,
  SEED_PROPOSALS,
  SEED_MILESTONES,
  SEED_DELIVERABLES,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_PAYMENTS,
  SEED_PAYOUTS,
  SEED_AGENCY_QUOTES,
  SEED_AUDIT_LOGS,
  SEED_PROFILES,
} from '@/lib/seed-data';
import { safeStorage, StorageKeys } from '@/lib/storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Data
  projects: Project[];
  proposals: Proposal[];
  milestones: ProjectMilestone[];
  deliverables: Deliverable[];
  conversations: Conversation[];
  messages: Message[];
  payments: PaymentRecord[];
  payouts: PayoutRecord[];
  agencyQuotes: AgencyQuoteRequest[];
  auditLogs: AuditLog[];
  allProfiles: Profile[];
  isLoadingData: boolean;

  // Project operations
  createProject: (
    data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'proposals_count'>
  ) => Promise<Project>;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => Promise<void>;
  getProject: (projectId: string) => Project | undefined;

  // Proposal operations
  getProposalsForProject: (projectId: string) => Proposal[];
  submitProposal: (
    data: Omit<Proposal, 'id' | 'created_at' | 'updated_at' | 'status'>
  ) => Promise<Proposal>;
  acceptProposal: (proposalId: string) => Promise<void>;
  shortlistProposal: (proposalId: string) => Promise<void>;

  // Milestone operations
  getMilestonesForProject: (projectId: string) => ProjectMilestone[];
  submitDeliverable: (
    milestoneId: string,
    title: string,
    fileUrl: string,
    notes: string
  ) => Promise<void>;
  approveMilestone: (milestoneId: string, feedback?: string) => Promise<void>;
  requestMilestoneRevision: (milestoneId: string, feedback: string) => Promise<void>;

  // Messaging operations
  getMessagesForConversation: (convId: string) => Message[];
  sendMessage: (convId: string, content: string) => Promise<void>;
  startConversationWithUser: (targetUserId: string, projectId?: string) => Promise<string>;

  // Payment & Payout operations
  fundProjectEscrow: (projectId: string, amount: number) => Promise<PaymentRecord>;
  requestPayout: (
    freelancerId: string,
    amount: number,
    method: 'bank_transfer' | 'stripe' | 'paypal' | 'demo_payout'
  ) => Promise<PayoutRecord>;

  // Agency Direct Services Quotes
  submitAgencyQuote: (
    quote: Omit<AgencyQuoteRequest, 'id' | 'status' | 'created_at' | 'updated_at'>
  ) => Promise<AgencyQuoteRequest>;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus, adminNotes?: string) => Promise<void>;

  // Admin moderation & dispute resolution
  resolveDispute: (
    projectId: string,
    action: 'release_to_freelancer' | 'refund_to_client',
    notes: string
  ) => Promise<void>;
  toggleUserVerification: (userId: string) => Promise<void>;
  toggleUserSuspension: (userId: string) => Promise<void>;

  // Utility
  resetToFactorySeed: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [proposals, setProposals] = useState<Proposal[]>(SEED_PROPOSALS);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(SEED_MILESTONES);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(SEED_DELIVERABLES);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [payments, setPayments] = useState<PaymentRecord[]>(SEED_PAYMENTS);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(SEED_PAYOUTS);
  const [agencyQuotes, setAgencyQuotes] = useState<AgencyQuoteRequest[]>(SEED_AGENCY_QUOTES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load from safeStorage on mount
  useEffect(() => {
    async function loadData() {
      try {
        const storedProjects = await safeStorage.getItem<Project[]>(
          StorageKeys.PROJECTS_STORE,
          SEED_PROJECTS
        );
        const storedProposals = await safeStorage.getItem<Proposal[]>(
          StorageKeys.PROPOSALS_STORE,
          SEED_PROPOSALS
        );
        const storedMilestones = await safeStorage.getItem<ProjectMilestone[]>(
          StorageKeys.MILESTONES_STORE,
          SEED_MILESTONES
        );
        const storedDeliverables = await safeStorage.getItem<Deliverable[]>(
          StorageKeys.DELIVERABLES_STORE,
          SEED_DELIVERABLES
        );
        const storedConversations = await safeStorage.getItem<Conversation[]>(
          StorageKeys.CONVERSATIONS_STORE,
          SEED_CONVERSATIONS
        );
        const storedMessages = await safeStorage.getItem<Message[]>(
          StorageKeys.MESSAGES_STORE,
          SEED_MESSAGES
        );
        const storedPayments = await safeStorage.getItem<PaymentRecord[]>(
          StorageKeys.PAYMENTS_STORE,
          SEED_PAYMENTS
        );
        const storedPayouts = await safeStorage.getItem<PayoutRecord[]>(
          StorageKeys.PAYOUTS_STORE,
          SEED_PAYOUTS
        );
        const storedQuotes = await safeStorage.getItem<AgencyQuoteRequest[]>(
          StorageKeys.AGENCY_QUOTES_STORE,
          SEED_AGENCY_QUOTES
        );
        const storedLogs = await safeStorage.getItem<AuditLog[]>(
          StorageKeys.AUDIT_LOGS_STORE,
          SEED_AUDIT_LOGS
        );
        const storedProfiles = await safeStorage.getItem<Profile[]>(
          StorageKeys.PROFILES_STORE,
          SEED_PROFILES
        );

        setProjects(storedProjects);
        setProposals(storedProposals);
        setMilestones(storedMilestones);
        setDeliverables(storedDeliverables);
        setConversations(storedConversations);
        setMessages(storedMessages);
        setPayments(storedPayments);
        setPayouts(storedPayouts);
        setAgencyQuotes(storedQuotes);
        setAuditLogs(storedLogs);
        setAllProfiles(storedProfiles);
      } catch (err) {
        console.warn('[DataProvider] Error loading storage:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

  const addAuditLog = async (
    action: string,
    targetType: string,
    targetId: string,
    metadata?: any
  ) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: user?.id,
      actor_name: user?.full_name || 'System Operator',
      action,
      target_type: targetType,
      target_id: targetId,
      metadata,
      ip_address: '192.168.1.104',
      created_at: new Date().toISOString(),
    };
    const next = [newLog, ...auditLogs];
    setAuditLogs(next);
    await safeStorage.setItem(StorageKeys.AUDIT_LOGS_STORE, next);
  };

  // --- Project Operations ---
  const createProject = async (
    data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'proposals_count'>
  ): Promise<Project> => {
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      client_name: user?.full_name || 'Client',
      client_avatar: user?.avatar_url,
      proposals_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const next = [newProject, ...projects];
    setProjects(next);
    await safeStorage.setItem(StorageKeys.PROJECTS_STORE, next);
    await addAuditLog('PROJECT_CREATED', 'projects', newProject.id, {
      title: newProject.title,
      budget: `${newProject.budget_min} - ${newProject.budget_max}`,
    });
    return newProject;
  };

  const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    const next = projects.map((p) =>
      p.id === projectId ? { ...p, status, updated_at: new Date().toISOString() } : p
    );
    setProjects(next);
    await safeStorage.setItem(StorageKeys.PROJECTS_STORE, next);
    await addAuditLog('PROJECT_STATUS_UPDATED', 'projects', projectId, { status });
  };

  const getProject = (projectId: string) => projects.find((p) => p.id === projectId);

  // --- Proposal Operations ---
  const getProposalsForProject = (projectId: string) =>
    proposals.filter((p) => p.project_id === projectId);

  const submitProposal = async (
    data: Omit<Proposal, 'id' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<Proposal> => {
    const newProposal: Proposal = {
      ...data,
      id: `prop-${Date.now()}`,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextProposals = [newProposal, ...proposals];
    setProposals(nextProposals);
    await safeStorage.setItem(StorageKeys.PROPOSALS_STORE, nextProposals);

    // Increment proposals_count on project
    const nextProjects = projects.map((p) =>
      p.id === data.project_id
        ? {
            ...p,
            proposals_count: (p.proposals_count || 0) + 1,
            status: p.status === 'open' ? ('proposal_review' as ProjectStatus) : p.status,
          }
        : p
    );
    setProjects(nextProjects);
    await safeStorage.setItem(StorageKeys.PROJECTS_STORE, nextProjects);

    await addAuditLog('PROPOSAL_SUBMITTED', 'proposals', newProposal.id, {
      projectId: data.project_id,
      proposedPrice: data.proposed_price,
    });
    return newProposal;
  };

  const shortlistProposal = async (proposalId: string) => {
    const next = proposals.map((p) =>
      p.id === proposalId ? { ...p, status: 'shortlisted' as const } : p
    );
    setProposals(next);
    await safeStorage.setItem(StorageKeys.PROPOSALS_STORE, next);
  };

  const acceptProposal = async (proposalId: string) => {
    const targetProp = proposals.find((p) => p.id === proposalId);
    if (!targetProp) return;

    // 1. Mark target proposal accepted, reject others for this project
    const nextProposals = proposals.map((p) => {
      if (p.id === proposalId) return { ...p, status: 'accepted' as const };
      if (p.project_id === targetProp.project_id) return { ...p, status: 'rejected' as const };
      return p;
    });
    setProposals(nextProposals);
    await safeStorage.setItem(StorageKeys.PROPOSALS_STORE, nextProposals);

    // 2. Set project to 'in_progress' and assign freelancer
    const nextProjects = projects.map((p) =>
      p.id === targetProp.project_id
        ? {
            ...p,
            status: 'in_progress' as ProjectStatus,
            assigned_freelancer_id: targetProp.freelancer_id,
            assigned_freelancer_name: targetProp.freelancer_name,
            updated_at: new Date().toISOString(),
          }
        : p
    );
    setProjects(nextProjects);
    await safeStorage.setItem(StorageKeys.PROJECTS_STORE, nextProjects);

    // 3. Initialize milestone
    const initialMilestone: ProjectMilestone = {
      id: `m-${Date.now()}`,
      project_id: targetProp.project_id,
      title: 'Milestone 1: Project Kickoff & Prototype Architecture',
      description: 'Foundational architecture, repository setup, and working prototype.',
      amount: targetProp.proposed_price,
      status: 'in_progress',
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const nextMilestones = [...milestones, initialMilestone];
    setMilestones(nextMilestones);
    await safeStorage.setItem(StorageKeys.MILESTONES_STORE, nextMilestones);

    // 4. Record Escrow Payment
    await fundProjectEscrow(targetProp.project_id, targetProp.proposed_price);

    await addAuditLog('PROPOSAL_ACCEPTED', 'proposals', proposalId, {
      projectId: targetProp.project_id,
      freelancerId: targetProp.freelancer_id,
      price: targetProp.proposed_price,
    });
  };

  // --- Milestone Operations ---
  const getMilestonesForProject = (projectId: string) =>
    milestones.filter((m) => m.project_id === projectId).sort((a, b) => a.order_index - b.order_index);

  const submitDeliverable = async (
    milestoneId: string,
    title: string,
    fileUrl: string,
    notes: string
  ) => {
    const targetMilestone = milestones.find((m) => m.id === milestoneId);
    if (!targetMilestone) return;

    const newDeliverable: Deliverable = {
      id: `deliv-${Date.now()}`,
      milestone_id: milestoneId,
      project_id: targetMilestone.project_id,
      freelancer_id: user?.id || 'freelancer',
      title,
      notes,
      file_url: fileUrl,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextDeliverables = [newDeliverable, ...deliverables];
    setDeliverables(nextDeliverables);
    await safeStorage.setItem(StorageKeys.DELIVERABLES_STORE, nextDeliverables);

    const nextMilestones = milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            status: 'submitted' as const,
            deliverable_url: fileUrl,
            deliverable_notes: notes,
            updated_at: new Date().toISOString(),
          }
        : m
    );
    setMilestones(nextMilestones);
    await safeStorage.setItem(StorageKeys.MILESTONES_STORE, nextMilestones);

    await addAuditLog('DELIVERABLE_SUBMITTED', 'milestones', milestoneId, {
      title,
      fileUrl,
    });
  };

  const approveMilestone = async (milestoneId: string, feedback?: string) => {
    const targetMilestone = milestones.find((m) => m.id === milestoneId);
    if (!targetMilestone) return;

    const nextMilestones = milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            status: 'approved' as const,
            client_feedback: feedback || 'Approved by client.',
            updated_at: new Date().toISOString(),
          }
        : m
    );
    setMilestones(nextMilestones);
    await safeStorage.setItem(StorageKeys.MILESTONES_STORE, nextMilestones);

    // Release Escrow payment
    const nextPayments = payments.map((p) =>
      p.project_id === targetMilestone.project_id && p.status === 'escrow_funded'
        ? { ...p, status: 'released' as const, updated_at: new Date().toISOString() }
        : p
    );
    setPayments(nextPayments);
    await safeStorage.setItem(StorageKeys.PAYMENTS_STORE, nextPayments);

    await addAuditLog('MILESTONE_APPROVED', 'milestones', milestoneId, {
      amount: targetMilestone.amount,
      feedback,
    });
  };

  const requestMilestoneRevision = async (milestoneId: string, feedback: string) => {
    const nextMilestones = milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            status: 'revision_requested' as const,
            client_feedback: feedback,
            updated_at: new Date().toISOString(),
          }
        : m
    );
    setMilestones(nextMilestones);
    await safeStorage.setItem(StorageKeys.MILESTONES_STORE, nextMilestones);
    await addAuditLog('MILESTONE_REVISION_REQUESTED', 'milestones', milestoneId, { feedback });
  };

  // --- Messaging Operations ---
  const getMessagesForConversation = (convId: string) =>
    messages.filter((m) => m.conversation_id === convId);

  const sendMessage = async (convId: string, content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: convId,
      sender_id: user?.id || 'anon',
      sender_name: user?.full_name || 'Member',
      sender_avatar: user?.avatar_url,
      content: content.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const nextMessages = [...messages, newMessage];
    setMessages(nextMessages);
    await safeStorage.setItem(StorageKeys.MESSAGES_STORE, nextMessages);

    // Update conversation last message
    const nextConversations = conversations.map((c) =>
      c.id === convId
        ? {
            ...c,
            last_message: content.trim(),
            last_message_at: newMessage.created_at,
          }
        : c
    );
    setConversations(nextConversations);
    await safeStorage.setItem(StorageKeys.CONVERSATIONS_STORE, nextConversations);
  };

  const startConversationWithUser = async (targetUserId: string, projectId?: string): Promise<string> => {
    const targetProfile = allProfiles.find((p) => p.id === targetUserId);
    const existing = conversations.find(
      (c) =>
        c.participant_ids.includes(user?.id || '') &&
        c.participant_ids.includes(targetUserId) &&
        (!projectId || c.project_id === projectId)
    );

    if (existing) return existing.id;

    const newConvId = `conv-${Date.now()}`;
    const project = projectId ? getProject(projectId) : undefined;

    const newConv: Conversation = {
      id: newConvId,
      project_id: projectId,
      project_title: project?.title,
      participant_ids: [user?.id || 'current-user', targetUserId],
      participant_names: {
        [user?.id || 'current-user']: user?.full_name || 'You',
        [targetUserId]: targetProfile?.full_name || 'Member',
      },
      participant_avatars: {
        [user?.id || 'current-user']: user?.avatar_url || '',
        [targetUserId]: targetProfile?.avatar_url || '',
      },
      last_message: 'Conversation initiated',
      last_message_at: new Date().toISOString(),
      unread_count: 0,
      created_at: new Date().toISOString(),
    };

    const next = [newConv, ...conversations];
    setConversations(next);
    await safeStorage.setItem(StorageKeys.CONVERSATIONS_STORE, next);
    return newConvId;
  };

  // --- Payment & Payout Operations ---
  const fundProjectEscrow = async (projectId: string, amount: number): Promise<PaymentRecord> => {
    const fee = Math.round(amount * 0.1 * 100) / 100; // 10% platform fee
    const net = amount - fee;
    const project = getProject(projectId);

    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      project_id: projectId,
      project_title: project?.title,
      payer_id: user?.id || 'client',
      payer_name: user?.full_name || 'Client',
      payee_id: project?.assigned_freelancer_id || 'freelancer',
      payee_name: project?.assigned_freelancer_name || 'Assigned Specialist',
      amount,
      platform_fee: fee,
      net_amount: net,
      currency: 'USD',
      payment_method: 'sandbox_escrow',
      transaction_reference: `TXN-LIMO-ESCROW-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'escrow_funded',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const next = [newRecord, ...payments];
    setPayments(next);
    await safeStorage.setItem(StorageKeys.PAYMENTS_STORE, next);
    await addAuditLog('ESCROW_FUNDED', 'payment_records', newRecord.id, {
      amount,
      fee,
      net,
      txRef: newRecord.transaction_reference,
    });
    return newRecord;
  };

  const requestPayout = async (
    freelancerId: string,
    amount: number,
    method: 'bank_transfer' | 'stripe' | 'paypal' | 'demo_payout'
  ): Promise<PayoutRecord> => {
    const newPayout: PayoutRecord = {
      id: `po-${Date.now()}`,
      freelancer_id: freelancerId,
      amount,
      payout_method: method,
      status: 'processing',
      reference_id: `PO-${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      admin_notes: 'Automated sandbox payout request received.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const next = [newPayout, ...payouts];
    setPayouts(next);
    await safeStorage.setItem(StorageKeys.PAYOUTS_STORE, next);
    await addAuditLog('PAYOUT_REQUESTED', 'payout_records', newPayout.id, {
      amount,
      method,
      reference: newPayout.reference_id,
    });
    return newPayout;
  };

  // --- Agency Services Quotes ---
  const submitAgencyQuote = async (
    quote: Omit<AgencyQuoteRequest, 'id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<AgencyQuoteRequest> => {
    const newQuote: AgencyQuoteRequest = {
      ...quote,
      id: `quote-${Date.now()}`,
      status: 'received',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const next = [newQuote, ...agencyQuotes];
    setAgencyQuotes(next);
    await safeStorage.setItem(StorageKeys.AGENCY_QUOTES_STORE, next);
    await addAuditLog('AGENCY_QUOTE_REQUESTED', 'quote_requests', newQuote.id, {
      serviceType: quote.service_type,
      budget: quote.estimated_budget,
    });
    return newQuote;
  };

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, adminNotes?: string) => {
    const next = agencyQuotes.map((q) =>
      q.id === quoteId
        ? {
            ...q,
            status,
            admin_notes: adminNotes || q.admin_notes,
            updated_at: new Date().toISOString(),
          }
        : q
    );
    setAgencyQuotes(next);
    await safeStorage.setItem(StorageKeys.AGENCY_QUOTES_STORE, next);
  };

  // --- Admin Moderation & Disputes ---
  const resolveDispute = async (
    projectId: string,
    action: 'release_to_freelancer' | 'refund_to_client',
    notes: string
  ) => {
    const nextPayments = payments.map((p) => {
      if (p.project_id === projectId) {
        return {
          ...p,
          status: action === 'release_to_freelancer' ? ('released' as const) : ('refunded' as const),
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    setPayments(nextPayments);
    await safeStorage.setItem(StorageKeys.PAYMENTS_STORE, nextPayments);

    await updateProjectStatus(projectId, 'completed');
    await addAuditLog('DISPUTE_RESOLVED', 'projects', projectId, { action, notes });
  };

  const toggleUserVerification = async (userId: string) => {
    const next = allProfiles.map((p) =>
      p.id === userId ? { ...p, is_verified: !p.is_verified } : p
    );
    setAllProfiles(next);
    await safeStorage.setItem(StorageKeys.PROFILES_STORE, next);
    await addAuditLog('USER_VERIFICATION_TOGGLED', 'profiles', userId);
  };

  const toggleUserSuspension = async (userId: string) => {
    const next = allProfiles.map((p) =>
      p.id === userId ? { ...p, is_suspended: !p.is_suspended } : p
    );
    setAllProfiles(next);
    await safeStorage.setItem(StorageKeys.PROFILES_STORE, next);
    await addAuditLog('USER_SUSPENSION_TOGGLED', 'profiles', userId);
  };

  // --- Reset to Seed ---
  const resetToFactorySeed = async () => {
    await safeStorage.clearPlatformState();
    setProjects(SEED_PROJECTS);
    setProposals(SEED_PROPOSALS);
    setMilestones(SEED_MILESTONES);
    setDeliverables(SEED_DELIVERABLES);
    setConversations(SEED_CONVERSATIONS);
    setMessages(SEED_MESSAGES);
    setPayments(SEED_PAYMENTS);
    setPayouts(SEED_PAYOUTS);
    setAgencyQuotes(SEED_AGENCY_QUOTES);
    setAuditLogs(SEED_AUDIT_LOGS);
    setAllProfiles(SEED_PROFILES);
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        proposals,
        milestones,
        deliverables,
        conversations,
        messages,
        payments,
        payouts,
        agencyQuotes,
        auditLogs,
        allProfiles,
        isLoadingData,
        createProject,
        updateProjectStatus,
        getProject,
        getProposalsForProject,
        submitProposal,
        acceptProposal,
        shortlistProposal,
        getMilestonesForProject,
        submitDeliverable,
        approveMilestone,
        requestMilestoneRevision,
        getMessagesForConversation,
        sendMessage,
        startConversationWithUser,
        fundProjectEscrow,
        requestPayout,
        submitAgencyQuote,
        updateQuoteStatus,
        resolveDispute,
        toggleUserVerification,
        toggleUserSuspension,
        resetToFactorySeed,
      }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
