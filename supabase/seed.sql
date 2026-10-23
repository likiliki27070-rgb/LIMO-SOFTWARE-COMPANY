-- ==============================================================================
-- LIMO PLATFORM — REALISTIC SEED DATA FOR LOCAL DEVELOPMENT & DEMO
-- ==============================================================================

-- 1. Insert Profiles
INSERT INTO public.profiles (id, email, phone, full_name, avatar_url, headline, bio, hourly_rate, availability_status, location, timezone, is_verified)
VALUES
    -- Admin
    ('a0000000-0000-0000-0000-000000000001', 'admin@limo.dev', '+15550000001', 'LIMO Super Admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Chief Technology & Moderation Officer', 'Overseeing LIMO platform integrity, client engagements, and security.', 0.00, 'available', 'San Francisco, CA', 'America/Los_Angeles', true),
    
    -- Clients
    ('c0000000-0000-0000-0000-000000000001', 'sarah.jenkins@apextech.io', '+15551110001', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Founder & VP of Product at Apex Tech', 'Leading next-gen SaaS products and scaling high-velocity engineering squads.', 0.00, 'available', 'Austin, TX', 'America/Chicago', true),
    ('c0000000-0000-0000-0000-000000000002', 'marcus.vance@vancelogistics.com', '+15551110002', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Chief Operating Officer at Vance Global', 'Scaling enterprise logistics and supply chain software solutions.', 0.00, 'available', 'Chicago, IL', 'America/Chicago', true),
    
    -- Freelancers
    ('f0000000-0000-0000-0000-000000000001', 'alex.rivera@devcore.io', '+15552220001', 'Alex Rivera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Senior Full-Stack & AI Systems Architect', '10+ years engineering high-scale distributed web applications, Next.js, TypeScript, and LLM integrations. Top 1% vetted specialist.', 95.00, 'available', 'Seattle, WA', 'America/Los_Angeles', true),
    ('f0000000-0000-0000-0000-000000000002', 'elena.rostova@designlab.co', '+15552220002', 'Elena Rostova', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Principal UI/UX Designer & Design System Lead', 'Crafting world-class mobile and web product experiences with sleek aesthetics, micro-interactions, and high conversion design.', 85.00, 'available', 'New York, NY', 'America/New_York', true),
    ('f0000000-0000-0000-0000-000000000003', 'david.chen@mobileworks.dev', '+15552220003', 'David Chen', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Cross-Platform Mobile Engineer (React Native / Expo)', 'Specialist in 60fps buttery-smooth iOS & Android applications with offline-first sync and biometric security.', 90.00, 'busy', 'Toronto, Canada', 'America/Toronto', true)
ON CONFLICT (id) DO NOTHING;

-- 2. User Roles
INSERT INTO public.user_roles (user_id, role)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin'),
    ('c0000000-0000-0000-0000-000000000001', 'client'),
    ('c0000000-0000-0000-0000-000000000002', 'client'),
    ('f0000000-0000-0000-0000-000000000001', 'freelancer'),
    ('f0000000-0000-0000-0000-000000000002', 'freelancer'),
    ('f0000000-0000-0000-0000-000000000003', 'freelancer')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Freelancer Skills
INSERT INTO public.freelancer_skills (freelancer_id, skill_name, years_of_experience, proficiency_level)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'Next.js', 6, 'expert'),
    ('f0000000-0000-0000-0000-000000000001', 'TypeScript', 8, 'expert'),
    ('f0000000-0000-0000-0000-000000000001', 'PostgreSQL', 7, 'expert'),
    ('f0000000-0000-0000-0000-000000000001', 'AI & LLM Integration', 3, 'expert'),
    ('f0000000-0000-0000-0000-000000000002', 'UI/UX Design', 9, 'expert'),
    ('f0000000-0000-0000-0000-000000000002', 'Design Systems', 7, 'expert'),
    ('f0000000-0000-0000-0000-000000000002', 'Figma', 8, 'expert'),
    ('f0000000-0000-0000-0000-000000000003', 'React Native', 6, 'expert'),
    ('f0000000-0000-0000-0000-000000000003', 'Expo', 5, 'expert'),
    ('f0000000-0000-0000-0000-000000000003', 'iOS / Android Native', 7, 'expert')
ON CONFLICT DO NOTHING;

-- 4. Portfolios
INSERT INTO public.portfolios (id, freelancer_id, title, description, project_url, image_url, tags)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Krypton AI Financial Terminal', 'Real-time financial analytics workstation with sub-millisecond websocket updates and custom LLM summarization pipeline.', 'https://github.com/example/krypton', 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600', ARRAY['Next.js', 'PostgreSQL', 'AI', 'WebSockets']),
    ('p0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'Aura Health Design System', 'Comprehensive multi-brand design system with over 200+ accessible tokens, WCAG AAA contrast, and interactive documentation.', 'https://figma.com/@aura-health', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600', ARRAY['Figma', 'UI/UX', 'Design Systems']),
    ('p0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'PulseFit Mobile Companion', 'React Native fitness application featuring background health kit integration, workout tracking, and push notifications.', 'https://apps.apple.com/app/pulsefit', 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600', ARRAY['React Native', 'Expo', 'Mobile', 'iOS', 'Android'])
ON CONFLICT DO NOTHING;

-- 5. Projects
INSERT INTO public.projects (id, client_id, assigned_freelancer_id, title, description, category, required_skills, budget_min, budget_max, budget_type, estimated_timeline, status, is_featured)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        NULL,
        'Next-Gen Fintech Analytics & Trading Dashboard',
        'We require an exceptional senior full-stack engineer to build a high-performance web dashboard displaying real-time portfolio tracking, multi-asset charts, automated tax calculations, and exportable audit reports. Clean modular architecture and strict data encryption are mandatory.',
        'Web Applications',
        ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Highcharts'],
        4500.00,
        7500.00,
        'fixed',
        '6 weeks',
        'open',
        true
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000001',
        NULL,
        'Cross-Platform Telehealth Mobile Application',
        'Looking for a mobile engineer experienced with React Native and Expo to architect our HIPAA-compliant patient consultation app. Must feature secure video calling, appointment scheduling, and offline-accessible medical records.',
        'Mobile Applications',
        ARRAY['React Native', 'Expo', 'TypeScript', 'WebRTC', 'iOS', 'Android'],
        6000.00,
        10000.00,
        'fixed',
        '8 weeks',
        'proposal_review',
        true
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000001',
        'Enterprise Supply Chain Route Optimization Engine',
        'Active development of an automated routing platform for 500+ commercial freight vehicles. Integrating real-time GPS coordinates, predictive traffic telemetry, and dynamic driver dispatch.',
        'AI Integration',
        ARRAY['PostgreSQL', 'AI & LLM Integration', 'TypeScript', 'Node.js'],
        8500.00,
        12000.00,
        'fixed',
        '10 weeks',
        'in_progress',
        false
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000002',
        'Luxury E-Commerce Brand Redesign & Web Platform',
        'Complete brand identity overhaul and high-converting storefront with interactive 3D product previews and frictionless checkout flow.',
        'UI/UX Design',
        ARRAY['Figma', 'UI/UX Design', 'Design Systems', 'Next.js'],
        5000.00,
        5000.00,
        'fixed',
        '4 weeks',
        'completed',
        false
    )
ON CONFLICT DO NOTHING;

-- 6. Proposals
INSERT INTO public.proposals (id, project_id, freelancer_id, cover_letter, proposed_price, estimated_duration, relevant_skills, status)
VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000001',
        'Hi Sarah, I reviewed your Fintech analytics specification in detail. Having engineered high-throughput trading tools at scale, I can implement your analytics dashboard with optimistic client state, sub-second queries, and bank-grade data security. My portfolio includes similar live platforms.',
        5800.00,
        '5 weeks',
        ARRAY['Next.js', 'TypeScript', 'PostgreSQL'],
        'submitted'
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000003',
        'Hello! I specialize in production Expo and React Native applications with native performance. I have built telemedicine video consultation modules with end-to-end encryption. I would love to walk you through our architectural plan.',
        7800.00,
        '7 weeks',
        ARRAY['React Native', 'Expo', 'iOS', 'Android'],
        'shortlisted'
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000003',
        'f0000000-0000-0000-0000-000000000001',
        'Proposal accepted for route optimization engine. Building algorithmic dispatch and real-time maps.',
        10000.00,
        '10 weeks',
        ARRAY['AI Integration', 'PostgreSQL', 'TypeScript'],
        'accepted'
    ),
    (
        '20000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000004',
        'f0000000-0000-0000-0000-000000000002',
        'Delivered the luxury e-commerce brand assets and responsive prototype.',
        5000.00,
        '4 weeks',
        ARRAY['UI/UX Design', 'Figma'],
        'accepted'
    )
ON CONFLICT DO NOTHING;

-- 7. Milestones
INSERT INTO public.project_milestones (id, project_id, title, description, due_date, amount, status, order_index)
VALUES
    (
        '30000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000003',
        'Milestone 1: Core Geo-routing & Database Architecture',
        'Schema setup, spatial queries, and real-time ingest pipeline.',
        NOW() + INTERVAL '14 days',
        3500.00,
        'approved',
        1
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000003',
        'Milestone 2: AI Dispatch Optimization Algorithm',
        'Heuristic scheduling and dynamic route recalculation engine.',
        NOW() + INTERVAL '30 days',
        4000.00,
        'in_progress',
        2
    ),
    (
        '30000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000003',
        'Milestone 3: Driver Telemetry Mobile App & Fleet Portal',
        'Live tracking portal, telemetry export, and deployment.',
        NOW() + INTERVAL '50 days',
        2500.00,
        'pending',
        3
    )
ON CONFLICT DO NOTHING;

-- 8. Deliverables
INSERT INTO public.deliverables (id, milestone_id, project_id, freelancer_id, title, notes, external_url, status, client_feedback)
VALUES
    (
        '40000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000003',
        'f0000000-0000-0000-0000-000000000001',
        'Geo-routing Engine v1.0 Release',
        'Completed spatial indexing, test suite with 98% coverage, and benchmark report demonstrating 45ms average routing time.',
        'https://github.com/vancelogistics/routing-engine/releases/tag/v1.0',
        'approved',
        'Outstanding execution! The benchmark results exceeded our initial targets.'
    )
ON CONFLICT DO NOTHING;

-- 9. Conversations & Messages
INSERT INTO public.conversations (id, project_id, title)
VALUES
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Supply Chain Routing Project Chat')
ON CONFLICT DO NOTHING;

INSERT INTO public.conversation_participants (conversation_id, user_id)
VALUES
    ('50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'),
    ('50000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO public.messages (conversation_id, sender_id, content, is_read, created_at)
VALUES
    ('50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Hi Alex, welcome aboard! Milestone 1 is funded in escrow. Let us know when the schema PR is ready.', true, NOW() - INTERVAL '5 days'),
    ('50000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Thank you Marcus! The schema is verified and benchmarked. I have submitted the deliverable for Milestone 1.', true, NOW() - INTERVAL '2 days'),
    ('50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Reviewed and approved! Escrow payment has been released to your account.', true, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- 10. Reviews
INSERT INTO public.reviews (id, project_id, reviewer_id, reviewee_id, rating, comment, review_type)
VALUES
    (
        '60000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000002',
        5.0,
        'Elena is an exceptional design lead. Her sense of aesthetics, typography, and speed is unmatched. Our conversion rates increased by 38% after deploying her designs.',
        'client_to_freelancer'
    ),
    (
        '60000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000004',
        'f0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        5.0,
        'Marcus was a dream client: clear requirements, quick feedback, and prompt milestone approval. Highly recommend working with him!',
        'freelancer_to_client'
    )
ON CONFLICT DO NOTHING;

-- 11. Payment Records
INSERT INTO public.payment_records (id, project_id, milestone_id, payer_id, payee_id, amount, platform_fee, net_amount, transaction_reference, status)
VALUES
    (
        '70000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000001',
        3500.00,
        350.00,
        3150.00,
        'LIMO-TX-SANDBOX-89104',
        'released'
    ),
    (
        '70000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000001',
        4000.00,
        400.00,
        3600.00,
        'LIMO-TX-SANDBOX-89105',
        'escrow_funded'
    )
ON CONFLICT DO NOTHING;

-- 12. Direct Agency Quote Requests (LIMO Software Services)
INSERT INTO public.quote_requests (id, contact_name, contact_email, contact_phone, service_type, project_scope, estimated_budget, target_timeline, status)
VALUES
    (
        '80000000-0000-0000-0000-000000000001',
        'Jonathan Miller',
        'jonathan@hypergrowth.vc',
        '+15553334444',
        'AI Integration',
        'We need an internal document intelligence assistant built on custom proprietary vector embeddings and Claude 3.5 Sonnet.',
        '$15,000 - $25,000',
        '4-6 weeks',
        'in_discussion'
    ),
    (
        '80000000-0000-0000-0000-000000000002',
        'Emily Zhao',
        'emily@solaraudio.com',
        '+15553335555',
        'Mobile Applications',
        'Turnkey audio recording and streaming application for iOS and Android built in React Native with Bluetooth LE peripheral connectivity.',
        '$20,000 - $35,000',
        '8-10 weeks',
        'received'
    )
ON CONFLICT DO NOTHING;

-- 13. System Notifications
INSERT INTO public.notifications (user_id, type, title, body, action_url, is_read)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'proposal_received', 'New Proposal Received', 'Alex Rivera submitted a proposal for "Next-Gen Fintech Analytics & Trading Dashboard".', '/dashboard/client/projects/10000000-0000-0000-0000-000000000001', false),
    ('f0000000-0000-0000-0000-000000000001', 'payment_released', 'Milestone Payment Released', 'Marcus Vance approved Milestone 1. $3,150.00 has been credited to your LIMO balance.', '/dashboard/freelancer/earnings', false)
ON CONFLICT DO NOTHING;

-- 14. Audit Logs
INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'VERIFY_FREELANCER', 'profiles', 'f0000000-0000-0000-0000-000000000001', '{"status": "verified", "reason": "Portfolio and ID credentials verified"}'::JSONB),
    ('c0000000-0000-0000-0000-000000000002', 'RELEASE_ESCROW', 'payment_records', '70000000-0000-0000-0000-000000000001', '{"amount": 3500.00, "milestone_id": "30000000-0000-0000-0000-000000000001"}'::JSONB)
ON CONFLICT DO NOTHING;
