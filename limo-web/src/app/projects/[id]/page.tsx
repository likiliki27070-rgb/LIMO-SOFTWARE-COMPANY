'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { ProposalModal } from '@/components/ProposalModal';
import { Badge } from '@/components/Badge';
import {
  ArrowLeft,
  DollarSign,
  Clock,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Send,
  MessageSquare,
  Check,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const {
    projects,
    proposals,
    milestones,
    acceptProposal,
    updateProposalStatus,
    startOrGetConversation,
  } = useData();

  const { user, role } = useAuth();
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);
  const projectProposals = useMemo(
    () => proposals.filter((p) => p.project_id === id),
    [proposals, id]
  );
  const projectMilestones = useMemo(
    () => milestones.filter((m) => m.project_id === id).sort((a, b) => a.order_index - b.order_index),
    [milestones, id]
  );

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-limo-navy dark:text-white">
          Project Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The project you are trying to view does not exist or may have been removed.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-limo-blue text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isClientOwner = user?.id === project.client_id;
  const isAssignedFreelancer = user?.id === project.assigned_freelancer_id;

  const handleStartChat = (recipientId: string) => {
    const conv = startOrGetConversation(recipientId, project.id);
    router.push(`/dashboard/messages?conv=${conv.id}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-limo-blue transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Main Project Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-limo-blue bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg">
                {project.category}
              </span>
              <Badge label={project.status} variant={project.status} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-limo-navy dark:text-white">
              {project.title}
            </h1>

            <p className="text-xs text-slate-400">
              Posted on {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex items-center gap-3">
            {project.status === 'open' || project.status === 'proposal_review' ? (
              <button
                onClick={() => setProposalModalOpen(true)}
                className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit a Proposal</span>
              </button>
            ) : null}

            {isClientOwner && project.assigned_freelancer_id && (
              <button
                onClick={() => handleStartChat(project.assigned_freelancer_id!)}
                className="py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-limo-navy dark:text-white flex items-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4 text-limo-blue" />
                <span>Message Specialist</span>
              </button>
            )}
          </div>
        </div>

        {/* Client & Budget Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          <div>
            <span className="text-xs text-slate-400 block">Client</span>
            <div className="flex items-center gap-2 mt-1">
              <img
                src={project.client_avatar}
                alt={project.client_name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <strong className="text-xs sm:text-sm text-limo-navy dark:text-white">
                {project.client_name}
              </strong>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block">Agreed Budget</span>
            <strong className="text-xs sm:text-sm font-bold text-limo-navy dark:text-white mt-1 block">
              ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()}
            </strong>
          </div>

          <div>
            <span className="text-xs text-slate-400 block">Estimated Timeline</span>
            <strong className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 block">
              {project.estimated_timeline}
            </strong>
          </div>

          <div>
            <span className="text-xs text-slate-400 block">Proposals Received</span>
            <strong className="text-xs sm:text-sm text-limo-blue mt-1 block">
              {projectProposals.length} Submitted
            </strong>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-limo-navy dark:text-white">
            Project Scope & Specifications
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Required Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.required_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Project Milestones Roadmap */}
      {projectMilestones.length > 0 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
                Contract Deliverables
              </span>
              <h2 className="text-xl font-bold text-limo-navy dark:text-white mt-0.5">
                Milestones & Escrow Allocation
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Escrow Protected</span>
            </div>
          </div>

          <div className="space-y-4">
            {projectMilestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-limo-blue text-white text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-limo-navy dark:text-white">
                      {m.title}
                    </h3>
                    <Badge label={m.status} variant={m.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-7">
                    {m.description}
                  </p>
                  {m.deliverable_url && (
                    <div className="pl-7 pt-1">
                      <a
                        href={m.deliverable_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-limo-blue hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Deliverable: {m.deliverable_url}</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Milestone Amount</span>
                  <span className="text-base font-black text-limo-navy dark:text-white">
                    ${m.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proposals Review Section (Available to Client & Freelancer) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
            Candidate Bids ({projectProposals.length})
          </span>
          <h2 className="text-xl font-bold text-limo-navy dark:text-white mt-0.5">
            Submitted Proposals
          </h2>
          <p className="text-xs text-slate-500">
            Compare candidate bids, proposed timelines, and technical approaches.
          </p>
        </div>

        {projectProposals.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
            No proposals have been submitted for this project yet. Be the first specialist to pitch!
          </div>
        ) : (
          <div className="space-y-4">
            {projectProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={proposal.freelancer_avatar}
                      alt={proposal.freelancer_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-limo-navy dark:text-white">
                          {proposal.freelancer_name}
                        </span>
                        <Badge label={proposal.status} variant={proposal.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {proposal.freelancer_headline}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Proposed Terms</div>
                    <div className="text-lg font-black text-limo-navy dark:text-white">
                      ${proposal.proposed_price.toLocaleString()}
                    </div>
                    <span className="text-xs text-slate-500">
                      in {proposal.estimated_duration}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {proposal.cover_letter}
                </p>

                {/* Client Control Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartChat(proposal.freelancer_id)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-limo-blue" />
                      <span>Chat with {proposal.freelancer_name.split(' ')[0]}</span>
                    </button>
                  </div>

                  {proposal.status === 'submitted' || proposal.status === 'shortlisted' ? (
                    <div className="flex items-center gap-2">
                      {proposal.status !== 'shortlisted' && (
                        <button
                          onClick={() => updateProposalStatus(proposal.id, 'shortlisted')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          Shortlist
                        </button>
                      )}
                      <button
                        onClick={() => acceptProposal(proposal.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Accept & Start Contract</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        project={project}
      />
    </div>
  );
}
