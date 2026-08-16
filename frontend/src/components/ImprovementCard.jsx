import React from 'react';
import {
  AlertTriangle,
  Lightbulb,
  AlertOctagon,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Mail,
  Phone,
  Link2,
} from 'lucide-react';

export default function ImprovementCard({ suggestions = [], detectedSections, metadata }) {
  const getBadge = (type) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertOctagon,
          bg: 'bg-rose-50 dark:bg-rose-950/60',
          border: 'border-rose-200 dark:border-rose-800',
          text: 'text-rose-700 dark:text-rose-300',
          label: 'Critical',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          label: 'Improvement',
        };
      default:
        return {
          icon: Lightbulb,
          bg: 'bg-sky-50 dark:bg-sky-950/60',
          border: 'border-sky-200 dark:border-sky-800',
          text: 'text-sky-700 dark:text-sky-300',
          label: 'Pro Tip',
        };
    }
  };

  const sectionsList = [
    { key: 'contact_info', label: 'Contact Info' },
    { key: 'summary', label: 'Summary / Objective' },
    { key: 'work_experience', label: 'Work Experience' },
    { key: 'skills', label: 'Skills Section' },
    { key: 'education', label: 'Education' },
    { key: 'projects', label: 'Projects' },
    { key: 'certifications', label: 'Certifications' },
  ];

  return (
    <div className="space-y-6">
      {/* Detected Resume Sections Card */}
      <div className="bento-card p-6 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center">
          <FileSpreadsheet className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
          Resume Structure & Sections
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {sectionsList.map((sec) => {
            const isPresent = detectedSections?.[sec.key] ?? false;
            return (
              <div
                key={sec.key}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-medium transition-all ${
                  isPresent
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-zinc-850 text-zinc-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800'
                }`}
              >
                {isPresent ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                )}
                <span className="truncate">{sec.label}</span>
              </div>
            );
          })}
        </div>

        {/* Metadata stats */}
        {metadata && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div>
              <span>Document:</span>{' '}
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{metadata.filename || 'Parsed Text'}</span>
            </div>
            <div>
              <span>Words:</span>{' '}
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{metadata.word_count}</span>
            </div>
            <div>
              <span>Est. Pages:</span>{' '}
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{metadata.page_count || 1}</span>
            </div>
            {metadata.detected_emails?.length > 0 && (
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                <span className="text-zinc-800 dark:text-zinc-200">{metadata.detected_emails[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actionable Suggestions */}
      <div className="bento-card p-6 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          ATS Action Plan & Tailoring Tips
        </h3>

        <div className="space-y-3">
          {suggestions.map((item, idx) => {
            const badge = getBadge(item.type);
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${badge.bg} ${badge.border} flex items-start space-x-3.5 transition-all`}
              >
                <div className={`p-2 rounded-lg bg-white dark:bg-zinc-800 ${badge.text} shrink-0 shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
