import React from 'react';
import { Briefcase, Trash2, CheckCircle2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobDescriptionInput({
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
}) {
  const wordCount = jobDescription ? jobDescription.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = jobDescription.length;

  return (
    <div className="bento-card p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-white">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-200 shadow-sm">
              02
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Target Job Description</span>
                {jobDescription && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Paste job requirements, qualifications, and stack</p>
            </div>
          </div>

          {jobDescription && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setJobDescription(''); setTargetRole(''); }}
              className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </motion.button>
          )}
        </div>

        {/* Target Role Input */}
        <div className="mb-5">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
            Target Job Title / Position
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer, Lead Product Manager..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold shadow-inner"
          />
        </div>

        {/* Clean Syntax-Style JD Editor */}
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-[11px] text-slate-700 font-bold">job_description_criteria.md</span>
            </div>
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job responsibilities, required technical skills, minimum qualifications, and stack..."
            rows={8}
            className="w-full bg-transparent p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-none font-mono leading-relaxed"
          />

          {/* Character Counter Badge */}
          {jobDescription && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-3 right-3 flex items-center gap-1.5
                px-3 py-1 rounded-full
                bg-white border border-slate-200
                text-[11px] font-bold text-slate-700 shadow-sm"
            >
              <span className={`w-2 h-2 rounded-full ${wordCount > 50 ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
              <span>{wordCount} words</span>
              <span className="text-slate-300">·</span>
              <span>{charCount} chars</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
