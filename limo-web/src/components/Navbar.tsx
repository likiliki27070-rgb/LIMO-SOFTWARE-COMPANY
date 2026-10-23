'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LimoWordmark } from './LimoWordmark';
import { PersonaSwitcherModal } from './PersonaSwitcherModal';
import { QuoteModal } from './QuoteModal';
import { Badge } from './Badge';
import {
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  User,
  ArrowRight,
  Shield,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { user, role, isAuthenticated, signOut } = useAuth();

  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Agency Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Find Talent', href: '/freelancers' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const getDashboardHref = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'freelancer') return '/dashboard/freelancer';
    return '/dashboard/client';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-limo-borderDark/80 bg-white/90 dark:bg-limo-navyDark/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <LimoWordmark size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-limo-blue dark:text-limo-cyan font-semibold bg-blue-50/70 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-limo-navy dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Header Controls & CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Direct Agency Quote CTA */}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-limo-blue" />
              <span>Get a Quote</span>
            </button>

            {/* Persona Switcher Dropdown Button */}
            <button
              onClick={() => setPersonaModalOpen(true)}
              title="Switch demo role (Client, Freelancer, Admin)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs font-semibold text-limo-navy dark:text-white max-w-[90px] truncate">
                {user?.full_name.split(' ')[0] || 'User'}
              </span>
              <Badge label={role} variant={role} size="sm" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            {isAuthenticated ? (
              <Link
                href={getDashboardHref()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-limo-borderDark bg-white dark:bg-limo-cardDark px-4 py-5 space-y-4 shadow-xl">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <button
                onClick={() => {
                  setPersonaModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user?.avatar_url}
                    alt={user?.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {user?.full_name}
                  </span>
                </div>
                <Badge label={role} variant={role} size="sm" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setQuoteModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-center"
                >
                  Request Quote
                </button>
                <Link
                  href={isAuthenticated ? getDashboardHref() : '/auth/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-limo-blue text-white text-center"
                >
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <PersonaSwitcherModal
        isOpen={personaModalOpen}
        onClose={() => setPersonaModalOpen(false)}
      />
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </>
  );
}
