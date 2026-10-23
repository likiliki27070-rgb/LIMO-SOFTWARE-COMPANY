'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { QuoteModal } from '@/components/QuoteModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { Badge } from '@/components/Badge';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Code2,
  Smartphone,
  Cpu,
  Layers,
  Wrench,
  Globe,
  Lock,
  CheckCircle2,
  Users,
  Briefcase,
  ChevronRight,
  Star,
  Plus,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export default function HomePage() {
  const { projects, profiles, skills } = useData();
  const { isAuthenticated, role } = useAuth();

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'clients' | 'freelancers'>('clients');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const agencyServices = [
    {
      id: 'website-development',
      title: 'Website Development',
      icon: Globe,
      description: 'High-performance corporate portals, conversion-tuned landing funnels, and Jamstack architectures.',
      tags: ['Next.js', 'Tailwind CSS', 'SEO', 'Vercel'],
      deliverables: 'Responsive design, Core Web Vitals < 90, CMS integration.',
    },
    {
      id: 'web-applications',
      title: 'Web Applications',
      icon: Code2,
      description: 'Full-stack enterprise SaaS, real-time dashboards, and distributed cloud applications.',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      deliverables: 'Database schema, auth, multi-tenant RBAC, REST/GraphQL APIs.',
    },
    {
      id: 'mobile-applications',
      title: 'Mobile Applications',
      icon: Smartphone,
      description: 'Buttery-smooth cross-platform iOS & Android mobile apps engineered with React Native and Expo.',
      tags: ['React Native', 'Expo', 'iOS', 'Android'],
      deliverables: '60fps UI, offline-first sync, push notifications, App Store compliance.',
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design Systems',
      icon: Layers,
      description: 'World-class product design, accessible design tokens, micro-interactions, and Figma libraries.',
      tags: ['Figma', 'Tokens', 'WCAG AAA', 'Prototyping'],
      deliverables: 'Interactive prototype, design tokens, component library, user journey maps.',
    },
    {
      id: 'ai-integration',
      title: 'AI & LLM Integration',
      icon: Cpu,
      description: 'Autonomous agents, RAG knowledge retrieval, fine-tuned models, and intelligent workflow automation.',
      tags: ['LangChain', 'Vector DB', 'OpenAI', 'Gemini'],
      deliverables: 'Sub-second inference pipelines, evaluation datasets, semantic search.',
    },
    {
      id: 'custom-software',
      title: 'Custom Software',
      icon: Briefcase,
      description: 'Tailored algorithms, logistical routing engines, financial pipelines, and legacy modernization.',
      tags: ['PostgreSQL', 'Python', 'Go', 'Docker'],
      deliverables: 'Targeted business logic, data migrations, unit/integration test suite.',
    },
    {
      id: 'maintenance-support',
      title: 'Maintenance & Support',
      icon: Wrench,
      description: 'Continuous security patching, dependency upgrades, 24/7 uptime monitoring, and SLA backing.',
      tags: ['SLA', 'CI/CD', 'Security', 'Monitoring'],
      deliverables: 'Monthly vulnerability audits, performance tuning, bug fixing sprints.',
    },
  ];

  const featuredProjects = projects.slice(0, 3);
  const featuredFreelancers = profiles.filter((p) => p.role === 'freelancer').slice(0, 3);

  const faqs = [
    {
      q: 'How does LIMO protect client payments and freelancer earnings?',
      a: 'LIMO enforces an auditable milestone-based escrow system. When a contract commences, project funds are deposited securely into escrow. Payments are released only when the client inspects and explicitly approves the submitted milestone deliverables.',
    },
    {
      q: 'What is the difference between the Freelance Marketplace and LIMO Agency Services?',
      a: 'The Freelance Marketplace allows you to post projects and hire independent, verified specialists directly. LIMO Agency Services provides a turn-key managed engineering squad led by senior architects, guaranteed delivery SLAs, and full intellectual property warranty.',
    },
    {
      q: 'How are freelancers vetted on the platform?',
      a: 'Every specialist must pass technical screening, portfolio verification, identity validation, and code architecture review before receiving the verified badge. Only the top applicants are featured in our public directory.',
    },
    {
      q: 'Are there hidden bidding or proposal fees for freelancers?',
      a: 'No. LIMO operates on a transparent, merit-based model with zero bidding fees. A standard platform commission (10%) is deducted only upon successful milestone approval and payment release.',
    },
    {
      q: 'What happens if there is a project dispute?',
      a: 'Authorized platform moderators inspect the complete auditable history: contract terms, submitted code deliverables, milestone notes, and in-platform messaging. Impartial arbitration guarantees fair refunds or payout releases.',
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-24 sm:space-y-32 pb-20 overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-limo-blue/20 via-limo-cyan/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 dark:border-limo-borderDark bg-white/80 dark:bg-limo-cardDark/80 shadow-sm text-xs font-medium text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-sm animate-in fade-in duration-500">
            <span className="flex h-2 w-2 rounded-full bg-limo-blue" />
            <span>Dual-Engine Software Platform:</span>
            <strong className="text-limo-blue dark:text-limo-cyan">Agency Squads + Vetted Marketplace</strong>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-limo-navy dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Build Better. Work Smarter.{' '}
            <span className="bg-gradient-to-r from-limo-blue via-blue-500 to-limo-cyan bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            LIMO unites high-velocity businesses with the world’s top independent software specialists, while providing dedicated turn-key engineering squads for mission-critical web, mobile, and AI systems.
          </p>

          {/* Call-to-Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/projects"
              className="px-8 py-4 rounded-2xl text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-xl shadow-blue-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/freelancers"
              className="px-8 py-4 rounded-2xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-limo-cardDark text-limo-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              <Users className="w-4 h-4 text-limo-blue" />
              <span>Hire Talent</span>
            </Link>

            <button
              onClick={() => {
                setSelectedService(undefined);
                setQuoteModalOpen(true);
              }}
              className="px-8 py-4 rounded-2xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-limo-blue" />
              <span>Request Agency Quote</span>
            </button>
          </div>

          {/* Freelancer Join Callout */}
          <div className="mt-8 text-xs text-slate-500 dark:text-slate-400">
            Are you a senior developer or designer?{' '}
            <Link
              href="/auth/login?role=freelancer"
              className="font-semibold text-limo-blue dark:text-limo-cyan hover:underline"
            >
              Join as a Verified Freelancer &rarr;
            </Link>
          </div>

          {/* Key Metrics / Trust Bar */}
          <div className="mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-limo-cardDark/60 border border-slate-200/60 dark:border-limo-borderDark/60">
              <div className="text-2xl sm:text-3xl font-black text-limo-navy dark:text-white">
                $2.4M+
              </div>
              <div className="text-xs text-slate-500 mt-1">Escrow Volume Secured</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-limo-cardDark/60 border border-slate-200/60 dark:border-limo-borderDark/60">
              <div className="text-2xl sm:text-3xl font-black text-limo-blue">
                99.8%
              </div>
              <div className="text-xs text-slate-500 mt-1">On-Time Milestone SLA</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-limo-cardDark/60 border border-slate-200/60 dark:border-limo-borderDark/60">
              <div className="text-2xl sm:text-3xl font-black text-limo-navy dark:text-white">
                Top 1%
              </div>
              <div className="text-xs text-slate-500 mt-1">Vetted Technical Talent</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-limo-cardDark/60 border border-slate-200/60 dark:border-limo-borderDark/60">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <div className="text-xs text-slate-500 mt-1">Payment Escrow Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. DIRECT SOFTWARE DEVELOPMENT AGENCY SERVICES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
            Core Service Model #1
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white mt-1">
            LIMO Software Development Agency
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Don’t have time to manage individual freelancers? Partner directly with our dedicated technical squads. We design, architect, ship, and maintain your software with turnkey accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencyServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group p-6 sm:p-7 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark hover:border-limo-blue dark:hover:border-limo-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-limo-blue flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-limo-navy dark:text-white mb-2">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <strong>Includes:</strong> {service.deliverables}
                  </p>
                </div>

                <div className="pt-6 mt-4">
                  <button
                    onClick={() => {
                      setSelectedService(service.title);
                      setQuoteModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-limo-blue hover:text-white dark:hover:bg-limo-blue text-limo-navy dark:text-white border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Request a Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (CLIENTS VS FREELANCERS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100/70 dark:bg-limo-cardDark/50 border border-slate-200 dark:border-limo-borderDark">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
              Seamless Process
            </span>
            <h2 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
              How LIMO Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              From contract scoping to milestone acceptance and payout, enjoy a transparent, frictionless experience.
            </p>

            {/* Workflow Switcher Tabs */}
            <div className="inline-flex p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-6">
              <button
                onClick={() => setActiveWorkflowTab('clients')}
                className={`py-2 px-6 rounded-xl text-xs font-bold transition ${
                  activeWorkflowTab === 'clients'
                    ? 'bg-limo-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-limo-navy dark:hover:text-white'
                }`}
              >
                For Clients & Businesses
              </button>
              <button
                onClick={() => setActiveWorkflowTab('freelancers')}
                className={`py-2 px-6 rounded-xl text-xs font-bold transition ${
                  activeWorkflowTab === 'freelancers'
                    ? 'bg-limo-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-limo-navy dark:hover:text-white'
                }`}
              >
                For Freelance Engineers
              </button>
            </div>
          </div>

          {activeWorkflowTab === 'clients' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-limo-blue flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Post Your Project</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Define technical scope, required skills, budget range, and deadlines in under 2 minutes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-limo-blue flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Review Verified Bids</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compare proposals, inspect real portfolios, check client ratings, and initiate direct chat.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-limo-blue flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Deposit to Escrow</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Funds remain safely protected in auditable escrow until milestone deliverables meet your quality criteria.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-limo-blue flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Approve & Release</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Inspect code and staging links, request revisions if needed, and release funds upon complete satisfaction.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Create Profile & Portfolio</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Showcase GitHub repos, Figma prototypes, hourly rate, and validated skill proficiencies.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Bid with Zero Fees</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Submit tailored proposals, suggest timeline breakdowns, and pitch directly without bidding token fees.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Deliver Milestones</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Work with peace of mind knowing the client has funded escrow prior to your development kickoff.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-base text-limo-navy dark:text-white">Receive Rapid Payouts</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Earnings are instantly credited to your platform balance for direct bank transfer or Stripe payout.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED MARKETPLACE PROJECTS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
              Live Opportunities
            </span>
            <h2 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
              Featured Client Projects
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Verified businesses actively seeking specialized engineering talent.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewProjectModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-limo-blue text-white hover:bg-limo-blueHover flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post a Project</span>
            </button>
            <Link
              href="/projects"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-limo-navy dark:text-white flex items-center gap-1.5 transition"
            >
              <span>View All Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-limo-blue bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                    {project.category}
                  </span>
                  <Badge label={project.status} variant={project.status} size="sm" />
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="font-bold text-lg text-limo-navy dark:text-white hover:text-limo-blue line-clamp-2 transition"
                >
                  {project.title}
                </Link>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-2.5 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.required_skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Budget Range</div>
                  <div className="font-bold text-sm text-limo-navy dark:text-white">
                    ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()}
                  </div>
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-limo-blue hover:text-white dark:hover:bg-limo-blue text-limo-navy dark:text-white transition"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED TALENT DIRECTORY
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
              Vetted Engineering Squad
            </span>
            <h2 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
              Top Verified Freelancers
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Explore profiles of senior engineers and designers ready for contract work.
            </p>
          </div>

          <Link
            href="/freelancers"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-limo-navy dark:text-white flex items-center gap-1.5 transition"
          >
            <span>Browse Full Talent Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFreelancers.map((talent) => (
            <div
              key={talent.id}
              className="p-6 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={talent.avatar_url}
                    alt={talent.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/freelancers/${talent.id}`}
                        className="font-bold text-base text-limo-navy dark:text-white hover:text-limo-blue transition"
                      >
                        {talent.full_name}
                      </Link>
                      {talent.is_verified && (
                        <ShieldCheck className="w-4 h-4 text-limo-blue shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {talent.headline}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{talent.location}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {talent.availability_status === 'available' ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {talent.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {skills
                    .filter((s) => s.freelancer_id === talent.id)
                    .map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {sk.skill_name}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Rate</div>
                  <div className="font-black text-sm text-limo-navy dark:text-white">
                    ${talent.hourly_rate}/hr
                  </div>
                </div>

                <Link
                  href={`/freelancers/${talent.id}`}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-limo-blue text-white hover:bg-limo-blueHover transition shadow-sm"
                >
                  View Profile &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. BENEFITS COMPARISON GRID
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
            Mutual Value
          </span>
          <h2 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
            Built for High-Trust Collaboration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Benefits */}
          <div className="p-8 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-limo-blue text-white flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-limo-navy dark:text-white">
                Why Clients Choose LIMO
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limo-blue shrink-0 mt-0.5" />
                <span><strong>Auditable Escrow Protection:</strong> Pay only when satisfied deliverables are approved.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limo-blue shrink-0 mt-0.5" />
                <span><strong>Top 1% Technical Vetting:</strong> Avoid interviewing hundreds of unqualified candidates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limo-blue shrink-0 mt-0.5" />
                <span><strong>Direct Agency Backup:</strong> Transition seamlessly to LIMO in-house engineering squads if your project scales.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limo-blue shrink-0 mt-0.5" />
                <span><strong>100% IP & Code Ownership:</strong> Immediate transfer of all repositories, copyright, and patent rights.</span>
              </li>
            </ul>
          </div>

          {/* Freelancer Benefits */}
          <div className="p-8 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-limo-navy dark:text-white">
                Why Engineers Love LIMO
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span><strong>Zero Bidding Fees:</strong> Never pay tokens or connect credits to submit proposals for high-paying contracts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span><strong>Guaranteed Escrow:</strong> Development begins only after client funds are safely locked in custody.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span><strong>High-Tier Modern Stack:</strong> Work on production Next.js, React Native, TypeScript, and AI integrations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span><strong>Direct Fast Payouts:</strong> Automated transfers to verified bank accounts or Stripe with zero arbitrary holds.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FAQ ACCORDION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-extrabold text-limo-navy dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-limo-borderDark bg-white dark:bg-limo-cardDark overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-limo-navy dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-limo-blue' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-limo-navy via-limo-navyLight to-limo-blue text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Digital Roadmap?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Whether you need a dedicated software engineering squad or wish to hire an elite freelance specialist, LIMO provides verified talent, escrow protection, and turnkey delivery.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setSelectedService(undefined);
                  setQuoteModalOpen(true);
                }}
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white text-limo-navy hover:bg-slate-100 transition shadow-lg"
              >
                Request a Dedicated Quote
              </button>
              <button
                onClick={() => setNewProjectModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white border border-white/20 transition"
              >
                Post Marketplace Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultService={selectedService}
      />
      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
      />
    </div>
  );
}
