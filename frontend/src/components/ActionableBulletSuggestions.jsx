import React, { useState } from 'react';
import {
  BarChart3,
  Copy,
  Check,
  Sparkles,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActionableBulletSuggestions({ suggestions = [], missingSkills = [], technicalSkills, onOpenBulletRewriter }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const missingTech = technicalSkills?.missing || missingSkills || [];

  // Generate customized measurable STAR bullet points based on missing keywords
  const generateSampleBullets = () => {
    const bullets = [];

    if (missingTech.includes('Docker') || missingTech.includes('Kubernetes')) {
      bullets.push({
        title: 'Cloud & Containerization Impact',
        bullet: 'Containerized 6 microservices with Docker and orchestrated deployment via Kubernetes, decreasing cloud infrastructure spend by 28% and achieving 99.95% service uptime.',
        impact: '+28% Cost Reduction',
        category: 'DevOps & Reliability',
      });
    }

    if (missingTech.includes('AWS') || missingTech.includes('GCP') || missingTech.includes('Azure')) {
      bullets.push({
        title: 'Cloud Architecture & Scalability',
        bullet: 'Architected serverless pipelines on AWS (Lambda, API Gateway, S3), reducing document processing latency from 3.2s to 450ms across 2.5M monthly requests.',
        impact: '86% Latency Cut',
        category: 'Cloud Systems',
      });
    }

    if (missingTech.includes('React') || missingTech.includes('TypeScript') || missingTech.includes('Tailwind CSS') || missingTech.includes('Next.js')) {
      bullets.push({
        title: 'Frontend Performance & UX',
        bullet: 'Engineered high-performance UI utilizing React and TypeScript with Tailwind CSS, increasing user engagement by 34% and cutting load times by 1.8s.',
        impact: '+34% Engagement',
        category: 'Frontend Engineering',
      });
    }

    if (missingTech.includes('FastAPI') || missingTech.includes('Python') || missingTech.includes('PostgreSQL')) {
      bullets.push({
        title: 'Backend API Throughput & Database',
        bullet: 'Designed high-throughput asynchronous REST APIs in FastAPI and Python; indexed PostgreSQL schemas to handle 4,500+ concurrent requests with sub-50ms latency.',
        impact: '4,500+ Req/Sec',
        category: 'Backend Architecture',
      });
    }

    if (missingTech.includes('Scikit-Learn') || missingTech.includes('spaCy') || missingTech.includes('NLP') || missingTech.includes('Spark')) {
      bullets.push({
        title: 'AI / Machine Learning Automation',
        bullet: 'Built custom NLP feature extraction pipeline using spaCy and Scikit-Learn TF-IDF, automating candidate classification with 94.2% precision.',
        impact: '94.2% Accuracy',
        category: 'Machine Learning',
      });
    }

    if (bullets.length < 3) {
      bullets.push({
        title: 'Process Automation & CI/CD Pipeline',
        bullet: 'Spearheaded automated CI/CD pipeline using GitHub Actions, decreasing release cycle times by 65% and eliminating manual regression deployment errors.',
        impact: '65% Faster Releases',
        category: 'Automation',
      });
      bullets.push({
        title: 'System Optimization & Quantitative Scale',
        bullet: 'Refactored core data ingestion engine, reducing memory consumption by 42% and enabling horizontal scaling across 1.8M daily transactions.',
        impact: '42% Memory Saved',
        category: 'System Scale',
      });
    }

    return bullets;
  };

  const actionableBullets = generateSampleBullets();

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="bento-card p-6 sm:p-8 space-y-6 relative overflow-hidden bg-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-sm">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Actionable Measurable Bullet Points
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Copy-and-paste STAR-formula bullet points tailored to bridge detected skill gaps
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenBulletRewriter && (
            <button
              type="button"
              onClick={onOpenBulletRewriter}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span>AI Bullet Rewriter</span>
            </button>
          )}
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 uppercase tracking-wider">
            STAR FORMULA
          </span>
        </div>
      </div>

      {/* Suggested Measurable Bullets to Add */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center">
          <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
          High-Impact STAR Bullet Points to Add
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionableBullets.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    {item.impact}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
                  "{item.bullet}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{item.category}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(item.bullet, idx)}
                  className="inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all shadow-2xs"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Strategic Tips */}
      {suggestions.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center">
            <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Resume Tailoring Strategy
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.category || 'Tip'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
