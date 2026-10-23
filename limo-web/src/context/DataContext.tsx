'use client';

// ==============================================================================
// LIMO PLATFORM — DATA CONTEXT & STATE ENGINE
// Covers Projects, Proposals, Milestones, Messaging, Payments & Moderation
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Project,
  Proposal,
  ProjectMilestone,
  Deliverable,
  Conversation,
  Message,
  Review,
  PaymentRecord,
  AgencyQuoteRequest,
  AuditLog,
  Profile,
  FreelancerSkill,
  Portfolio,
} from '@/types';
import {
  SEED_PROJECTS,
  SEED_PROPOSALS,
  SEED_MILESTONES,
  SEED_DELIVERABLES,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_REVIEWS,
  SEED_PAYMENTS,
  SEED_AGENCY_QUOTES,
  SEED_AUDIT_LOGS,
  SEED_PROFILES,
  SEED_SKILLS,
  SEED_PORTFOLIOS,
} from '@/lib/seed-data';
import { useAuth } from './AuthContext';

interface DataContextType {
  projects: Project[];
  proposals: Proposal[];
  milestones: ProjectMilestone[];
  deliverables: Deliverable[];
  conversations: Conversation[];
  messages: Message[];
  reviews: Review[];
  payments: PaymentRecord[];
  quoteRequests: AgencyQuoteRequest[];
  auditLogs: AuditLog[];
  profiles: Profile[];
  skills: FreelancerSkill[];
  portfolios: Portfolio[];

  // Project operations
  createProject: (newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Project;
  updateProjectStatus: (projectId: string, newStatus: Project['status']) => void;

  // Proposal operations
  submitProposal: (proposalData: Omit<Proposal, 'id' | 'created_at' | 'updated_at' | 'status'>) => Proposal;
  updateProposalStatus: (proposalId: string, status: Proposal['status']) => void;
  acceptProposal: (proposalId: string) => void;

  // Milestone & Deliverable operations
  submitDeliverable: (milestoneId: string, title: string, fileUrl?: string, notes?: string) => void;
  reviewDeliverable: (milestoneId: string, approved: boolean, feedback?: string) => void;

  // Quote request operations
  submitQuoteRequest: (quote: Omit<AgencyQuoteRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => AgencyQuoteRequest;
  updateQuoteStatus: (quoteId: string, status: AgencyQuoteRequest['status']) => void;

  // Payment operations
  fundMilestoneEscrow: (milestoneId: string, amount: number) => void;
  releaseMilestonePayment: (milestoneId: string) => void;

  // Messaging operations
  sendMessage: (conversationId: string, content: string, attachments?: string[]) => Message;
  startOrGetConversation: (recipientId: string, projectId?: string) => Conversation;

  // Admin moderation operations
  toggleUserSuspension: (userId: string) => void;
  toggleUserVerification: (userId: string) => void;
  resolveDispute: (projectId: string, resolution: 'refund_client' | 'release_freelancer') => void;
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
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [payments, setPayments] = useState<PaymentRecord[]>(SEED_PAYMENTS);
  const [quoteRequests, setQuoteRequests] = useState<AgencyQuoteRequest[]>(SEED_AGENCY_QUOTES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [skills] = useState<FreelancerSkill[]>(SEED_SKILLS);
  const [portfolios] = useState<Portfolio[]>(SEED_PORTFOLIOS);

  // Load from local storage if available
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('limo_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedProposals = localStorage.getItem('limo_proposals');
      if (savedProposals) setProposals(JSON.parse(savedProposals));

      const savedPayments = localStorage.getItem('limo_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedQuotes = localStorage.getItem('limo_quotes');
      if (savedQuotes) setQuoteRequests(JSON.parse(savedQuotes));
    } catch (e) {
      console.warn('[DataContext] Local storage hydration warning:', e);
    }
  }, []);

  const syncProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem('limo_projects', JSON.stringify(updated));
  };

  const syncProposals = (updated: Proposal[]) => {
    setProposals(updated);
    localStorage.setItem('limo_proposals', JSON.stringify(updated));
  };

  const syncPayments = (updated: PaymentRecord[]) => {
    setPayments(updated);
    localStorage.setItem('limo_payments', JSON.stringify(updated));
  };

  const syncQuotes = (updated: AgencyQuoteRequest[]) => {
    setQuoteRequests(updated);
    localStorage.setItem('limo_quotes', JSON.stringify(updated));
  };

  // 1. Create Project
  const createProject = (newProjectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project => {
    const id = `prj_${Date.now()}`;
    const now = new Date().toISOString();
    const created: Project = {
      ...newProjectData,
      id,
      client_name: user?.full_name || 'Sarah Jenkins',
      client_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
      proposals_count: 0,
      created_at: now,
      updated_at: now,
    };

    const updated = [created, ...projects];
    syncProjects(updated);
    return created;
  };

  // 2. Update Project Status
  const updateProjectStatus = (projectId: string, newStatus: Project['status']) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p
    );
    syncProjects(updated);
  };

