import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, UserCheck, TrendingUp, Sparkles } from 'lucide-react';

/* Animated count-up hook */
function useCountUp(target, duration = 1200) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = start + (target - start) * eased;
      if (ref.current) ref.current.textContent = Number.isInteger(target)
        ? Math.round(current)
        : current.toFixed(1);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return ref;
}

export default function ScoreGauge({
  scores, atsScore, similarityScore, skillsScore,
  matchedKeywords, experienceFit, verdict,
}) {
  const overall = atsScore ?? scores?.overall_score ?? 0;
  const radius = 68;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  const scoreRef = useCountUp(Math.round(overall), 1400);

  const getStatusInfo = (score) => {
    if (score >= 80) return {
      label: 'High Precision Match',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      strokeGradientId: 'gaugeGradientEmerald',
      textColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
      stops: ['#10B981', '#06B6D4'],
    };
    if (score >= 65) return {
      label: 'Strong Match',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      strokeGradientId: 'gaugeGradientCyan',
      textColor: 'text-blue-600',
      dotColor: 'bg-blue-500',
      stops: ['#2563EB', '#06B6D4'],
    };
    if (score >= 50) return {
      label: 'Moderate Alignment',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      strokeGradientId: 'gaugeGradientAmber',
      textColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
      stops: ['#F59E0B', '#F97316'],
    };
    return {
      label: 'Needs Keyword Boost',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      strokeGradientId: 'gaugeGradientRose',
      textColor: 'text-rose-600',
      dotColor: 'bg-rose-500',
      stops: ['#F43F5E', '#E11D48'],
    };
  };

  const status = getStatusInfo(overall);

  const breakdownMetrics = [
    { label: 'Semantic Role Match', value: similarityScore ?? scores?.keyword_match ?? 0, icon: Zap, suffix: '%', color: 'indigo' },
    { label: 'Skills Coverage', value: skillsScore ?? scores?.skills_match ?? 0, icon: Award, suffix: '%', color: 'emerald' },
    { label: 'Keywords Matched', value: matchedKeywords?.matched_count ?? 0, total: matchedKeywords?.total_jd_keywords, customText: matchedKeywords?.count_summary, icon: TrendingUp, color: 'blue' },
    { label: 'Seniority Alignment', customText: experienceFit?.rating ? `${experienceFit.rating} Fit` : 'Strong Fit', icon: UserCheck, color: 'purple' },
  ];

  const barColors = {
    indigo: 'from-indigo-600 to-blue-600',
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-600 to-cyan-500',
    purple: 'from-purple-600 to-indigo-600',
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="bento-card p-6 sm:p-8 relative overflow-hidden h-full flex flex-col justify-between bg-white"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-200 text-indigo-700 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Overall ATS Match Score</h3>
              <p className="text-xs text-slate-500 font-medium">Precision alignment against job requirements</p>
            </div>
          </div>

          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${status.badgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            <span>{status.label}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
          {/* Circular SVG Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              className="w-48 h-48 -rotate-90 transform"
              viewBox="0 0 160 160"
            >
              <defs>
                <linearGradient id={status.strokeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={status.stops[0]} />
                  <stop offset="100%" stopColor={status.stops[1]} />
                </linearGradient>
              </defs>

              {/* Track */}
              <circle
                cx="80" cy="80" r={radius}
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Progress Arc */}
              <motion.circle
                cx="80" cy="80" r={radius}
                stroke={`url(#${status.strokeGradientId})`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Count-up Score */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`text-4xl sm:text-5xl font-black tracking-tight ${status.textColor}`}
              >
                <span ref={scoreRef}>0</span>
                <span className="text-2xl font-bold">%</span>
              </motion.span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-0.5">
                MATCH SCORE
              </span>
            </div>
          </div>

          {/* Sub-metrics Grid */}
          <div className="w-full grid grid-cols-2 gap-3">
            {breakdownMetrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 + 0.2, duration: 0.4 }}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                    <span className="truncate">{item.label}</span>
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <div>
                    {item.customText ? (
                      <span className="text-sm sm:text-base font-black text-slate-900">{item.customText}</span>
                    ) : (
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          {Math.round(item.value)}{item.suffix || ''}
                        </span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, item.value)}%` }}
                            transition={{ delay: idx * 0.1 + 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full bg-gradient-to-r ${barColors[item.color]}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {verdict && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-xs sm:text-sm text-slate-700 flex items-start space-x-2.5 shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <span className="font-bold text-slate-900">AI Verdict: </span>
            {verdict}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
