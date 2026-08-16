import React from 'react';
import {
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
  User,
  Mail,
  Phone,
  BarChart3,
} from 'lucide-react';

export default function AtsReportPdfTemplate({ result, targetRole }) {
  if (!result) return null;

  const atsScore = Math.round(result.ats_score || result.scores?.overall_score || 0);
  const matchedCount = result.matched_keywords?.matched_count || 0;
  const totalKeywords = result.matched_keywords?.total_jd_keywords || 0;
  const matchedKeywords = result.matched_keywords?.items || result.technical_skills?.matched || [];
  const missingSkills = result.missing_critical_skills || result.technical_skills?.missing || [];
  const experienceFit = result.experience_fit || {};
  const metadata = result.metadata || {};

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' };
    if (score >= 65) return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
    if (score >= 50) return { bg: '#fffbeb', text: '#b45309', border: '#fde68a' };
    return { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' };
  };

  const scoreTheme = getScoreColor(atsScore);

  return (
    <div
      id="ats-report-pdf-template"
      className="bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6 font-sans"
      style={{ minHeight: '1050px' }}
    >
      {/* Report Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              ATS
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Smart Resume Analyzer
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Applicant Tracking System & NLP Match Evaluation Report
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Generated Report
          </span>
          <span className="text-xs font-semibold text-slate-800">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Candidate & Target Role Summary */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Candidate Profile
          </span>
          <p className="text-sm font-bold text-slate-900">
            {metadata.detected_emails?.[0]?.split('@')[0]?.replace('.', ' ')?.toUpperCase() || 'Candidate'}
          </p>
          <div className="text-xs text-slate-600 space-y-0.5 mt-1">
            {metadata.detected_emails?.length > 0 && <p>Email: {metadata.detected_emails[0]}</p>}
            {metadata.detected_phones?.length > 0 && <p>Phone: {metadata.detected_phones[0]}</p>}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Target Position & Seniority
          </span>
          <p className="text-sm font-bold text-blue-700">
            {targetRole || 'Target Role Analysis'}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Seniority Detected: <span className="font-semibold text-slate-800">{experienceFit.candidate_seniority || 'Mid-Senior'}</span>
          </p>
          <p className="text-xs text-slate-600">
            Document: <span className="font-semibold text-slate-800">{metadata.filename || 'Resume'}</span> ({metadata.word_count || 0} words)
          </p>
        </div>
      </div>

      {/* Scores & Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Main Score Box */}
        <div
          className="p-4 rounded-xl border text-center flex flex-col items-center justify-center"
          style={{ backgroundColor: scoreTheme.bg, borderColor: scoreTheme.border }}
        >
          <span className="text-3xl font-extrabold" style={{ color: scoreTheme.text }}>
            {atsScore}%
          </span>
          <span className="text-xs font-bold uppercase tracking-wider mt-1 text-slate-700">
            Overall ATS Match
          </span>
        </div>

        {/* Semantic Similarity */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-900">
            {Math.round(result.similarity_score || 0)}%
          </span>
          <span className="text-xs font-medium text-slate-500 mt-1">
            TF-IDF Semantic Fit
          </span>
        </div>

        {/* Experience Fit */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center">
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {experienceFit.rating || 'Strong'} Fit
          </span>
          <span className="text-xs font-medium text-slate-500 mt-1">
            Experience Alignment
          </span>
        </div>
      </div>

      {/* Keywords Matched Section */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Matched Keywords & Skills ({matchedCount} of {totalKeywords} keywords)
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            {Math.round((matchedCount / Math.max(1, totalKeywords)) * 100)}% Coverage
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {matchedKeywords.map((kw, i) => (
            <span
              key={i}
              className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              ✓ {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Critical Skills Warning Section */}
      {missingSkills.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1.5">
            Missing Critical Skills (Found in JD, not in Resume)
          </h3>
          <p className="text-xs text-rose-700 mb-2">
            Incorporate these missing keywords into your experience bullets to increase ATS pass rate:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((sk, i) => (
              <span
                key={i}
                className="text-xs font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-300"
              >
                + {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Actionable Measurable Bullets */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
          Recommended Measurable Bullet Points to Add (STAR Format)
        </h3>

        <div className="space-y-2">
          {missingSkills.slice(0, 3).map((skill, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-blue-700 block mb-0.5">
                • Target Keyword: {skill}
              </span>
              <p className="text-slate-700 leading-relaxed">
                "Utilized <span className="font-bold">{skill}</span> to architect and deploy core services, improving system processing speed by 35% and reducing infrastructure overhead."
              </p>
            </div>
          ))}

          {missingSkills.length === 0 && (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
              "Spearheaded core performance optimizations, reducing latency by 42% and increasing throughput across 1.5M active users."
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
        <span>Smart Resume Analyzer • Confidential Evaluation</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}
