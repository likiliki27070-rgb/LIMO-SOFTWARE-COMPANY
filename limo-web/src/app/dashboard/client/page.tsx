'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { NewProjectModal } from '@/components/NewProjectModal';
import { Badge } from '@/components/Badge';
import {
  Briefcase,
  Plus,
  DollarSign,
  Clock,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Check,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function ClientDashboardPage() {
  const {
    projects,
    proposals,
    milestones,
    payments,
    acceptProposal,
    reviewDeliverable,
    startOrGetConversation,
  } = useData();

  const { user } = useAuth();
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'contracts' | 'payments'>('projects');

  // Client's projects
  const clientProjects = useMemo(() => {
    return projects.filter((p) => p.client_id === user?.id || p.client_name === user?.full_name);
  }, [projects, user]);

  // Client's active contracts
  const activeContracts = useMemo(() => {
    return clientProjects.filter(
      (p) => p.status === 'in_progress' || p.status === 'submitted_for_review'
    );
  }, [clientProjects]);

  // Client's proposals received
  const incomingProposals = useMemo(() => {
    const projectIds = clientProjects.map((p) => p.id);
    return proposals.filter((pr) => projectIds.includes(pr.project_id));
  }, [clientProjects, proposals]);

  // Total escrow spent
  const totalSpent = useMemo(() => {
    return payments
      .filter((p) => p.payer_id === user?.id || p.payer_name === user?.full_name)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [payments, user]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
              Client Command Center
            </span>
            <Badge label="Client" variant="client" size="sm" />
          </div>
          <h1 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
            Welcome back, {user?.full_name.split(' ')[0] || 'Client'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your digital roadmaps, inspect candidate proposals, and approve escrow milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/messages"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2 transition"
          >
            <MessageSquare className="w-4 h-4 text-limo-blue" />
            <span>Messages</span>
          </Link>

          <button
            onClick={() => setNewProjectModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Project</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Total Posted Projects</span>
          <div className="text-3xl font-black text-limo-navy dark:text-white mt-1">
            {clientProjects.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active on marketplace</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Proposals Received</span>
          <div className="text-3xl font-black text-limo-blue mt-1">
            {incomingProposals.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Candidate pitches</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Active Contracts</span>
          <div className="text-3xl font-black text-amber-500 mt-1">
            {activeContracts.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In progress delivery</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Total Escrow Volume</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalSpent.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Auditable transactions</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 text-sm">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'projects'
              ? 'border-b-2 border-limo-blue text-limo-blue'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          My Posted Projects ({clientProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'contracts'
              ? 'border-b-2 border-limo-blue text-limo-blue'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Active Contracts & Milestones ({activeContracts.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'payments'
              ? 'border-b-2 border-limo-blue text-limo-blue'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Payment & Escrow Ledger
        </button>
      </div>

      {/* TAB 1: MY POSTED PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {clientProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-limo-navy dark:text-white">
                No active projects posted
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to find an engineering specialist? Publish a project to start receiving verified proposals.
              </p>
              <button
                onClick={() => setNewProjectModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-limo-blue text-white"
              >
                Post Your First Project
              </button>
            </div>
          ) : (
            clientProjects.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-limo-blue bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg">
                      {p.category}
                    </span>
                    <Badge label={p.status} variant={p.status} size="sm" />
                  </div>
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-bold text-lg text-limo-navy dark:text-white hover:text-limo-blue transition"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Budget: ${p.budget_min.toLocaleString()} – ${p.budget_max.toLocaleString()} • Timeline: {p.estimated_timeline}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/projects/${p.id}`}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-limo-navy dark:text-white hover:bg-limo-blue hover:text-white transition"
                  >
                    Manage & Review Bids ({p.proposals_count || 0}) &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE CONTRACTS & MILESTONES */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          {activeContracts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark text-xs text-slate-500">
              No active in-progress contracts at the moment.
            </div>
          ) : (
            activeContracts.map((contract) => {
              const contractMilestones = milestones.filter((m) => m.project_id === contract.id);

              return (
                <div
                  key={contract.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-limo-blue uppercase">Active Contract</span>
                      <h3 className="text-xl font-bold text-limo-navy dark:text-white">
                        {contract.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Assigned Specialist: <strong>{contract.assigned_freelancer_name || 'Alex Rivera'}</strong>
                      </p>
                    </div>

                    <Badge label={contract.status} variant={contract.status} size="md" />
                  </div>

                  {/* Milestones in this contract */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Contract Milestones & Deliverables
                    </h4>

                    {contractMilestones.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-limo-navy dark:text-white">
                              {m.title}
                            </strong>
                            <Badge label={m.status} variant={m.status} size="sm" />
                          </div>
                          <p className="text-xs text-slate-500">{m.description}</p>
                          {m.deliverable_url && (
                            <a
                              href={m.deliverable_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-limo-blue hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Inspect Submitted Code / Link</span>
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-sm text-limo-navy dark:text-white">
                            ${m.amount.toLocaleString()}
                          </span>

                          {m.status === 'submitted' && (
                            <button
                              onClick={() => reviewDeliverable(m.id, true, 'Approved by Sarah Jenkins')}
                              className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Release Payment</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: PAYMENT LEDGER */}
      {activeTab === 'payments' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-limo-navy dark:text-white">
                Escrow & Financial Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Auditable records of funds deposited, platform fees deducted, and released payouts.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              Sandbox Escrow Mode Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Project / Milestone</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Fee (10%)</th>
                  <th className="p-3">Net Payout</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-mono text-[11px] font-semibold text-limo-blue">
                      {p.transaction_reference}
                    </td>
                    <td className="p-3 max-w-[200px] truncate">{p.project_title || 'Contract'}</td>
                    <td className="p-3">{p.payee_name}</td>
                    <td className="p-3 font-bold">${p.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">${p.platform_fee.toFixed(2)}</td>
                    <td className="p-3 font-semibold text-emerald-600">${p.net_amount.toFixed(2)}</td>
                    <td className="p-3">
                      <Badge label={p.status} variant={p.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
      />
    </div>
  );
}
