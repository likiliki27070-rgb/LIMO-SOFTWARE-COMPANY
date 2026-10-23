'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { X, Send, CheckCircle2, Sparkles, Clock, DollarSign, Briefcase } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const AGENCY_SERVICES = [
  'Website Development',
  'Web Applications',
  'Mobile Applications',
  'UI/UX Design',
  'AI Integration',
  'Custom Software',
  'Maintenance and Support',
];

export const BUDGET_TIERS = [
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
];

export function QuoteModal({ isOpen, onClose, defaultService }: QuoteModalProps) {
  const { submitQuoteRequest } = useData();
  const { user } = useAuth();

  const [serviceType, setServiceType] = useState(defaultService || AGENCY_SERVICES[0]);
  const [contactName, setContactName] = useState(user?.full_name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [projectScope, setProjectScope] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(BUDGET_TIERS[1]);
  const [targetTimeline, setTargetTimeline] = useState('6-8 weeks');

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !projectScope.trim()) {
      setError('Please provide your name, email, and a brief description of project scope.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = submitQuoteRequest({
        client_id: user?.id,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim(),
        service_type: serviceType,
        project_scope: projectScope.trim(),
        estimated_budget: estimatedBudget,
        target_timeline: targetTimeline,
      });

      setSubmittedId(created.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedId(null);
    setProjectScope('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedId ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-limo-navy dark:text-white">
              Quote Request Submitted!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Thank you, <strong>{contactName}</strong>. Our senior engineering solutions team has received your inquiry for <strong>{serviceType}</strong> and will deliver a scoped proposal within 24 business hours.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-mono text-slate-500">
              Reference Inquiry ID: <span className="font-semibold text-limo-blue">{submittedId}</span>
            </div>
            <div className="pt-3">
              <button
                onClick={handleReset}
                className="w-full py-3 px-6 rounded-xl font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-limo-blue" />
                <h3 className="text-xl font-bold text-limo-navy dark:text-white">
                  Request a Dedicated Agency Quote
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Partner directly with LIMO’s in-house engineering squads, verified security standards, and strict SLA guarantees.
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Service Category
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue transition"
              >
                {AGENCY_SERVICES.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>
            </div>

            {/* Phone & Timeline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4-6 weeks"
                  value={targetTimeline}
                  onChange={(e) => setTargetTimeline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>
            </div>

            {/* Estimated Budget Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Estimated Budget Bracket
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BUDGET_TIERS.map((tier) => (
                  <button
                    type="button"
                    key={tier}
                    onClick={() => setEstimatedBudget(tier)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl border transition ${
                      estimatedBudget === tier
                        ? 'border-limo-blue bg-blue-50 dark:bg-blue-950/40 text-limo-blue font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Scope */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Project Scope & Requirements *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe your objectives, tech requirements, target users, or key milestones..."
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
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
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
