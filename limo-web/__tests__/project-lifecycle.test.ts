import { ProjectStatus } from '../src/types';

describe('LIMO Web — Project Lifecycle State Machine (Section 11)', () => {
  const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
    draft: ['open', 'cancelled'],
    open: ['proposal_review', 'cancelled'],
    proposal_review: ['in_progress', 'cancelled', 'open'],
    in_progress: ['submitted_for_review', 'disputed', 'cancelled'],
    submitted_for_review: ['completed', 'in_progress', 'disputed'],
    completed: [],
    cancelled: [],
    disputed: ['in_progress', 'cancelled', 'completed'],
  };

  function canTransition(current: ProjectStatus, target: ProjectStatus): boolean {
    return VALID_TRANSITIONS[current]?.includes(target) ?? false;
  }

  it('allows natural progression from open to proposal review to in progress', () => {
    expect(canTransition('open', 'proposal_review')).toBe(true);
    expect(canTransition('proposal_review', 'in_progress')).toBe(true);
    expect(canTransition('in_progress', 'submitted_for_review')).toBe(true);
    expect(canTransition('submitted_for_review', 'completed')).toBe(true);
  });

  it('prohibits illegal bypass transitions (e.g. open directly to completed)', () => {
    expect(canTransition('open', 'completed')).toBe(false);
    expect(canTransition('draft', 'in_progress')).toBe(false);
  });

  it('allows dispute arbitration from in_progress or submitted_for_review', () => {
    expect(canTransition('in_progress', 'disputed')).toBe(true);
    expect(canTransition('submitted_for_review', 'disputed')).toBe(true);
  });

  it('terminal states have no outgoing transitions', () => {
    expect(canTransition('completed', 'open')).toBe(false);
    expect(canTransition('cancelled', 'in_progress')).toBe(false);
  });
});
