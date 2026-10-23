'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/Badge';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  DollarSign,
  MessageSquare,
  ExternalLink,
  Award,
  Layers,
  MapPin,
  Clock,
} from 'lucide-react';

export default function FreelancerProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { profiles, skills, portfolios, reviews, startOrGetConversation } = useData();
  const { user } = useAuth();

  const freelancer = useMemo(() => profiles.find((p) => p.id === id), [profiles, id]);
  const freelancerSkills = useMemo(
    () => skills.filter((s) => s.freelancer_id === id),
    [skills, id]
  );
  const freelancerPortfolios = useMemo(
    () => portfolios.filter((p) => p.freelancer_id === id),
    [portfolios, id]
  );
  const freelancerReviews = useMemo(
    () => reviews.filter((r) => r.reviewee_id === id),
    [reviews, id]
  );

  if (!freelancer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-limo-navy dark:text-white">
          Freelancer Profile Not Found
        </h2>
        <Link
          href="/freelancers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-limo-blue text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Talent Directory</span>
        </Link>
      </div>
    );
  }

  const handleStartChat = () => {
    const conv = startOrGetConversation(freelancer.id);
    router.push(`/dashboard/messages?conv=${conv.id}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/freelancers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-limo-blue transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Talent Directory</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={freelancer.avatar_url}
              alt={freelancer.full_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-700 shadow-md shrink-0"
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-limo-navy dark:text-white">
                  {freelancer.full_name}
                </h1>
                {freelancer.is_verified && (
                  <span title="Verified by LIMO">
                    <ShieldCheck className="w-6 h-6 text-limo-blue shrink-0" />
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {freelancer.headline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {freelancer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {freelancer.timezone}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                  {freelancer.availability_status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <div className="sm:text-right">
              <span className="text-xs text-slate-400 block">Standard Rate</span>
              <span className="text-3xl font-black text-limo-navy dark:text-white">
                ${freelancer.hourly_rate}
                <span className="text-sm font-normal text-slate-400">/hr</span>
              </span>
            </div>

            <button
              onClick={handleStartChat}
              className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact / Hire Specialist</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Professional Overview
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {freelancer.bio}
          </p>
        </div>

        {/* Verified Skills */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Technical Proficiencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {freelancerSkills.map((sk) => (
              <div
                key={sk.id}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
              >
                <div className="font-bold text-xs text-limo-navy dark:text-white">
                  {sk.skill_name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {sk.years_of_experience} years • {sk.proficiency_level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      {freelancerPortfolios.length > 0 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
              Verified Track Record
            </span>
            <h2 className="text-xl font-bold text-limo-navy dark:text-white mt-0.5">
              Portfolio & Featured Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freelancerPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 overflow-hidden space-y-4 p-5"
              >
                {portfolio.image_url && (
                  <img
                    src={portfolio.image_url}
                    alt={portfolio.title}
                    className="w-full h-44 rounded-xl object-cover"
                  />
                )}
                <div>
                  <h3 className="font-bold text-base text-limo-navy dark:text-white">
                    {portfolio.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                    {portfolio.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {portfolio.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {portfolio.project_url && (
                  <a
                    href={portfolio.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-limo-blue hover:underline pt-1"
                  >
                    <span>Inspect Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Reviews Section */}
      {freelancerReviews.length > 0 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
                Client Testimonials
              </span>
              <h2 className="text-xl font-bold text-limo-navy dark:text-white mt-0.5">
                Ratings & Verified Reviews
              </h2>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>5.0 Verified Score</span>
            </div>
          </div>

          <div className="space-y-4">
            {freelancerReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.reviewer_avatar}
                      alt={rev.reviewer_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-limo-navy dark:text-white block">
                        {rev.reviewer_name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
