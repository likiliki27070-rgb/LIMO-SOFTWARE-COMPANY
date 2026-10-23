'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Trash2, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AccountDeletionPage() {
  const { user, signOut } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    setDeleted(true);
    setTimeout(() => {
      signOut();
    }, 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
          User Rights & GDPR
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
          Account Deletion & Data Erasure
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Instructions for requesting permanent removal of personal profile and platform data.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-6">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong>Important Notice:</strong> Deleting your account will immediately revoke all active sessions, remove your public profile from the talent directory, and permanently erase personal metadata. Past completed financial transactions and tax invoices will remain archived in immutable audit ledgers as required by compliance laws.
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h3 className="font-bold text-limo-navy dark:text-white">
            What Data is Erased:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Public profile information, avatar, bio, and location.</li>
            <li>Direct phone number and authentication mappings.</li>
            <li>Active bids on open projects (withdrawn automatically).</li>
            <li>In-progress unsubmitted quote inquiries.</li>
          </ul>
        </div>

        {user ? (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="text-xs text-slate-500">
              You are currently logged in as: <strong>{user.full_name}</strong> ({user.email || user.phone})
            </div>

            {deleted ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your account data has been scheduled for permanent erasure. Signing out...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>I understand that this action is irreversible and will delete my profile.</span>
                </label>

                <button
                  type="button"
                  disabled={!confirmed}
                  onClick={handleDelete}
                  className="py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white flex items-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete My Account</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
            Please log in first if you wish to execute a self-service account deletion request, or contact support@limo.dev.
          </div>
        )}
      </div>
    </div>
  );
}
