-- ==============================================================================
-- LIMO PLATFORM — INITIAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Version: 1.0.0
-- Architecture: PostgreSQL + Supabase Auth
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('client', 'freelancer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status_type AS ENUM (
        'draft',
        'open',
        'proposal_review',
        'in_progress',
        'submitted_for_review',
        'completed',
        'cancelled',
        'disputed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status_type AS ENUM (
        'submitted',
        'shortlisted',
        'accepted',
        'rejected',
        'withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status_type AS ENUM (
        'pending',
        'in_progress',
        'submitted',
        'revision_requested',
        'approved'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM (
        'pending',
        'escrow_funded',
        'released',
        'refunded',
        'failed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status_type AS ENUM (
        'requested',
        'processing',
        'completed',
        'failed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status_type AS ENUM (
        'open',
        'under_review',
        'resolved',
        'dismissed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. CORE TABLES
-- ------------------------------------------------------------------------------

-- 2.1 Profiles (linked to auth.users or standalone UUIDs)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    headline TEXT,
    bio TEXT,
    hourly_rate NUMERIC(10, 2) DEFAULT 0.00 CHECK (hourly_rate >= 0),
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'not_available')),
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    is_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 2.3 Freelancer Skills
CREATE TABLE IF NOT EXISTS public.freelancer_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    years_of_experience INT DEFAULT 1 CHECK (years_of_experience >= 0),
    proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (freelancer_id, skill_name)
);

-- 2.4 Portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    project_url TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    assigned_freelancer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) >= 5),
    description TEXT NOT NULL CHECK (char_length(description) >= 20),
    category TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    budget_min NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (budget_min >= 0),
    budget_max NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (budget_max >= budget_min),
    budget_type TEXT DEFAULT 'fixed' CHECK (budget_type IN ('fixed', 'hourly')),
    estimated_timeline TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::JSONB,
    status project_status_type NOT NULL DEFAULT 'open',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Proposals
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL CHECK (char_length(cover_letter) >= 20),
    proposed_price NUMERIC(10, 2) NOT NULL CHECK (proposed_price > 0),
    estimated_duration TEXT NOT NULL,
    relevant_skills TEXT[] DEFAULT '{}',
    status proposal_status_type NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, freelancer_id)
);

-- 2.7 Project Milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
    status milestone_status_type NOT NULL DEFAULT 'pending',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Deliverables
CREATE TABLE IF NOT EXISTS public.deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID NOT NULL REFERENCES public.project_milestones(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    file_url TEXT,
    external_url TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'revision_requested')),
    client_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.9 Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 Conversation Participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (conversation_id, user_id)
);

-- 2.11 Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.12 Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT NOT NULL CHECK (char_length(comment) >= 10),
    review_type TEXT NOT NULL CHECK (review_type IN ('client_to_freelancer', 'freelancer_to_client')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, reviewer_id, reviewee_id)
);

