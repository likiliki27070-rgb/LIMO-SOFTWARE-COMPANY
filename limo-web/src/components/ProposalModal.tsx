'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { X, Send, CheckCircle2, DollarSign, Clock, FileText } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function ProposalModal({ isOpen, onClose, project }: ProposalModalProps) {
  const { submitProposal } = useData();
  const { user, role } = useAuth();

  const [proposedPrice, setProposedPrice] = useState(project.budget_min || 3000);
  const [estimatedDuration, setEstimatedDuration] = useState('4 weeks');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || coverLetter.length < 20) {
      setError('Please provide a descriptive proposal pitch (minimum 20 characters).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      submitProposal({
        project_id: project.id,
        project_title: project.title,
        freelancer_id: user?.id || 'f0000000-0000-0000-0000-000000000001',
        freelancer_name: user?.full_name || 'Alex Rivera',
        freelancer_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        freelancer_headline: user?.headline || 'Senior Specialist',
        freelancer_rating: 5.0,
        proposed_price: Number(proposedPrice),
        estimated_duration: estimatedDuration,
        cover_letter: coverLetter.trim(),
        relevant_skills: project.required_skills,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setCoverLetter('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-limo-navy dark:text-white">
              Proposal Submitted!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your proposal has been delivered to <strong>{project.client_name || 'the Client'}</strong>. You will receive an alert once they review your terms or initiate a direct chat.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full py-3 px-6 rounded-xl font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 transition"
              >
                Return to Project
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-limo-blue">
                Submit Proposal
              </span>
              <h3 className="text-xl font-bold text-limo-navy dark:text-white line-clamp-1 mt-0.5">
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Client Budget: ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()}
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Proposed Bid Amount ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={100}
                    step={50}
                    required
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Estimated Delivery Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 weeks"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                  />
                </div>
              </div>
            </div>

            {/* Cover letter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Cover Letter / Pitch & Approach *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain why your experience matches this project, your architectural approach, and relevant portfolio references..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
