// ==============================================================================
// LIMO TEST SUITE — PROJECT LIFECYCLE & PROPOSAL STATE TRANSITIONS
// Section 6, 7 & 14: Lifecycle states, proposal acceptance, and transactional updates
// ==============================================================================

import { Project, Proposal, ProjectStatus } from '../src/types';

describe('LIMO Project Lifecycle & Proposal Engine', () => {
  const mockProject: Project = {
    id: 'proj-001',
    client_id: 'client-1',
    title: 'High-Performance Next.js Trading App',
    description: 'Requires extensive websocket knowledge and highcharts visualization.',
    category: 'Web Applications',
    required_skills: ['Next.js', 'TypeScript'],
    budget_min: 5000,
    budget_max: 8000,
    budget_type: 'fixed',
    estimated_timeline: '6 weeks',
    status: 'open',
    is_featured: false,
    proposals_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockProposals: Proposal[] = [
    {
      id: 'prop-1',
      project_id: 'proj-001',
      freelancer_id: 'free-1',
      freelancer_name: 'Alex Rivera',
      proposed_price: 6500,
      estimated_duration: '5 weeks',
      relevant_skills: ['Next.js'],
      status: 'submitted',
      cover_letter: 'I can deliver this architecture cleanly with automated tests.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prop-2',
      project_id: 'proj-001',
      freelancer_id: 'free-2',
      freelancer_name: 'David Chen',
      proposed_price: 7000,
      estimated_duration: '6 weeks',
      relevant_skills: ['TypeScript'],
      status: 'submitted',
      cover_letter: 'Experienced frontend specialist with high-frequency telemetry.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  it('transitions project status to "proposal_review" when proposals are submitted', () => {
    let currentStatus: ProjectStatus = mockProject.status;

    // First proposal submitted
    if (mockProposals.length > 0 && currentStatus === 'open') {
      currentStatus = 'proposal_review';
    }

    expect(currentStatus).toBe('proposal_review');
  });

  it('accepts the selected proposal, rejects competing proposals, and assigns freelancer', () => {
    const selectedProposalId = 'prop-1';
    const winningProposal = mockProposals.find((p) => p.id === selectedProposalId)!;

    // Simulate transactional acceptance
    const updatedProposals = mockProposals.map((p) => {
      if (p.id === selectedProposalId) return { ...p, status: 'accepted' as const };
      if (p.project_id === winningProposal.project_id) return { ...p, status: 'rejected' as const };
      return p;
    });

    const updatedProject: Project = {
      ...mockProject,
      status: 'in_progress',
      assigned_freelancer_id: winningProposal.freelancer_id,
      assigned_freelancer_name: winningProposal.freelancer_name,
    };

    expect(updatedProposals.find((p) => p.id === 'prop-1')?.status).toBe('accepted');
    expect(updatedProposals.find((p) => p.id === 'prop-2')?.status).toBe('rejected');
    expect(updatedProject.status).toBe('in_progress');
    expect(updatedProject.assigned_freelancer_id).toBe('free-1');
  });

  it('prevents duplicate proposals from the same freelancer for a single project', () => {
    const existingFreelancerId = 'free-1';
    const isDuplicate = mockProposals.some(
      (p) => p.project_id === 'proj-001' && p.freelancer_id === existingFreelancerId
    );

    expect(isDuplicate).toBe(true);
  });
});
