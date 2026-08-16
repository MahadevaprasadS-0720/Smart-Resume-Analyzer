import React, { useState } from 'react';
import {
  RotateCcw, Sparkles, CheckCircle2, FileText, Loader2,
  History, HelpCircle, Award, ShieldCheck, TrendingUp, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeOverviewCard from './ResumeOverviewCard';
import JobMatchMetrics from './JobMatchMetrics';
import ScoreGauge from './ScoreGauge';
import ActionableBulletSuggestions from './ActionableBulletSuggestions';
import AtsHealthAudit from './AtsHealthAudit';
import AtsReportPdfTemplate from './AtsReportPdfTemplate';
import { exportAtsReportPdf } from '../utils/pdfGenerator';

const tabConfig = [
  { id: 'overview', label: 'Overview & Match', icon: Award },
  { id: 'audit', label: 'ATS Health Audit', icon: ShieldCheck },
  { id: 'suggestions', label: 'STAR Bullet Plan', icon: TrendingUp },
];

export default function AnalysisDashboard({
  result,
  targetRole,
  onReset,
  onOpenBulletRewriter,
  onOpenCoverLetter,
  onOpenInterviewPrep,
  onOpenHistory,
  onOpenCompare,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!result) return null;

  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    try {
      const candidateName = result.metadata?.detected_emails?.[0]?.split('@')[0] || 'Candidate';
      const filename = `ATS_Report_${candidateName}_${Date.now()}.pdf`;
      await exportAtsReportPdf('ats-report-pdf-template', filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const experienceFit = result.experience_fit;
  const auditScore = result.ats_health_audit?.health_score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* ── Top Floating Action Bar ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-white"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-200 shadow-sm shrink-0">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ATS Match & Precision Audit
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                EVALUATED
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {result.summary_verdict || 'Resume evaluated against target job description.'}
            </p>
          </div>
        </div>

        {/* Action Suite */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenHistory && (
            <motion.button
              type="button"
              onClick={onOpenHistory}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 transition-all shadow-2xs group"
            >
              <History className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-45 transition-transform" />
              <span>History</span>
            </motion.button>
          )}

          {onOpenInterviewPrep && (
            <motion.button
              type="button"
              onClick={onOpenInterviewPrep}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center space-x-1.5 border border-cyan-200 transition-all shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Interview Prep</span>
            </motion.button>
          )}

          {onOpenCoverLetter && (
            <motion.button
              type="button"
              onClick={onOpenCoverLetter}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center space-x-1.5 border border-blue-200 transition-all shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Cover Letter</span>
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            whileHover={!isExportingPdf ? { scale: 1.04, y: -1 } : {}}
            whileTap={!isExportingPdf ? { scale: 0.96 } : {}}
            className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-extrabold text-white flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isExportingPdf ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Exporting...</span></>
            ) : (
              <><FileText className="w-3.5 h-3.5" /><span>Export PDF</span></>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={onReset}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Sleek White Segmented Tab Pill Bar with Spring Sliding Indicator ───────────────── */}
      <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit shadow-xs">
        {tabConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                isActive ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {/* Sliding Active Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm border border-slate-200/80"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="relative z-10">{tab.label}</span>
              {tab.id === 'audit' && auditScore != null && (
                <span className={`relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                }`}>
                  {auditScore}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Score + Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6">
                <ScoreGauge
                  scores={result.scores}
                  atsScore={result.ats_score}
                  similarityScore={result.similarity_score}
                  skillsScore={result.skills_score}
                  matchedKeywords={result.matched_keywords}
                  experienceFit={result.experience_fit}
                  verdict={result.summary_verdict}
                />
              </div>
              <div className="lg:col-span-6">
                <ResumeOverviewCard
                  metadata={result.metadata}
                  detectedSections={result.sections_detected || result.detected_sections}
                  technicalSkills={result.technical_skills}
                  softSkills={result.soft_skills}
                  candidateSeniority={experienceFit?.candidate_seniority}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <JobMatchMetrics
                atsScore={result.ats_score || result.scores?.overall_score}
                similarityScore={result.similarity_score || result.scores?.keyword_match}
                matchedKeywords={result.matched_keywords}
                technicalSkills={result.technical_skills}
                softSkills={result.soft_skills}
                missingCriticalSkills={result.missing_critical_skills}
                experienceFit={result.experience_fit}
              />
            </motion.div>

            {result.ats_health_audit && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <AtsHealthAudit auditData={result.ats_health_audit} />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ActionableBulletSuggestions
                suggestions={result.suggestions}
                missingSkills={result.missing_critical_skills}
                technicalSkills={result.technical_skills}
                onOpenBulletRewriter={onOpenBulletRewriter}
              />
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="tab-audit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {result.ats_health_audit ? (
              <AtsHealthAudit auditData={result.ats_health_audit} />
            ) : (
              <div className="bento-card p-8 text-center text-slate-500 font-medium">
                Audit data is not available for this profile.
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'suggestions' && (
          <motion.div
            key="tab-suggestions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <ActionableBulletSuggestions
              suggestions={result.suggestions}
              missingSkills={result.missing_critical_skills}
              technicalSkills={result.technical_skills}
              onOpenBulletRewriter={onOpenBulletRewriter}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden PDF Template */}
      <div className="hidden">
        <AtsReportPdfTemplate result={result} targetRole={targetRole} />
      </div>
    </motion.div>
  );
}
