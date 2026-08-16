import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
  Lightbulb,
  Target,
  Layers,
  Award,
  Users,
  Compass,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterviewPrep } from '../services/api';

const CATEGORIES = [
  { id: 'all', label: 'All Questions', count: 6 },
  { id: 'Technical Gap', label: 'Technical Gaps', count: 3 },
  { id: 'System Design / Architecture', label: 'System Design', count: 2 },
  { id: 'Behavioral & Leadership', label: 'Behavioral', count: 1 },
];

export default function InterviewPrep({
  isOpen,
  onClose,
  matchedSkills = [],
  missingSkills = [],
  targetRole = 'Senior Software Engineer',
  seniorityLevel = 'Senior',
  jobDescription = '',
  resumeText = '',
}) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedIds, setExpandedIds] = useState([1, 2]); // Expand top 2 by default
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, targetRole, seniorityLevel]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await getInterviewPrep({
        matchedSkills,
        missingSkills,
        targetRole,
        seniorityLevel,
        jobDescription,
        resumeText,
      });

      if (data && data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to load interview prep questions:', err);
      // Fallback questions
      setQuestions(generateFallbackQuestions());
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuestions = () => [
    {
      id: 1,
      question: `The job description emphasizes hands-on experience with Docker/Kubernetes. How would you containerize a multi-tier service and configure auto-scaling for peak loads?`,
      category: 'Technical Gap',
      difficulty: 'Senior',
      targeted_skill: 'Docker & Kubernetes',
      why_interviewer_asks_this:
        'The interviewer wants to evaluate whether you understand container lifecycle, multi-stage builds, and Kubernetes Horizontal Pod Autoscaler (HPA) without introducing deployment instability.',
      star_framework_outline: {
        situation: 'Our microservices had environment discrepancies between staging and cloud deployments.',
        task: 'Standardize deployments with Docker and implement automated scaling via Kubernetes.',
        action: 'Authored multi-stage Dockerfiles with distroless images and configured HPA targeting 70% CPU/Memory with graceful shutdown hooks.',
        result: 'Decreased container image size by 65% and achieved 99.95% availability during traffic spikes.',
        full_outline:
          '• Situation: Multi-tier microservice environment inconsistencies.\n• Task: Standardize Docker images and configure Kubernetes auto-scaling.\n• Action: Multi-stage builds, distroless images, HPA targeting 70% utilization.\n• Result: 65% smaller image sizes and zero downtime during traffic surges.',
      },
      keywords_to_mention: ['Multi-stage Docker builds', 'Horizontal Pod Autoscaler (HPA)', 'Liveness/Readiness probes', 'Distroless images'],
    },
    {
      id: 2,
      question: `How would you architect a secure and cost-effective cloud infrastructure on AWS for high-throughput APIs?`,
      category: 'Technical Gap',
      difficulty: 'Senior',
      targeted_skill: 'AWS Infrastructure',
      why_interviewer_asks_this:
        'Evaluates architectural breadth across cloud compute (ECS/Fargate), IAM least-privilege security, and VPC networking.',
      star_framework_outline: {
        situation: 'Legacy monolithic compute had manual scaling and single-point-of-failure vulnerabilities.',
        task: 'Modernize infrastructure on AWS with automated failover and secure networking.',
        action: 'Provisioned multi-AZ VPC subnets, deployed containerized tasks to AWS Fargate behind an ALB, and applied IAM least-privilege policies.',
        result: 'Reduced infrastructure costs by 32% while handling 3x higher throughput with automated Multi-AZ failover.',
        full_outline:
          '• Situation: Legacy compute had manual scaling limits.\n• Task: Migrate to AWS serverless/containerized setup.\n• Action: Multi-AZ subnets, AWS Fargate, Application Load Balancers, IAM security.\n• Result: 32% cost reduction and automatic failover.',
      },
      keywords_to_mention: ['AWS ECS/Fargate', 'VPC Subnets', 'IAM Least Privilege', 'Application Load Balancer', 'RDS Multi-AZ'],
    },
    {
      id: 3,
      question: `Describe how you design a resilient CI/CD pipeline that balances fast developer feedback with automated regression testing and canary rollouts.`,
      category: 'Technical Gap',
      difficulty: 'Mid',
      targeted_skill: 'CI/CD & Reliability',
      why_interviewer_asks_this:
        'Verifies your engineering standards, test pyramid adoption, and risk mitigation strategies during frequent releases.',
      star_framework_outline: {
        situation: 'Manual deployments frequently introduced regressions and delayed release cycles.',
        task: 'Automate build, test, and staged canary deployment pipelines.',
        action: 'Built GitHub Actions pipelines with parallel unit/integration test suites, container vulnerability scans, and automated canary rollbacks.',
        result: 'Accelerated deployment cycle frequency from bi-weekly to daily with zero major release incidents.',
        full_outline:
          '• Situation: Manual releases caused regression delays.\n• Task: Build automated CI/CD testing gates.\n• Action: GitHub Actions, parallel test suites, vulnerability scans, canary rollback.\n• Result: Daily deployments achieved with zero regression incidents.',
      },
      keywords_to_mention: ['GitHub Actions', 'Automated Test Suites', 'Canary Releases', 'Container Security Scanning', 'Zero-downtime Rollback'],
    },
    {
      id: 4,
      question: `Design a high-scale backend system for ${targetRole} that handles 10,000+ requests per second with sub-50ms latency. How do you design the data layer and caching?`,
      category: 'System Design / Architecture',
      difficulty: 'Senior',
      targeted_skill: 'High Concurrency & Caching',
      why_interviewer_asks_this:
        'Evaluates architectural trade-offs between P99 latency, caching strategies (Redis), database read replicas, and rate limiting.',
      star_framework_outline: {
        situation: 'Primary database faced connection pool exhaustion during flash traffic surges.',
        task: 'Redesign architecture to guarantee sub-50ms latency under 10k req/sec load.',
        action: 'Placed Redis caching with LRU eviction in front of read endpoints, added token-bucket rate limiting, and configured PostgreSQL read replicas.',
        result: 'Maintained P99 latency of 34ms and offloaded 78% of read queries from the primary database.',
        full_outline:
          '• Situation: Database connection exhaustion during traffic peaks.\n• Task: Sustain 10k req/sec with <50ms latency.\n• Action: Redis Cache-Aside, Token-bucket rate limiting, PostgreSQL read replicas.\n• Result: P99 latency under 34ms with 78% database load reduction.',
      },
      keywords_to_mention: ['Redis Cache-Aside', 'Read Replicas', 'Token-Bucket Rate Limiting', 'Connection Pooling', 'P99 Latency'],
    },
    {
      id: 5,
      question: `How do you execute zero-downtime database schema migrations on a live production database with millions of active records?`,
      category: 'System Design / Architecture',
      difficulty: 'Senior',
      targeted_skill: 'Zero-Downtime Migrations',
      why_interviewer_asks_this:
        'Hiring managers check practical production experience avoiding table locks and downtime during structural database changes.',
      star_framework_outline: {
        situation: 'A critical release required modifying schema across 15 million rows without downtime.',
        task: 'Execute schema evolution with 0% downtime and backward compatibility.',
        action: 'Implemented the expand-contract pattern: added nullable columns, dual-wrote application records, backfilled historical data asynchronously, and phased out legacy columns.',
        result: 'Completed migration across 15M records with zero table locks, zero downtime, and 100% data integrity.',
        full_outline:
          '• Situation: Modifying table structure across 15M active rows.\n• Task: Zero-downtime schema evolution.\n• Action: Expand-contract pattern, dual-writing, asynchronous batch backfill.\n• Result: Completed with zero table locking delays and zero downtime.',
      },
      keywords_to_mention: ['Expand-Contract Pattern', 'Dual-Writing', 'Asynchronous Batch Backfill', 'Zero Table Locks', 'Backward Compatibility'],
    },
    {
      id: 6,
      question: `Tell me about a time when you had a significant technical disagreement with a team member regarding architecture or deadlines. How did you resolve it?`,
      category: 'Behavioral & Leadership',
      difficulty: 'All Levels',
      targeted_skill: 'Conflict Resolution & Alignment',
      why_interviewer_asks_this:
        'Assesses emotional intelligence, communication skills, objective data-driven decision making, and team collaboration under pressure.',
      star_framework_outline: {
        situation: 'Team was divided between complex microservices vs a modular monolith for a tight Q3 deadline.',
        task: 'Align engineering and product stakeholders on a pragmatic path forward.',
        action: 'Facilitated an objective trade-off matrix and built a 2-day proof of concept demonstrating modular monolith feasibility.',
        result: 'Unified team behind the modular plan, delivered 1 week early, and successfully scaled to 500k users.',
        full_outline:
          '• Situation: Team split between microservices vs modular monolith.\n• Task: Align team to meet tight deadline without long-term debt.\n• Action: Objective trade-off matrix and rapid 2-day proof of concept.\n• Result: Delivered 1 week ahead of schedule and scaled seamlessly.',
      },
      keywords_to_mention: ['Objective Trade-off Matrix', 'Proof of Concept (PoC)', 'Data-driven Decisions', 'Active Listening', 'Pragmatic Engineering'],
    },
  ];

  const toggleAccordion = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((item) => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const handleCopyAnswer = (q) => {
    const textToCopy = `Question: ${q.question}
Targeted Skill: ${q.targeted_skill} (${q.category})
Interviewer's Intent: ${q.why_interviewer_asks_this}

Recommended STAR Answer Outline:
${q.star_framework_outline?.full_outline || ''}

Key Technical Keywords to Mention:
${(q.keywords_to_mention || []).join(', ')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(q.id);
    showToast(`Answer guide for Question #${q.id} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const filteredQuestions =
    activeTab === 'all'
      ? questions
      : questions.filter((q) => q.category === activeTab);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        {/* Toast Notification */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-950 text-white shadow-2xl border border-zinc-700 flex items-center space-x-2.5 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[94vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    AI Mock Interview Prep & ATS Gap Strategy
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    STAR Method
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Targeted questions and structured answering guides based on identified ATS skill gaps.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner & Category Tabs */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-zinc-850/80 border-b border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-zinc-950 dark:bg-zinc-800 text-white border-zinc-950 dark:border-zinc-700 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Target Role:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                {targetRole}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                {seniorityLevel} Level
              </span>
            </div>
          </div>

          {/* Questions Accordion List Area */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50 dark:bg-zinc-950/40">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Synthesizing ATS skill gaps and generating STAR interview guides...
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">No questions found in this category.</p>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isExpanded = expandedIds.includes(q.id);

                const difficultyColor =
                  q.difficulty === 'Senior'
                    ? 'bg-purple-100/70 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                    : q.difficulty === 'Mid'
                    ? 'bg-sky-100/70 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                    : 'bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

                const categoryColor =
                  q.category === 'Technical Gap'
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : q.category === 'System Design / Architecture'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm overflow-hidden hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
                  >
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleAccordion(q.id)}
                      className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3 select-none hover:bg-slate-50/50 dark:hover:bg-zinc-850/50 transition-colors"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-zinc-950 dark:bg-zinc-800 text-white text-[11px] font-bold flex items-center justify-center border border-zinc-800 dark:border-zinc-700">
                            #{q.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${categoryColor}`}>
                            {q.category}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${difficultyColor}`}>
                            {q.difficulty}
                          </span>
                          {q.targeted_skill && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold border border-slate-200 dark:border-zinc-700">
                              Gap: {q.targeted_skill}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          "{q.question}"
                        </h4>
                      </div>

                      <div className="p-1 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mt-1 shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Accordion Collapsible Body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-100 dark:border-zinc-800 space-y-4"
                        >
                          {/* Why Interviewer Asks This */}
                          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs">
                            <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-1.5 mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span>Interviewer's Evaluation Intent:</span>
                            </div>
                            <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                              {q.why_interviewer_asks_this}
                            </p>
                          </div>

                          {/* Recommended STAR Framework Breakdown */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center">
                                <Target className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                                Recommended STAR Answer Framework:
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 text-xs">
                              {/* S - Situation */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200/80 dark:border-zinc-800 flex items-start space-x-2.5">
                                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  S
                                </span>
                                <div>
                                  <strong className="text-zinc-900 dark:text-zinc-100 block font-bold text-[11px]">Situation (Context):</strong>
                                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">{q.star_framework_outline?.situation}</p>
                                </div>
                              </div>

                              {/* T - Task */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200/80 dark:border-zinc-800 flex items-start space-x-2.5">
                                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  T
                                </span>
                                <div>
                                  <strong className="text-zinc-900 dark:text-zinc-100 block font-bold text-[11px]">Task (Objective):</strong>
                                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">{q.star_framework_outline?.task}</p>
                                </div>
                              </div>

                              {/* A - Action */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200/80 dark:border-zinc-800 flex items-start space-x-2.5">
                                <span className="w-5 h-5 rounded-md bg-cyan-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  A
                                </span>
                                <div>
                                  <strong className="text-zinc-900 dark:text-zinc-100 block font-bold text-[11px]">Action (Engineering Implementation):</strong>
                                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">{q.star_framework_outline?.action}</p>
                                </div>
                              </div>

                              {/* R - Result */}
                              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-2.5">
                                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  R
                                </span>
                                <div>
                                  <strong className="text-emerald-950 dark:text-emerald-300 block font-bold text-[11px]">Result (Measurable Impact):</strong>
                                  <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed font-sans font-medium">{q.star_framework_outline?.result}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Keywords to Mention */}
                          {q.keywords_to_mention?.length > 0 && (
                            <div className="pt-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5 flex items-center">
                                <Tag className="w-3 h-3 mr-1 text-zinc-400 dark:text-zinc-500" /> Key Terms to Weave into Answer:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {q.keywords_to_mention.map((kw, kwIdx) => (
                                  <span
                                    key={kwIdx}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold"
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Copy Action Button */}
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleCopyAnswer(q)}
                              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 dark:bg-zinc-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-all border border-zinc-800 dark:border-zinc-700"
                            >
                              {copiedId === q.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">Copied Outline!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-zinc-300" />
                                  <span>Copy Answer Guide</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="hidden sm:inline">
              6 customized questions generated from your ATS gap analysis
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold transition-all ml-auto"
            >
              Close Prep Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
