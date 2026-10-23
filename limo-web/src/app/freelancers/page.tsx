'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/Badge';
import {
  Search,
  ShieldCheck,
  Star,
  DollarSign,
  Briefcase,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function FreelancersPage() {
  const router = useRouter();
  const { profiles, skills, portfolios, startOrGetConversation } = useData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'busy'>('all');
  const [maxHourlyRate, setMaxHourlyRate] = useState(150);

  const freelancers = useMemo(() => {
    return profiles.filter((p) => p.role === 'freelancer');
  }, [profiles]);

  const filteredFreelancers = useMemo(() => {
    return freelancers.filter((f) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.full_name.toLowerCase().includes(q);
        const matchHeadline = (f.headline || '').toLowerCase().includes(q);
        const matchBio = (f.bio || '').toLowerCase().includes(q);
        const freelancerSkills = skills
          .filter((s) => s.freelancer_id === f.id)
          .map((s) => s.skill_name.toLowerCase());
        const matchSkills = freelancerSkills.some((s) => s.includes(q));

        if (!matchName && !matchHeadline && !matchBio && !matchSkills) {
          return false;
        }
      }

      // Availability filter
      if (availabilityFilter !== 'all' && f.availability_status !== availabilityFilter) {
        return false;
      }

      // Hourly rate filter
      if (f.hourly_rate > maxHourlyRate) {
        return false;
      }

      return true;
    });
  }, [freelancers, searchQuery, availabilityFilter, maxHourlyRate, skills]);

  const handleContact = (freelancerId: string) => {
    const conv = startOrGetConversation(freelancerId);
    router.push(`/dashboard/messages?conv=${conv.id}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
            Verified Talent Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse senior developers, mobile architects, and UI/UX leads vetted by LIMO engineering standards.
          </p>
        </div>

        <Link
          href="/auth/login?role=freelancer"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Apply as Specialist</span>
        </Link>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
            />
          </div>

          {/* Availability */}
          <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Availability
            </h3>
            {(['all', 'available', 'busy'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setAvailabilityFilter(status)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                  availabilityFilter === status
                    ? 'bg-limo-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {status === 'all' ? 'All Specialists' : status}
              </button>
            ))}
          </div>

          {/* Max Hourly Rate */}
          <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Max Hourly Rate
              </h3>
              <span className="text-xs font-bold text-limo-blue">
                ${maxHourlyRate}/hr
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={200}
              step={5}
              value={maxHourlyRate}
              onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
              className="w-full accent-limo-blue cursor-pointer"
            />
          </div>
        </div>

        {/* Right Freelancers List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="text-xs text-slate-500">
            Showing <strong className="text-limo-navy dark:text-white">{filteredFreelancers.length}</strong> vetted specialists
          </div>

          <div className="space-y-6">
            {filteredFreelancers.map((talent) => {
              const talentSkills = skills.filter((s) => s.freelancer_id === talent.id);
              const talentPortfolios = portfolios.filter((p) => p.freelancer_id === talent.id);

              return (
                <div
                  key={talent.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-lg transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={talent.avatar_url}
                        alt={talent.full_name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/freelancers/${talent.id}`}
                            className="text-xl font-bold text-limo-navy dark:text-white hover:text-limo-blue transition"
                          >
                            {talent.full_name}
                          </Link>
                          {talent.is_verified && (
                            <span title="LIMO Verified Engineer">
                              <ShieldCheck className="w-5 h-5 text-limo-blue shrink-0" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {talent.headline}
                        </p>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                          <span>{talent.location}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                            {talent.availability_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-xs text-slate-400">Hourly Rate</div>
                      <div className="text-2xl font-black text-limo-navy dark:text-white">
                        ${talent.hourly_rate}
                        <span className="text-xs font-normal text-slate-400">/hr</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {talent.bio}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {talentSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        {sk.skill_name} • {sk.years_of_experience}y
                      </span>
                    ))}
                  </div>

                  {/* Portfolio Card Preview */}
                  {talentPortfolios.length > 0 && (
                    <div className="pt-2">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src={talentPortfolios[0].image_url}
                          alt={talentPortfolios[0].title}
                          className="w-full sm:w-28 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-limo-blue">
                            Featured Project Sample
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-limo-navy dark:text-white">
                            {talentPortfolios[0].title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {talentPortfolios[0].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleContact(talent.id)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-limo-navy dark:text-white flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-limo-blue" />
                      <span>Message</span>
                    </button>
                    <Link
                      href={`/freelancers/${talent.id}`}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-sm flex items-center gap-1.5 transition"
                    >
                      <span>View Full Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