-- 2.13 LIMO Agency Direct Quote Requests
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    service_type TEXT NOT NULL,
    project_scope TEXT NOT NULL,
    estimated_budget TEXT NOT NULL,
    target_timeline TEXT,
    status TEXT DEFAULT 'received' CHECK (status IN ('received', 'in_discussion', 'quoted', 'converted', 'declined')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.14 Payment Records (Sandbox & Real Payment Ledger)
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
    milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL,
    payer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    payee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (platform_fee >= 0),
    net_amount NUMERIC(10, 2) NOT NULL CHECK (net_amount >= 0),
    currency TEXT DEFAULT 'USD',
    payment_method TEXT DEFAULT 'sandbox_escrow',
    transaction_reference TEXT UNIQUE NOT NULL,
    status payment_status_type NOT NULL DEFAULT 'pending',
    provider_payload JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.15 Payout Records
CREATE TABLE IF NOT EXISTS public.payout_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payout_method TEXT NOT NULL CHECK (payout_method IN ('bank_transfer', 'stripe', 'paypal', 'demo_payout')),
    status payout_status_type NOT NULL DEFAULT 'requested',
    reference_id TEXT UNIQUE NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.16 Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.17 Moderation Reports
CREATE TABLE IF NOT EXISTS public.moderation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status report_status_type NOT NULL DEFAULT 'open',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.18 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE & RELIABILITY
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_freelancer ON public.projects(assigned_freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON public.proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON public.proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON public.payment_records(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payment_records(status);

-- ------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS FOR PERMISSIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_id_param AND role = 'admin' AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated at timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers
CREATE OR REPLACE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_milestones_updated_at
BEFORE UPDATE ON public.project_milestones
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_payments_updated_at
BEFORE UPDATE ON public.payment_records
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles: Public viewable, owner editable
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- 5.2 User Roles: Viewable by user or admin, mutable only by admin
CREATE POLICY "User can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admin can manage all roles"
ON public.user_roles FOR ALL
USING (public.is_admin(auth.uid()));

-- 5.3 Freelancer Skills & Portfolios: Public viewable, owner editable
CREATE POLICY "Skills viewable by all"
ON public.freelancer_skills FOR SELECT
USING (true);

CREATE POLICY "Skills manageable by owner"
ON public.freelancer_skills FOR ALL
USING (auth.uid() = freelancer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Portfolios viewable by all"
ON public.portfolios FOR SELECT
USING (true);

CREATE POLICY "Portfolios manageable by owner"
ON public.portfolios FOR ALL
USING (auth.uid() = freelancer_id OR public.is_admin(auth.uid()));

-- 5.4 Projects: Open projects public, drafts/private visible to owner/admin
CREATE POLICY "Projects viewable if open or by owner/admin"
ON public.projects FOR SELECT
USING (
    status NOT IN ('draft')
    OR auth.uid() = client_id
    OR auth.uid() = assigned_freelancer_id
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Clients can create projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = client_id OR public.is_admin(auth.uid()));

CREATE POLICY "Clients can update own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = client_id OR public.is_admin(auth.uid()));

-- 5.5 Proposals: Client sees project proposals, Freelancer sees own proposals
CREATE POLICY "Proposals viewable by project client, freelancer, or admin"
ON public.proposals FOR SELECT
USING (
    auth.uid() = freelancer_id
    OR auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Freelancers can insert proposals"
ON public.proposals FOR INSERT
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can update own proposal if submitted"
ON public.proposals FOR UPDATE
USING (
    (auth.uid() = freelancer_id AND status = 'submitted')
    OR auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
    OR public.is_admin(auth.uid())
);

-- 5.6 Milestones & Deliverables: Project participants only
CREATE POLICY "Milestones viewable by project participants"
ON public.project_milestones FOR SELECT
USING (
    auth.uid() IN (
        SELECT client_id FROM public.projects WHERE id = project_id
        UNION
        SELECT assigned_freelancer_id FROM public.projects WHERE id = project_id
    )
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Milestones editable by client or admin"
ON public.project_milestones FOR ALL
USING (
    auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Deliverables viewable by participants"
ON public.deliverables FOR SELECT
USING (
    auth.uid() = freelancer_id
    OR auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Deliverables manageable by freelancer"
ON public.deliverables FOR INSERT
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Deliverables updateable by client or freelancer"
ON public.deliverables FOR UPDATE
USING (
    auth.uid() = freelancer_id
    OR auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
    OR public.is_admin(auth.uid())
);

-- 5.7 Conversations & Messages: Participants ONLY
CREATE POLICY "Conversations viewable by participants"
ON public.conversations FOR SELECT
USING (
    id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Messages viewable by conversation participants"
ON public.messages FOR SELECT
USING (
    conversation_id IN (
        SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Messages insertable by conversation participants"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND conversation_id IN (
        SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
    )
);

-- 5.8 Payments & Payouts: Involved parties or admin
CREATE POLICY "Payment records viewable by payer, payee, or admin"
ON public.payment_records FOR SELECT
USING (
    auth.uid() = payer_id
    OR auth.uid() = payee_id
    OR public.is_admin(auth.uid())
);

CREATE POLICY "Payout records viewable by freelancer or admin"
ON public.payout_records FOR SELECT
USING (
    auth.uid() = freelancer_id
    OR public.is_admin(auth.uid())
);

-- 5.9 Notifications: Owner only
CREATE POLICY "Notifications viewable and manageable by recipient"
ON public.notifications FOR ALL
USING (auth.uid() = user_id);

-- 5.10 Moderation & Audit Logs: Admin only
CREATE POLICY "Reports insertable by reporter, viewable by admin"
ON public.moderation_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reports viewable and manageable by admin"
ON public.moderation_reports FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Audit logs viewable only by admin"
ON public.audit_logs FOR SELECT
USING (public.is_admin(auth.uid()));

-- End of schema definition
