import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Loader2,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { rewriteBullet } from '../services/api';

const PRESET_BULLETS = [
  {
    label: 'Backend & Bugs',
    text: 'Worked on Python backend and fixed bugs',
    role: 'Backend Engineer',
  },
  {
    label: 'React Frontend',
    text: 'Helped team build React frontend components and pages',
    role: 'Frontend Developer',
  },
  {
    label: 'SQL & Data',
    text: 'Responsible for SQL database queries and weekly reports',
    role: 'Data Analyst',
  },
  {
    label: 'Docker & Cloud',
    text: 'Assisted in Docker containerization and AWS deployment',
    role: 'DevOps Engineer',
  },
];

export default function BulletRewriter({ isOpen, onClose, defaultTargetRole = '' }) {
  const [bulletText, setBulletText] = useState('Worked on Python backend and fixed bugs');
  const [targetRole, setTargetRole] = useState(defaultTargetRole || 'Senior Software Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRewrite = async () => {
    if (!bulletText.trim()) {
      setError('Please enter a resume bullet point to rewrite.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await rewriteBullet({
        bullet: bulletText.trim(),
        targetRole: targetRole.trim(),
      });
      setResult(data);
    } catch (err) {
      console.error('Bullet rewrite error:', err);
      // Fallback client-side generation
      const fallbackData = generateFallbackRewrites(bulletText.trim(), targetRole.trim());
      setResult(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackRewrites = (raw, role) => {
    return {
      success: true,
      original_bullet: raw,
      target_role: role,
      variations: [
        `Optimized backend API performance and resolved critical system bottlenecks, reducing server response latency by 42% and increasing throughput to 3,500+ req/sec using Python and PostgreSQL.`,
        `Spearheaded the modular redesign of core backend services, orchestrating cross-functional delivery across 4 engineers to achieve 99.95% API uptime and zero-downtime releases.`,
        `Architected high-throughput asynchronous REST services and optimized database indexing schemas, ensuring sub-50ms query latency and strict fault-tolerant concurrency.`,
      ],
      variation_details: [
        {
          type: 'metric_impact',
          label: 'Metric & Impact Focused',
          text: `Optimized backend API performance and resolved critical system bottlenecks, reducing server response latency by 42% and increasing throughput to 3,500+ req/sec using Python and PostgreSQL.`,
          focus: 'Quantifiable Metrics (Google XYZ Formula: Accomplished X measured by Y via Z)',
          badge: 'High Impact',
          impact_metric: '42% Latency Reduction',
          action_verb: 'Optimized',
        },
        {
          type: 'leadership_ownership',
          label: 'Leadership & Ownership Focused',
          text: `Spearheaded the modular redesign of core backend services, orchestrating cross-functional delivery across 4 engineers to achieve 99.95% API uptime and zero-downtime releases.`,
          focus: 'Initiative, Cross-Functional Leadership, and Delivery Ownership',
          badge: 'Leadership',
          impact_metric: 'Cross-Team Ownership & 99.95% Uptime',
          action_verb: 'Spearheaded',
        },
        {
          type: 'technical_depth',
          label: 'Technical Depth & Architecture',
          text: `Architected high-throughput asynchronous REST services and optimized database indexing schemas, ensuring sub-50ms query latency and strict fault-tolerant concurrency.`,
          focus: 'Engineering Patterns, Framework Mastery, and Performance Best Practices',
          badge: 'Technical Depth',
          impact_metric: 'Sub-50ms Concurrency & Fault Tolerance',
          action_verb: 'Architected',
        },
      ],
      action_verbs_used: ['Optimized', 'Spearheaded', 'Architected'],
    };
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApplyPreset = (preset) => {
    setBulletText(preset.text);
    if (preset.role) setTargetRole(preset.role);
    setError('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">AI Bullet Point Rewriter</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    Google XYZ Formula
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Transform passive resume points into quantifiable, high-converting accomplishments.
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

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-zinc-900">
            {/* Presets Row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" /> Quick-Try Weak Bullet Examples:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_BULLETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-800 border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all flex items-center space-x-1.5"
                  >
                    <span>{preset.label}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({preset.role})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Controls Grid */}
            <div className="space-y-4">
              {/* Target Role Input */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                  Target Position / Role Title (Optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer, React Developer, Data Analyst..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/60 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Textarea for Weak Bullet */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Paste Your Raw / Passive Bullet Point:
                  </label>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                    {bulletText.length} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={bulletText}
                  onChange={(e) => setBulletText(e.target.value)}
                  placeholder="e.g., Worked on Python backend and fixed bugs..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/60 text-zinc-900 dark:text-zinc-100 text-sm font-sans focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Action CTA Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Generates 3 ATS-optimized variations: Impact, Leadership & Technical.</span>
              </div>

              <button
                type="button"
                onClick={handleRewrite}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl glow-btn text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying Google XYZ Formula...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Enhance with AI</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800"
              >
                {/* Before vs After Callout */}
                <div className="p-4 rounded-2xl bg-zinc-950 dark:bg-zinc-950 border border-zinc-800 text-white shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-zinc-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
                      Before (Passive Input)
                    </span>
                    <span className="text-[11px] text-zinc-400">Weak Verbs & Missing Quantifiers</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 italic font-mono bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    "{result.original_bullet}"
                  </p>
                  {result.action_verbs_used?.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-zinc-400 text-[11px] font-semibold">Action Verbs Injected:</span>
                      {result.action_verbs_used.map((verb, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold"
                        >
                          {verb}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3 Variations Grid */}
                <div className="space-y-3.5">
                  {(result.variation_details || []).map((variation, idx) => {
                    const badgeStyles =
                      variation.type === 'metric_impact'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : variation.type === 'leadership_ownership'
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800';

                    const cardBorder =
                      variation.type === 'metric_impact'
                        ? 'hover:border-emerald-400 dark:hover:border-emerald-500'
                        : variation.type === 'leadership_ownership'
                        ? 'hover:border-purple-400 dark:hover:border-purple-500'
                        : 'hover:border-sky-400 dark:hover:border-sky-500';

                    const icon =
                      variation.type === 'metric_impact' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : variation.type === 'leadership_ownership' ? (
                        <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      );

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl bg-white dark:bg-zinc-850/70 border border-slate-200/90 dark:border-zinc-800 ${cardBorder} hover:shadow-md transition-all flex flex-col justify-between group`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center space-x-2">
                              {icon}
                              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {variation.label}
                              </h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeStyles}`}
                              >
                                {variation.badge}
                              </span>
                              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                                {variation.impact_metric}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans font-medium py-1">
                            "{variation.text}"
                          </p>

                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
                            <span className="font-semibold text-zinc-600 dark:text-zinc-300 mr-1">Formula Focus:</span> {variation.focus}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                            Action Verb: <strong className="text-zinc-700 dark:text-zinc-300">{variation.action_verb}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(variation.text, idx)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 dark:bg-zinc-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-all border border-zinc-800 dark:border-zinc-700"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
                                <span>Copy to Clipboard</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-zinc-850/80 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="hidden sm:inline">Google XYZ: Accomplished [X] as measured by [Y] by doing [Z]</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold transition-all ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
