import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, Plus, Check,
} from 'lucide-react';

export default function JobMatchMetrics({
  atsScore,
  similarityScore,
  matchedKeywords,
  technicalSkills,
  softSkills,
  missingCriticalSkills = [],
  experienceFit,
}) {
  const [copiedSkill, setCopiedSkill] = useState(null);

  const matchedItems = matchedKeywords?.items || technicalSkills?.matched || [];
  const missingItems = missingCriticalSkills.length > 0
    ? missingCriticalSkills
    : [...(technicalSkills?.missing || []), ...(softSkills?.missing || [])];

  const matchedCount = matchedKeywords?.matched_count || matchedItems.length;
  const totalCount = matchedKeywords?.total_jd_keywords || (matchedCount + missingItems.length);
  const coveragePct = Math.round((matchedCount / Math.max(1, totalCount)) * 100);

  const handleCopy = (skill) => {
    navigator.clipboard.writeText(`Engineered high-impact solutions leveraging ${skill} to optimize production workflows.`);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 2200);
  };

  return (
    <div className="space-y-5">

      {/* ── Matched Keywords Card ─────────────────────────── */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="bento-card p-6 sm:p-7 relative overflow-hidden bg-white"
      >
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Matched Keywords & Competencies ({matchedCount}/{totalCount})
            </h4>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Coverage bar */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${coveragePct}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {coveragePct}% MATCH
            </span>
          </div>
        </div>

        {matchedItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No matching keywords detected.</p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            <AnimatePresence>
              {matchedItems.map((kw, idx) => (
                <motion.span
                  key={`matched-${kw}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02, duration: 0.25 }}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold
                    bg-emerald-50 text-emerald-800
                    border border-emerald-200
                    shadow-2xs hover:border-emerald-300
                    transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                  <span>{kw}</span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ── Missing Critical Skills Card ──────────────────── */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="bento-card p-6 sm:p-7 relative overflow-hidden bg-white"
      >
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 shadow-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Missing Critical Skills ({missingItems.length})
            </h4>
          </div>
          <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
            ATS GAPS
          </span>
        </div>

        {missingItems.length === 0 ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero critical skill gaps detected. Perfect profile alignment!</span>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-500 font-medium mb-3">
              Click any skill badge to copy a tailored STAR resume bullet point:
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              <AnimatePresence>
                {missingItems.map((skill, idx) => {
                  const isCopied = copiedSkill === skill;
                  return (
                    <motion.button
                      key={`missing-${skill}-${idx}`}
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.025, duration: 0.25 }}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCopy(skill)}
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all group ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200 hover:border-rose-300'
                      }`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 mr-1.5 text-white shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 mr-1 text-rose-600 group-hover:rotate-90 transition-transform shrink-0" />
                      )}
                      <span>{skill}</span>
                      <span className={`text-[10px] ml-1.5 font-extrabold transition-opacity ${isCopied ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                        {isCopied ? 'Copied!' : '+ Add to Resume'}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
