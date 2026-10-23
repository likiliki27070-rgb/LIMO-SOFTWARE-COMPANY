'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/QuoteModal';
import {
  Globe,
  Code2,
  Smartphone,
  Layers,
  Cpu,
  Briefcase,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function ServicesPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const services = [
    {
      id: 'website-development',
      title: 'Website Development',
      badge: 'Core Service',
      icon: Globe,
      tagline: 'High-speed, SEO-optimized digital storefronts and corporate portals.',
      description:
        'We engineer modern websites with Next.js, React, and Tailwind CSS tailored for ultra-fast load times (sub-second LCP), high conversion rates, responsive mobile layout, and seamless headless CMS content management.',
      deliverables: [
        'Responsive layout across mobile, tablet, and desktop',
        'Lighthouse performance score 95+ and Core Web Vitals optimization',
        'Headless CMS integration (Sanity, Strapi, or Contentful)',
        'Enterprise SEO schema markup, OpenGraph tags, and sitemaps',
        'Accessibility compliance (WCAG 2.1 AA)',
      ],
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Vercel'],
      startingTimeline: '2 to 4 weeks',
      typicalBudget: '$5,000 – $15,000',
    },
    {
      id: 'web-applications',
      title: 'Web Applications',
      badge: 'High Demand',
      icon: Code2,
      tagline: 'Scalable cloud SaaS applications and real-time workstations.',
      description:
        'Architected from the ground up for security, high concurrency, and data integrity. We build multi-tenant SaaS platforms, administrative portals, analytics engines, and subscription platforms with distributed relational databases.',
      deliverables: [
        'PostgreSQL relational database schema with Row Level Security',
        'Multi-tenant authentication, RBAC, and session management',
        'Interactive real-time dashboards with WebSockets or SSE',
        'Stripe billing, subscription webhooks, and invoice generation',
        'Comprehensive unit and integration test suite',
      ],
      technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Supabase', 'Docker'],
      startingTimeline: '6 to 12 weeks',
      typicalBudget: '$12,000 – $35,000',
    },
    {
      id: 'mobile-applications',
      title: 'Mobile Application Development',
      badge: 'Featured',
      icon: Smartphone,
      tagline: 'Cross-platform iOS and Android mobile apps engineered with React Native and Expo.',
      description:
        'Deliver 60fps native performance from a single maintainable TypeScript codebase. We specialize in offline-first encrypted storage, camera/biometric hardware integration, push notifications, and App Store submission workflows.',
      deliverables: [
        'Universal iOS & Android mobile application using Expo Router',
        'Biometric authentication (FaceID, TouchID, Fingerprint)',
        'Push notifications with badge counters and deeplinks',
        'Offline SQLite sync and local state persistence',
        'Apple App Store and Google Play Store submission management',
      ],
      technologies: ['React Native', 'Expo', 'TypeScript', 'EAS Build', 'SQLite'],
      startingTimeline: '6 to 10 weeks',
      typicalBudget: '$15,000 – $40,000',
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design Systems',
      badge: 'Creative Studio',
      icon: Layers,
      tagline: 'Design systems, high-converting product UX, and Figma tokens.',
      description:
        'Elevate your brand with minimalist, high-converting interfaces. We produce comprehensive multi-brand design systems, interactive Figma prototypes, design tokens, and user flow architectures ready for front-end implementation.',
      deliverables: [
        'Complete Figma design token system (colors, typography, spacing, shadows)',
        'Component variants with interactive states (hover, focus, active, disabled)',
        'Dark and light mode palettes tested for AAA contrast',
        'Clickable high-fidelity prototyping and user test recordings',
        'Design-to-code handoff documentation for engineering squads',
      ],
      technologies: ['Figma', 'Tokens Studio', 'WCAG AAA', 'Prototyping'],
      startingTimeline: '3 to 6 weeks',
      typicalBudget: '$6,000 – $18,000',
    },
    {
      id: 'ai-integration',
      title: 'AI & LLM Integration',
      badge: 'Next-Gen',
      icon: Cpu,
      tagline: 'Vector search, retrieval-augmented generation (RAG), and autonomous agents.',
      description:
        'Transform your product with custom generative AI capabilities. We integrate state-of-the-art LLMs, build proprietary vector embeddings, implement automated document triage, and deploy conversational intelligence pipelines.',
      deliverables: [
        'Vector database indexing and semantic search (pgvector, Pinecone)',
        'RAG pipeline connected to private enterprise documents',
        'Autonomous agent function-calling workflows',
        'Prompt engineering, guardrails, and toxic output filtering',
        'Evaluation benchmarks and latency caching layers',
      ],
      technologies: ['LangChain', 'pgvector', 'OpenAI', 'Gemini', 'Python'],
      startingTimeline: '4 to 8 weeks',
      typicalBudget: '$15,000 – $45,000',
    },
    {
      id: 'custom-software',
      title: 'Custom Software Development',
      badge: 'Enterprise',
      icon: Briefcase,
      tagline: 'Tailored backend algorithms, logistical routing engines, and data pipelines.',
      description:
        'When off-the-shelf software falls short, our senior architects build proprietary tools designed specifically for your operational workflows, telemetry tracking, ERP integrations, and legacy modernization.',
      deliverables: [
        'Custom algorithmic computation engine with load benchmarking',
        'Third-party legacy API integration and asynchronous queues',
        'Database migration scripts with zero-downtime execution',
        'Microservice containerization with Docker and Kubernetes',
        'Architecture documentation and transfer workshops',
      ],
      technologies: ['PostgreSQL', 'Go', 'Python', 'Redis', 'Kafka'],
      startingTimeline: '8 to 16 weeks',
      typicalBudget: '$20,000 – $60,000+',
    },
    {
      id: 'maintenance-support',
      title: 'Website & Application Maintenance',
      badge: 'SLA Backed',
      icon: Wrench,
      tagline: 'Continuous security patching, 24/7 uptime monitoring, and SLA backing.',
      description:
        'Protect your digital infrastructure with dedicated ongoing maintenance. We handle security vulnerabilities, dependency deprecations, performance monitoring, infrastructure autoscaling, and emergency incident resolution.',
      deliverables: [
        'Monthly dependency security audits and patch deployments',
        '24/7 automated uptime, latency, and error rate monitoring',
        'Database vacuuming, backup verification, and disaster recovery drills',
        'Guaranteed 1-hour response SLA for critical production incidents',
        'Dedicated monthly sprint hours for feature iterations',
      ],
      technologies: ['CI/CD', 'Sentry', 'Datadog', 'AWS', 'Vercel'],
      startingTimeline: 'Ongoing Monthly SLA',
      typicalBudget: '$1,500 – $5,000 / month',
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-20 py-12">
      {/* Services Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 text-xs font-semibold text-limo-blue dark:text-limo-cyan mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LIMO Dedicated Software Engineering Squads</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-limo-navy dark:text-white tracking-tight max-w-4xl mx-auto">
          World-Class Digital Products Built by{' '}
          <span className="bg-gradient-to-r from-limo-blue to-limo-cyan bg-clip-text text-transparent">
            Senior Specialists
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From full-stack web applications and cross-platform mobile apps to generative AI pipelines and round-the-clock maintenance, LIMO turns complex requirements into elegant, high-performance software.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              setSelectedService(undefined);
              setQuoteModalOpen(true);
            }}
            className="px-8 py-3.5 rounded-2xl text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-xl shadow-blue-500/25 flex items-center gap-2 transition"
          >
            <span>Request a Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Services Grid with Complete Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={service.id}
              id={service.id}
              className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Description Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-limo-blue flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-limo-blue">
                        {service.badge}
                      </span>
                      <h2 className="text-2xl font-bold text-limo-navy dark:text-white">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
                    {service.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Tech stack */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-500 block mb-2">
                      Core Technology Stack:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Deliverables & CTA Column */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-4 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-limo-navy dark:text-white mb-3 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-limo-blue" />
                      <span>Standard Deliverables & Guarantees</span>
                    </h3>

                    <ul className="space-y-2.5">
                      {service.deliverables.map((del, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Typical Budget</span>
                        <strong className="text-sm font-bold text-limo-navy dark:text-white">
                          {service.typicalBudget}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Delivery SLA</span>
                        <strong className="text-sm font-bold text-limo-blue">
                          {service.startingTimeline}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSelectedService(service.title);
                        setQuoteModalOpen(true);
                      }}
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Request a Quote for {service.title}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultService={selectedService}
      />
    </div>
  );
}
