'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { X, Plus, CheckCircle2, DollarSign, Clock, Layers } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'Web Applications',
  'Mobile Applications',
  'AI Integration',
  'UI/UX Design',
  'Custom Software',
  'DevOps & Cloud',
];

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const { createProject } = useData();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [skillsInput, setSkillsInput] = useState('Next.js, TypeScript, PostgreSQL');
  const [budgetMin, setBudgetMin] = useState(3000);
  const [budgetMax, setBudgetMax] = useState(6000);
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [timeline, setTimeline] = useState('4-6 weeks');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (description.trim().length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }
    if (budgetMax < budgetMin) {
      setError('Maximum budget must be greater than or equal to minimum budget.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = createProject({
        client_id: user?.id || 'c0000000-0000-0000-0000-000000000001',
        title: title.trim(),
        description: description.trim(),
        category,
        required_skills: skills.length > 0 ? skills : ['TypeScript', 'React'],
        budget_min: Number(budgetMin),
        budget_max: Number(budgetMax),
        budget_type: budgetType,
        estimated_timeline: timeline,
        status: 'open',
        is_featured: false,
      });

      setCreatedId(created.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to publish project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreatedId(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {createdId ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-limo-navy dark:text-white">
              Project Published Successfully!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your project <strong>{title}</strong> is now live on the marketplace. Verified specialists will submit proposals shortly.
            </p>
            <div className="pt-3">
              <button
                onClick={handleClose}
                className="w-full py-3 px-6 rounded-xl font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 transition"
              >
                View Marketplace
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-limo-blue">
                Client Workspace
              </span>
              <h3 className="text-2xl font-bold text-limo-navy dark:text-white mt-0.5">
                Post a New Project
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify your technical requirements, deliverables, budget, and target milestones.
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js High-Throughput Analytics Dashboard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              />
            </div>

            {/* Category & Budget Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Budget Structure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBudgetType('fixed')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      budgetType === 'fixed'
                        ? 'border-limo-blue bg-blue-50 dark:bg-blue-950/40 text-limo-blue'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetType('hourly')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      budgetType === 'hourly'
                        ? 'border-limo-blue bg-blue-50 dark:bg-blue-950/40 text-limo-blue'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hourly Rate
                  </button>
                </div>
              </div>
            </div>

            {/* Budget Range & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Min Budget ($) *
                </label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  required
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Budget ($) *
                </label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  required
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Timeline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6 weeks"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                placeholder="Next.js, TypeScript, PostgreSQL, Tailwind CSS"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Project Description & Scope *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide complete deliverables, architectural preferences, user flow, or APIs to integrate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
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
                <Plus className="w-4 h-4" />
                {isSubmitting ? 'Publishing...' : 'Publish Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