  // 3. Submit Proposal
  const submitProposal = (proposalData: Omit<Proposal, 'id' | 'created_at' | 'updated_at' | 'status'>): Proposal => {
    const id = `pr_${Date.now()}`;
    const now = new Date().toISOString();
    const created: Proposal = {
      ...proposalData,
      id,
      freelancer_name: user?.full_name || proposalData.freelancer_name,
      freelancer_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      freelancer_headline: user?.headline || 'Senior Specialist',
      freelancer_rating: 5.0,
      status: 'submitted',
      created_at: now,
      updated_at: now,
    };

    const updatedProposals = [created, ...proposals];
    syncProposals(updatedProposals);

    // Increment proposal count on project
    const updatedProjects = projects.map((p) =>
      p.id === proposalData.project_id ? { ...p, proposals_count: (p.proposals_count || 0) + 1 } : p
    );
    syncProjects(updatedProjects);

    return created;
  };

  // 4. Update Proposal Status
  const updateProposalStatus = (proposalId: string, status: Proposal['status']) => {
    const updated = proposals.map((p) =>
      p.id === proposalId ? { ...p, status, updated_at: new Date().toISOString() } : p
    );
    syncProposals(updated);
  };

  // 5. Accept Proposal (Transactional workflow: assigns freelancer, changes project status to in_progress)
  const acceptProposal = (proposalId: string) => {
    const targetProposal = proposals.find((p) => p.id === proposalId);
    if (!targetProposal) return;

    // Mark accepted proposal as accepted, others for same project as rejected
    const updatedProposals = proposals.map((p) => {
      if (p.id === proposalId) return { ...p, status: 'accepted' as const, updated_at: new Date().toISOString() };
      if (p.project_id === targetProposal.project_id && p.status === 'submitted') {
        return { ...p, status: 'rejected' as const, updated_at: new Date().toISOString() };
      }
      return p;
    });
    syncProposals(updatedProposals);

    // Update project
    const updatedProjects = projects.map((p) => {
      if (p.id === targetProposal.project_id) {
        return {
          ...p,
          assigned_freelancer_id: targetProposal.freelancer_id,
          assigned_freelancer_name: targetProposal.freelancer_name,
          status: 'in_progress' as const,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    syncProjects(updatedProjects);

    // Ensure conversation exists between client and freelancer
    startOrGetConversation(targetProposal.freelancer_id, targetProposal.project_id);
  };

  // 6. Submit Deliverable
  const submitDeliverable = (milestoneId: string, title: string, fileUrl?: string, notes?: string) => {
    const targetMilestone = milestones.find((m) => m.id === milestoneId);
    if (!targetMilestone) return;

    const newDeliverable: Deliverable = {
      id: `del_${Date.now()}`,
      milestone_id: milestoneId,
      project_id: targetMilestone.project_id,
      freelancer_id: user?.id || 'f0000000-0000-0000-0000-000000000001',
      title,
      file_url: fileUrl,
      notes,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDeliverables((prev) => [newDeliverable, ...prev]);

    // Update milestone status
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: 'submitted',
              deliverable_url: fileUrl,
              deliverable_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : m
      )
    );
  };

  // 7. Review Deliverable
  const reviewDeliverable = (milestoneId: string, approved: boolean, feedback?: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: approved ? 'approved' : 'revision_requested',
              client_feedback: feedback,
              updated_at: new Date().toISOString(),
            }
          : m
      )
    );

    if (approved) {
      releaseMilestonePayment(milestoneId);
    }
  };

  // 8. Submit Quote Request
  const submitQuoteRequest = (quoteData: Omit<AgencyQuoteRequest, 'id' | 'created_at' | 'updated_at' | 'status'>): AgencyQuoteRequest => {
    const id = `quote_${Date.now()}`;
    const now = new Date().toISOString();
    const created: AgencyQuoteRequest = {
      ...quoteData,
      id,
      status: 'received',
      created_at: now,
      updated_at: now,
    };
    const updated = [created, ...quoteRequests];
    syncQuotes(updated);
    return created;
  };

