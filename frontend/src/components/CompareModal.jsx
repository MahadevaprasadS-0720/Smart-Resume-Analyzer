import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompareModal({
  isOpen,
  onClose,
  history = [],
  initialScanA = null,
  initialScanB = null,
}) {
  const [scanAId, setScanAId] = useState(null);
  const [scanBId, setScanBId] = useState(null);

  useEffect(() => {
    if (initialScanA) setScanAId(initialScanA.id);
    if (initialScanB) setScanBId(initialScanB.id);

    // Default to latest two if not provided
    if (!initialScanA && !initialScanB && history.length >= 2) {
      setScanAId(history[1].id); // older scan
      setScanBId(history[0].id); // newer scan
    } else if (!initialScanA && history.length >= 1) {
      setScanAId(history[0].id);
    }
  }, [isOpen, initialScanA, initialScanB, history]);

  if (!isOpen) return null;

  const scanA = history.find((h) => h.id === scanAId) || history[1] || history[0];
  const scanB = history.find((h) => h.id === scanBId) || history[0];

  if (!scanA || !scanB) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-zinc-800">
          <GitCompare className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Need At Least 2 Scans</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Please run at least two ATS resume scans to compare score deltas and resolved skills side-by-side.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Calculate Deltas
  const scoreDelta = (scanB.overallScore || 0) - (scanA.overallScore || 0);
  const similarityDelta = (scanB.similarityScore || 0) - (scanA.similarityScore || 0);
  const skillsDelta = (scanB.skillsScore || 0) - (scanA.skillsScore || 0);
  const healthDelta = (scanB.healthScore || 0) - (scanA.healthScore || 0);

  // Skill Diffing
  const skillsA = new Set((scanA.matchedSkills || []).map((s) => s.toLowerCase()));
  const skillsB = new Set((scanB.matchedSkills || []).map((s) => s.toLowerCase()));
  const missingA = new Set((scanA.missingSkills || []).map((s) => s.toLowerCase()));
  const missingB = new Set((scanB.missingSkills || []).map((s) => s.toLowerCase()));

  // Newly matched in B (present in B matched, but not in A matched)
  const newlyMatchedSkills = (scanB.matchedSkills || []).filter(
    (s) => !skillsA.has(s.toLowerCase())
  );

  // Resolved Missing Gaps (was missing in A, now matched in B)
  const resolvedMissingSkills = (scanA.missingSkills || []).filter((s) =>
    skillsB.has(s.toLowerCase())
  );

  // Persistent missing in B
  const remainingMissingSkills = scanB.missingSkills || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <GitCompare className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Resume Version Comparison & Score Delta
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Diff Engine
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Side-by-side comparative analysis of match percentages, skill gains, and resolved gaps.
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

          {/* Version Selectors Bar */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-zinc-850/80 border-b border-slate-200/80 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Version A (Baseline) Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Version A (Baseline / Prior):
              </label>
              <select
                value={scanA.id}
                onChange={(e) => setScanAId(e.target.value)}
                className="w-full text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs cursor-pointer"
              >
                {history.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.targetRole} • {h.overallScore}% ATS ({h.formattedDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Version B (Comparison) Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Version B (Latest / Comparison):
              </label>
              <select
                value={scanB.id}
                onChange={(e) => setScanBId(e.target.value)}
                className="w-full text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs cursor-pointer"
              >
                {history.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.targetRole} • {h.overallScore}% ATS ({h.formattedDate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-zinc-950/40">
            {/* Score Delta Hero Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Overall ATS Delta
                </span>
                <div className="flex items-center space-x-3">
                  <div
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-base font-extrabold border ${
                      scoreDelta > 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : scoreDelta < 0
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                        : 'bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700'
                    }`}
                  >
                    {scoreDelta > 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : scoreDelta < 0 ? (
                      <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Minus className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    )}
                    <span>
                      {scoreDelta > 0 ? `+${scoreDelta}%` : `${scoreDelta}%`} Score Change
                    </span>
                  </div>

                  {scoreDelta > 0 && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Significant Optimization Gain!
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Baseline (Version A): <strong className="text-zinc-800 dark:text-zinc-200">{scanA.overallScore}%</strong> ➔ Comparison (Version B): <strong className="text-zinc-800 dark:text-zinc-200">{scanB.overallScore}%</strong>
                </p>
              </div>

              {/* Quick Side-by-Side Score Badges */}
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-zinc-850 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block uppercase">Version A</span>
                  <span className="text-base font-extrabold text-zinc-700 dark:text-zinc-300">{scanA.overallScore}%</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
                <div className="text-center">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase">Version B</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{scanB.overallScore}%</span>
                </div>
              </div>
            </div>

            {/* Comparative Visual Metrics Bars */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Key Metric Comparisons
              </h4>

              <div className="space-y-4">
                {/* Overall Score */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-700 dark:text-zinc-300">Overall ATS Match Score</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      A: {scanA.overallScore}% vs B: {scanB.overallScore}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${scanA.overallScore}%` }}
                        className="bg-slate-400 dark:bg-zinc-600 h-full rounded-full transition-all"
                        title={`Version A: ${scanA.overallScore}%`}
                      />
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${scanB.overallScore}%` }}
                        className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full transition-all shadow-sm"
                        title={`Version B: ${scanB.overallScore}%`}
                      />
                    </div>
                  </div>
                </div>

                {/* Semantic Similarity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-700 dark:text-zinc-300">TF-IDF Semantic Similarity</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      A: {scanA.similarityScore}% vs B: {scanB.similarityScore}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${scanA.similarityScore}%` }}
                        className="bg-slate-400 dark:bg-zinc-600 h-full rounded-full"
                      />
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${scanB.similarityScore}%` }}
                        className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills Coverage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-700 dark:text-zinc-300">Skills Coverage Percentage</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      A: {scanA.skillsScore}% vs B: {scanB.skillsScore}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${scanA.skillsScore}%` }}
                        className="bg-slate-400 dark:bg-zinc-600 h-full rounded-full"
                      />
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${scanB.skillsScore}%` }}
                        className="bg-teal-600 dark:bg-teal-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Delta Diffing Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Newly Matched Skills (Gains in B) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                    Newly Matched in Version B ({newlyMatchedSkills.length})
                  </span>
                </div>

                {newlyMatchedSkills.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No newly added skills detected in Version B.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {newlyMatchedSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1"
                      >
                        <span>+ {sk}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolved Gaps (Was missing in A, now matched in B) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                    Resolved ATS Gaps ({resolvedMissingSkills.length})
                  </span>
                </div>

                {resolvedMissingSkills.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No previous skill gaps were resolved in Version B.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {resolvedMissingSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1 line-through decoration-emerald-500"
                      >
                        <span>✓ {sk}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Remaining Missing Gaps in Version B */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                Remaining Missing Gaps in Version B ({remainingMissingSkills.length})
              </span>
              {remainingMissingSkills.length === 0 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">🎉 Zero missing skills in Version B!</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {remainingMissingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              Comparing {scanA.targetRole} vs {scanB.targetRole}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-zinc-950 dark:bg-zinc-800 text-white font-bold hover:bg-zinc-850 dark:hover:bg-zinc-700 transition-all ml-auto"
            >
              Close Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
