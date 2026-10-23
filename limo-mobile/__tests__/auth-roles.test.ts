// ==============================================================================
// LIMO TEST SUITE — ROLE AUTHORIZATION & PERMISSION GATES
// Section 4 & 5: Role protection, least-privilege, and authorization checks
// ==============================================================================

import { UserRole, Profile } from '../src/types';

describe('LIMO Role Authorization & Permission Gating', () => {
  const adminUser: Profile = {
    id: 'a-1',
    email: 'admin@limo.dev',
    phone: '+15550000001',
    full_name: 'LIMO Admin',
    hourly_rate: 0,
    availability_status: 'available',
    is_verified: true,
    is_suspended: false,
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const clientUser: Profile = {
    id: 'c-1',
    email: 'client@company.com',
    phone: '+15551110001',
    full_name: 'Sarah Client',
    hourly_rate: 0,
    availability_status: 'available',
    is_verified: true,
    is_suspended: false,
    role: 'client',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const freelancerUser: Profile = {
    id: 'f-1',
    email: 'freelancer@dev.io',
    phone: '+15552220001',
    full_name: 'Alex Freelancer',
    hourly_rate: 95.0,
    availability_status: 'available',
    is_verified: true,
    is_suspended: false,
    role: 'freelancer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  function canModeratePlatform(role: UserRole): boolean {
    return role === 'admin';
  }

  function canPostProject(role: UserRole): boolean {
    return role === 'client' || role === 'admin';
  }

  function canSubmitProposal(role: UserRole, projectClientId: string, currentUserId: string): boolean {
    // Cannot submit proposal to own project
    if (projectClientId === currentUserId) return false;
    return role === 'freelancer';
  }

  it('permits platform moderation only for admin users', () => {
    expect(canModeratePlatform(adminUser.role)).toBe(true);
    expect(canModeratePlatform(clientUser.role)).toBe(false);
    expect(canModeratePlatform(freelancerUser.role)).toBe(false);
  });

  it('permits project creation only for clients and admins', () => {
    expect(canPostProject(clientUser.role)).toBe(true);
    expect(canPostProject(adminUser.role)).toBe(true);
    expect(canPostProject(freelancerUser.role)).toBe(false);
  });

  it('permits proposal submission only for freelancers bidding on other users projects', () => {
    // Valid bid on client's project
    expect(canSubmitProposal(freelancerUser.role, clientUser.id, freelancerUser.id)).toBe(true);

    // Client bidding on own project -> blocked
    expect(canSubmitProposal(clientUser.role, clientUser.id, clientUser.id)).toBe(false);

    // Admin bidding on client project -> blocked (must be freelancer)
    expect(canSubmitProposal(adminUser.role, clientUser.id, adminUser.id)).toBe(false);
  });
});
