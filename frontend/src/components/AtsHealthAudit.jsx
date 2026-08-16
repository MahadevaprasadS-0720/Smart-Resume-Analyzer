import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AtsHealthAudit({ auditData }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'issues', 'passed'
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  if (!auditData) return null;

  const {
    health_score = 0,
    health_grade = 'Good',
    summary = '',
    total_checks = 0,
    passed_checks = 0,
    failed_checks = 0,
    issues = [],
  } = auditData;

  const handleCopyFix = (issue) => {
    navigator.clipboard.writeText(issue.suggested_fix || issue.fix || '');
    setCopiedId(issue.id || issue.title);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredIssues = issues.filter((iss) => {
    const isPassed = iss.passed ?? (iss.severity === 'pass');
    if (activeFilter === 'passed') return isPassed;
    if (activeFilter === 'issues') return !isPassed;
    return true;
  });

  const getGradeBadge = () => {
    if (health_score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (health_score >= 70) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (health_score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="bento-card overflow-hidden bg-white"
    >
      {/* Top Banner */}
      <div className="p-6 sm:p-7 bg-slate-50 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-200">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-emerald-200 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ATS Formatting & Structural Health Audit
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getGradeBadge()}`}>
                {health_grade}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl leading-relaxed font-medium">
              {summary || 'Comprehensive evaluation of parsing readability, core headings, contact signals, and word count.'}
            </p>
          </div>
        </div>

        {/* Health Score Badge */}
        <div className="flex items-center space-x-4 bg-white p-3 rounded-2xl border border-slate-200 shrink-0 shadow-2xs">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Health Score
            </div>
            <div className="text-xs font-bold text-slate-700">
              {passed_checks} of {total_checks} Passed
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shadow-sm">
            <span className="text-lg font-black text-emerald-700 leading-none">
              {health_score}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="px-6 py-3.5 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 border-slate-300 shadow-sm'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-white hover:text-slate-900'
            }`}
          >
            All Checks ({total_checks})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('issues')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeFilter === 'issues'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-100 text-rose-700 border-slate-200 hover:bg-rose-50'
            }`}
          >
            Issues to Fix ({failed_checks || (total_checks - passed_checks)})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('passed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeFilter === 'passed'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-100 text-emerald-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            Passed ({passed_checks})
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-1.5 font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Click any item to view actionable suggestions</span>
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="p-6 space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-medium text-slate-500">No audit checks match the selected filter.</p>
          </div>
        ) : (
          filteredIssues.map((issue, idx) => {
            const itemId = issue.id || idx;
            const isExpanded = expandedId === itemId;
            const isPassed = issue.passed ?? (issue.severity === 'pass');

            const severityBadge =
              isPassed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : issue.severity === 'high' || issue.severity === 'critical'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

            const categoryBadge =
              issue.category === 'Contact Information' || issue.category === 'Contact Info'
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                : issue.category === 'Section Headings' || issue.category === 'Section Headers'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';

            return (
              <div
                key={itemId}
                className={`rounded-2xl border transition-all ${
                  isPassed
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-amber-50/20 border-amber-200 hover:border-amber-300'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : itemId)}
                  className="p-4 sm:p-4.5 cursor-pointer flex items-start justify-between gap-3 select-none"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      ) : issue.severity === 'high' || issue.severity === 'critical' ? (
                        <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                          <AlertOctagon className="w-4 h-4 text-rose-600" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${severityBadge}`}>
                          {isPassed ? 'PASSED' : `${issue.severity || 'MEDIUM'} PRIORITY`}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${categoryBadge}`}>
                          {issue.category || 'General'}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-1 text-slate-400 hover:text-slate-700 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Collapsible Actionable Fix */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-4 pt-1 border-t border-slate-100"
                    >
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5 flex-1">
                          <strong className="text-slate-900 font-bold block">
                            💡 Recommended Action / Fix:
                          </strong>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {issue.suggested_fix || issue.fix || 'No structural changes required. Item satisfies ATS formatting criteria.'}
                          </p>
                        </div>

                        {!isPassed && (issue.suggested_fix || issue.fix) && (
                          <button
                            type="button"
                            onClick={() => handleCopyFix(issue)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-2xs transition-all shrink-0"
                          >
                            {copiedId === (issue.id || issue.title) ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Fix</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
