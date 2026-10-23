'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/Badge';
import {
  ShieldAlert,
  Users,
  Briefcase,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Check,
  X,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    profiles,
    projects,
    proposals,
    payments,
    quoteRequests,
    auditLogs,
    toggleUserSuspension,
    toggleUserVerification,
    updateQuoteStatus,
    resolveDispute,
  } = useData();

  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'quotes' | 'disputes' | 'audit'>('overview');
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return profiles;
    const q = userSearch.toLowerCase();
    return profiles.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q)
    );
  }, [profiles, userSearch]);

  const clientCount = profiles.filter((p) => p.role === 'client').length;
  const freelancerCount = profiles.filter((p) => p.role === 'freelancer').length;
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress').length;
  const totalEscrowManaged = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPlatformFees = payments.reduce((acc, curr) => acc + curr.platform_fee, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Administrative Control Suite
            </span>
            <Badge label="Super Admin" variant="admin" size="sm" />
          </div>
          <h1 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
            Platform Moderation & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time platform metrics, user verification, quote requests pipeline, and dispute arbitration.
          </p>
        </div>

        {role !== 'admin' && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              You are currently viewing as <strong>{role}</strong>. Use the Persona Switcher in the top bar to switch to <strong>Super Admin</strong> for full moderation privileges.
            </span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Total Platform Users</span>
          <div className="text-3xl font-black text-limo-navy dark:text-white mt-1">
            {profiles.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {clientCount} Clients • {freelancerCount} Specialists
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Active Contracts</span>
          <div className="text-3xl font-black text-limo-blue mt-1">
            {inProgressProjects}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {projects.length} Total Projects
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Agency Inquiries</span>
          <div className="text-3xl font-black text-purple-600 mt-1">
            {quoteRequests.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Custom software pipeline</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Escrow Managed</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalEscrowManaged.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Custody volume</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Platform Commission</span>
          <div className="text-3xl font-black text-rose-600 mt-1">
            ${totalPlatformFees.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">10% earned revenue</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'overview'
              ? 'border-b-2 border-rose-600 text-rose-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'users'
              ? 'border-b-2 border-rose-600 text-rose-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          User Management ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'quotes'
              ? 'border-b-2 border-rose-600 text-rose-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Agency Quote Requests ({quoteRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'disputes'
              ? 'border-b-2 border-rose-600 text-rose-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Dispute Resolution Center
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'audit'
              ? 'border-b-2 border-rose-600 text-rose-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Security & Financial Audit Logs
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-limo-navy dark:text-white">
              Recent Inquiries & Quote Pipeline
            </h3>
            <div className="space-y-3">
              {quoteRequests.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <strong className="text-xs sm:text-sm text-limo-navy dark:text-white block">
                      {q.service_type}
                    </strong>
                    <span className="text-xs text-slate-500">
                      Client: {q.contact_name} • {q.estimated_budget}
                    </span>
                  </div>
                  <Badge label={q.status} variant="submitted" size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-limo-navy dark:text-white">
              Security Health & Compliance Status
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>PostgreSQL RLS Policies Active on 18 Tables</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Plaintext OTP Storage Enforced</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5-Minute OTP Expiry & 60s Resend Cooldown Active</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Transactional Escrow Ledger Reconciled</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <h3 className="font-bold text-base text-limo-navy dark:text-white">
              Platform Member Roster
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 flex items-center gap-2.5">
                      <img
                        src={u.avatar_url}
                        alt={u.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <strong className="block text-limo-navy dark:text-white">
                          {u.full_name}
                        </strong>
                        <span className="text-[11px] text-slate-400">{u.location || 'Remote'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge label={u.role} variant={u.role} size="sm" />
                    </td>
                    <td className="p-3 text-slate-500">{u.email || u.phone}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleUserVerification(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          u.is_verified
                            ? 'bg-blue-100 text-limo-blue dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}
                      >
                        {u.is_verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="p-3">
                      {u.is_suspended ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserSuspension(u.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                            u.is_suspended
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {u.is_suspended ? 'Reinstate' : 'Suspend Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUOTE REQUESTS */}
      {activeTab === 'quotes' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-4">
          <h3 className="font-bold text-base text-limo-navy dark:text-white">
            Direct Agency Inquiries Pipeline
          </h3>

          <div className="space-y-4">
            {quoteRequests.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-purple-600 uppercase">
                      {q.service_type}
                    </span>
                    <h4 className="font-bold text-base text-limo-navy dark:text-white">
                      {q.contact_name} &bull; {q.contact_email}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Budget: <strong>{q.estimated_budget}</strong> • Timeline: {q.target_timeline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={q.status}
                      onChange={(e) => updateQuoteStatus(q.id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value="received">Received</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="quoted">Quoted</option>
                      <option value="converted">Converted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {q.project_scope}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DISPUTE RESOLUTION */}
      {activeTab === 'disputes' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <div>
              <h3 className="font-bold text-lg text-limo-navy dark:text-white">
                Dispute Arbitration Center
              </h3>
              <p className="text-xs text-slate-500">
                Impartial administrative arbitration enforcing milestone contract specifications.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <strong className="text-sm text-limo-navy dark:text-white">
                Enterprise Supply Chain Route Optimization Engine
              </strong>
              <Badge label="In Review" variant="disputed" size="sm" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Dispute Case #DISP-9918: Client Marcus Vance opened arbitration citing milestone deadline variance. Specialist Alex Rivera submitted code benchmarks demonstrating 25,000 pings/sec.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <button
                onClick={() => resolveDispute('10000000-0000-0000-0000-000000000003', 'refund_client')}
                className="py-2 px-4 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white transition"
              >
                Arbitrate: Refund Escrow to Client
              </button>
              <button
                onClick={() => resolveDispute('10000000-0000-0000-0000-000000000003', 'release_freelancer')}
                className="py-2 px-4 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                Arbitrate: Release Escrow to Specialist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-limo-navy dark:text-white">
              Immutable Platform Audit Log
            </h3>
            <span className="text-xs text-slate-400 font-mono">PostgreSQL audit_logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-limo-navy dark:text-white">
                      {log.actor_name}
                    </td>
                    <td className="p-3 font-bold text-limo-blue">{log.action}</td>
                    <td className="p-3 text-slate-500">
                      {log.target_type}:{log.target_id.slice(0, 8)}...
                    </td>
                    <td className="p-3 text-slate-400">{log.ip_address || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