  // 9. Update Quote Status
  const updateQuoteStatus = (quoteId: string, status: AgencyQuoteRequest['status']) => {
    const updated = quoteRequests.map((q) =>
      q.id === quoteId ? { ...q, status, updated_at: new Date().toISOString() } : q
    );
    syncQuotes(updated);
  };

  // 10. Fund Milestone Escrow
  const fundMilestoneEscrow = (milestoneId: string, amount: number) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const project = projects.find((p) => p.id === milestone.project_id);
    const platformFee = Number((amount * 0.1).toFixed(2));
    const netAmount = Number((amount - platformFee).toFixed(2));

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      project_id: milestone.project_id,
      project_title: project?.title,
      milestone_id: milestoneId,
      payer_id: user?.id || 'c0000000-0000-0000-0000-000000000001',
      payer_name: user?.full_name || 'Sarah Jenkins',
      payee_id: project?.assigned_freelancer_id || 'f0000000-0000-0000-0000-000000000001',
      payee_name: project?.assigned_freelancer_name || 'Alex Rivera',
      amount,
      platform_fee: platformFee,
      net_amount: netAmount,
      currency: 'USD',
      payment_method: 'sandbox_escrow',
      transaction_reference: `TXN-LIMO-${Date.now().toString().slice(-6)}`,
      status: 'escrow_funded',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newPayment, ...payments];
    syncPayments(updated);
  };

  // 11. Release Milestone Payment
  const releaseMilestonePayment = (milestoneId: string) => {
    const updated = payments.map((p) =>
      p.milestone_id === milestoneId ? { ...p, status: 'released' as const, updated_at: new Date().toISOString() } : p
    );
    syncPayments(updated);
  };

  // 12. Send Message
  const sendMessage = (conversationId: string, content: string, attachments?: string[]): Message => {
    const id = `msg_${Date.now()}`;
    const now = new Date().toISOString();
    const created: Message = {
      id,
      conversation_id: conversationId,
      sender_id: user?.id || 'c0000000-0000-0000-0000-000000000001',
      sender_name: user?.full_name || 'Member',
      sender_avatar: user?.avatar_url,
      content,
      attachments,
      is_read: true,
      created_at: now,
    };

    setMessages((prev) => [...prev, created]);

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message: content,
              last_message_at: now,
            }
          : c
      )
    );

    return created;
  };

  // 13. Start or Get Conversation
  const startOrGetConversation = (recipientId: string, projectId?: string): Conversation => {
    const existing = conversations.find(
      (c) =>
        c.participant_ids.includes(recipientId) &&
        (projectId ? c.project_id === projectId : true)
    );

    if (existing) return existing;

    const recipient = profiles.find((p) => p.id === recipientId);
    const id = `conv_${Date.now()}`;
    const currentUserId = user?.id || 'c0000000-0000-0000-0000-000000000001';

    const newConv: Conversation = {
      id,
      project_id: projectId,
      participant_ids: [currentUserId, recipientId],
      participant_names: {
        [currentUserId]: user?.full_name || 'Client',
        [recipientId]: recipient?.full_name || 'Specialist',
      },
      participant_avatars: {
        [currentUserId]: user?.avatar_url || '',
        [recipientId]: recipient?.avatar_url || '',
      },
      last_message: 'Started conversation',
      last_message_at: new Date().toISOString(),
      unread_count: 0,
      created_at: new Date().toISOString(),
    };

    setConversations((prev) => [newConv, ...prev]);
    return newConv;
  };

  // 14. Admin Moderation Actions
  const toggleUserSuspension = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, is_suspended: !p.is_suspended } : p))
    );
  };

  const toggleUserVerification = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, is_verified: !p.is_verified } : p))
    );
  };

  const resolveDispute = (projectId: string, resolution: 'refund_client' | 'release_freelancer') => {
    updateProjectStatus(projectId, resolution === 'refund_client' ? 'cancelled' : 'completed');
    setPayments((prev) =>
      prev.map((p) =>
        p.project_id === projectId
          ? {
              ...p,
              status: resolution === 'refund_client' ? 'refunded' : 'released',
              updated_at: new Date().toISOString(),
            }
          : p
      )
    );
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
        reviews,
        payments,
        quoteRequests,
        auditLogs,
        profiles,
        skills,
        portfolios,
        createProject,
        updateProjectStatus,
        submitProposal,
        updateProposalStatus,
        acceptProposal,
        submitDeliverable,
        reviewDeliverable,
        submitQuoteRequest,
        updateQuoteStatus,
        fundMilestoneEscrow,
        releaseMilestonePayment,
        sendMessage,
        startOrGetConversation,
        toggleUserSuspension,
        toggleUserVerification,
        resolveDispute,
      }}
    >
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
