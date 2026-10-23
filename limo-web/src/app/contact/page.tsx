'use client';

import React, { useState } from 'react';
import { Mail, Clock, ShieldCheck, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [department, setDepartment] = useState('Enterprise Agency Solutions');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
          Contact the LIMO Team
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          Have questions regarding direct software engineering quotes, platform moderation, escrow payments, or technical vetting? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark text-center space-y-2">
          <Mail className="w-6 h-6 text-limo-blue mx-auto" />
          <h3 className="font-bold text-sm text-limo-navy dark:text-white">Direct Email</h3>
          <p className="text-xs text-slate-500">support@limo.dev</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark text-center space-y-2">
          <Clock className="w-6 h-6 text-limo-blue mx-auto" />
          <h3 className="font-bold text-sm text-limo-navy dark:text-white">Response SLA</h3>
          <p className="text-xs text-slate-500">Within 24 business hours</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark text-center space-y-2">
          <ShieldCheck className="w-6 h-6 text-limo-blue mx-auto" />
          <h3 className="font-bold text-sm text-limo-navy dark:text-white">Mediation Support</h3>
          <p className="text-xs text-slate-500">Disputes & escrow reviews</p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-limo-navy dark:text-white">
              Message Sent!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Thank you, <strong>{name}</strong>. Your message regarding <strong>{department}</strong> has been assigned to our operations team. We will respond to <strong>{email}</strong> shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                setSubject('');
              }}
              className="mt-4 px-6 py-2.5 rounded-xl text-xs font-semibold bg-limo-blue text-white"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department Routing *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              >
                <option value="Enterprise Agency Solutions">Enterprise Agency Solutions</option>
                <option value="Marketplace Support & Disputes">Marketplace Support & Disputes</option>
                <option value="Freelancer Verification & Onboarding">Freelancer Verification & Onboarding</option>
                <option value="Billing & Escrow Reconciliation">Billing & Escrow Reconciliation</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                placeholder="Brief summary of inquiry..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Explain your requirements or details of your request..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
