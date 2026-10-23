'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SEED_PROFILES } from '@/lib/seed-data';
import { Badge } from './Badge';
import { X, Check, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

interface PersonaSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonaSwitcherModal({ isOpen, onClose }: PersonaSwitcherModalProps) {
  const { user, switchPersona } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-limo-blue" />
              <h3 className="text-lg font-bold text-limo-navy dark:text-white">
                Platform Persona Switcher
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch roles to experience client hiring, freelance bidding, or administrative moderation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona List */}
        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SEED_PROFILES.map((profile) => {
            const isCurrent = user?.id === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => {
                  switchPersona(profile.id);
                  onClose();
                }}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-limo-blue bg-blue-50/60 dark:bg-blue-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-limo-navy dark:text-white truncate">
                        {profile.full_name}
                      </span>
                      {profile.is_verified && (
                        <ShieldCheck className="w-4 h-4 text-limo-blue shrink-0" />
                      )}
                    </div>
                    <Badge label={profile.role} variant={profile.role} size="sm" />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {profile.headline}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span>{profile.location}</span>
                    {profile.hourly_rate > 0 && (
                      <span>${profile.hourly_rate}/hr</span>
                    )}
                  </div>
                </div>

                {isCurrent && (
                  <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-limo-blue text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Active Role: <strong className="text-limo-blue capitalize">{user?.role || 'Guest'}</strong></span>
          <span className="text-[11px]">Enforces strict PostgreSQL RLS policies</span>
        </div>
      </div>
    </div>
  );
}
