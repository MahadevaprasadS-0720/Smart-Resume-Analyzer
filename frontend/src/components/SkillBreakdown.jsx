import React, { useState } from 'react';
import { Check, Plus, Tag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillBreakdown({
  matchedSkills = [],
  missingSkills = [],
  technicalSkills,
  softSkills,
  missingCriticalSkills = [],
}) {
  const [filter, setFilter] = useState('all');
  const [copiedSkill, setCopiedSkill] = useState(null);

  const techMatched = technicalSkills?.matched || [];
  const techMissing = technicalSkills?.missing || [];
  const softMatched = softSkills?.matched || [];
  const softMissing = softSkills?.missing || [];

  const combinedSkills = [
    ...techMatched.map((name) => ({ name, type: 'matched', category: 'Technical' })),
    ...softMatched.map((name) => ({ name, type: 'matched', category: 'Soft Skill' })),
    ...techMissing.map((name) => ({ name, type: 'missing', category: 'Technical' })),
    ...softMissing.map((name) => ({ name, type: 'missing', category: 'Soft Skill' })),
  ];

  const allSkills = combinedSkills.length > 0
    ? combinedSkills
    : [
        ...matchedSkills.map((s) => ({ ...s, type: 'matched', category: s.category || 'General' })),
        ...missingSkills.map((s) => ({ ...s, type: 'missing', category: s.category || 'General' })),
      ];

  const displayedSkills = allSkills.filter((s) => {
    if (filter === 'technical') return s.category === 'Technical';
    if (filter === 'soft') return s.category === 'Soft Skill';
    if (filter === 'missing') return s.type === 'missing';
    if (filter === 'matched') return s.type === 'matched';
    return true;
  });

  const totalMatched = allSkills.filter((s) => s.type === 'matched').length;
  const totalMissing = allSkills.filter((s) => s.type === 'missing').length;

  const handleCopyMissing = (skill) => {
    navigator.clipboard.writeText(skill);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  const filterButtons = [
    { id: 'all', label: `All (${allSkills.length})`, color: 'slate' },
    { id: 'matched', label: `Matched (${totalMatched})`, icon: Check, color: 'emerald' },
    { id: 'missing', label: `Missing (${totalMissing})`, icon: Plus, color: 'coral' },
  ];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="bento-card p-6 sm:p-7 relative overflow-hidden bg-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-200">
            <Tag className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">Keyword & Skill Breakdown</h3>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs gap-1">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = filter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 font-extrabold ${
                  isActive && btn.color === 'slate'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : isActive && btn.color === 'emerald'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isActive && btn.color === 'coral'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Tags */}
      {displayedSkills.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 rounded-xl bg-slate-50 border border-slate-200">
          No skills found in this category.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
          <AnimatePresence>
            {displayedSkills.map((skill, idx) => {
              const isMatched = skill.type === 'matched';
              const isCopied = copiedSkill === skill.name;

              return (
                <motion.span
                  key={`${skill.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.02, duration: 0.2 }}
                  onClick={() => !isMatched && handleCopyMissing(skill.name)}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300'
                      : isCopied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm cursor-pointer'
                      : 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-300 cursor-pointer'
                  }`}
                >
                  {isMatched ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                  ) : isCopied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-white shrink-0" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />
                  )}
                  <span>{skill.name}</span>
                  {!isMatched && !isCopied && (
                    <span className="ml-1.5 text-[10px] text-rose-600">+ Add</span>
                  )}
                  {isCopied && (
                    <span className="ml-1.5 text-[10px] font-bold">Copied!</span>
                  )}
                  {skill.category && isMatched && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-white text-slate-500 border border-slate-200">
                      {skill.category}
                    </span>
                  )}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
