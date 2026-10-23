'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/Badge';
import {
  DollarSign,
  Briefcase,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  UploadCloud,
  Check,
  X,
  CreditCard,
} from 'lucide-react';

export default function FreelancerDashboardPage() {
  const {
    projects,
    proposals,
    milestones,
    payments,
    submitDeliverable,
    startOrGetConversation,
  } = useData();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'contracts' | 'proposals' | 'earnings'>('contracts');

  // Deliverable Submission Modal State
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Freelancer's active contracts
  const myContracts = useMemo(() => {
    return projects.filter(
      (p) => p.assigned_freelancer_id === user?.id || (user?.role === 'freelancer' && p.assigned_freelancer_name?.includes(user?.full_name.split(' ')[0] || 'Alex'))
    );
  }, [projects, user]);

  // Freelancer's submitted proposals
  const myProposals = useMemo(() => {
    return proposals.filter(
      (pr) => pr.freelancer_id === user?.id || pr.freelancer_name === user?.full_name
    );
  }, [proposals, user]);

  // Earnings
  const myPayments = useMemo(() => {
    return payments.filter(
      (p) => p.payee_id === user?.id || p.payee_name === user?.full_name
    );
  }, [payments, user]);

  const totalEarned = myPayments
    .filter((p) => p.status === 'released')
    .reduce((acc, curr) => acc + curr.net_amount, 0);

  const pendingEscrow = myPayments
    .filter((p) => p.status === 'escrow_funded')
    .reduce((acc, curr) => acc + curr.net_amount, 0);

  const handleOpenDeliverable = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setDeliverableTitle('');
    setDeliverableUrl('https://github.com/my-org/pull/42');
    setDeliverableNotes('');
    setSubmissionSuccess(false);
    setDeliverableModalOpen(true);
  };

  const handleDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneId || !deliverableTitle) return;

    setIsSubmitting(true);
    submitDeliverable(
      selectedMilestoneId,
      deliverableTitle,
      deliverableUrl,
      deliverableNotes
    );
    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Specialist Workspace
            </span>
            <Badge label="Freelancer" variant="freelancer" size="sm" />
          </div>
          <h1 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
            Welcome, {user?.full_name.split(' ')[0] || 'Specialist'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliver contracted milestones, pitch on high-tier projects, and track secure escrow earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/messages"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2 transition"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>Client Messages</span>
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 flex items-center gap-2 transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse New Projects</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Active Contracts</span>
          <div className="text-3xl font-black text-limo-navy dark:text-white mt-1">
            {myContracts.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In progress work</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Submitted Proposals</span>
          <div className="text-3xl font-black text-purple-600 mt-1">
            {myProposals.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Zero bid fees applied</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Pending Escrow</span>
          <div className="text-3xl font-black text-amber-500 mt-1">
            ${pendingEscrow.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Locked in custody</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
          <span className="text-xs text-slate-400 block">Total Net Earned</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalEarned.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Processed payouts</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 text-sm">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'contracts'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          My Active Contracts ({myContracts.length})
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'proposals'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Submitted Proposals ({myProposals.length})
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'earnings'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Earnings & Payouts
        </button>
      </div>

      {/* TAB 1: ACTIVE CONTRACTS */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          {myContracts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-limo-navy dark:text-white">
                No active contracts in progress
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the marketplace and pitch on verified projects to kickstart high-paying engagements.
              </p>
              <Link
                href="/projects"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            myContracts.map((contract) => {
              const contractMilestones = milestones.filter((m) => m.project_id === contract.id);

              return (
                <div
                  key={contract.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-purple-600 uppercase">Active Engagement</span>
                      <h3 className="text-xl font-bold text-limo-navy dark:text-white">
                        {contract.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Client: <strong>{contract.client_name}</strong>
                      </p>
                    </div>

                    <Badge label={contract.status} variant={contract.status} size="md" />
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Deliverable Milestones
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
                            <div className="pt-1">
                              <a
                                href={m.deliverable_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Submitted: {m.deliverable_url}</span>
                              </a>
                            </div>
                          )}
                          {m.client_feedback && (
                            <p className="text-xs text-emerald-600 font-medium">
                              Client note: {m.client_feedback}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-sm text-limo-navy dark:text-white">
                            ${m.amount.toLocaleString()}
                          </span>

                          {m.status !== 'approved' && (
                            <button
                              onClick={() => handleOpenDeliverable(m.id)}
                              className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 transition"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>{m.status === 'submitted' ? 'Update Deliverable' : 'Submit Work'}</span>
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

      {/* TAB 2: PROPOSALS */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {myProposals.map((pr) => (
            <div
              key={pr.id}
              className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge label={pr.status} variant={pr.status} size="sm" />
                  <span className="text-xs text-slate-400">
                    Submitted on {new Date(pr.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">
                  {pr.project_title || 'Software Development Project'}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{pr.cover_letter}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Proposed Price</span>
                <span className="text-lg font-black text-limo-navy dark:text-white">
                  ${pr.proposed_price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 block">{pr.estimated_duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-xl text-limo-navy dark:text-white">
                Available Earnings Balance
              </h3>
              <p className="text-xs text-slate-500">
                Processed milestones ready for transfer to your verified payout account.
              </p>
            </div>

            <button
              onClick={() => alert('Demo payout requested. In sandbox mode, funds are cleared automatically within 24 hours.')}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>Request Payout (${totalEarned.toLocaleString()})</span>
            </button>
          </div>

          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Gross Amount</th>
                  <th className="p-3">Platform Fee (10%)</th>
                  <th className="p-3">Your Net Pay</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {myPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-mono text-[11px] font-semibold text-purple-600">
                      {p.transaction_reference}
                    </td>
                    <td className="p-3">{p.payer_name}</td>
                    <td className="p-3 font-bold">${p.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">-${p.platform_fee.toFixed(2)}</td>
                    <td className="p-3 font-bold text-emerald-600">${p.net_amount.toFixed(2)}</td>
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

      {/* DELIVERABLE SUBMISSION MODAL */}
      {deliverableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark rounded-3xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setDeliverableModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {submissionSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-limo-navy dark:text-white">
                  Deliverable Submitted!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The client has been notified to review your work and release the milestone funds.
                </p>
                <button
                  onClick={() => setDeliverableModalOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDeliverableSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-limo-navy dark:text-white">
                    Submit Milestone Deliverable
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide the repository pull request, staging demo link, or deliverable notes for client inspection.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deliverable Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Completed telemetry API & PostGIS schema"
                    value={deliverableTitle}
                    onChange={(e) => setDeliverableTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Staging Link or Pull Request URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Review Notes / Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Testing credentials, endpoint documentation, or migration notes..."
                    value={deliverableNotes}
                    onChange={(e) => setDeliverableNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliverableModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Client</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
