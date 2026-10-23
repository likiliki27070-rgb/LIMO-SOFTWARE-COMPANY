import { UserRole } from '../src/types';

describe('LIMO Web — Role-Based Access Control Rules (Section 7)', () => {
  type Permission =
    | 'create_project'
    | 'submit_proposal'
    | 'approve_milestone'
    | 'submit_deliverable'
    | 'suspend_user'
    | 'arbitrate_dispute';

  const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    client: ['create_project', 'approve_milestone'],
    freelancer: ['submit_proposal', 'submit_deliverable'],
    admin: [
      'create_project',
      'submit_proposal',
      'approve_milestone',
      'submit_deliverable',
      'suspend_user',
      'arbitrate_dispute',
    ],
  };

  function hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  }

  it('clients can create projects and approve milestones, but not submit proposals or deliverables', () => {
    expect(hasPermission('client', 'create_project')).toBe(true);
    expect(hasPermission('client', 'approve_milestone')).toBe(true);
    expect(hasPermission('client', 'submit_proposal')).toBe(false);
    expect(hasPermission('client', 'submit_deliverable')).toBe(false);
    expect(hasPermission('client', 'suspend_user')).toBe(false);
  });

  it('freelancers can submit proposals and deliverables, but not create projects or approve milestones', () => {
    expect(hasPermission('freelancer', 'submit_proposal')).toBe(true);
    expect(hasPermission('freelancer', 'submit_deliverable')).toBe(true);
    expect(hasPermission('freelancer', 'create_project')).toBe(false);
    expect(hasPermission('freelancer', 'approve_milestone')).toBe(false);
    expect(hasPermission('freelancer', 'suspend_user')).toBe(false);
  });

  it('admins hold platform-wide moderation and arbitration authority', () => {
    expect(hasPermission('admin', 'suspend_user')).toBe(true);
    expect(hasPermission('admin', 'arbitrate_dispute')).toBe(true);
  });
});
