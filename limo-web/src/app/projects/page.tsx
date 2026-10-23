'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { NewProjectModal } from '@/components/NewProjectModal';
import { ProposalModal } from '@/components/ProposalModal';
import { Badge } from '@/components/Badge';
import { Project } from '@/types';
import {
  Search,
  Filter,
  Plus,
  Clock,
  DollarSign,
  Briefcase,
  ChevronRight,
  ArrowUpDown,
  Send,
  Layers,
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Web Applications',
  'Mobile Applications',
  'AI Integration',
  'UI/UX Design',
  'Custom Software',
];

const SKILL_OPTIONS = [
  'Next.js',
  'TypeScript',
  'React Native',
  'Expo',
  'PostgreSQL',
  'Tailwind CSS',
  'AI & LLM Integration',
  'Figma',
  'Node.js',
  'WebRTC',
];

export default function ProjectsPage() {
  const { projects } = useData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState(0);
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'proposals'>('newest');

  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [activeProjectForProposal, setActiveProjectForProposal] = useState<Project | null>(null);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = project.title.toLowerCase().includes(q);
          const matchDesc = project.description.toLowerCase().includes(q);
          const matchSkills = project.required_skills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchSkills) return false;
        }

        // Category filter
        if (selectedCategory !== 'All Categories' && project.category !== selectedCategory) {
          return false;
        }

        // Skills filter
        if (
          selectedSkills.length > 0 &&
          !selectedSkills.some((s) => project.required_skills.includes(s))
        ) {
          return false;
        }

        // Budget filter
        if (project.budget_max < minBudget) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'budget_high') {
          return b.budget_max - a.budget_max;
        }
        if (sortBy === 'proposals') {
          return (b.proposals_count || 0) - (a.proposals_count || 0);
        }
        return 0;
      });
  }, [projects, searchQuery, selectedCategory, selectedSkills, minBudget, sortBy]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
            Projects Marketplace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover verified software development, mobile app, and AI contracts backed by auditable escrow.
          </p>
        </div>

        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="self-start md:self-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post a New Project</span>
        </button>
      </div>

      {/* Main Filter & Listing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keywords or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue transition"
            />
          </div>

          {/* Category Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Categories
            </h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-limo-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Min Budget Filter */}
          <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Minimum Budget
              </h3>
              <span className="text-xs font-bold text-limo-blue">
                ${minBudget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full accent-limo-blue cursor-pointer"
            />
          </div>

          {/* Skills Filter */}
          <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Filter by Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'border-limo-blue bg-blue-50 dark:bg-blue-950/60 text-limo-blue font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            {selectedSkills.length > 0 && (
              <button
                onClick={() => setSelectedSkills([])}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-2 block"
              >
                Clear skill filters
              </button>
            )}
          </div>
        </div>

        {/* Right Project Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting and Result Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark text-xs">
            <div className="text-slate-500 dark:text-slate-400">
              Showing <strong className="text-limo-navy dark:text-white">{filteredProjects.length}</strong> available projects
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-limo-blue"
              >
                <option value="newest">Newest First</option>
                <option value="budget_high">Highest Budget</option>
                <option value="proposals">Most Proposals</option>
              </select>
            </div>
          </div>

          {/* Project Cards List */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-limo-navy dark:text-white">
                No matching projects found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, widening the budget bracket, or clearing applied skill filters.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-limo-blue bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg">
                        {project.category}
                      </span>
                      <Badge label={project.status} variant={project.status} size="sm" />
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="text-xl font-bold text-limo-navy dark:text-white hover:text-limo-blue transition"
                    >
                      {project.title}
                    </Link>
                  </div>

                  {/* Client Avatar / Name */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <img
                      src={project.client_avatar}
                      alt={project.client_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="text-right sm:text-left">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        {project.client_name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Verified Client</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Bottom Meta & Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span>
                        Budget:{' '}
                        <strong className="text-sm text-limo-navy dark:text-white">
                          ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{project.estimated_timeline}</span>
                    </div>

                    <div>
                      <span>
                        Proposals:{' '}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {project.proposals_count || 0}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveProjectForProposal(project)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-limo-blue hover:bg-limo-blueHover text-white flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Proposal</span>
                    </button>
                    <Link
                      href={`/projects/${project.id}`}
                      className="py-2.5 px-3.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-limo-navy dark:text-white transition"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
      />
      {activeProjectForProposal && (
        <ProposalModal
          isOpen={Boolean(activeProjectForProposal)}
          onClose={() => setActiveProjectForProposal(null)}
          project={activeProjectForProposal}
        />
      )}
    </div>
  );
}
