// ==============================================================================
// LIMO PLATFORM — TYPESCRIPT DOMAIN MODELS & TYPES
// Version: 1.0.0
// Synchronized with Supabase Schema (20261022000000_init_limo_schema.sql)
// ==============================================================================

export type UserRole = 'client' | 'freelancer' | 'admin';

export type AvailabilityStatus = 'available' | 'busy' | 'not_available';

export type ProjectStatus =
  | 'draft'
  | 'open'
  | 'proposal_review'
  | 'in_progress'
  | 'submitted_for_review'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type ProposalStatus =
  | 'submitted'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'revision_requested'
  | 'approved';

export type PaymentStatus =
  | 'pending'
  | 'escrow_funded'
  | 'released'
  | 'refunded'
  | 'failed';

export type PayoutStatus =
  | 'requested'
  | 'processing'
  | 'completed'
  | 'failed';

export type ReportStatus =
  | 'open'
  | 'under_review'
  | 'resolved'
  | 'dismissed';

export type QuoteStatus =
  | 'received'
  | 'in_discussion'
  | 'quoted'
  | 'converted'
  | 'declined';

export interface Profile {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  hourly_rate: number;
  availability_status: AvailabilityStatus;
  location?: string;
  timezone?: string;
  is_verified: boolean;
  is_suspended: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface FreelancerSkill {
  id: string;
  freelancer_id: string;
  skill_name: string;
  years_of_experience: number;
  proficiency_level: 'beginner' | 'intermediate' | 'expert';
  created_at?: string;
}

export interface Portfolio {
  id: string;
  freelancer_id: string;
  title: string;
  description: string;
  project_url?: string;
  image_url?: string;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  client_id: string;
  client_name?: string;
  client_avatar?: string;
  assigned_freelancer_id?: string | null;
  assigned_freelancer_name?: string;
  title: string;
  description: string;
  category: string;
  required_skills: string[];
  budget_min: number;
  budget_max: number;
  budget_type: 'fixed' | 'hourly';
  estimated_timeline: string;
  attachments?: string[];
  status: ProjectStatus;
  is_featured: boolean;
  proposals_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  project_id: string;
  project_title?: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_avatar?: string;
  freelancer_headline?: string;
  freelancer_rating?: number;
  cover_letter: string;
  proposed_price: number;
  estimated_duration: string;
  relevant_skills: string[];
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date?: string;
  amount: number;
  status: MilestoneStatus;
  order_index: number;
  deliverable_url?: string;
  deliverable_notes?: string;
  client_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  milestone_id: string;
  project_id: string;
  freelancer_id: string;
  title: string;
  notes?: string;
  file_url?: string;
  external_url?: string;
  status: 'submitted' | 'approved' | 'revision_requested';
  client_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  project_id?: string;
  project_title?: string;
  participant_ids: string[];
  participant_names: Record<string, string>;
  participant_avatars?: Record<string, string>;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  attachments?: string[];
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  review_type: 'client_to_freelancer' | 'freelancer_to_client';
  created_at: string;
}

export interface AgencyQuoteRequest {
  id: string;
  client_id?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  service_type: string;
  project_scope: string;
  estimated_budget: string;
  target_timeline?: string;
  status: QuoteStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  project_id: string;
  project_title?: string;
  milestone_id?: string;
  payer_id: string;
  payer_name: string;
  payee_id: string;
  payee_name: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  currency: string;
  payment_method: string;
  transaction_reference: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface PayoutRecord {
  id: string;
  freelancer_id: string;
  amount: number;
  payout_method: 'bank_transfer' | 'stripe' | 'paypal' | 'demo_payout';
  status: PayoutStatus;
  reference_id: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'proposal' | 'milestone' | 'message' | 'payment' | 'system';
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface ModerationReport {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  reported_user_id?: string;
  reported_user_name?: string;
  project_id?: string;
  project_title?: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface OTPChallenge {
  phoneNumber: string;
  challengeId: string;
  hashedOtp: string;
  plaintextForDemo?: string; // Revealed only in dev/demo mode for convenience
  expiresAt: number; // Unix timestamp in ms (5 minutes)
  attemptsLeft: number;
  resendCooldownUntil: number; // Unix timestamp in ms (60 seconds)
  isVerified: boolean;
}
